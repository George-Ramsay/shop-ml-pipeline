Use this revised `architecture.md` with Supabase included as the deployed data layer and with the connection requirement called out clearly:

````md
# architecture.md

## System Overview

This project is an end-to-end machine learning system built around the `shop.db` dataset. During development, the source data may begin in SQLite, but for the deployed application the data layer will be hosted in **Supabase** and the application must be connected to it correctly.

The system combines a lightweight operational web app with batch-style ML scoring so users can interact with customer and order data while also using model predictions in a business workflow.

The architecture supports two primary use cases:

1. **Late delivery prediction** for warehouse prioritization in the web app
2. **Fraud prediction** through a CRISP-DM notebook and serialized ML pipeline

---

## High-Level Architecture

```text
                   +----------------------+
                   |      shop.db         |
                   | local development    |
                   | source dataset       |
                   +----------+-----------+
                              |
                              | migrate / seed
                              v
                   +----------------------+
                   |      Supabase        |
                   | deployed relational  |
                   | database + API       |
                   +----------+-----------+
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
+---------------------------+      +---------------------------+
|       Next.js Web App     |      |   Jupyter / ML Pipeline   |
|  Customer + warehouse UI  |      | Fraud + delivery modeling |
+-------------+-------------+      +-------------+-------------+
              |                                  |
              | reads/writes customers/orders    | reads training/scoring data
              | through Supabase connection      | from Supabase or exported data
              v                                  v
   +---------------------------+      +---------------------------+
   | App services / API layer  |      | Serialized model artifacts|
   | order creation, queries,  |      | .pkl / .joblib + pipeline |
   | scoring trigger           |      +---------------------------+
   +-------------+-------------+                    |
                 |                                  |
                 +------------------+---------------+
                                    |
                                    v
                     +-------------------------------+
                     | Inference / scoring process   |
                     | generates late-delivery risk  |
                     | and refreshes priority queue  |
                     +-------------------------------+
````

---

## Core Components

## 1. Data Layer

### Local Development Data

**Source dataset:** `shop.db`

This database is the original working dataset used for exploration, notebook development, and possibly initial prototyping.

### Deployed Data Store

**Production/deployed database:** **Supabase**

For the live application, the data must be deployed to Supabase and the application must be connected to that Supabase instance.

Responsibilities:

* store customer records
* store order records
* support reads and writes from the deployed web app
* provide the `is_fraud` target for notebook modeling
* provide order-level features for late-delivery scoring
* act as the connected cloud database for the deployed app

### Connection Requirement

A required part of the architecture is that the application **must be connected to Supabase** so that:

* customer selection loads real customer records
* new orders are saved to the deployed database
* order history reflects deployed data
* the warehouse priority queue reads current scored orders
* the scoring workflow can update or refresh records tied to deployed data

---

## 2. Web Application

**Recommended stack:** Next.js + TypeScript + Tailwind CSS
**Deployment target:** Vercel

Responsibilities:

* customer selection screen
* customer dashboard with order summaries
* create new orders
* display customer order history
* display warehouse late-delivery priority queue
* expose a **Run Scoring** action to refresh predictions

Main UI pages:

* `/` or `/customers` → Select Customer
* `/customer/[id]` → Customer Dashboard
* `/customer/[id]/orders` → Order History
* `/customer/[id]/new-order` → New Order Form
* `/warehouse/priority-queue` → Late Delivery Priority Queue

The web app should connect to Supabase for all deployed reads and writes.

---

## 3. Application Service Layer

This layer handles business logic between the UI and the data/model layer.

Responsibilities:

* query customer and order data from Supabase
* validate and save new orders
* load scored late-delivery predictions
* trigger inference job when user clicks **Run Scoring**
* transform raw database records into UI-friendly summaries

Possible implementation choices:

* Next.js route handlers
* Next.js server actions
* Supabase client integration in server-side logic

For rapid development, this logic should stay close to the Next.js app unless Python scoring requires a separate service boundary.

---

## 4. Machine Learning Pipeline

There are effectively two ML workflows in this repo.

### A. Fraud Detection Pipeline

Built in the Jupyter notebook using CRISP-DM.

Responsibilities:

* load data from the project dataset
* explore and understand fraud patterns
* clean and prepare data
* engineer features
* train and compare classification models
* tune and evaluate the best model
* serialize the final fraud model and preprocessing pipeline

Expected outputs:

* notebook documentation of CRISP-DM process
* trained model artifact
* reproducible preparation and inference steps

### B. Late Delivery Scoring Pipeline

Used by the web app’s warehouse queue.

Responsibilities:

* load order data from Supabase
* prepare features for late-delivery prediction
* run inference on active or relevant orders
* write back prediction scores or expose them to the app
* rank orders by late-delivery probability

Expected output:

* scored list of orders sorted by descending late-delivery risk
* top 50 shown in the warehouse UI

---

## 5. Model Artifacts

Serialized assets should be saved in a predictable location, such as:

```text
/models
  fraud_pipeline.pkl
  late_delivery_pipeline.pkl
```

These artifacts should contain:

* preprocessing logic
* feature transformations
* trained estimator
* versionable inference pipeline

This makes deployment and scoring simpler and reduces mismatch between training and prediction logic.

---

## 6. Inference / Scoring Process

The scoring process is triggered by the web app and refreshes the late-delivery queue.

Responsibilities:

* load the current late-delivery model artifact
* fetch relevant order records from Supabase
* generate predictions
* store or return probabilities
* refresh queue view

Possible approaches:

* run scoring synchronously from a backend route
* run a Python script triggered by the app
* expose a simple scoring endpoint if Python is separated from Next.js

For the assignment, the simplest architecture is acceptable as long as the flow is clear and working.

---

## Data Flow

## Data Setup and Deployment

1. Start with the provided `shop.db` dataset
2. Create the corresponding schema in Supabase
3. migrate or seed the source data into Supabase
4. connect the Next.js application to Supabase
5. verify deployed reads and writes are working end to end

## Customer and Order Experience

1. User opens the app
2. User selects a customer
3. App queries Supabase
4. Dashboard displays customer summaries
5. User creates a new order
6. App validates input and writes the order to Supabase
7. Order history updates from current deployed database state

## Late Delivery Priority Queue

1. User opens warehouse page
2. App reads current scored late-delivery records
3. Top 50 highest-risk orders are displayed
4. User clicks **Run Scoring**
5. Scoring pipeline runs inference on relevant orders
6. Predictions are refreshed
7. Queue reloads with updated ranking

## Fraud Modeling Notebook

1. Notebook connects to the dataset source
2. Data is extracted from orders data
3. Features are explored and prepared
4. Models are trained and evaluated
5. Best pipeline is serialized
6. Deployment section demonstrates how the artifact is loaded and used

---

## Suggested Repository Structure

```text
shop-ml-pipeline/
│
├── app/                     # Next.js app
├── components/              # UI components
├── lib/                     # Supabase and service helpers
├── app/api/                 # route handlers if used
│
├── notebooks/
│   └── fraud_pipeline.ipynb
│
├── ml/
│   ├── train_fraud.py
│   ├── train_late_delivery.py
│   ├── score_late_delivery.py
│   └── preprocessing/
│
├── models/
│   ├── fraud_pipeline.pkl
│   └── late_delivery_pipeline.pkl
│
├── data/
│   └── shop.db
│
├── README.md
├── architecture.md
├── agents.md
└── plan.md
```

---

## Design Principles

### 1. Keep the architecture simple

This is a class project, so the system should prioritize clarity and completeness over production-scale complexity.

### 2. Separate app logic from ML logic

The web app should not contain notebook-style experimentation. Training, scoring, and serialized artifacts should be clearly organized.

### 3. Connect deployment to real hosted data

The deployed app should not remain dependent on a local-only database. Supabase is the deployed data layer and must be properly connected to the application.

### 4. Reuse preprocessing in inference

Training and prediction should use the same preparation pipeline to avoid feature mismatch.

### 5. Optimize for demonstration

The most important outcome is a clean, working flow that clearly shows:

* data source
* database deployment to Supabase
* model training
* scoring
* user interaction
* deployment

---

## Deployment View

### Web App

* deployed on Vercel
* serves UI and app logic
* connects to Supabase
* triggers scoring workflow

### Data Layer

* Supabase hosts the deployed application data
* schema and records must be loaded from the provided dataset
* app environment variables must be configured for Supabase connectivity

### Notebook / ML Artifacts

* developed locally in Jupyter
* artifacts committed or packaged appropriately
* deployment section demonstrates how saved models integrate into inference flow

---

## Risks and Constraints

* the SQLite source data must be transformed and loaded into Supabase correctly
* the Supabase schema must match application and ML expectations
* ML inference in Vercel may require care depending on runtime and Python integration
* feature leakage must be avoided in fraud and delivery models
* the scoring flow should be deterministic and easy to demo

---

## MVP Definition

The minimum viable architecture should support:

* deploying the data into Supabase
* connecting the app to Supabase
* selecting a customer
* viewing customer summaries and order history
* creating a new order
* viewing the late-delivery priority queue
* triggering scoring and refreshing predictions
* training and documenting a fraud model in a notebook
* saving and loading a serialized model artifact