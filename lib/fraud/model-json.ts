/** Serialized ridge model — matches `models/fraud_risk_model.json`. */
export type FraudModelJson = {
  version: number;
  target: string;
  fraudThreshold: number;
  ridgeLambda: number;
  featureKeys: string[];
  numericColumns: string[];
  categoricalColumns: string[];
  medians: Record<string, number>;
  means: Record<string, number>;
  stds: Record<string, number>;
  categories: Record<string, string[]>;
  designLabels: string[];
  weights: number[];
};
