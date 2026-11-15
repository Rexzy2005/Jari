# JARI Product and Data Architecture

## Current delivery boundary

The frontend has browser-local simulated workflows behind `frontend/src/services/index.ts`; `frontend/src/lib/simulated-data.ts` provides the current persistence adapter. This supports product exploration and local evaluation, not production authentication or shared multi-user data. Module 3 is also frontend/mock only; the FastAPI backend and database are not in scope for it.

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

**Module 2 — flock and inventory management:** house management is the operational foundation for flock batches. House, flock and inventory operations use the shared farm/house/batch references; flock and inventory remain independently usable. The current Module 2 plan authorizes house and flock work in Phase 2, inventory in Phase 3, integration and record freshness in Phase 4, and validation/documentation in Phase 5. Module 1 does not absorb these operational workflows. Intelligent record capture remains excluded until separately authorized.

**Module 3 — production and performance management:** production records extend existing batch identities and always retain their farmer, farm, house and batch references. Egg collections, bird-weight measurements, and batch feed consumption are source records; house and farm totals are derived from those batch records. Population denominators come from Module 2's dated flock movement history. Feed stock remains owned by Module 2 inventory: issuing feed creates one stock transaction and one linked production-consumption record, while manual consumption does not alter inventory. Performance indicators are derived on demand, disclose their period, units and completeness, and remain unavailable when their inputs are insufficient. Module 3 uses the same account-scoped simulated persistence adapter and introduces no backend, independent inventory, or separate source-of-truth snapshot.

Later capabilities must reuse the shared identities and relationships above. Module plans define implementation scope; this document defines the shared product architecture and does not authorize backend or later-module work.

## Existing implementation versus target

The frontend uses a simulated service facade and browser-local storage. Module 2 work adds account-scoped farm, house, batch, movement, activity, milestone and inventory-ledger relationships while preserving compatibility with existing demo records. Existing production records are legacy-shaped (display-name based, shared storage, and without stable farm/house/batch references); they must be retained as legacy history but must not be treated as normalized Module 3 measurements unless they can be safely linked to an owned batch. See `docs/progress.md` for the current implementation boundary and remaining work. Do not claim existing screens or workflows imply production API integration.

## Module 1 logical records

Module 1's simulated service contract separates `User`, `FarmerProfile`, `Farm`, `FarmLocation`, `FarmInfrastructure`, `UserFarmRelationship` and `OnboardingState`. Related records reference stable IDs; records include creation/update timestamps where applicable. The authenticated user owns their profile and farm memberships. The relationship marks the primary farm. Onboarding state records completed sections and completion state. Persist credentials only through the existing explicitly simulated auth mechanism; never add passwords to onboarding domain records. The primary-farm submission must be one logical service operation with rollback on storage failure.

These logical boundaries describe the intended contract. They do not claim that the current frontend records are already normalized or that a database schema has been implemented.
