/** Score all orders using existing model file (no training). */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { createScriptSupabase } from "@/lib/fraud/script-supabase";
import { defaultModelPath, runScoreOnly } from "@/lib/fraud/run-pipeline";

async function main() {
  const supabase = createScriptSupabase();
  const modelPath = process.env.FRAUD_MODEL_PATH ?? defaultModelPath();

  const result = await runScoreOnly({ supabase, modelPath });
  console.log(`Scored ${result.orderCount} orders; updated ${result.rowsUpdated} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
