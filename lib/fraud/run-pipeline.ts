import { readFileSync, writeFileSync } from "fs";
import path from "path";

import type { SupabaseClient } from "@supabase/supabase-js";

import { buildDesignVector, computeNumericStats } from "@/lib/fraud/design-vector";
import type { FraudModelJson } from "@/lib/fraud/model-json";
import { buildRawFeatureRow } from "@/lib/fraud/raw-features";
import { fitRidgeWeights, predictRisk } from "@/lib/fraud/ridge";
import { fetchMergedOrders } from "@/lib/fraud/supabase-orders";
import { trainingRiskTarget } from "@/lib/fraud/training-target";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function defaultModelPath(): string {
  return path.join(process.cwd(), "models", "fraud_risk_model.json");
}

export function loadModel(modelPath: string): FraudModelJson {
  return JSON.parse(readFileSync(modelPath, "utf8")) as FraudModelJson;
}

export function saveModel(modelPath: string, model: FraudModelJson): void {
  writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`, "utf8");
}

export type RunPipelineOptions = {
  supabase: SupabaseClient;
  modelPath: string;
  /** Write refreshed weights + stats back to `modelPath` (for local dev / committed model). */
  persistModel: boolean;
};

export type RunPipelineResult = {
  orderCount: number;
  rowsUpdated: number;
  model: FraudModelJson;
};

/**
 * Retrain ridge weights on Supabase data (human labels via `trainingRiskTarget`),
 * then write `risk_score` + `is_fraud` for all orders.
 */
export async function runTrainAndScore(options: RunPipelineOptions): Promise<RunPipelineResult> {
  const template = loadModel(options.modelPath);
  const merged = await fetchMergedOrders(options.supabase);

  if (merged.length < 2) {
    throw new Error("Need at least 2 orders in Supabase to train.");
  }

  const rawRows = merged.map((m) => buildRawFeatureRow(m));
  const { medians, means, stds } = computeNumericStats(rawRows, template.numericColumns);

  const working: FraudModelJson = {
    ...template,
    medians: { ...template.medians, ...medians },
    means: { ...template.means, ...means },
    stds: { ...template.stds, ...stds },
  };

  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < merged.length; i++) {
    X.push(
      buildDesignVector(working, rawRows[i]!, working.medians, working.means, working.stds),
    );
    y.push(trainingRiskTarget(merged[i]!.risk_score, merged[i]!.actual_fraud));
  }

  const weights = fitRidgeWeights(X, y, template.ridgeLambda);
  const model: FraudModelJson = { ...working, weights };

  if (options.persistModel) {
    saveModel(options.modelPath, model);
  }

  const updates: { order_id: number; risk_score: number; is_fraud: boolean }[] = [];
  for (let i = 0; i < merged.length; i++) {
    const dv = buildDesignVector(model, rawRows[i]!, model.medians, model.means, model.stds);
    let risk = predictRisk(model, dv);
    risk = Math.max(0, Math.min(100, risk));
    const is_fraud = risk >= model.fraudThreshold;
    updates.push({ order_id: merged[i]!.order_id, risk_score: risk, is_fraud });
  }

  let rowsUpdated = 0;
  for (const batch of chunk(updates, 25)) {
    const results = await Promise.all(
      batch.map((u) =>
        options.supabase
          .from("orders")
          .update({ risk_score: u.risk_score, is_fraud: u.is_fraud })
          .eq("order_id", u.order_id),
      ),
    );
    for (const res of results) {
      if (res.error) {
        throw new Error(`Failed to update order: ${res.error.message}`);
      }
      rowsUpdated += 1;
    }
  }

  return { orderCount: merged.length, rowsUpdated, model };
}

/**
 * Score all orders using the model on disk (no retraining).
 */
export async function runScoreOnly(options: {
  supabase: SupabaseClient;
  modelPath: string;
}): Promise<RunPipelineResult> {
  const model = loadModel(options.modelPath);
  const merged = await fetchMergedOrders(options.supabase);
  if (merged.length === 0) {
    throw new Error("No orders to score.");
  }

  const rawRows = merged.map((m) => buildRawFeatureRow(m));
  const updates: { order_id: number; risk_score: number; is_fraud: boolean }[] = [];

  for (let i = 0; i < merged.length; i++) {
    const dv = buildDesignVector(model, rawRows[i]!, model.medians, model.means, model.stds);
    let risk = predictRisk(model, dv);
    risk = Math.max(0, Math.min(100, risk));
    const is_fraud = risk >= model.fraudThreshold;
    updates.push({ order_id: merged[i]!.order_id, risk_score: risk, is_fraud });
  }

  let rowsUpdated = 0;
  for (const batch of chunk(updates, 25)) {
    const results = await Promise.all(
      batch.map((u) =>
        options.supabase
          .from("orders")
          .update({ risk_score: u.risk_score, is_fraud: u.is_fraud })
          .eq("order_id", u.order_id),
      ),
    );
    for (const res of results) {
      if (res.error) {
        throw new Error(`Failed to update order: ${res.error.message}`);
      }
      rowsUpdated += 1;
    }
  }

  return { orderCount: merged.length, rowsUpdated, model };
}
