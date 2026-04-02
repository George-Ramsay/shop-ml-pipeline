-- Human ground truth for retraining: null = not reviewed yet
alter table public.orders add column if not exists actual_fraud boolean;
alter table public.orders add column if not exists fraud_reviewed_at timestamptz;

comment on column public.orders.actual_fraud is 'Human label: true/fraud, false/not fraud, null = not reviewed';
comment on column public.orders.fraud_reviewed_at is 'When actual_fraud was last set (cleared when set back to not reviewed)';
