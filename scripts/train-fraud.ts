/** Retrain model and write `models/fraud_risk_model.json` (local dev). */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { createScriptSupabase } from "@/lib/fraud/script-supabase";
import { defaultModelPath, runTrainAndScore } from "@/lib/fraud/run-pipeline";

async function main() {
  const supabase = createScriptSupabase();
  const modelPath = process.env.FRAUD_MODEL_PATH ?? defaultModelPath();

  const result = await runTrainAndScore({
    supabase,
    modelPath,
    persistModel: true,
  });

  console.log(
    `Trained on ${result.orderCount} orders; updated ${result.rowsUpdated} rows; model saved to ${modelPath}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
