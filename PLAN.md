# plan.md

## Goal

Build a working end-to-end application around `shop.db` by progressing through three major stages:

1. create a functional website
2. connect the deployed app to Supabase
3. connect the application workflow to the ML pipeline

The plan is intentionally phased so the project becomes usable early and then gains data connectivity and predictive functionality step by step.

---

## Phase 1: Build a Working Website First

### Objective
Create a clean, working web app with the required pages and flows before worrying about deployment data integration or ML scoring.

### Why this phase comes first
The project will move faster if the UI, routing, and core user flows are working first. This creates a usable shell that can later be connected to real data and prediction logic.

### Deliverables
- Next.js project initialized
- Tailwind styling configured
- page routing in place
- reusable layout and components created
- mock or local sample data wired into the interface
- all required screens render and navigate correctly

### Required pages
- **Select Customer**
- **Customer Dashboard**
- **New Order**
- **Order History**
- **Late Delivery Priority Queue**

### Functional goals
- user can select a customer
- dashboard displays summary cards and recent order info
- user can fill out and submit a new order form
- order history page displays customer orders
- warehouse page displays a table for top late-delivery-risk orders
- **Run Scoring** button exists in the UI even if temporarily mocked

### Suggested tasks
- initialize repo with Next.js + TypeScript + Tailwind
- create base layout and navigation
- define initial TypeScript data models
- create mock data for customers and orders
- scaffold each page with placeholder data
- build shared UI components such as:
  - customer selector
  - summary cards
  - order table
  - new order form
  - priority queue table
  - scoring action button
- make navigation between pages work cleanly
- ensure the site is demoable even before real data is connected

### Exit criteria
Phase 1 is complete when the app can be opened locally and all required pages work with mock or temporary data.

---

## Phase 2: Connect the Website to Supabase

### Objective
Replace mock or local-only app data with a real deployed data layer in Supabase.

### Why this phase comes second
Once the website structure is stable, connecting data becomes much easier. This reduces the risk of changing UI and schema at the same time.

### Deliverables
- Supabase project created
- schema created for customers and orders
- `shop.db` data migrated or seeded into Supabase
- app successfully connected to Supabase
- customer flows and order flows use real database records

### Functional goals
- customer selection loads from Supabase
- dashboard queries real customer/order data
- new order form writes new records to Supabase
- order history page reads from Supabase
- warehouse queue reads scored order data from Supabase or a connected table/view

### Suggested tasks
- inspect the `shop.db` schema
- define matching Supabase tables
- create SQL schema and seed scripts
- migrate source data from SQLite into Supabase
- add environment variables for Supabase URL and key
- add Supabase client configuration in the app
- replace mock data functions with real queries
- test create/read flows for orders
- confirm the deployed app works against Supabase

### Important implementation note
At the end of this phase, the application should no longer depend on local mock data for core functionality.

### Exit criteria
Phase 2 is complete when the website is using Supabase as its real data source and the main user flows work end to end.

---

## Phase 3: Build the ML Pipeline in Parallel

### Objective
Develop the fraud detection notebook and the reusable ML pipeline artifacts while the web app is becoming stable.

### Why parallel work helps
The notebook and model experimentation can move forward while app development is happening. This keeps progress steady and avoids waiting until the site is fully complete before starting modeling.

### Deliverables
- Jupyter notebook for CRISP-DM fraud prediction
- data loading from project data source
- exploratory analysis
- feature engineering
- preprocessing pipeline
- trained and evaluated fraud model
- serialized model artifact

### Functional goals
- notebook clearly documents business understanding
- data preparation is reproducible
- model training and evaluation are documented
- final model can be saved and loaded
- deployment section shows how the artifact fits into the broader system

### Suggested tasks
- connect notebook to source data
- define fraud prediction target and success criteria
- explore the orders table and related features
- clean and prepare data
- build preprocessing pipeline
- test multiple classification models
- evaluate using appropriate classification metrics
- tune the best model
- perform feature selection if useful
- serialize final artifact with `joblib` or `pickle`

### Exit criteria
Phase 3 is complete when the fraud notebook is submission-ready and the saved model artifact can be loaded for inference.

---

## Phase 4: Add Late Delivery Scoring Integration

### Objective
Connect the website workflow to a real ML scoring process for the late-delivery priority queue.

### Why this phase comes after data connectivity
Scoring is much easier to integrate once the app can already read and write real deployed data.

### Deliverables
- late-delivery prediction pipeline or scoring script
- saved model artifact for delivery risk
- scoring workflow callable from the app
- refreshed warehouse priority queue based on prediction results

### Functional goals
- **Run Scoring** button triggers a scoring action
- relevant orders are scored
- scores are saved or returned in a usable format
- priority queue updates to show top 50 late-risk orders

### Suggested tasks
- define late-delivery target and scoring dataset
- engineer delivery-related features
- train a late-delivery classifier
- serialize the late-delivery pipeline
- create scoring script or route handler
- connect **Run Scoring** button to scoring logic
- update queue page to show latest predictions
- verify ranking logic is correct

### Implementation options
Possible approaches:
- scoring script invoked by backend route
- Python service called by the app
- precomputed predictions stored in Supabase

For class-project speed, the simplest working implementation is preferred.

### Exit criteria
Phase 4 is complete when the warehouse page shows real model-driven rankings and the scoring button refreshes those rankings.

---

## Phase 5: Deployment and Final Integration

### Objective
Deploy the full solution and make sure all required deliverables are present and reviewable.

### Deliverables
- Vercel deployment live
- Supabase connected in deployed environment
- required pages functioning
- notebook completed and exported
- model artifacts saved and organized
- repo documentation cleaned up

### Final checks
- live URL works
- customer selection works
- dashboard works
- new order flow works
- order history works
- warehouse queue works
- scoring trigger works
- notebook is complete and clear
- README, architecture, agents, and plan docs are present

### Suggested tasks
- configure Vercel environment variables
- test deployed Supabase connectivity
- verify no hardcoded local-only paths remain
- organize notebook and models folders
- review repo naming and structure
- clean up placeholder code and comments
- capture AI chat logs if submitting them

### Exit criteria
Phase 5 is complete when the project is fully demoable, deployed, and submission-ready.

---

## Recommended Build Order Summary

### First priority
Get the **website working locally** with all pages and flows.

### Second priority
Connect the app to **Supabase** and verify real reads and writes.

### Third priority
Complete the **fraud notebook pipeline** and save model artifacts.

### Fourth priority
Connect the **late-delivery scoring pipeline** to the app.

### Fifth priority
Deploy, test, polish, and submit.

---

## MVP Milestones

### MVP 1
Website works locally with mock data.

### MVP 2
Website works with Supabase-backed customer and order data.

### MVP 3
Fraud notebook is complete and model artifact is saved.

### MVP 4
Late-delivery scoring is connected to the warehouse queue.

### MVP 5
Everything is deployed and ready for submission.

---

## Risk Management

### Risk 1: Supabase schema mismatch
Mitigation:
- inspect `shop.db` early
- map tables and fields before wiring app queries

### Risk 2: ML integration slows down frontend progress
Mitigation:
- keep the website moving first
- use placeholder scoring until the real pipeline is ready

### Risk 3: Deployment issues with local-only assumptions
Mitigation:
- move to Supabase early
- keep secrets in environment variables
- avoid dependence on local file paths in deployed code

### Risk 4: Overengineering
Mitigation:
- choose the simplest architecture that satisfies the assignment
- prefer working flows over ideal abstractions

---

## Definition of Done

The project is complete when:

- a live deployed app is accessible
- the app supports customer selection, dashboard viewing, new order creation, order history, and warehouse priority queue
- the deployed app is connected to Supabase
- the scoring workflow refreshes the late-delivery priority queue
- the CRISP-DM notebook predicts `is_fraud`
- the model pipeline is serialized and demonstrated as deployable
- the repository documentation clearly explains the system