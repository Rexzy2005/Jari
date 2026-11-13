# JARI Codebase Review

Reviewed: 2026-11-13

## What the product is

JARI is being built as a poultry farm operations record system with a financial readiness and institutional services layer. The primary workflow is for farmers to keep a usable history of their farms, houses, flocks, feed, production, animal health, sales, expenses, and supporting documents. That history is intended to help farmers understand their operations and, with their consent, support conversations with lenders, insurers, and grant providers. Administrators and verification agents support account and record review; institutions have a separate onboarding and portfolio workspace.

The product has a clear local focus on poultry farmers in Jos South and Plateau State. Its strongest product choice is to treat record completeness as useful information in itself and to avoid promising loans, insurance, or grants based on an unvalidated score.

## What is implemented today

- `frontend/` is a Next.js App Router application with public pages and separate farmer, admin/reviewer, and institutional workspaces.
- The farmer workspace contains a broad set of operational and financial workflows. Most demo workflows use a versioned browser `localStorage` data store through `frontend/src/services/index.ts` and `frontend/src/lib/simulated-data.ts`.
- The frontend includes local demo accounts and simulated KYC, institution verification, programme applications, and review flows. The docs and screens generally label those outcomes as simulations.
- `backend/` is a FastAPI/PostgreSQL service with SQLAlchemy models, Alembic migrations, JWT authentication, role dependencies, and endpoints/services for the same farm domains plus institutional profiles and risk assessments.
- `frontend/src/lib/api-client.ts` and `backend-sync.ts` provide a real API client and local cache synchronization path. This coexistence means the app has two data modes: browser demo data and backend-backed records. The README and frontend handoff correctly say that a configured API URL does not make every page backend-backed.
- There are backend pytest suites and a separate frontend simulated-workflow test suite. The frontend handoff documents passing workflow/type/build checks and outstanding manual browser/device review.

## Feedback and recommended priorities

### P0 — Close the institution-to-farm privacy boundary before using real data

The backend currently permits institution users to enumerate farms even when they have no access grant. `RiskAssessmentService.get_portfolio_farms()` falls back to every farm in the database when no active `InstitutionFarmAccess` rows exist. The institution risk-profile endpoint also computes a profile for any supplied farm ID without checking that the institution has access to that farm. The grant-access endpoint creates an institution/farm link without farmer approval. These paths expose identifiable farm and operational data across tenant boundaries.

There is a related account-role issue: public `/auth/register` calls `register_farmer`, but `AuthService.register_farmer()` accepts `institutional_user` from the submitted role. That makes institution registration self-service at the API level, outside any admin review or trusted invitation process. Together, these behaviors make the existing role check insufficient as an authorization boundary.

Before connecting real farmer data, make institutional account creation/admin approval explicit, require a farmer-controlled consent grant (with purpose, scope, expiry/revocation and audit history as product needs dictate), and enforce that grant in portfolio listing, profile reads, and assessment writes. Default to no farm access when no grant exists. Add tests that prove a second institution and an unapproved institution cannot read a farmer profile or create an assessment.

### P1 — Choose and document the source of truth for each workflow

The UI services facade is a useful seam, but the current implementation has both local simulated persistence and real backend mutations/sync. `RoleShell` can restore a backend token, while most visible farmer workflows are still described as local demo flows. In this hybrid state, users and developers can have trouble knowing whether a save is durable, which data store owns a record, and whether a local record is overwritten during a backend sync.

For each workflow, document whether it is demo-only, backend-backed, or intentionally hybrid. Then put the mode decision in one place in the service facade, show the active mode to demo users, and define migration/conflict behavior before moving existing local records to server storage. The README already sets this expectation well; keep it aligned as wiring progresses.

### P1 — Keep risk outputs explainable and non-decisional until validated

The backend currently computes a deterministic 0–100 score from mortality, biosecurity checklist count, KYC status, and a few record-presence checks, then labels bands “Low Risk”, “Moderate Risk”, and “High Risk” (`backend/app/services/risk_assessment.py`). It is transparent in code, but the weights and meanings are not supported by model validation or domain evidence in the repository. A label like “Low Risk” can be interpreted as an underwriting judgment even if the frontend demo carefully avoids that claim. Also, assessment creation accepts a submitted score and band, so saved assessments are not necessarily tied to the current calculation.

Until the scoring method is reviewed with poultry, insurance, and lending stakeholders and validated against outcomes, lead with record coverage and data quality signals. If a score remains visible, record its version, inputs, timestamp, limitations, and author, and keep it explicitly advisory. Separate calculated profile data from an institution's own documented assessment.

### P1 — Make the production configuration fail safely

`backend/app/core/config.py` contains a usable fallback JWT secret and enables debug mode by default. Those defaults are convenient for local setup, but a deployment that omits environment configuration could start with a predictable signing key. Production startup should reject placeholder secrets and unsafe debug settings, and deployment documentation should make the required values unambiguous. Keep the local `.env.example` usable for development while validating production configuration separately.

### P2 — Reduce drift between product docs and the current system

The docs are detailed and useful, but they represent different moments and scopes: the frontend handoff is current and frontend-only, older progress notes describe unfinished work that is now marked complete elsewhere, and institutional requirements explicitly describe a simulated frontend phase. The README is the clearest present-day overview. Add a small status/ownership section that points to the current source of truth for each area, and archive or label superseded trackers so a new contributor does not resume already-completed work or assume backend integration is complete.

### P2 — Turn the broad workflow set into a repeatable release check

JARI has many connected records where one action affects another: mortality changes flock counts, transfers affect two flocks, feed use depends on stock, and partial payments affect outstanding balances. The simulated workflow tests cover several important invariants, and backend endpoint tests are present. Keep expanding tests around consent/role boundaries, data-mode synchronization, cross-record rollback, and browser refresh behavior. Complete the documented manual checks for mobile layouts, keyboard focus, and role navigation before treating the frontend as ready for field use.

## Suggested sequence

1. Close farm-data access and institutional role assignment in the backend; add negative authorization tests.
2. Decide the source of truth and rollout mode for each user workflow, especially auth, farm profile, records, documents, and institution review.
3. Review risk profile language and governance with domain stakeholders; version any retained scoring method.
4. Enforce production configuration requirements and then complete browser/device acceptance checks.

## Review limits

This is a repository-level review of the code and documentation, not a security audit or domain validation. I did not run the test suites or connect to a deployed environment. The access-control concerns above are directly visible in the backend route and service behavior and should be verified with focused tests during remediation.
