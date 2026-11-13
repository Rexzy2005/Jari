"""Seed the built-in local-testing demo workspaces into the configured database.

This is intentionally limited to the demo farmer's farm and the institution's
access to that farm. It never grants the demo institution access to other farms.
Safe to rerun: existing accounts and records are preserved.
"""

import runpy
from pathlib import Path

from sqlalchemy import select

from app.core.config import settings
from app.core.security import verify_password
from app.database.session import SessionLocal
from app.models.assessment import FarmRiskAssessment
from app.models.farm import Farm
from app.models.institution import InstitutionProfile
from app.models.institution_access import InstitutionFarmAccess
from app.models.user import User
from app.services.auth import AuthService
from app.schemas.auth import FarmerRegisterRequest
from app.shared.enums import RiskBand, UserRole


DEMO_PASSWORDS = {
    "08030000000": "password123",
    "08040000000": "admin123",
    "08060000000": "institution123",
}


def ensure_demo_user(db, phone: str, full_name: str, password: str, role: UserRole) -> None:
    user = AuthService.get_user_by_phone(db, phone)
    if user:
        if user.role != role:
            raise RuntimeError(f"Demo phone {phone} already belongs to a different role; no changes made.")
        if not verify_password(password, user.hashed_password):
            raise RuntimeError(f"Demo account {phone} exists with a different password; no changes made.")
        return

    if role == UserRole.ADMIN:
        AuthService.create_admin_seed_user(db, phone, full_name, password)
    else:
        AuthService.register_farmer(
            db,
            FarmerRegisterRequest(phone=phone, full_name=full_name, password=password, role=role),
        )


def seed_institution_workspace(db) -> None:
    institution_user = AuthService.get_user_by_phone(db, "08060000000")
    demo_farmer = AuthService.get_user_by_phone(db, "08030000000")
    farm = db.scalar(select(Farm).where(Farm.user_id == demo_farmer.id))
    if farm is None:
        raise RuntimeError("Demo farmer farm was not created; cannot seed institution workspace.")

    profile = db.scalar(
        select(InstitutionProfile).where(InstitutionProfile.user_id == institution_user.id)
    )
    if profile is None:
        profile = InstitutionProfile(
            user_id=institution_user.id,
            organisation_name="Plateau Agri Trust",
            organisation_type="Microfinance / Agricultural Credit",
            cac_registration_number="DEMO-RC-1294812",
            year_established=2018,
            official_email="contact@plateauagritrust.example",
            official_phone=institution_user.phone,
            state="Plateau",
            lga="Jos South",
            office_address="12 Commercial Way, Rayfield, Jos",
            status="approved",
            categories=["Lending / Credit", "Insurance Underwriting", "Input Financing"],
            services={"credit_limit": 10000000, "interest_rate": 8.5},
            representative={
                "fullName": "Paul Gyang",
                "jobTitle": "Chief Credit Officer",
                "email": "p.gyang@plateauagritrust.example",
                "phone": institution_user.phone,
            },
            documents=[],
        )
        db.add(profile)
        db.flush()

    access = db.scalar(
        select(InstitutionFarmAccess).where(
            InstitutionFarmAccess.institution_id == profile.id,
            InstitutionFarmAccess.farm_id == farm.id,
        )
    )
    if access is None:
        db.add(
            InstitutionFarmAccess(
                institution_id=profile.id,
                farm_id=farm.id,
                notes="Demo portfolio access to the seeded demo farm.",
            )
        )

    assessment = db.scalar(
        select(FarmRiskAssessment).where(
            FarmRiskAssessment.institution_id == profile.id,
            FarmRiskAssessment.farm_id == farm.id,
        )
    )
    if assessment is None:
        db.add(
            FarmRiskAssessment(
                institution_id=profile.id,
                farm_id=farm.id,
                score=88.5,
                risk_band=RiskBand.LOW_RISK,
                metrics={"biosecurity_score": 90, "flock_health": 95, "financial_history": 85},
                notes="Demo assessment for local product testing.",
            )
        )
    db.commit()


def main() -> None:
    if settings.ENVIRONMENT.lower() in {"production", "prod"}:
        raise RuntimeError("Refusing to seed demo accounts when ENVIRONMENT is production.")

    db = SessionLocal()
    try:
        ensure_demo_user(db, "08030000000", "Amina Daniel", DEMO_PASSWORDS["08030000000"], UserRole.FARMER)
        ensure_demo_user(db, "08040000000", "Grace Musa", DEMO_PASSWORDS["08040000000"], UserRole.ADMIN)
        ensure_demo_user(
            db,
            "08060000000",
            "Plateau Agri Trust",
            DEMO_PASSWORDS["08060000000"],
            UserRole.INSTITUTIONAL_USER,
        )
    finally:
        db.close()

    # Reuse the existing idempotent farm and operations fixture for the one
    # built-in demo farmer; keep its path independent of the caller's cwd.
    repo_root = Path(__file__).resolve().parents[3]
    runpy.run_path(str(repo_root / "seed_live_db.py"))

    db = SessionLocal()
    try:
        seed_institution_workspace(db)
    finally:
        db.close()

    print("Demo accounts and demo farm data are ready.")
    print("Farmer: 08030000000 / password123")
    print("Admin: 08040000000 / admin123")
    print("Institution: 08060000000 / institution123")


if __name__ == "__main__":
    main()
