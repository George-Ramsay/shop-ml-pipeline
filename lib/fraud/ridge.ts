import { Matrix, solve } from "ml-matrix";

import type { FraudModelJson } from "@/lib/fraud/model-json";

/**
 * Ridge regression: w = (X'X + λI)⁻¹ X'y
 */
export function fitRidgeWeights(X: number[][], y: number[], lambda: number): number[] {
  const n = X.length;
  if (n === 0) {
    throw new Error("fitRidgeWeights: no rows");
  }
  const p = X[0]!.length;
  const Xm = new Matrix(X);
  const yt = Matrix.columnVector(y);
  const Xt = Xm.transpose();
  const XtX = Xt.mmul(Xm);
  const Xty = Xt.mmul(yt);

  for (let i = 0; i < p; i++) {
    XtX.set(i, i, XtX.get(i, i) + lambda);
  }

  const w = solve(XtX, Xty);
  return w.to1DArray();
}

export function predictRisk(model: FraudModelJson, designRow: number[]): number {
  let s = 0;
  for (let i = 0; i < model.weights.length; i++) {
    s += model.weights[i]! * (designRow[i] ?? 0);
  }
  return s;
}
