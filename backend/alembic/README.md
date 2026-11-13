# Backend database migrations

The backend uses Alembic as its schema migration system. The ordered revisions in `versions/` create every SQLAlchemy application table:

1. `0001_create_user_table.py` — users and role/status enums.
2. `0002_create_farm_and_poultry_house_tables.py` — farms and poultry houses.
3. `0003_create_flock_and_flock_movement_tables.py` — flocks, movements, and flock enums.
4. `0004_create_operations_and_health_tables.py` — feed purchases/consumption, production, health incidents, vaccinations, and treatments.
5. `0005_create_financial_tables.py` — sales, expenses, and payment history.
6. `0006_create_kyc_admin_institution_tables.py` — KYC, documents, institutions, farm access, and risk assessments.
7. `0007_enable_application_rls.py` — enables row-level security on application tables so direct Supabase Data API roles have no access unless explicit policies are added.

The FastAPI server connects to PostgreSQL with its server-side `DATABASE_URL`; it does not use the Supabase client API or expose a Supabase service key to browsers. Keep application queries on this server connection. Use the Supabase project `postgres` role for both migrations and API access: it owns the tables and bypasses the no-policy RLS setup. A restricted custom runtime role would need deliberate grants and RLS policies (or `BYPASSRLS`) before it could read/write these tables.

## Apply to a new Supabase project

1. In Supabase, create a project and open **Connect**. Copy the **Session pooler** URI (port `5432`) for Render. The direct database host can be IPv6-only on the Free plan, while the shared session pooler supports IPv4. Do not use the transaction pooler on port `6543` for Alembic migrations.
2. Add the URI as the secret `DATABASE_URL` environment variable on the Render web service. Keep the password URL-encoded and ensure the URL requests TLS (`sslmode=require`). The project-specific URI shape is in `backend/.env.production.example`; replace its password placeholder with your Supabase database password. The app normalizes `postgresql://` to the installed `psycopg` 3 driver.
3. Deploy the Render service. Its start command runs `alembic upgrade head` before Uvicorn, applying revisions `0001` through `0007` in order. Or apply them from a trusted local environment with the backend requirements installed and `DATABASE_URL` set: `alembic upgrade head` from `backend/`.
4. Confirm the resulting head with `alembic current` and check the API health endpoint.

Do not also create the same tables manually in Supabase Studio or run a second SQL migration system against this schema. Alembic records applied revisions in `public.alembic_version`; Supabase CLI tracks a separate migration history. This repository uses Alembic for the application schema so deploy-time migrations and the checked-in revision history stay aligned.

## Future schema changes

Create each schema change as a new Alembic revision after modifying the SQLAlchemy models. Review both `upgrade()` and `downgrade()`, then commit the revision with the model change. Never edit a revision that has already been applied to a shared database.
