# Agent notes (shop-ml-pipeline)

- **Customer routes:** `app/customer/[id]` expects a Supabase `customer_id` (positive integer). URLs use numeric segments, e.g. `/customer/1`. Legacy `/customer/customer-1001` is parsed by `lib/customer-route.ts`.
- **Demo picker:** `lib/demo.ts` rows must keep `id` aligned with seeded `customers.customer_id` in migrations.
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
- **Fraud scoring (JS):** `npm run fraud:train` / `npm run fraud:score`; model at `models/fraud_risk_model.json`. **`/warehouse/priority-queue`** shows **fraud** (`is_fraud`, `risk_score`) and late-delivery columns; the batch job updates fraud fields in Supabase.
- **Windows:** Clear `.next` with PowerShell: `Remove-Item -Recurse -Force .next`.
