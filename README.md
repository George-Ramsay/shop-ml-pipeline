# shop-ml-pipeline

End-to-end machine learning project built around `shop.db`.

## Overview

This project combines an operational web app with machine learning pipelines for two business use cases:

- **Late delivery prediction** for warehouse prioritization
- **Fraud detection** for order risk analysis

## Deliverables

### Web App
A deployed application that allows users to:

- select a customer
- view a customer dashboard
- place a new order
- review order history
- view a late-delivery priority queue
- run scoring to refresh predicted late-delivery risk

### ML Notebook
A Jupyter notebook that applies the **CRISP-DM** process to predict `is_fraud` from the `orders` table, including:

- business understanding
- data understanding
- data preparation
- modeling
- evaluation
- deployment

## Tech Direction

Planned stack:

- **Frontend/App:** Next.js + TypeScript + Tailwind
- **Database:** SQLite (`shop.db`)
- **ML:** Python, pandas, scikit-learn, Jupyter
- **Deployment:** Vercel

## Environment Variables

The app now recognizes these Supabase environment variables for Vercel and local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

For compatibility with older naming, the code also accepts `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` as fallbacks.

## Repository Goals

- keep the app simple and demo-ready
- build a clear, reproducible ML pipeline
- connect predictions to a usable business workflow
- structure the repo so app, notebook, and deployment assets are easy to review

## Next Docs

This repo will also include:

- `agents.md`
- `architecture.md`
- `plan.md`
