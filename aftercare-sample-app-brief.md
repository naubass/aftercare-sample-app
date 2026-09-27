# Sample App Brief — Aftercare (Agent Engineer 2)

**Hackathon:** IBM Bob 2.0 · Sep 25–27, 2026
**Owner:** Naufal (Agent Engineer 2) — sample app, failure scenarios, chaos/verify scripts

---

## 1. What's being built

**"Micro Checkout API"** — a minimal e-commerce app that serves as the "test dummy" for the Aftercare system. This is **not** the hackathon's core product — it's just a target we deliberately break so Bob can prove its runbooks actually work.

Design principle: every failure must be **easy to trigger** by script and **easy to verify** as recovered or not via the health check.

## 2. Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Local deployment:** Docker Compose (app + postgres + mock-shipping-api as separate containers)

## 3. Three required failure scenarios

| # | Scenario | How it's triggered | What's affected |
|---|---|---|---|
| 1 | **Database down** | `docker stop aftercare-db` | Product stock & order history become inaccessible |
| 2 | **Missing config/secret** | Rename `config/payment-secret.txt` → `payment-secret.txt.bak` (restored on recovery) | Payment gateway key is gone, `/payment` endpoint fails |
| 3 | **External API unavailable** | `docker stop aftercare-mock-shipping-api` | Shipping cost check (mock third-party API) becomes inaccessible |

> Note: scenario 2 intentionally renames the file (rather than deleting it permanently) to keep recovery deterministic and safe for repeated demo runs. The secret is read from a file rather than an env var, since env vars can't be changed live without restarting the container.

## 4. Main endpoints

| Endpoint | Function | Scenario it triggers |
|---|---|---|
| `POST /checkout` | Checks DB stock, creates an order | 1 |
| `POST /payment` | Calls the payment gateway using the secret key | 2 |
| `GET /shipping-cost` | Calls the mock external shipping API | 3 |
| `GET /health` | Granular status per dependency: `{ db, payment_secret, shipping_api }` | All — used by the dashboard for 🔴/🟢 status |

## 5. Repo structure

```
aftercare-sample-app/
├── docker-compose.yml
├── Dockerfile
├── .env
├── package.json
├── config/
│   └── payment-secret.txt
├── db/
│   └── init.sql
├── src/
│   ├── index.js
│   ├── db.js
│   ├── health.js
│   └── routes/
│       ├── checkout.js
│       ├── payment.js
│       └── shipping.js
├── mock-shipping-api/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
└── scripts/
    ├── lib.js
    ├── chaos.js
    ├── verify.js
    ├── run-all.js
    └── run-parallel.js
```

## 6. Deliberately out of scope

To keep the scope small and focused on Aftercare (not the sample app itself):
- No auth / user management
- No shopping cart or checkout UI
- No real payment gateway — just a mock that checks whether the secret key exists
- Max 3 failure scenarios (per the MVP limit)

## 7. Dependencies on other team members

- **Backend (hosted service):** needs to know the `/health` response shape to store run results
- **Frontend (dashboard):** needs to know the per-scenario status format to render 🔴/🟢
- **Agent Engineer 1 (Bob/runbook):** needs access to the sample app repo, plus the trigger commands in section 3, to generate a runbook per scenario

## 8. Status

Sample app, all 3 endpoints, and the health check are built and working. Chaos and verify scripts are built and tested — confirmed safe to run **both sequentially and in parallel** (all three scenarios can be broken and recovered at the same time without interfering with each other). Next: hand off the trigger/verify interface to Agent Engineer 1 for runbook generation, and coordinate on deployment.
