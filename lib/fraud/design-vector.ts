import type { FraudModelJson } from "@/lib/fraud/model-json";

function median(sorted: number[]): number {
  if (sorted.length === 0) {
    return 0;
  }
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m]! : (sorted[m - 1]! + sorted[m]!) / 2;
}

/** Compute medians / means / population std for numeric columns from raw feature rows. */
export function computeNumericStats(
  rows: Record<string, number | string | boolean>[],
  numericColumns: string[],
): { medians: Record<string, number>; means: Record<string, number>; stds: Record<string, number> } {
  const medians: Record<string, number> = {};
  const means: Record<string, number> = {};
  const stds: Record<string, number> = {};

  for (const col of numericColumns) {
    const vals: number[] = [];
    for (const r of rows) {
      const v = r[col];
      if (typeof v === "number" && Number.isFinite(v)) {
        vals.push(v);
      }
    }
    vals.sort((a, b) => a - b);
    medians[col] = median(vals);

    const filled = vals.length ? vals : [0];
    const mean = filled.reduce((a, b) => a + b, 0) / filled.length;
    means[col] = mean;
    const variance =
      filled.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(filled.length, 1);
    stds[col] = variance > 0 ? Math.sqrt(variance) : 1;
  }

  return { medians, means, stds };
}

function numVal(
  raw: Record<string, number | string | boolean>,
  col: string,
  medians: Record<string, number>,
  means: Record<string, number>,
  stds: Record<string, number>,
): number {
  let v = raw[col];
  if (typeof v !== "number" || !Number.isFinite(v)) {
    v = medians[col] ?? 0;
  }
  const mean = means[col] ?? 0;
  const std = stds[col] && stds[col]! > 0 ? stds[col]! : 1;
  return (v - mean) / std;
}

/**
 * Build one design row (length = designLabels.length) from raw features + preprocessing stats.
 */
export function buildDesignVector(
  model: FraudModelJson,
  raw: Record<string, number | string | boolean>,
  medians: Record<string, number>,
  means: Record<string, number>,
  stds: Record<string, number>,
): number[] {
  const vec: number[] = new Array(model.designLabels.length);
  let i = 0;
  for (const label of model.designLabels) {
    if (label.startsWith("num:")) {
      const col = label.slice(4);
      vec[i] = numVal(raw, col, medians, means, stds);
    } else if (label.startsWith("cat:")) {
      const rest = label.slice(4);
      const eq = rest.indexOf("=");
      const col = rest.slice(0, eq);
      const val = rest.slice(eq + 1);
      const actual = raw[col];
      const s = typeof actual === "string" ? actual : String(actual ?? "");
      vec[i] = s === val ? 1 : 0;
    } else {
      vec[i] = 0;
    }
    i += 1;
  }
  return vec;
}

export function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    s += a[i]! * (b[i] ?? 0);
  }
  return s;
}
