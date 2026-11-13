# JARI Product and Data Architecture

## Current delivery boundary

The frontend has browser-local simulated workflows behind `frontend/src/services/index.ts`; `frontend/src/lib/simulated-data.ts` provides the current persistence adapter. This supports product exploration and local evaluation, not production authentication or shared multi-user data. The FastAPI backend and database are separate and are not in scope for Modules 1 or 2 as currently specified.

Keep UI components dependent on service contracts rather than local storage details. A future API adapter should replace simulated persistence without changing product workflows. Do not treat browser-local passwords, sessions, or records as secure production storage.

## Product hierarchy

```text
Farmer account
└── Farmer profile
    └── Farm membership (role, primary-farm flag)
        └── Farm
            └── Poultry houses
                └── Flock batches
```

A farmer may belong to multiple farms, and each farm may have multiple houses. A house belongs to exactly one farm; each flock batch belongs to a farm and its current house. Enforce that a batch's house belongs to the same farm. House assignments and population changes should retain dated event history instead of silently overwriting operational history.

Farm identity, ownership, registration, administrative location and farm-wide operation attributes belong to the farm. A farmer's own administrative location belongs to the farmer profile. GPS coordinates belong to the farm location and must record capture source, accuracy and time; requesting location is user initiated and never required when manual location is used.

House capacity, infrastructure and house-level biosecurity belong to a house. Batch population, age, health, vaccination, mortality, production and lifecycle history belong to a batch where applicable. Farm dashboards aggregate house and batch records while preserving drill-down to the underlying records.

## Connected and independent capabilities

- Flock management builds on the farm/house/batch hierarchy.
- Inventory can be used on its own or connected to flock batches. Stock balances derive from transactions; feed or supplies can reference the batch receiving them when known.
- Production and health capabilities extend the existing batch identities; house condition and biosecurity extend house/farm identities.
- Farm documentation and records, risk/advisory, and financial readiness/opportunities are distinct capabilities. They consume relevant farm records without creating a competing flock or inventory store.
- Institutional services follow the farmer and farm foundation and expose only permitted/consented information.

## Module boundaries and sequence

**Module 1 — farmer onboarding and primary farm registration:** account, contact-verification demo where no provider exists, farmer profile, primary farm, review, resumable onboarding, honest incomplete/active dashboard. Simulated frontend persistence only. It may collect an optional house count as descriptive farm information but must not create house or batch records.

**Module 2 — flock and inventory management:** house management is the operational foundation; flock and inventory are independent submodules that can be connected through shared farm/house/batch references. Its plan currently explicitly defers some house-management work pending separate authorization; respect that restriction and resolve that sequencing only when Module 2 begins. Module 1 does not absorb these operational workflows.

Later capabilities must reuse the shared identities and relationships above. Module plans define implementation scope; this document defines the shared product architecture and does not authorize backend or later-module work.

## Existing implementation versus target

The frontend already has a simulated service facade, versioned local storage, and legacy records for a single farm profile, poultry houses, flocks/movements, feed, production, health and financial activity. Several workflows and tests are implemented; see `docs/active.md` and `docs/progress.md` for verified status. This is not yet the target normalized model: the existing farm profile is a single shared record, and several operational records use optional house IDs or display names rather than complete account/farm ownership references. Existing demo data must be migrated or isolated deliberately when onboarding introduces account-scoped records. Do not claim existing screens or workflows imply production API integration.

## Module 1 logical records

Module 1's simulated service contract separates `User`, `FarmerProfile`, `Farm`, `FarmLocation`, `FarmInfrastructure`, `UserFarmRelationship` and `OnboardingState`. Related records reference stable IDs; records include creation/update timestamps where applicable. The authenticated user owns their profile and farm memberships. The relationship marks the primary farm. Onboarding state records completed sections and completion state. Persist credentials only through the existing explicitly simulated auth mechanism; never add passwords to onboarding domain records. The primary-farm submission must be one logical service operation with rollback on storage failure.

These logical boundaries describe the intended contract. They do not claim that the current frontend records are already normalized or that a database schema has been implemented.
