"""enable row-level security on application tables

Revision ID: 0007_enable_application_rls
Revises: 0006_create_kyc_admin_institution_tables
Create Date: 2026-11-13 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0007_app_rls"
down_revision: Union[str, None] = "0006_kyc_admin"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


APPLICATION_TABLES = (
    "users",
    "farms",
    "poultry_houses",
    "flocks",
    "flock_movements",
    "feed_purchases",
    "feed_consumptions",
    "production_records",
    "health_incidents",
    "vaccination_records",
    "treatment_records",
    "sales",
    "expenses",
    "financial_payments",
    "kyc_applications",
    "farm_documents",
    "institution_profiles",
    "institution_farm_access",
    "farm_risk_assessments",
)


def upgrade() -> None:
    # No policies are created: Supabase API roles are denied table access by
    # default. The trusted backend connection uses the table-owning DB role.
    for table_name in APPLICATION_TABLES:
        op.execute(f'ALTER TABLE public."{table_name}" ENABLE ROW LEVEL SECURITY')


def downgrade() -> None:
    for table_name in reversed(APPLICATION_TABLES):
        op.execute(f'ALTER TABLE public."{table_name}" DISABLE ROW LEVEL SECURITY')
