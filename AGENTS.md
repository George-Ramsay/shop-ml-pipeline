# Agent notes (shop-ml-pipeline)

- **Customer routes:** `app/customer/[id]` expects a Supabase `customer_id` (positive integer). URLs use numeric segments, e.g. `/customer/1`. Legacy `/customer/customer-1001` is parsed by `lib/customer-route.ts`.
- **Demo picker:** `lib/demo.ts` rows must keep `id` aligned with seeded `customers.customer_id` in migrations.
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
- **Fraud scoring (JS):** `npm run fraud:pipeline` (retrain + update DB; CI nightly), `npm run fraud:train` (retrain + save `models/fraud_risk_model.json`), `npm run fraud:score` (score only). Model template at `models/fraud_risk_model.json`. GitHub Actions: `.github/workflows/nightly-fraud.yml` needs secrets `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. **`/warehouse/priority-queue`** reads **fraud** (`is_fraud`, `risk_score`) from Supabase.
- **Windows:** Clear `.next` with PowerShell: `Remove-Item -Recurse -Force .next`.
