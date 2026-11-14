# Run the JARI backend from Git Bash

This guide starts the FastAPI backend on Windows using Git Bash. Run it from a separate terminal from the frontend.

## Current workspace setup

The repository currently has a working `backend/.venv` using Python 3.12.10, with FastAPI, Alembic and Psycopg installed. Use that environment; the system Python 3.15 is not the project runtime. The earlier install attempt used Python 3.15 and tried to compile PyYAML, which failed because Microsoft C++ Build Tools were unavailable.

## Start the API

Open Git Bash and run:

```bash
cd ~/Desktop/Projects/Jari/backend
source .venv/Scripts/activate
python --version
if [ ! -f .env ]; then cp .env.example .env; fi
```

The version should be Python 3.12.x. Then check `backend/.env` before applying migrations:

```bash
notepad .env
```

Make sure `DATABASE_URL` points to the database you intend to use before running migrations. The checked-in example points to a local PostgreSQL database at `localhost:5432`. For Supabase, use the project’s **Session pooler** connection on port `5432`, keep `sslmode=require`, and URL-encode special characters in the password. Migrations change the selected database schema. Do not paste database credentials into chat or commit `.env`.

Apply the database migrations, then start the API:

```bash
python -m alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open while the backend is running. Stop it with `Ctrl+C`; leave the environment with `deactivate` if you want.

In a second Git Bash window, check the health endpoint:

```bash
curl.exe http://127.0.0.1:8000/health
```

The API documentation is at <http://127.0.0.1:8000/docs>. The frontend’s default API URL is `http://localhost:8000/api/v1`.

## If the virtual environment is missing

The project requires Python 3.12. Check which runtimes the Windows launcher can find:

```bash
py -0p
```

If Python 3.12 is listed, recreate the environment from the `backend` directory:

```bash
py -3.12 -m venv .venv
source .venv/Scripts/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If `py -3.12` reports “No suitable Python runtime found,” install Python 3.12 for Windows first, then reopen Git Bash and repeat these commands. Do not create this project environment with Python 3.15; the current dependency set can attempt a PyYAML source build on that version.

## Module 2: what to exercise

Module 2’s farm, flock and inventory workflows are currently implemented in the frontend’s browser-local simulated data layer. They do not become Supabase-backed just because the FastAPI server is running. Test these screens in the frontend at <http://localhost:3000>:

- **Farm and houses:** `/farms`, `/poultry-houses` — create/select farms, add houses, assign batches to a house on the same farm, check occupancy/capacity and house assignment history.
- **Flock batches:** `/birds`, `/birds/new`, then open a batch detail — register a batch, record additions, mortality, sales/removals, transfers and corrections; check current population, mortality rate, timeline, editing and supported insights. Void a mortality incident and confirm its reversal is reflected in population/mortality. Close a batch only after its recorded population reaches zero; archive a closed batch and confirm its history remains.
- **Care and milestones:** `/flock-activities`, `/health/vaccinations` — schedule, edit, complete, reschedule and cancel activities; check overdue state and vaccination follow-up. Link a product and planned quantity to an activity to inspect recorded stock availability. The check does not reserve stock or verify medical suitability. Record laying milestones on a layer or mixed batch.
- **Inventory:** `/inventory`, `/inventory/suppliers`, `/inventory/purchases` — add items and opening stock, record receipts/issues/adjustments/disposals, check low-stock and expiry indicators, manage suppliers and purchases/payment status, and move stock between locations or farms. Verify that paired transfers change both ledgers. Check that depletion estimates appear only when issue history is sufficient and that cost estimates are qualified when cost data is missing.
- **Feed and freshness:** `/feed` and its consumption flow; `/record-keeping` — issue feed to a batch and inspect the linked stock movement. Configure daily or weekly reminders by farm/module, then exercise due reminders, snooze, completion, no-activity and unavailable responses. A no-activity response must not add a farm transaction.
- **Persistence boundaries:** refresh pages and switch farms/accounts. Confirm saved simulated records remain available to their owner and do not appear in another farm/account. Review backup export/import/reset behavior with a disposable test account before using valuable records.

Record-keeping reminders are in-app/local simulated reminders; this implementation does not send SMS or email or run a background notification service. These Module 2 frontend records are not persisted to the backend database. The backend commands above start and migrate the FastAPI application independently.

For the full scope and acceptance criteria, see [JARI Module 2 Updated](development-plans/JARI_Module_2_Updated.md). For Supabase migration details, see [backend Alembic migrations](../backend/alembic/README.md).
