# JARI: Module 3 - Production and Performance Management

## 1. Module Overview

### 1.1 Module Name
Production and Performance Management

### 1.2 Product Context

JARI is an Agricultural Risk Intelligence and Financial Enablement Platform designed to help poultry farmers reduce operational risks, improve farm management and become better prepared to access appropriate financial support.

JARI is initially targeting underserved poultry farmers in Jos South, Plateau State, Nigeria.

The platform must be designed around the actual operating conditions of these farmers. We must not assume that every farmer has advanced equipment, structured record-keeping practices, reliable internet access or extensive knowledge of poultry production metrics.

The goal is to make farm management and production analysis accessible to farmers at different levels of digital and operational maturity.

### 1.3 Purpose of Module 3

Production and Performance Management provides farmers with the ability to record, monitor and understand the production performance of their poultry batches.

It builds on the farm, house, batch, flock and inventory structures established in Modules 1 and 2.

The module must support both major poultry production categories:

- Broilers: meat production and growth performance.
- Layers: egg production and laying performance.

Farmers should be able to record production activities manually, monitor production trends, understand resource consumption and receive useful performance insights.

JARI should automatically calculate relevant performance indicators when sufficient information is available.

The system must not require farmers to provide every possible data point before they can use the module.

### 1.4 Core Objective

Enable poultry farmers to understand what their birds are producing, how production changes over time, how resources are being consumed and where improvements may be needed.

### 1.5 Development Constraints

For this implementation:

- Frontend development only.
- No backend implementation.
- Use the existing localStorage-based mock data architecture.
- Reuse existing services, data structures and simulated-data utilities.
- Do not introduce a competing persistence architecture.
- Maintain compatibility with future backend integration.
- Preserve existing JARI branding and design patterns.
- All implemented workflows must be functional.
- All records must persist across page refreshes and application sessions.
- Support multiple farms belonging to one farmer.
- Support multiple houses per farm.
- Support multiple batches per house.
- Enforce account-level data isolation.
- Maximum of five implementation phases.
- Track implementation progress continuously in `progress.md`.

---

# 2. Mandatory Pre-Implementation: Project Documentation and Architecture Synchronisation

This section is compulsory.

The coding agent must not begin implementation immediately after reading this document.

Before writing code, the agent must understand the existing JARI architecture and synchronise all relevant project documentation.

### 2.1 Read Existing Development Documentation

Inspect all relevant documents inside:

`docs/development-plan/`

At minimum, review:

- Module 1: Farmer Onboarding and Farm Registration.
- Module 2: Flock and Inventory Management.
- Existing project architecture documentation.
- Existing data model documentation.
- Existing implementation progress documentation.
- Any other development plans that affect farm, house, batch, inventory or farmer data.

Do not assume that the documents perfectly reflect the current codebase. Verify their requirements against the actual implementation.

### 2.2 Inspect the Existing Codebase

Inspect the existing implementation of:

- Authentication and user management.
- Farmer profiles.
- Farm registration and farm selection.
- House management.
- Flock and batch management.
- Batch population transactions.
- Batch movement between houses.
- Inventory management.
- Feed inventory and stock transactions.
- Existing dashboard components.
- Existing service architecture.
- Existing simulated data.
- Existing localStorage persistence.
- Existing TypeScript interfaces and validation schemas.
- Existing notification and alert systems.
- Existing navigation and route structure.

Pay particular attention to:

`frontend/src/services/index.ts`

`frontend/src/lib/simulated-data.ts`

These are important existing parts of the frontend simulation architecture. Reuse and extend them where appropriate.

Do not create another independent localStorage or persistence system.

### 2.3 Confirm the Existing Farm Hierarchy

The established hierarchy is:

Farm → Houses → Batches

The relationships must remain consistent.

- One farmer can manage multiple farms.
- One farm can contain multiple houses.
- One house can contain multiple batches.
- Every batch belongs to one farm and one house.
- Production records must be associated with the exact batch responsible for the production.
- House-level performance must be calculated from the batches assigned to that house.
- Farm-level performance must be calculated from the relevant houses and batches belonging to that farm.

Production records must not become disconnected from their originating batches.

### 2.4 Synchronise Project Documentation

Before implementation:

1. Review the existing documentation and identify inconsistencies.
2. Update the architecture documentation where Module 3 introduces new relationships.
3. Update the shared data model documentation.
4. Update the project roadmap where necessary.
5. Update `README.md` if the module changes documented project capabilities.
6. Initialise or update `progress.md`.
7. Record existing implementation gaps and architectural decisions.
8. Ensure Module 3 does not conflict with Modules 1 and 2.

Do not create duplicate documentation files when an existing document can be updated.

The coding agent must report:

- Documentation reviewed.
- Existing implementation inspected.
- Existing services and components that will be reused.
- Required data model changes.
- Architectural conflicts discovered.
- Documentation changes completed.
- Outstanding issues requiring attention.

**Do not begin Module 3 implementation until this synchronisation is complete.**

---

# 3. Module Scope and Functional Areas

Module 3 consists of the following major functional areas:

1. Production Dashboard.
2. Production Record Management.
3. Layer Production Management.
4. Broiler Production Management.
5. Bird Weight Monitoring.
6. Feed Consumption Monitoring.
7. Production Performance Calculations.
8. Production Trends and Comparisons.
9. Production Alerts and Insights.
10. Production History and Reporting.

These are interconnected capabilities within one production management module, not separate disconnected systems.

---

# 4. Production Dashboard

### 4.1 Purpose

The Production Dashboard gives farmers an overview of the production activities and performance of their farms.

The dashboard must display actual records and calculated indicators from the farmer's selected farm.

### 4.2 Dashboard Overview

Display relevant information such as:

- Number of active production batches.
- Number of active production houses.
- Total birds currently recorded across active batches.
- Total production recorded within the selected period.
- Latest production activity.
- Feed consumption where records are available.
- Weight monitoring summaries where applicable.
- Production trends.
- Outstanding production records.
- Relevant performance alerts.

The displayed metrics must respond to the selected farm and reporting period.

### 4.3 Production Categories

Provide filters for:

- All production.
- Broiler production.
- Layer production.

The dashboard must not mix broiler and layer performance indicators into misleading combined calculations.

For example, egg production and broiler weight gain must remain separate performance categories.

### 4.4 House and Batch Filters

Farmers must be able to filter production information by:

- Farm.
- House.
- Batch.
- Production category.
- Date range.

When a house is selected, the dashboard must display aggregated information from its batches.

When a batch is selected, the dashboard must display records belonging to that exact batch.

### 4.5 Dashboard Empty States

The dashboard must work even when farmers have not started recording production.

Examples:

- No production records yet.
- No feed consumption records yet.
- No weight records yet.
- No egg collection records yet.
- No performance calculations available.

Provide clear next actions.

Do not display fabricated production figures, percentages or performance indicators to make the dashboard appear populated.

---

# 5. Production Record Management

### 5.1 Purpose

This is the central production record system.

It allows farmers to record production activities against specific poultry batches.

### 5.2 Production Record Structure

Every production record should contain:

- Unique record ID.
- Farmer/user ID.
- Farm ID.
- House ID.
- Batch ID.
- Production category.
- Record type.
- Record date.
- Quantity or measurement.
- Unit of measurement.
- Recording method.
- Optional notes.
- Created timestamp.
- Updated timestamp.
- Record creator.

The farm, house and batch relationships must be validated before saving.

### 5.3 Recording Methods

Support:

- Manual entry.
- Historical record entry.
- Corrections to existing records.

The system must identify whether a figure is:

- Actual: directly measured or recorded by the farmer.
- Estimated: based on the farmer's estimate.
- Calculated: derived from other recorded values.

Do not silently convert estimated figures into actual measurements.

### 5.4 Date and Historical Records

Farmers should be able to record production for previous dates.

The system must:

- Validate dates.
- Prevent accidental duplicate submissions.
- Allow authorised corrections.
- Preserve record history where appropriate.
- Recalculate affected performance indicators after corrections.

### 5.5 Record Editing and Deletion

Farmers should be able to edit incorrect records.

Where records have already contributed to calculated indicators, the system must update the affected calculations.

Avoid permanent deletion where it would destroy important production history.

Use safe archival or reversal mechanisms where appropriate.

---

# 6. Layer Production Management

### 6.1 Purpose

This section supports farmers raising layers for egg production.

It provides a simple way to record egg collection and understand laying performance.

### 6.2 Daily Egg Collection

Farmers must be able to record eggs collected from a specific batch.

The record should include:

- Farm.
- House.
- Batch.
- Collection date.
- Total eggs collected.
- Number of marketable eggs, where recorded.
- Number of damaged or broken eggs, where recorded.
- Number of rejected eggs, where recorded.
- Optional notes.

Do not force farmers to provide every egg classification.

The minimum required field should be the total number of eggs collected.

### 6.3 Egg Classification

Where farmers want more detailed records, support:

- Good/marketable eggs.
- Broken eggs.
- Cracked eggs.
- Dirty eggs.
- Other rejected eggs.

The system should validate that classified quantities do not exceed the total collection quantity.

If classifications are not entered, the system must not assume all eggs are marketable.

### 6.4 Egg Collection Aggregation

JARI must automatically aggregate egg collection records at different levels:

Batch level:
- Daily collection.
- Weekly collection.
- Monthly collection.
- Total collection within a selected period.

House level:
- Combined output from all batches in the house.

Farm level:
- Combined output from all relevant houses and batches.

The system must retain the original batch-level records.

House and farm totals must be calculated from those records rather than stored as unrelated independent production figures.

### 6.5 Egg Production Trends

Display:

- Daily egg production trends.
- Weekly production trends.
- Monthly production trends.
- Production comparisons between selected periods.
- Production trends for individual batches.
- Production comparisons between batches.

Provide simple visualisations that help farmers understand whether production is increasing, decreasing or remaining stable.

### 6.6 Laying Rate

Where the necessary information is available, calculate the laying rate.

Formula:

Laying Rate (%) = (Number of Eggs Produced ÷ Number of Live Hens) × 100

For daily laying rate:

- Use the relevant batch's live hen population for that production date.
- Do not use the original number of birds placed into the batch.
- Account for recorded mortality, sales, transfers and other population changes.
- If the live population cannot be established reliably, do not calculate the indicator.

The interface should explain that laying rate is based on recorded egg output and recorded live hen population.

### 6.7 Eggs Per Bird

Where reliable population information exists, calculate:

- Eggs per bird per day.
- Eggs per bird per week.
- Eggs per bird per month.

Clearly identify the denominator used.

Do not calculate using the original batch population when the current live population is different.

### 6.8 Egg Production History

Farmers should be able to view:

- Previous collection records.
- Total eggs collected.
- Collection dates.
- Batch performance.
- Changes in production over time.

Provide filtering and search where appropriate.

### 6.9 Laying Milestones

The module should use relevant batch information to display production milestones.

Examples:

- Expected beginning of lay.
- Actual recorded beginning of lay.
- Days since beginning of lay.
- Production progress.

Where expected laying dates are based on farmer-provided information or configured breed guidance, clearly identify the source.

Do not invent expected laying dates.

Detailed vaccination, veterinary and health interventions remain outside Module 3.

---

# 7. Broiler Production Management

### 7.1 Purpose

This section supports farmers raising broilers for meat production.

It focuses on growth monitoring, weight performance, feed consumption and production progress.

### 7.2 Broiler Production Records

Support the recording of:

- Production date.
- Batch.
- Number of live birds.
- Number of birds weighed.
- Average bird weight, where available.
- Total measured weight, where available.
- Optional notes.

The system should distinguish between:

- Total batch population.
- Number of birds sampled.
- Number of birds weighed.
- Total weight of sampled birds.
- Average sampled bird weight.

Do not treat a sample weight as the weight of the entire flock.

### 7.3 Weight Monitoring

Weight monitoring is an important part of broiler production management.

Farmers should be able to record bird weights at different stages of production.

Support:

- Individual bird weight entry.
- Group average weight entry.
- Group total weight entry.
- Sample-based weight recording.

The system must not require farmers to weigh every bird.

### 7.4 Weight Record Fields

A weight record should include:

- Record ID.
- Farm ID.
- House ID.
- Batch ID.
- Measurement date.
- Number of birds sampled.
- Weight measurement.
- Unit of measurement.
- Recording method.
- Optional individual measurements.
- Optional notes.

Support kilograms and grams, with consistent internal units.

### 7.5 Average Weight

Where individual weights are recorded:

Average Weight = Total Weight of Sampled Birds ÷ Number of Birds Weighed

Where the farmer provides a group average directly, save that value as a farmer-entered measurement.

Clearly distinguish between calculated and manually entered averages.

### 7.6 Weight Gain

Where at least two valid weight records exist, calculate:

Weight Gain = Current Average Weight - Previous Average Weight

Average Daily Weight Gain:

Average Daily Weight Gain = Weight Gain ÷ Number of Days Between Measurements

The system must:

- Compare valid records from the same batch.
- Use consistent units.
- Handle different measurement dates correctly.
- Avoid calculating growth from invalid or incomplete records.
- Explain the period used for the calculation.

### 7.7 Weight History

Display:

- Weight records by date.
- Average weight progression.
- Weight gain.
- Average daily weight gain.
- Comparison between batches.
- Historical weight measurements.

Where sample sizes differ, show the number of birds sampled so farmers can understand the context of the measurement.

### 7.8 Production Targets

Allow farmers to record their own target weight and expected production period.

Do not assume all farmers use the same target weight or production duration.

Where reference benchmarks are eventually introduced, they must be clearly identified as reference values and not actual farm measurements.

---

# 8. Feed Consumption Monitoring

### 8.1 Purpose

Feed is one of the major resources used in poultry production.

Farmers need to understand how much feed their batches consume and how feed consumption relates to production output.

This capability must integrate with Module 2 Inventory Management.

It must not create a second independent feed inventory system.

### 8.2 Feed Consumption Records

Farmers should be able to record feed issued to a specific batch.

Record fields:

- Farm ID.
- House ID.
- Batch ID.
- Feed inventory item.
- Feed type.
- Quantity issued.
- Unit.
- Date.
- Optional notes.

Support common units such as:

- Kilograms.
- Grams.
- Bags.

Where bags are used, the system must know the recorded bag size before converting the quantity to kilograms.

Do not assume every feed bag has the same weight.

### 8.3 Feed Types

Support common feed stages and categories, including:

- Broiler starter.
- Broiler grower.
- Broiler finisher.
- Layer starter.
- Layer grower.
- Layer developer.
- Layer pre-layer.
- Layer production feed.
- Other farmer-defined feed types.

Allow farmers to use their own feed descriptions where necessary.

The list should be configurable rather than permanently restricted to these examples.

### 8.4 Inventory Integration

Feed consumption must be connected to Module 2 Inventory Management.

Expected workflow:

1. Farmer selects a farm.
2. Farmer selects a house and batch.
3. Farmer selects the feed item.
4. Farmer enters the quantity issued to the batch.
5. JARI validates the available stock.
6. The system records the stock movement.
7. Inventory balance is updated.
8. Feed consumption is associated with the selected batch.

The system must not deduct inventory twice.

If Module 2 already has a stock issuance transaction, Module 3 should reuse it or extend the existing service.

### 8.5 Manual Consumption Records

Some underserved farmers may not maintain detailed feed inventory records.

Allow a manual feed consumption record when appropriate.

However:

- Clearly identify it as a manually recorded consumption figure.
- Do not silently deduct inventory if no inventory transaction exists.
- Avoid double-counting feed already issued through inventory.
- Where stock data is unavailable, allow production records to continue.
- Explain when feed performance calculations cannot be completed.

### 8.6 Feed Consumption Summary

Display:

- Total feed issued to a batch.
- Feed consumption within a selected period.
- Average daily feed consumption, where the period is valid.
- Feed consumption per live bird, where population data is available.
- Feed consumption trends.
- Feed consumption comparisons between batches.

The system must distinguish between feed issued and feed actually consumed.

If feed wastage or remaining feed is not recorded, JARI must not claim that all issued feed was consumed.

---

# 9. Production Performance Calculations

### 9.1 Purpose

This section converts production records into useful performance indicators.

The calculations must be automatic where sufficient information exists.

The farmer must not need to understand the underlying formulas to benefit from the results.

However, every calculated indicator should have an explanation.

### 9.2 Calculation Principles

Every calculation must:

- Use actual records from the relevant batch.
- Use correct population figures.
- Use consistent measurement units.
- Respect record dates.
- Identify missing data.
- Distinguish actual, estimated and calculated information.
- Avoid displaying misleading results.
- Explain the calculation in simple language.

Do not calculate an indicator when the required inputs are missing or unreliable.

### 9.3 Broiler Performance Indicators

Support the following:

**A. Average Weight**

Average Weight = Total Weight of Sampled Birds ÷ Number of Birds Weighed

**B. Weight Gain**

Weight Gain = Current Average Weight - Previous Average Weight

**C. Average Daily Weight Gain**

Average Daily Weight Gain = Weight Gain ÷ Days Between Measurements

**D. Feed Consumption Per Bird**

Feed Consumption Per Bird = Feed Consumed or Issued ÷ Relevant Bird Population

The interface must identify whether the calculation uses feed consumed or feed issued.

**E. Feed Conversion Ratio (FCR)**

FCR = Total Feed Consumed ÷ Total Live-Weight Gain

Important requirements:

- FCR should only be calculated when the necessary feed and weight information is available.
- The calculation period must be consistent.
- Bird population changes must be considered.
- The system must not treat the weight of a small sample as the total weight gain of the entire batch.
- Where total flock weight gain cannot be reliably established, do not display a flock-level FCR as an actual result.

For an initial implementation, FCR may be unavailable for farmers who only record average sample weight and feed issued.

Provide a clear explanation of the missing information.

**F. Feed Cost Per Kilogram of Weight Gain**

Feed Cost Per Kilogram of Weight Gain = Feed Cost for the Period ÷ Total Live-Weight Gain

This calculation requires reliable feed cost and total live-weight gain data.

Do not assume feed costs from current market prices unless the farmer has recorded or confirmed them.

### 9.4 Layer Performance Indicators

Support the following:

**A. Total Egg Production**

Sum of valid egg collection records within the selected period.

**B. Laying Rate**

Laying Rate (%) = (Total Eggs Produced ÷ Total Live Hens) × 100

Use the relevant live hen population for the production date or period.

**C. Eggs Per Bird**

Eggs Per Bird = Total Eggs Produced ÷ Relevant Live Hen Population

**D. Feed Consumption Per Bird**

Feed Consumption Per Bird = Feed Consumption ÷ Relevant Live Hen Population

**E. Feed Per Dozen Eggs**

Feed Per Dozen Eggs = Total Feed Consumption ÷ (Total Eggs Produced ÷ 12)

**F. Feed Conversion Based on Egg Mass**

Feed Conversion = Total Feed Consumption ÷ Total Egg Mass

This requires egg mass information.

If egg mass is not available, the system must not invent it.

Where individual egg weights or representative average egg weight are available, egg mass can be calculated from the relevant production records.

**G. Feed Cost Per Egg**

Feed Cost Per Egg = Feed Cost for the Period ÷ Number of Eggs Produced

Only calculate when feed cost and egg production records are available for compatible periods.

### 9.5 Calculation Availability

The system must not present all indicators as if they are always available.

Examples:

- Egg production available, feed conversion unavailable because feed records are missing.
- Weight gain available, FCR unavailable because total flock weight gain is not established.
- Feed consumption available, feed cost unavailable because feed purchase cost was not recorded.

Display an understandable explanation rather than an unexplained blank value.

### 9.6 Calculation Transparency

For each performance indicator, provide:

- Indicator name.
- Calculated result.
- Measurement unit.
- Date range.
- Data used.
- Short explanation.
- Data completeness status.

Example:

Feed per dozen eggs

Result: 18 kg

Period: 1–7 November

Explanation: The batch recorded 18 kg of feed consumption for every 12 eggs produced during this period.

This is an illustrative example only. Do not use it as actual farm data.

---

# 10. Production Performance and Comparisons

### 10.1 Purpose

Farmers should be able to compare production performance across their own farms, houses and batches.

### 10.2 Batch Comparison

Allow comparison of batches using relevant indicators.

For broilers:

- Average weight.
- Weight gain.
- Average daily weight gain.
- Feed consumption.
- FCR, where reliable.
- Mortality and population changes, sourced from Module 2.

For layers:

- Total egg production.
- Laying rate.
- Eggs per bird.
- Feed consumption.
- Feed per dozen eggs.
- Feed cost per egg, where available.

### 10.3 House Comparison

Display aggregated production performance for houses.

The farmer should be able to identify which houses have:

- Higher production output.
- Lower production output.
- Better recorded feed efficiency.
- Better growth performance.
- More complete production records.

Comparisons must use compatible production categories and time periods.

### 10.4 Farm Comparison

Provide a farm-wide view of production.

The system should aggregate data from all relevant houses and batches.

Do not calculate farm-level performance by simply averaging batch percentages when the underlying denominators differ.

For example, farm-level laying rate should be calculated using total eggs produced and the corresponding total live hen population, not by taking an unweighted average of individual batch laying rates.

### 10.5 Historical Comparison

Allow farmers to compare:

- Current week versus previous week.
- Current month versus previous month.
- Selected date ranges.
- One batch against another.
- One production cycle against another, where historical data exists.

Do not display a comparison when the required historical information is unavailable.

---

# 11. Production Alerts and Insights

### 11.1 Purpose

JARI should help farmers identify important changes in production without overwhelming them with unnecessary notifications.

The system should provide understandable, evidence-based observations from recorded farm data.

### 11.2 Alert Categories

Support:

- Declining egg production.
- Unusual changes in laying rate.
- Missing production records.
- Declining recorded weight gain.
- Missing weight monitoring records.
- Unusual feed consumption changes.
- Feed inventory shortages, using Module 2.
- Production targets not being met.
- Incomplete data affecting performance calculations.

### 11.3 Alert Rules

Alerts must be based on identifiable rules and available records.

For example:

- A decline in egg collection compared with the previous comparable period.
- A batch has not had a weight record within its configured monitoring interval.
- Feed stock is below the existing inventory alert threshold.
- A production calculation is unavailable because required records are missing.

Thresholds should be configurable where appropriate.

Avoid fixed assumptions that do not account for different farm sizes, breeds, ages and production systems.

### 11.4 Insights

Provide simple observations.

Examples:

- Egg collection has decreased compared with the previous seven recorded days.
- No weight measurement has been recorded for this batch recently.
- Feed consumption records are available, but weight records are incomplete.
- This batch has a higher recorded egg output than the other selected batches.

These observations must be generated from actual records.

Do not claim that a decline is caused by a disease, poor feed quality or another specific factor without sufficient evidence.

### 11.5 No Generic AI Advice

Module 3 should not introduce a generic AI adviser.

Use explainable calculations, simple rules and record-based observations.

Advanced risk analysis and advisory capabilities belong to Module 7.

---

# 12. Production Reports and History

### 12.1 Production History

Farmers must be able to view historical production records.

Support filtering by:

- Farm.
- House.
- Batch.
- Production category.
- Record type.
- Date range.

### 12.2 Batch Production History

Each batch should have a production history view showing:

- Egg collection records, where applicable.
- Weight records.
- Feed consumption records.
- Production indicators.
- Performance trends.
- Relevant alerts.

This must be linked to the batch details established in Module 2.

### 12.3 House Production History

Display aggregated production information from batches belonging to the selected house.

Allow farmers to open individual batch records.

### 12.4 Export and Reports

Where supported by the existing frontend architecture, provide a basic production report export.

The report should include:

- Farm details.
- House and batch details.
- Reporting period.
- Production records.
- Available performance indicators.
- Data completeness notes.

Do not generate reports containing invented or unrecorded information.

If export functionality is not already available, implement a lightweight export approach that does not introduce unnecessary dependencies.

---

# 13. Underserved Farmer Experience Requirements

This section is a core product requirement and must influence every part of Module 3.

JARI is being built for underserved poultry farmers.

The platform must not assume that every farmer has access to advanced equipment, reliable internet, professional farm-management systems or extensive record-keeping knowledge.

The goal is to help farmers improve their record-keeping and farm management gradually.

### 13.1 Simple Language

Use straightforward language.

Where technical terms are necessary, explain them.

Examples:

- Use "Average bird weight" alongside "Average live weight".
- Explain FCR as "How much feed was used to produce weight gain".
- Explain laying rate as "The percentage of live hens producing eggs in a day".

Do not expect farmers to understand technical poultry terminology before using the system.

### 13.2 Flexible Record-Keeping

Do not make advanced records mandatory.

A farmer should be able to use Module 3 even if they only record:

- Daily egg collection.
- Occasional bird weights.
- Feed issued to batches.

The system should provide more detailed insights as additional records become available.

### 13.3 Multiple Recording Levels

Support:

- Individual measurements.
- Group measurements.
- Batch-level totals.
- Manual historical records.

Do not require individual bird-level records for every activity.

### 13.4 Estimated Information

Allow estimated values where appropriate.

Clearly identify estimates.

Do not treat estimates as actual measurements when calculating performance indicators without explicitly identifying the limitation.

### 13.5 Missing Information

Missing records must not prevent the farmer from using unrelated features.

For example:

- A farmer without weight records can still record egg production.
- A farmer without feed records can still monitor bird growth.
- A farmer without inventory data can still record manually reported feed consumption.

Explain which calculations are unavailable and why.

### 13.6 Low-End Devices

The interface should remain lightweight.

Avoid unnecessary animations, oversized charts and resource-heavy components.

Use responsive layouts suitable for affordable Android phones.

### 13.7 Unstable Connectivity

Design the frontend workflows to support future offline-friendly operation.

Within the current localStorage-based implementation:

- Avoid losing entered information when navigating between steps.
- Provide clear save feedback.
- Handle storage failures.
- Avoid unnecessary data refetching.
- Keep forms usable on mobile devices.

Do not claim full offline synchronisation or cross-device sync. Those capabilities require additional implementation and are outside the current scope.

### 13.8 Progressive Data Collection

Do not ask farmers to enter all production information at once.

Allow them to record information as it becomes available.

The system should gradually help farmers improve their record-keeping habits.

---

# 14. Integration with Existing JARI Modules

Module 3 must extend existing JARI functionality.

It must not introduce disconnected copies of existing data.

### 14.1 Module 1: Farmer Onboarding and Farm Registration

Reuse:

- Farmer account.
- Farmer profile.
- Farm records.
- Farm ownership and location information.

Do not modify the onboarding workflow unless a genuine compatibility issue is discovered.

### 14.2 Module 2: Flock and Inventory Management

Reuse:

- Farms.
- Houses.
- Batches.
- Batch population records.
- Batch lifecycle information.
- Inventory items.
- Feed stock.
- Stock movement records.
- Inventory alerts.

Production records must be associated with the appropriate existing batch.

Feed consumption must integrate with existing inventory transactions.

### 14.3 Future Module 4: Animal Health and Biosecurity Management

Module 3 must be designed to allow future health information to extend the same batch and house records.

However, Module 3 must not implement:

- Vaccination management.
- Veterinary treatment records.
- Disease diagnosis.
- Biosecurity inspections.
- Veterinary advisory workflows.

These belong to Module 4.

### 14.4 Future Module 5: Farm Financial Management

Production records may eventually contribute to farm financial calculations.

However, Module 3 must not implement a complete financial management system.

Do not introduce:

- Full farm accounting.
- Expense management.
- Debt management.
- Cash-flow management.
- Profit and loss statements.
- Financial forecasting.
- Payment processing.

Production-related selling prices may be recorded only where needed for an explicitly approved production feature. Full sales and financial transaction management should remain in Module 5.

### 14.5 Future Module 7: Risk Intelligence and Advisory

Module 3 must produce structured production data that can later support risk assessment and advisory services.

However, Module 3 must not implement the complete risk intelligence engine.

---

# 15. Data Architecture and Core Entities

The implementation must reuse existing data models where possible.

The following entities describe the required logical structure. They are not instructions to create duplicate tables or persistence systems.

### 15.1 Production Record

Suggested entity:

`production_records`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- production_type
- record_type
- record_date
- quantity
- unit
- measurement_status
- notes
- created_at
- updated_at

### 15.2 Egg Collection Record

Suggested entity:

`egg_collection_records`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- collection_date
- total_eggs
- marketable_eggs
- broken_eggs
- cracked_eggs
- dirty_eggs
- rejected_eggs
- notes
- created_at
- updated_at

Classification fields may be optional.

### 15.3 Weight Record

Suggested entity:

`weight_records`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- measurement_date
- sample_size
- total_sample_weight
- average_weight
- measurement_unit
- measurement_method
- individual_measurements
- measurement_status
- notes
- created_at
- updated_at

### 15.4 Feed Consumption Record

Suggested entity:

`feed_consumption_records`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- inventory_item_id
- feed_type
- quantity
- unit
- consumption_date
- transaction_source
- measurement_status
- notes
- created_at
- updated_at

The transaction source should distinguish inventory-issued feed from manually recorded consumption.

### 15.5 Production Performance Snapshot

Where useful, the system may maintain derived performance snapshots.

Suggested entity:

`production_performance_snapshots`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- production_category
- reporting_period_start
- reporting_period_end
- indicator_type
- indicator_value
- unit
- calculation_status
- calculation_inputs
- calculated_at

Performance snapshots must remain derived data.

The original production records are the source of truth.

Do not create unnecessary duplicated records if the existing architecture can calculate these values efficiently.

### 15.6 Production Alert

Suggested entity:

`production_alerts`

Fields:

- id
- user_id
- farm_id
- house_id
- batch_id
- alert_type
- title
- description
- severity
- status
- triggered_at
- resolved_at

### 15.7 Relationship Requirements

Every production record must belong to:

- One farmer/account.
- One farm.
- One house.
- One batch.

The selected house must belong to the selected farm.

The selected batch must belong to the selected house and farm.

All relationships must be validated before saving.

Never rely only on frontend dropdown filtering for data integrity.

---

# 16. Service Architecture

Extend the existing service architecture.

Do not introduce direct localStorage manipulation inside UI components.

Create or extend appropriate service operations based on the existing project conventions.

Suggested service groups:

### 16.1 Production Services

- createProductionRecord
- getProductionRecords
- getProductionRecordById
- updateProductionRecord
- archiveProductionRecord
- getProductionSummary
- getProductionHistory

### 16.2 Egg Production Services

- createEggCollectionRecord
- getEggCollectionRecords
- updateEggCollectionRecord
- getEggProductionSummary
- getEggProductionTrends
- getLayingRate

### 16.3 Weight Monitoring Services

- createWeightRecord
- getWeightRecords
- updateWeightRecord
- getAverageWeight
- getWeightGain
- getAverageDailyWeightGain
- getWeightHistory

### 16.4 Feed Consumption Services

- createFeedConsumptionRecord
- getFeedConsumptionRecords
- getBatchFeedConsumption
- getFeedConsumptionSummary
- getFeedConsumptionTrends

These operations must reuse Module 2 inventory services when creating stock movement transactions.

### 16.5 Performance Calculation Services

- calculateBroilerPerformance
- calculateLayerPerformance
- calculateFeedConversionRatio
- calculateFeedPerDozenEggs
- calculateLayingRate
- calculateEggsPerBird
- calculateWeightGain
- calculateFeedCostPerUnit
- getBatchPerformance
- getHousePerformance
- getFarmPerformance

Calculations should be implemented as reusable, independently testable functions.

Do not place calculation logic directly inside React components.

### 16.6 Alert Services

- generateProductionAlerts
- getProductionAlerts
- updateProductionAlertStatus
- resolveProductionAlert

### 16.7 Service Design Requirements

All services must:

- Use the existing project architecture.
- Validate account ownership.
- Validate farm, house and batch relationships.
- Handle missing records.
- Handle invalid inputs.
- Return consistent results.
- Support future API integration.
- Avoid duplicate persistence mechanisms.

---

# 17. User Interface and Navigation

### 17.1 Navigation

Add Production and Performance Management to the existing farmer dashboard navigation.

Do not redesign the entire application.

Preserve existing navigation patterns, branding, typography, colours and component styles.

### 17.2 Main Production Pages

The module should contain the following functional areas:

1. Production Overview.
2. Egg Production.
3. Broiler Production.
4. Weight Monitoring.
5. Feed Consumption.
6. Performance Analysis.
7. Production History.

Reuse existing components where appropriate.

### 17.3 Farm Selection

All production pages must respect the selected farm.

Where the farmer manages multiple farms, provide a consistent farm selector.

### 17.4 House and Batch Selection

Forms must guide farmers through:

Farm → House → Batch

The available houses must depend on the selected farm.

The available batches must depend on the selected house.

Do not allow production records to be assigned to unrelated batches.

### 17.5 Mobile-First Design

Design for mobile devices first.

Forms must be:

- Short.
- Easy to understand.
- Clearly labelled.
- Easy to complete.
- Suitable for small screens.

Avoid overwhelming farmers with too many fields on one screen.

Use progressive disclosure where appropriate.

### 17.6 User Feedback

Every action should provide clear feedback.

Examples:

- Production record saved.
- Egg collection recorded.
- Weight record updated.
- Feed consumption recorded.
- Inventory balance updated.
- Record could not be saved.
- Required information is missing.

Do not show success messages before the operation succeeds.

---

# 18. Validation and Data Integrity

### 18.1 General Validation

Validate:

- Required fields.
- Numeric values.
- Date values.
- Measurement units.
- Farm ownership.
- House ownership.
- Batch ownership.
- Production category compatibility.

### 18.2 Production Validation

Prevent:

- Negative production quantities.
- Negative feed quantities.
- Invalid weight measurements.
- Zero sample sizes for average weight calculations.
- Invalid date ranges.
- Duplicate accidental submissions.
- Inconsistent egg classifications.
- Records assigned to closed or archived batches without an explicit historical-record workflow.

### 18.3 Population Changes

Use the population history established in Module 2.

Do not independently create a second bird population system.

When calculating production performance, account for:

- Mortality.
- Sales.
- Transfers.
- Batch population adjustments.
- Batch closure.

Where historical population data is unavailable, mark affected calculations as incomplete.

### 18.4 Data Corrections

When a farmer edits a historical record:

- Update the relevant production totals.
- Recalculate affected indicators.
- Update affected alerts.
- Preserve necessary audit information.
- Ensure no duplicate inventory deduction occurs.

---

# 19. Security, Privacy and Account Isolation

Although this is a frontend simulation, the implementation must follow backend-ready data ownership principles.

Requirements:

- Farmers must only access their own records.
- Records must be associated with the authenticated account.
- Farm ownership must be validated.
- House and batch relationships must be validated.
- Switching accounts must not expose another account's records.
- Logging out must not clear unrelated users' records.
- Do not store plaintext passwords.
- Do not expose sensitive account information in production records.
- Handle corrupted or unavailable localStorage data safely.

Do not claim that localStorage provides production-grade data security.

Actual server-side authorisation, encryption at rest and secure multi-device access belong to future backend implementation.

---

# 20. Scope Exclusions

The following features must not be implemented as part of Module 3 unless separately approved.

### 20.1 Animal Health and Biosecurity

Deferred to Module 4:

- Vaccination management.
- Veterinary treatment records.
- Disease management.
- Veterinary consultations.
- Biosecurity inspections.
- Detailed health analytics.

### 20.2 Farm Financial Management

Deferred to Module 5:

- Full accounting.
- Expense tracking.
- Farm cash flow.
- Debt management.
- Profit and loss statements.
- Financial forecasting.
- Complete sales and payment management.

### 20.3 Advanced Risk Intelligence

Deferred to Module 7:

- Comprehensive risk scoring.
- Predictive disease analytics.
- AI-driven advisory.
- Cross-farm risk intelligence.
- Advanced risk forecasting.

### 20.4 Institutional Services

Deferred to later modules:

- Insurance matching.
- Loan matching.
- Grant matching.
- Institutional onboarding.
- Institutional dashboards.

### 20.5 Intelligent Record Capture

Do not implement:

- AI-powered record extraction.
- OCR.
- Image-based record interpretation.
- Automatic notebook scanning.
- AI-generated production entries.
- Automated camera-based flock monitoring.

JARI Intelligent Record Capture is a future platform-wide capability requiring its own development plan and explicit approval.

### 20.6 External Integrations

Do not implement:

- Real SMS services.
- Email notification services.
- Push notification services.
- External agricultural APIs.
- Automated IoT sensor integrations.
- External AI services.
- Background processing infrastructure.

Document any future integration requirements without implementing them.

---

# 21. Testing Requirements

Every implemented workflow must be tested.

### 21.1 Production Record Tests

Verify:

- Create production record.
- View production record.
- Edit production record.
- Archive production record.
- Filter production records.
- Retrieve historical records.
- Persist records after refresh.

### 21.2 Layer Production Tests

Verify:

- Record egg collection.
- Record optional egg classifications.
- Calculate daily production.
- Calculate weekly production.
- Calculate monthly production.
- Calculate laying rate when valid data exists.
- Handle missing population data.
- Compare batches.

### 21.3 Broiler Production Tests

Verify:

- Record individual weights.
- Record group average weights.
- Record group total weights.
- Calculate average weight.
- Calculate weight gain.
- Calculate average daily weight gain.
- Handle different sample sizes.
- Handle missing historical measurements.

### 21.4 Feed Consumption Tests

Verify:

- Record feed consumption.
- Connect feed consumption to inventory.
- Update stock balances correctly.
- Prevent double deductions.
- Handle manually recorded consumption.
- Handle unavailable stock.
- Calculate feed consumption per bird where possible.

### 21.5 Performance Calculation Tests

Test all supported formulas using known input and expected output.

Include:

- Missing records.
- Zero values.
- Different reporting periods.
- Population changes.
- Incomplete measurements.
- Estimated measurements.
- Incorrect measurement units.
- Edited historical records.

### 21.6 Account Isolation Tests

Verify:

- Account A cannot view Account B's production records.
- Switching farms changes the displayed records correctly.
- Houses cannot be mixed across farms.
- Batches cannot be mixed across houses.
- Logging out does not delete unrelated account records.

### 21.7 Responsive and Usability Tests

Test:

- Small Android screens.
- Larger mobile screens.
- Desktop layouts.
- Form validation.
- Empty states.
- Loading states.
- Error states.
- Save feedback.
- Navigation between module sections.

### 21.8 Build and Quality Checks

Run the project's available:

- TypeScript checks.
- Linting.
- Unit tests.
- Integration tests.
- Production build.

Do not report a test as passed unless it was actually executed.

Record unresolved failures and limitations in `progress.md`.

---

# 22. Implementation Phases

The entire module must be implemented in a maximum of five phases.

Each phase must be independently testable before proceeding.

## Phase 1: Architecture Review, Documentation Synchronisation and Data Modelling

Tasks:

1. Read all relevant development plans.
2. Inspect the existing codebase.
3. Review Module 1 and Module 2 implementations.
4. Identify reusable components and services.
5. Confirm farm, house and batch relationships.
6. Design production data structures.
7. Define validation rules.
8. Define performance calculation requirements.
9. Update shared architecture documentation.
10. Update `progress.md`.

Deliverables:

- Architecture review completed.
- Documentation synchronised.
- Production data model defined.
- Service implementation plan approved.
- Identified dependencies documented.

Testing:

- Confirm existing workflows remain unaffected.
- Confirm the proposed data structures support all required relationships.
- Confirm no duplicate persistence architecture is being introduced.

Do not proceed until the architecture and data model are consistent.

## Phase 2: Production Dashboard and Core Production Record Management

Tasks:

1. Implement Production Dashboard.
2. Implement farm selection.
3. Implement house and batch filtering.
4. Implement core production record services.
5. Implement production record creation.
6. Implement record editing and history.
7. Implement production empty states.
8. Implement mobile-friendly forms.
9. Implement localStorage persistence through existing services.

Deliverables:

- Functional Production Dashboard.
- Functional production record management.
- Farm, house and batch filtering.
- Persistent records.
- Account isolation.

Testing:

- Create, view, edit and retrieve production records.
- Confirm records persist after refresh.
- Confirm farm, house and batch relationships are valid.

## Phase 3: Layer and Broiler Production Management

Tasks:

1. Implement egg collection records.
2. Implement egg classification.
3. Implement egg production aggregation.
4. Implement laying rate calculations.
5. Implement eggs-per-bird calculations.
6. Implement broiler weight monitoring.
7. Implement individual and group weight entry.
8. Implement weight gain calculations.
9. Implement average daily weight gain.
10. Implement production history and trends.

Deliverables:

- Functional Layer Production Management.
- Functional Broiler Production Management.
- Functional Weight Monitoring.
- Batch-level production history.
- House and farm-level aggregation.

Testing:

- Verify egg collection calculations.
- Verify laying rate calculations.
- Verify weight calculations.
- Verify aggregation across batches and houses.
- Verify missing-data handling.

## Phase 4: Feed Consumption and Production Performance Analytics

Tasks:

1. Integrate with existing Module 2 feed inventory.
2. Implement batch-level feed consumption records.
3. Implement manual consumption recording.
4. Prevent duplicate inventory deductions.
5. Implement broiler performance calculations.
6. Implement layer performance calculations.
7. Implement FCR where reliable data exists.
8. Implement feed-per-dozen-egg calculations.
9. Implement feed cost indicators where data exists.
10. Implement batch, house and farm comparisons.
11. Implement production alerts and insights.

Deliverables:

- Functional feed consumption monitoring.
- Inventory integration.
- Reusable performance calculation services.
- Production analytics.
- Explainable alerts and insights.

Testing:

- Verify feed and inventory integration.
- Verify all supported formulas.
- Verify missing and incomplete data handling.
- Verify that calculations update after record corrections.

## Phase 5: Full Testing, Refinement and Completion

Tasks:

1. Test all production workflows.
2. Test account isolation.
3. Test multi-farm support.
4. Test mobile responsiveness.
5. Test persistence.
6. Test historical records.
7. Test calculation accuracy.
8. Test integration with Module 2.
9. Fix identified issues.
10. Update all relevant documentation.
11. Update `README.md`.
12. Update `progress.md`.
13. Document remaining limitations.

Deliverables:

- Fully tested Module 3 frontend.
- Updated documentation.
- Updated progress tracker.
- Documented calculation rules.
- Documented outstanding issues.
- Production-ready frontend structure for future backend integration.

---

# 23. Progress Tracking Requirements

The coding agent must maintain:

`progress.md`

This file is the authoritative implementation progress tracker.

Update it throughout development.

It must contain:

- Module overview.
- Current phase.
- Phase status.
- Completed tasks.
- Tasks in progress.
- Pending tasks.
- Tests executed.
- Test results.
- Known issues.
- Architectural decisions.
- Documentation updates.
- Outstanding dependencies.

Use clear statuses:

- Not Started.
- In Progress.
- Blocked.
- Completed.
- Requires Review.

Do not mark a phase completed until its deliverables and tests have been verified.

Do not wait until the end of the module to update `progress.md`.

---

# 24. Final Acceptance Criteria

Module 3 is complete only when all applicable criteria below are satisfied.

### Production Management

- Farmers can record production against specific batches.
- Farmers can view and edit production records.
- Farmers can retrieve historical records.
- Production records persist.
- Farm, house and batch relationships are enforced.

### Layer Production

- Farmers can record egg collection.
- Egg collection is attributed to the correct batch.
- Egg production aggregates to house and farm levels.
- Laying rate is calculated when reliable information exists.
- Egg production trends are available.

### Broiler Production

- Farmers can record bird weights.
- Individual and group weight records are supported.
- Weight gain can be calculated.
- Average daily weight gain can be calculated.
- Historical weight trends are available.

### Feed Consumption

- Farmers can record feed consumption.
- Feed records are associated with the correct batch.
- Inventory integration works.
- Duplicate stock deductions are prevented.
- Manual consumption records are supported.

### Performance Analytics

- Relevant broiler indicators are calculated.
- Relevant layer indicators are calculated.
- FCR is only shown when sufficient reliable data exists.
- Feed-per-dozen-egg calculations work.
- Missing information is handled honestly.
- Calculations can be explained.
- Batch, house and farm comparisons work.

### Farmer Experience

- The module works for farmers with basic record-keeping practices.
- Advanced measurements are optional.
- Estimated records are identifiable.
- Technical terms are explained.
- Forms are mobile-friendly.
- Empty states are meaningful.
- Farmers are not overwhelmed with unnecessary data entry.

### Architecture and Quality

- Existing architecture is reused.
- No backend is introduced.
- No competing persistence system is created.
- Existing Module 1 and Module 2 workflows remain functional.
- Account isolation is enforced in the mock environment.
- Documentation is synchronised.
- `progress.md` is current.
- All implemented workflows have been tested.
- Build and quality checks have been executed and their results documented.

---

# 25. Final Development Directive

The objective is not to build a complicated poultry analytics system that only large commercial farms can use.

JARI is being developed for underserved poultry farmers who may currently rely on notebooks, manual calculations or informal record-keeping.

The system must meet farmers at their current level of operation and help them improve gradually.

A farmer should be able to start with basic egg collection or occasional weight records and still receive value from the platform.

As the farmer records more information, JARI should provide more detailed performance calculations and insights.

The system must never make advanced data collection a barrier to basic use.

Build for real farm conditions, not idealised assumptions.

Maintain the established structure:

**Farm → Houses → Batches**

Production records must always be traceable to their originating batch, with accurate aggregation at house and farm levels.

Use actual data wherever available. Identify estimated data. Explain calculated data. Never fabricate missing information.

Keep Module 3 focused on Production and Performance Management while ensuring that its data can support future JARI modules, especially Animal Health and Biosecurity, Farm Financial Management, Risk Intelligence and Financial Readiness.

Follow the five implementation phases, test each phase before proceeding and maintain `progress.md` throughout the entire development process.

Do not begin coding until the mandatory architecture and documentation synchronisation in Section 2 is complete.