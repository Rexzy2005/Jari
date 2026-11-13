# Backend Deployment on Render

The repository root [`render.yaml`](../render.yaml) defines a free Render Blueprint for the FastAPI backend. The database is hosted separately on Supabase; the Blueprint prompts for `DATABASE_URL` as a secret instead of creating a Render database. The web service uses the `backend/` directory, runs Alembic migrations on startup, and exposes `/health` for Render health checks. See [Backend database migrations](../backend/alembic/README.md) for the Supabase connection and migration steps.

## Free plan limits

This configuration is for a demo or temporary evaluation. Render's free web service spins down after 15 minutes without inbound traffic; the next request can wait about a minute while it starts. Its filesystem is ephemeral. Supabase's Free plan has a 500 MB database quota, pauses projects after a week of low activity, and does not include downloadable automatic backups. Keep independent backups and review Supabase's [Free plan limits](https://supabase.com/docs/guides/platform/billing-on-supabase) and [pause behavior](https://supabase.com/docs/guides/platform/free-project-pausing).

Because Render's pre-deploy command requires a paid web service, the free Blueprint runs `alembic upgrade head` in its start command before Uvicorn starts. The free web service runs one worker to stay within its memory limit. A restart or cold start therefore checks/applies migrations before serving requests.

## Before creating the Blueprint

1. Push this repository and branch to the Git provider connected to Render.
2. Create a Supabase project. In its **Connect** dialog, copy the **Session pooler** URI on port `5432`; see the [migration guide](../backend/alembic/README.md) for why this is preferred from Render.
3. In Render, create a new Blueprint from the repository. Enter the Supabase URI when prompted for the `DATABASE_URL` secret.
4. Confirm the frontend's production origin in `BACKEND_CORS_ORIGINS`. The checked-in value is the current Vercel origin, `https://jari-jet.vercel.app`.
5. After the first deploy, note the API's `onrender.com` URL. Set `NEXT_PUBLIC_API_URL` in the frontend hosting environment to `https://<render-service>.onrender.com/api/v1`, then redeploy the frontend.
6. Verify `https://<render-service>.onrender.com/health`, `/docs`, and an authenticated API workflow before changing any custom domain or directing users to the new backend.

Set `ENVIRONMENT=production`, `DATABASE_URL` to the Supabase Session pooler URI on port `5432` with `sslmode=require`, a private `SECRET_KEY`, and the exact HTTPS frontend origin in `BACKEND_CORS_ORIGINS`. The project-specific connection template is in [`backend/.env.production.example`](../backend/.env.production.example). Backend settings convert `postgresql://` to `postgresql+psycopg://`, matching the psycopg 3 dependency, and reject insecure/misconfigured production values at startup. The API binds to Render's `$PORT`; do not set a fixed public port.

## Migrating the existing VPS database

The Supabase project starts with an empty database. The Render deploy applies the checked-in Alembic revisions to create the schema. It does not copy data from the current VPS. If the VPS contains records that must be retained, take and verify a PostgreSQL dump before cutover, restore it into Supabase, and only then direct the frontend to Render. Keep the old service and its database intact until the restored data and application have been checked. Use a secure transfer path and do not commit dumps or connection strings. Supabase Free has no downloadable automatic backups and may pause after low activity, so this remains a demo/evaluation setup unless you establish independent backups and suitable operational coverage.

Example migration sequence, to be run from a trusted machine with `pg_dump` and `psql` installed:

```bash
# 1. Create a consistent dump from the existing VPS database.
pg_dump --format=custom --no-owner --no-acl \
  --host "$SOURCE_DB_HOST" --username "$SOURCE_DB_USER" \
  --dbname "$SOURCE_DB_NAME" --file jari-before-render.dump

# 2. Restore it into Supabase using the session pooler connection details.
pg_restore --clean --if-exists --no-owner --no-acl \
  --host "$RENDER_DB_HOST" --username "$RENDER_DB_USER" \
  --dbname "$RENDER_DB_NAME" jari-before-render.dump
```

Supply passwords through a protected `.pgpass` file or a secret prompt, not command-line arguments. Obtain the Render external connection details from the Render dashboard and URL-encode credentials when needed. Check the restored row counts and login/API workflows before changing traffic. If the existing database has already been migrated independently, compare Alembic state before restoring; a dump restore replaces target schema objects.

The current API stores document content in database fields, so database backup/restore includes those records. Do not assume files written to a service's local filesystem would persist across Render deploys; use object storage or an explicitly configured persistent disk if file uploads move to local files later.

## Operations

- Deploys follow the linked branch. Render runs `pip install -r requirements.txt`, then the start command applies `alembic upgrade head` and starts one Uvicorn worker on `$PORT`.
- Render's `SECRET_KEY` is generated by the Blueprint. Keep it stable between deploys; rotating it invalidates existing JWTs.
- `DATABASE_URL` is the Supabase session-pooler URI entered as a Render secret. Never commit it or expose it to frontend code.
- Change `BACKEND_CORS_ORIGINS` in the Blueprint and sync it when the frontend's production origin changes. Keep local development origins in local environment files rather than production CORS settings.
- The current `backend/docker-compose.prod.yml`, Docker entrypoint, Nginx configuration, and `scripts/deployment/deploy.sh` remain for the previous VPS/self-hosted path. They are not used by the Render Blueprint.
- Free web services can be restarted or suspended when the workspace reaches its included usage limits. The free web service also has no SSH/shell access; use deploy logs and health checks for diagnostics.

## Rollback

If the Render deploy fails, use Render's available rollback for the previous deploy or point the frontend back to its previous API URL while investigating. Keep the VPS database unchanged until cutover is accepted. Database restores and schema rollback should follow a verified backup plan; don't use `pg_restore --clean` against a database containing the only copy of production data. Export Supabase backups independently and verify recovery steps because the Free plan does not include downloadable automatic backups.
