/**
 * Nightly (or manual): retrain ridge model on Supabase data, then update risk_score / is_fraud.
 * In CI, set persistModel=false so the repo file is unchanged; weights live in DB after scoring.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { createScriptSupabase } from "@/lib/fraud/script-supabase";
import { defaultModelPath, runTrainAndScore } from "@/lib/fraud/run-pipeline";

async function main() {
  const persist =
    process.env.FRAUD_PERSIST_MODEL === "1" || process.env.FRAUD_PERSIST_MODEL === "true";
  const supabase = createScriptSupabase();
  const modelPath = process.env.FRAUD_MODEL_PATH ?? defaultModelPath();

  const result = await runTrainAndScore({
    supabase,
    modelPath,
    persistModel: persist,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        orderCount: result.orderCount,
        rowsUpdated: result.rowsUpdated,
        modelPersisted: persist,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
