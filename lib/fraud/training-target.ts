/**
 * Nightly retraining should prefer human labels when present:
 * map actual_fraud to a 0–100 target; fall back to existing risk_score for unreviewed rows.
 */
export function trainingRiskTarget(
  riskScore: number,
  actualFraud: boolean | null,
): number {
  if (actualFraud === true) return 100;
  if (actualFraud === false) return 0;
  return riskScore;
}
