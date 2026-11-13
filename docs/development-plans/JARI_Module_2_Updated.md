**# JARI**

**# MODULE 2: FLOCK AND INVENTORY MANAGEMENT**

**## Product Requirements and Development Specification**



**\*\*Project:\*\*** JARI  

**\*\*Module:\*\*** Module 2  

**\*\*Product Category:\*\*** Agricultural Risk Intelligence and Financial Enablement Platform  

**\*\*Initial Target Market:\*\*** Poultry farmers in Jos South, Plateau State, Nigeria  

**\*\*Document Type:\*\*** Product Requirements and Development Specification  

**\*\*Implementation Approach:\*\*** Frontend development using simulated data and localStorage  

**\*\*Backend Implementation:\*\*** Deferred



**---**



**# 1. Introduction**



**## 1.1 Purpose**



Module 2 introduces two essential farm-management capabilities to JARI:



1\. Flock Management.

2\. Inventory Management.



The objective is to help poultry farmers maintain accurate records of their birds, monitor flock development, manage farm resources, track stock movements and receive relevant insights that support day-to-day farm operations.



These two submodules must operate independently while sharing relevant information where necessary.



Flock Management focuses on understanding and monitoring the birds within each farm. Inventory Management focuses on managing the resources, supplies and equipment required to operate the farm.



Together, they should provide JARI with a better understanding of the farm's operational activities and support more useful, data-driven recommendations.



**## 1.2 Development Principles**



The implementation must follow these principles:



\- Preserve the existing JARI branding and design system.

\- Reuse existing components, layouts, authentication and navigation.

\- Use the existing frontend service architecture.

\- Continue using simulated data and localStorage for the current development stage.

\- Do not introduce a competing persistence architecture.

\- Design data structures and service contracts to support future backend integration.

\- Support farmers who manage multiple farms.

\- Maintain proper separation between farmer accounts and their records.

\- Ensure that every implemented interface and action works.

\- Do not display fabricated farm statistics or activity records.

\- Maintain historical records instead of permanently deleting important farm activities.

\- Keep Flock Management and Inventory Management independently usable.



The backend must not be implemented or modified as part of this module.

**## 1.3 Mandatory Project-Wide Architecture Alignment**

Before implementing Module 2, the development agent must complete the project-wide documentation and architecture synchronisation required by Module 1 and inspect all relevant documents in `docs/development-plan/`.

The agent must:

1. Read the current Module 1 and Module 2 plans and all other available development plans.
2. Inspect the actual frontend architecture, routes, navigation, service layer, simulated-data layer, existing farm records and current implementation.
3. Confirm that the product uses the agreed **Farm → Houses → Batches** hierarchy.
4. Confirm that farm-level dashboards aggregate house and batch records without losing house-level or batch-level detail.
5. Confirm that future production, health and biosecurity capabilities are planned as extensions of the relevant existing house and batch records, not as disconnected data systems.
6. Update relevant existing project documentation, including `progress.md`, `README.md`, architecture documentation and data-model documentation where applicable. Do not create duplicate or conflicting documents.
7. Record what is already implemented, what is only planned, any conflicts found and any decisions requiring the project owner's approval.

Do not begin Module 2 implementation until the documentation and architecture are consistent and the synchronisation result has been recorded in `progress.md`. If a conflict cannot be resolved from the approved development plans, stop and request clarification rather than guessing.

This alignment task does not authorise backend work or implementation of future modules.

**---**



**# 2. Module Structure**



Module 2 consists of two independent submodules.



**## 2.1 Flock Management**



Flock Management is responsible for the registration, monitoring and lifecycle management of individual bird batches.



It must enable farmers to:



\- Register individual batches.

\- Track bird population and age.

\- Monitor mortality.

\- Record vaccination history.

\- Schedule vaccination and other management activities.

\- Monitor laying milestones for layer batches.

\- Track sales, transfers and retirement of birds.

\- Receive batch-specific recommendations.

\- View the complete history of each batch.



Flock Management must function as a lifecycle tracking and management assistance system, not merely a bird registration form.



**## 2.2 Inventory Management**



Inventory Management is responsible for managing farm supplies, consumables, equipment, purchases and stock movements.



It must enable farmers to:



\- Register and categorise inventory items.

\- Track available stock.

\- Record purchases and stock movements.

\- Monitor feed consumption.

\- Associate supplies issued with specific flock batches.

\- Track expiry dates.

\- Receive low-stock and expiry alerts.

\- Monitor supplier and purchase history.

\- Analyse inventory consumption.

\- Estimate future stock requirements.



Inventory Management must help farmers understand what they have, what they are using, what is running out and what they may need to purchase.



**## 2.3 Independent Operation**



The two submodules must not depend on each other to function.



A farmer should be able to:



\- Use Flock Management without configuring Inventory Management.

\- Use Inventory Management without registering flock batches.

\- Use both modules together for more comprehensive farm monitoring.



When a feature requires information from another module, JARI must handle missing information appropriately rather than preventing the farmer from using the current module.

**## 2.4 Farm, House and Batch Structure**

JARI must use the following hierarchy throughout farm operations:

**Farm → Houses → Batches**

- A farmer can manage multiple farms.
- Each farm can contain multiple poultry houses.
- Each house can contain multiple flock batches.
- Each batch must belong to one farm and one house.
- A house must belong to one farm.
- A batch must never be associated with a house belonging to a different farm.

House Management is part of the operational foundation of Module 2. It is not a separate, disconnected product module. It provides the structure in which flock batches are organised and managed.

The farm registration information captured in Module 1, including the optional number of poultry houses, is an initial farm-level description. It does not replace the actual house records created and managed in this module.

**Farm-level views** must aggregate relevant information from all houses and their batches. Farmers must still be able to open an individual house and inspect its batches and records.

Future production and performance capabilities must extend batch records. For example, egg collections and batch production revenue must be attributed to the batch that produced them, then aggregated into house and farm summaries. Future health records must be attributable to the relevant batch where applicable. Biosecurity and house-condition records must be attributable to the relevant house or farm. These future capabilities must reuse the same farm, house and batch identities rather than introduce parallel flock or house records.

**---**



**# 3. FLOCK MANAGEMENT**



**## 3.0 House Management**

House Management establishes the physical organisation of each poultry farm before flock batches are registered.

Farmers must be able to create and manage multiple houses under each farm.

**### House Registration**

Each house should capture:

- House name.
- House reference or identification code.
- Associated farm.
- House purpose or production type, where applicable (broiler, layer, mixed or other).
- Housing system (deep litter, battery cage, free range, semi-intensive or other).
- Maximum bird capacity.
- Current operational status.
- Optional description, dimensions or other identifying details.
- Optional infrastructure details relevant to the house.
- Additional notes.

House status should support:

- Active.
- Temporarily inactive.
- Under maintenance.
- Closed.
- Archived.

House capacity must be a non-negative value. The system must calculate the recorded current population from the live populations of batches assigned to that house. It must not treat the farmer-entered capacity as the actual population.

**### House Details and Batch Overview**

Each house must have a dedicated details view showing:

- House identity and farm.
- Declared capacity.
- Recorded current bird population.
- Available capacity, where the underlying records are sufficient.
- Number of active batches.
- Batch list with production type, breed, age and current population.
- Relevant house-level infrastructure details.
- House activity and assignment history.
- Relevant alerts or operational status.

House-level figures must be calculated from the batches currently assigned to that house. Farm-level summaries must aggregate these figures across the farm's houses.

**### House Capacity and Assignment Rules**

- A batch must be assigned to a house when it is registered.
- The selected house must belong to the selected farm.
- JARI must show the effect of assigning a batch on the house's recorded occupancy.
- If an assignment would exceed declared capacity, clearly warn the farmer and explain the calculation. Do not silently accept an over-capacity assignment. Any permitted override must require an explicit confirmation and be recorded.
- A house with assigned batches or historical records must not be permanently deleted.
- A house can be marked inactive or archived only when the status change does not hide or invalidate its historical records.
- Farmers must be able to move a batch to another house on the same farm while preserving the previous assignment and movement history.
- Moving a batch between houses must not create or destroy birds or be mistaken for mortality, sale or a new batch.
- A batch must not be assigned to a house on another farm through a simple house reassignment. Cross-farm movement must use an explicit transfer workflow that preserves source and destination history.

House Management must remain usable even before any flock batches have been registered. Empty houses should display a clear empty state.

**### House-Level Biosecurity Boundary**

Module 2 may capture basic house identity and optional infrastructure information, but it must not implement a full biosecurity inspection, disease-control programme or detailed health incident workflow. Those capabilities will be introduced through a later extension of house and batch management.

**## 3.1 Flock Management Dashboard**



The dashboard should provide a summary of the farmer's registered flock batches.



It should display information such as:



\- Total registered birds.

\- Number of active batches.

\- Number of broiler batches.

\- Number of layer batches.

\- Other or mixed production batches.

\- Current population across active batches.

\- Upcoming vaccination activities.

\- Overdue management activities.

\- Recent mortality records.

\- Recent flock activities.

\- Important lifecycle notifications.



The dashboard must only calculate figures from actual registered records.



If the farmer has not registered any batches, JARI should display a proper empty state with a clear action to register the first batch.



The dashboard should support farm selection and house filtering. A farm-level view must aggregate the records of all houses and their batches, while a house-level view must show only the batches assigned to that house. Farmers must be able to drill down from farm to house to batch without losing the context of the selected farm.



**## 3.2 Batch Registration**



Every flock must be registered as an individual batch.



A batch represents a group of birds acquired or raised together and monitored throughout its lifecycle.



The registration workflow should capture the following information.



**### A. Batch Identity**



\- Batch name.

\- Batch reference or identification number.

\- Farm associated with the batch.

\- Production type:

  - Broiler.

  - Layer.

  - Both or mixed.

  - Other, where supported.

\- Bird category.

\- Breed.



**### B. Bird Age Information**



The farmer should be able to provide either:



\- Hatch date, where known.

\- Age at acquisition and acquisition date.



The system should calculate the current age automatically using the available information.



If neither value is known, the age should be marked as unknown. JARI must not invent or estimate an age without sufficient information.



Original age information must remain available even as the calculated age changes.



**### C. Population Information**



\- Initial bird quantity.

\- Current bird quantity.

\- Acquisition date.

\- Acquisition source.

\- Supplier, where applicable.

\- Acquisition method.

\- House assignment (required; the house must belong to the selected farm).



The system must distinguish between initial population and current population.



**### D. Batch Status**



Batch status should include:



\- Active.

\- Completed.

\- Closed.

\- Archived.



Production status must be maintained separately from administrative batch status.



For example, a layer batch can be active while not yet laying. A batch that has stopped laying is not automatically closed.



**## 3.3 Batch Details and Lifecycle Tracking**



Every registered batch must have a dedicated details page.



The page should provide a complete view of the batch, including:



\- Batch identity.

\- Bird type and breed.

\- Age.

\- Current population.

\- Mortality statistics.

\- Vaccination history.

\- Upcoming activities.

\- Laying milestones, where applicable.

\- Sales and transfer history.

\- Current lifecycle status.

\- Chronological activity timeline.



The farmer should be able to understand what has happened to the batch, its current recorded condition and what activities are expected next.



**## 3.4 Population and Mortality Tracking**



Farmers must be able to record population changes throughout the lifecycle of each batch.



Supported population activities include:



\- Initial registration.

\- Addition of birds.

\- Mortality.

\- Culling.

\- Sale or removal.

\- Transfer to another batch or farm.

\- Population correction.



Each transaction must record:



\- Batch reference.

\- Transaction type.

\- Quantity.

\- Date of occurrence.

\- Reason, where applicable.

\- Notes, where applicable.

\- User responsible for the entry.

\- Record creation timestamp.



The system must prevent negative population balances and invalid transactions.



**### Mortality Tracking**



Farmers must be able to record:



\- Number of birds that died.

\- Date of mortality.

\- Batch affected.

\- Cause of death, where known.

\- Additional notes.



The system should automatically update the current batch population and calculate relevant mortality statistics.



**### Mortality Calculations**



The system should support:



**\*\*Cumulative mortality rate\*\***



Total recorded deaths divided by the total number of birds introduced into the batch, multiplied by 100.



The total number introduced must account for the initial population and subsequent additions. Transfers must be handled consistently to prevent double counting.



**\*\*Period mortality rate\*\***



Deaths recorded during a selected period divided by the opening live population for that period, multiplied by 100.



The system must handle zero denominators safely and clearly identify the period being measured.



Mortality statistics must distinguish between recorded deaths and other population reductions, such as sales, culling and transfers.



JARI must not automatically diagnose the cause of mortality.



If a sudden or unusual mortality pattern is detected, the system may flag it for attention and recommend that the farmer consult a qualified poultry veterinarian.



**## 3.5 Vaccination and Health Activity History**



Vaccination tracking must be part of each batch's lifecycle history.



Farmers should be able to record:



\- Vaccine name.

\- Batch receiving the vaccine.

\- Administration date.

\- Quantity or number of birds covered.

\- Vaccine manufacturer, where known.

\- Vaccine lot or batch number, where available.

\- Next scheduled vaccination date, where applicable.

\- Administrator or responsible person, where known.

\- Notes.



Farmers must be able to record historical vaccinations even when they do not have complete information.



The system must distinguish between:



\- Vaccination scheduled.

\- Vaccination completed and recorded.

\- Vaccination overdue.

\- Vaccination history unavailable or incomplete.



JARI must not assume that a vaccine was administered simply because a reminder was created.



The system must also avoid claiming that a flock is fully vaccinated or compliant when the necessary records are missing.



**## 3.6 Flock Activity Scheduling and Reminders**



JARI must provide a scheduling system for batch-specific management activities.



Farmers should be able to create reminders for activities such as:



\- Vaccination.

\- Deworming.

\- Debeaking, where applicable.

\- Health checks.

\- Treatment follow-ups.

\- Other farm-management activities.



Each scheduled activity should capture:



\- Activity name and category.

\- Associated farm.

\- Associated batch.

\- Scheduled date.

\- Optional reminder time.

\- Notes or instructions.

\- Reminder status.



Reminder statuses should include:



\- Upcoming.

\- Due.

\- Overdue.

\- Completed.

\- Rescheduled.

\- Cancelled.



Farmers must be able to:



\- Create activities manually.

\- Edit scheduled activities.

\- Reschedule activities.

\- Mark activities as completed.

\- Record completion details.

\- View past and upcoming activities.



**### Intelligent Activity Suggestions**



JARI should also be able to suggest relevant activities based on:



\- Bird type.

\- Breed, where relevant.

\- Age.

\- Production stage.

\- Existing vaccination history.

\- Recorded farm conditions.

\- Verified poultry management guidelines.



For example, a newly registered broiler batch should receive relevant management guidance based on its age and production stage.



A layer batch should receive relevant guidance appropriate to its development and laying stages.



Suggestions must be grounded in verified poultry management guidance and should not be generated from unsupported assumptions.



Farmers must remain able to review and accept or dismiss suggestions.



JARI must distinguish between an AI or guideline-based suggestion and an activity that the farmer has actually scheduled.



**## 3.7 Layer Production Milestones**



For layer batches, JARI must track important laying milestones.



Farmers should be able to record:



\- Date the birds started laying.

\- Current laying status.

\- Date laying stopped, where applicable.

\- Reason for stopping, where known.

\- Number of birds affected, where applicable.

\- Additional notes.



The system should support the distinction between:



\- Not yet laying.

\- Started laying.

\- Currently laying.

\- Partially stopped laying.

\- Completely stopped laying.



The system must not assume that the entire batch started or stopped laying on the same date if the farmer records only a partial change.



Detailed egg quantities and production trends will be handled by the separate Production Tracking module.



**## 3.8 Bird Sales, Retirement and Batch Closure**



Farmers must be able to record when birds are sold, removed or retired.



Each sale or removal record should capture:



\- Batch.

\- Quantity.

\- Date.

\- Reason or category.

\- Notes.



Possible reasons include:



\- Normal commercial sale.

\- Old or unproductive birds.

\- End of production cycle.

\- Culling.

\- Other.



Financial sale amounts and detailed revenue records belong to the future Financial Management module.



**### Batch Closure**



A batch should be closed when the farmer has completed its operational lifecycle.



Closure information should include:



\- Closure date.

\- Final recorded population.

\- Closure reason.

\- Notes.



Historical batch information must remain accessible after closure.



The system must not delete a batch simply because its current population reaches zero.



**## 3.9 Batch Activity Timeline**



Every batch must have a chronological activity timeline.



The timeline should include:



\- Batch registration.

\- Age and batch information updates.

\- Population additions.

\- Mortality.

\- Vaccination records.

\- Scheduled activity completion.

\- Laying milestones.

\- Sales.

\- Transfers.

\- Status changes.

\- Batch closure.



The timeline should allow the farmer to understand the history of the batch without navigating through multiple unrelated pages.



**---**



**# 4. INTELLIGENT FLOCK INSIGHTS**



**## 4.1 Purpose**



JARI should use flock information to provide relevant, batch-specific management insights.



The objective is to help farmers understand their birds and identify activities or conditions requiring attention.



The insights system should consider:



\- Bird type.

\- Breed.

\- Age.

\- Population.

\- Mortality history.

\- Vaccination history.

\- Production stage.

\- Laying status.

\- Scheduled activities.

\- Relevant inventory availability.

\- Recorded farm conditions.



**## 4.2 Examples of Insights**



**### Broiler Management**



JARI may provide relevant guidance on:



\- Feeding stages.

\- Housing.

\- Hygiene.

\- Vaccination schedules.

\- Expected development.

\- General management practices.



**### Layer Management**



JARI may provide relevant guidance on:



\- Preparation for laying.

\- Feeding requirements.

\- Vaccination.

\- Laying-stage management.

\- Production monitoring.

\- Management of older or declining flocks.



**### Mortality Monitoring**



If mortality increases beyond an appropriate reference threshold, JARI should flag the trend and explain the records behind the alert.



It should recommend investigation and veterinary attention where appropriate, not claim a disease diagnosis.



**### Vaccination Monitoring**



JARI should identify upcoming or overdue vaccination activities based on the farmer's recorded schedule and relevant verified guidance.



**### Management Recommendations**



JARI should provide recommendations that are relevant to the actual batch and explain why each recommendation is being displayed.



**## 4.3 Reliability Requirements**



The intelligence system must:



\- Use verified poultry management guidance.

\- Consider the actual records available for each batch.

\- Identify missing or incomplete information.

\- Explain the basis of recommendations.

\- Avoid unsupported predictions.

\- Avoid claiming a diagnosis.

\- Avoid presenting suggestions as confirmed farm activities.

\- Recommend professional veterinary assessment when necessary.



If information is insufficient, JARI should communicate that limitation rather than generate a confident but unsupported recommendation.



**---**



**# 5. INVENTORY MANAGEMENT**



**## 5.1 Inventory Dashboard**



Inventory Management should have its own independent dashboard.



The dashboard should display:



\- Total registered inventory items.

\- Items currently in stock.

\- Low-stock items.

\- Out-of-stock items.

\- Products approaching expiry.

\- Expired products.

\- Recent stock transactions.

\- Inventory category summary.

\- Inventory value, where reliable cost information is available.

\- Upcoming restocking requirements.



All displayed statistics must come from actual inventory records.



The dashboard should support farm selection and appropriate filtering.



**## 5.2 Inventory Categories**



The system should support the following categories.



**### A. Feed**



\- Starter feed.

\- Grower feed.

\- Finisher feed.

\- Layer feed.

\- Concentrates.

\- Feed ingredients.

\- Other feed products.



**### B. Veterinary and Health Supplies**



\- Vaccines.

\- Medications.

\- Supplements.

\- Vitamins.

\- Other veterinary supplies.



**### C. Farm Consumables**



\- Disinfectants.

\- Cleaning materials.

\- Bedding and litter.

\- Water treatment products.

\- Protective equipment.

\- Other consumables.



**### D. Equipment and Farm Assets**



\- Feeders.

\- Drinkers.

\- Brooding equipment.

\- Heating equipment.

\- Lighting.

\- Storage equipment.

\- Other farm equipment.



The category structure should allow future expansion without requiring major changes to the data model.



**## 5.3 Inventory Item Registration**



Farmers should be able to register individual inventory items.



Each item should capture:



\- Item name.

\- Category.

\- Item type: consumable or durable equipment.

\- Description.

\- Associated farm.

\- Initial quantity.

\- Measurement unit.

\- Current quantity.

\- Minimum stock threshold, where applicable.

\- Supplier, where available.

\- Purchase date, where available.

\- Purchase cost, where available.

\- Product lot or batch number, where applicable.

\- Expiry date, where applicable.

\- Storage location.

\- Additional notes.



The system must support suitable measurement units, including:



\- Kilograms.

\- Bags.

\- Tonnes.

\- Litres.

\- Millilitres.

\- Doses.

\- Packs.

\- Tablets.

\- Pieces.

\- Other appropriate units.



Units must be validated against the selected item type.



Expiry dates should be required only for products where they are relevant.



Equipment should not be treated as an expiring consumable unless a specific expiry or maintenance requirement applies.



**## 5.4 Stock Transactions**



All inventory changes must be recorded as transactions.



Supported transaction types:



\- Stock received.

\- Stock issued or used.

\- Stock adjustment.

\- Stock transfer.

\- Stock disposal.



Each transaction must capture:



\- Inventory item.

\- Farm.

\- Transaction type.

\- Quantity.

\- Unit.

\- Date of occurrence.

\- Reason.

\- Notes, where applicable.

\- User responsible.

\- Record creation timestamp.



The system must calculate current stock from the transaction history or maintain a consistent balance derived from that history.



The user interface must not directly modify stock quantities without creating the corresponding transaction.



Negative stock balances must be prevented.



**## 5.5 Feed and Resource Consumption Tracking**



Farmers must be able to record feed and other relevant resources issued to individual flock batches.



Each consumption record should capture:



\- Inventory item.

\- Associated farm.

\- Flock batch, where applicable.

\- Quantity issued.

\- Measurement unit.

\- Date.

\- Purpose or notes.

\- Responsible user.



JARI should use these records to calculate:



\- Feed consumed by each batch.

\- Total feed issued over a selected period.

\- Average recorded consumption.

\- Remaining stock.

\- Consumption trends.

\- Estimated days before stock depletion, where sufficient history exists.



The system must distinguish between stock issued to a batch and stock confirmed as consumed. If actual consumption is not recorded, JARI must not present issued quantities as verified consumption.



**## 5.6 Automatic Low-Stock Monitoring**



JARI must automatically monitor inventory quantities against farmer-defined minimum stock thresholds.



For each item, the farmer should be able to configure a low-stock threshold.



The system should identify:



\- Normal stock.

\- Low stock.

\- Out of stock.



Low-stock alerts should be generated when the available quantity reaches or falls below the configured threshold.



The farmer should be able to view the affected item and its current balance.



The system should also support restocking reminders and suggested reorder quantities where sufficient information is available.



**## 5.7 Stock Depletion Forecasting**



JARI should estimate how long available stock may last using recorded consumption history.



For example, if a farm has 20 bags of feed and its recent recorded usage suggests that the feed will last approximately five days, JARI may display an estimated depletion date.



The estimate must consider:



\- Current available stock.

\- Recent usage records.

\- Selected consumption period.

\- Relevant flock batch information, where available.



Forecasts must clearly be labelled as estimates.



If there is insufficient or inconsistent consumption history, the system must communicate that a reliable forecast cannot yet be generated.



**## 5.8 Expiry and Product Lot Tracking**



Inventory items with expiry dates must support expiry monitoring.



JARI should:



\- Track product expiry dates.

\- Generate approaching-expiry alerts.

\- Identify expired stock.

\- Display the affected quantity.

\- Retain lot or batch information.

\- Support stock disposal records.



The system should implement FEFO (First Expired, First Out) as a stock-management principle where applicable.



Products that have expired must be flagged and excluded from normal usable-stock recommendations.



The system must not silently delete expired stock or automatically assume that an expired product has been disposed of.



**## 5.9 Supplier Management**



Farmers should be able to maintain supplier records.



Supplier information may include:



\- Supplier or business name.

\- Contact details.

\- Address or location.

\- Products supplied.

\- Purchase history.

\- Previous prices.

\- Additional notes.



Supplier records should be reusable across purchases.



**## 5.10 Purchase Management**



Farmers should be able to record inventory purchases.



Purchase records should include:



\- Supplier.

\- Purchased items.

\- Quantities.

\- Measurement units.

\- Unit prices, where available.

\- Total purchase amount.

\- Purchase date.

\- Payment status, where applicable.

\- Supporting notes.



Recording a purchase should update the relevant inventory balance through a stock-received transaction.



Purchase records should remain linked to their associated stock transactions.



**## 5.11 Inventory Cost and Expenditure Insights**



JARI should use purchase records to provide inventory expenditure insights.



The system may display:



\- Total inventory purchase expenditure.

\- Feed expenditure.

\- Health-supply expenditure.

\- Consumables expenditure.

\- Purchase history.

\- Spending trends.

\- Estimated value of current inventory, where reliable valuation information exists.



The system must distinguish between purchase expenditure and the value of stock currently remaining.



Inventory expenditure data may later integrate with the Financial Management module.



**## 5.12 Stock Transfers and Storage Locations**



The system must support transfers:



\- Between farms belonging to the same farmer.

\- Between storage locations within a farm.



A transfer must create corresponding outgoing and incoming stock movements.



For example, transferring 10 bags of feed from Farm A to Farm B must:



\- Deduct 10 bags from Farm A.

\- Add 10 bags to Farm B.

\- Record the source and destination.

\- Preserve the transfer history.

\- Prevent inconsistent balances.



The system must not allow a transfer that exceeds available stock.



**---**



**# 6. INTELLIGENT INVENTORY INSIGHTS**



**## 6.1 Purpose**



Inventory Management should provide actionable insights based on stock records, purchases, consumption and flock requirements.



**## 6.2 Supported Insights**



**### Feed Forecasting**



Estimate when feed may run out using recorded consumption and current balances.



**### Upcoming Flock Activities**



Check whether relevant supplies are recorded as available for scheduled activities, such as vaccination.



The system must not assume that a particular product is suitable simply because it exists in inventory. Product suitability must be checked against the relevant activity and verified guidance.



**### Unusual Consumption**



Identify significant changes in recorded usage and notify the farmer that the pattern may need investigation.



**### Purchase Patterns**



Show frequently purchased items, recurring purchases and recorded price changes.



**### Expiry Monitoring**



Identify products approaching expiry and provide appropriate alerts.



**### Stock Wastage**



Flag unusual stock adjustments, disposal quantities or discrepancies for review.



The system must explain the records behind each insight.



It must not automatically accuse a farmer of wastage or misuse.



**---**



**# 7. AUTOMATIC FARM RECORD FRESHNESS AND UPDATE REMINDERS**



**## 7.1 Purpose**



JARI must include a farm record-keeping reminder system that encourages farmers to maintain current and accurate digital records.



The system should monitor when relevant farm records were last updated and remind farmers when their chosen reporting period has elapsed.



This capability applies across Flock Management and Inventory Management and should be designed to extend to other JARI modules.



**## 7.2 Reporting Preferences**



Farmers should be able to configure how frequently they want to update their farm records.



Supported frequencies:



\- Daily.

\- Weekly.



The farmer should be able to configure:



\- Reporting frequency.

\- Preferred reminder time.

\- Preferred notification method, subject to available notification integrations.

\- Relevant farm.

\- Relevant record categories or modules.



Weekly reporting should allow selection of the preferred reminder day.



**## 7.3 Record Freshness Monitoring**



JARI should monitor the last recorded update for relevant sections.



Examples include:



\- Flock population.

\- Mortality.

\- Vaccination activities.

\- Feed consumption.

\- Inventory purchases.

\- Stock usage.

\- Production records, when the Production module is available.



The system should identify sections that have not been updated within the farmer's configured reporting period.



**## 7.4 Reminder Behaviour**



When an update becomes due, JARI should notify the farmer.



Example:



"Your inventory records have not been updated recently. Have you purchased, received, used or transferred any farm supplies?"



The farmer should be able to:



\- Update records.

\- Confirm that no activity occurred.

\- Indicate that information is unavailable.

\- Snooze the reminder.



Confirming no activity must not create fake transactions or activity records.



**## 7.5 Module-Specific Status**



The system should display the update status of individual record categories.



Possible statuses:



\- Up to date.

\- Update due.

\- Overdue.

\- No records available.

\- Update not applicable.



A farmer may have updated Flock Management while leaving Inventory Management unchanged. The system must track these separately.



**## 7.6 Record Freshness Versus Farm Activity Detection**



An important limitation must be respected.



JARI can determine when records were last updated, but it cannot independently know what happened on a physical farm without information supplied by the farmer or connected devices.



Therefore:



\- Record freshness means the last recorded update.

\- It does not prove that all farm activities have been documented.

\- An overdue reminder does not mean an incident occurred.

\- The system must not invent missing farm activities.



**## 7.7 Notification Architecture**



The current implementation should support the reminder preferences, due-status calculations and notification interface using the existing simulated-data architecture.



The future backend should provide reliable scheduled processing and notification delivery.



The frontend must not pretend that a background notification service exists if one has not been integrated.



**---**



**# 8. INTEGRATION BETWEEN FLOCK AND INVENTORY MANAGEMENT**



Although the two submodules are independent, JARI should connect them through shared farm and batch references.



Examples:



**### Feed Issuance**



When feed is issued to a flock batch:



\- Inventory records the stock movement.

\- The flock batch is associated with the consumption record.

\- The relevant inventory balance is updated.

\- Consumption information becomes available for analysis.



**### Vaccination Preparation**



When a vaccination activity is scheduled:



\- JARI identifies the relevant batch.

\- Inventory can be checked for the required product.

\- The system indicates whether the product is recorded as available.

\- The farmer remains responsible for confirming product suitability and actual administration.



**### Consumption Analysis**



JARI can compare recorded feed usage with:



\- Bird population.

\- Bird age.

\- Production type.

\- Production stage.



Any comparison must use appropriate reference data and clearly identify assumptions.



**### Multi-Farm Stock Transfers**



A farmer managing multiple farms should be able to transfer inventory between farms while preserving the stock movement history.



**### Independent Operation**



Missing flock information must not prevent basic inventory operations.



Missing inventory information must not prevent basic flock registration, population tracking or lifecycle management.



**---**



**# 9. PLATFORM-WIDE FUTURE CAPABILITY: JARI INTELLIGENT RECORD CAPTURE**



**## 9.1 Strategic Requirement**



JARI will eventually include a platform-wide intelligent record capture capability.



This feature will allow farmers to photograph or upload handwritten and printed farm records and have JARI extract, interpret and organise the information into the appropriate digital records.



This capability is intended to reduce the burden of manually transferring information from physical farm notebooks into JARI.



It should work across the platform, not exclusively within Flock Management or Inventory Management.



**## 9.2 Expected Future Workflow**



The planned workflow is:



1\. Farmer captures a photograph or uploads a document.

2\. JARI processes the image using OCR and suitable vision or AI technology.

3\. The system extracts relevant text, dates, quantities, tables and other information.

4\. The system identifies the type of information.

5\. Extracted information is classified into the appropriate JARI module.

6\. The farmer reviews and corrects the extracted information.

7\. The farmer confirms the records.

8\. JARI saves the approved records through the appropriate service layer.

9\. The original image and extraction history remain available for traceability.



Potential record destinations include:



\- Flock Management.

\- Inventory Management.

\- Production Tracking.

\- Financial Management.

\- Other relevant modules introduced later.



**## 9.3 Accuracy and Safety Requirements**



The future implementation must:



\- Support printed and handwritten records where technically feasible.

\- Detect unclear or incomplete information.

\- Provide confidence information where supported by the processing technology.

\- Request clarification for uncertain values.

\- Detect potential duplicate records.

\- Validate dates, quantities and units.

\- Request batch or farm selection when the destination is unclear.

\- Preserve the original uploaded document.

\- Record extraction and approval status.

\- Require farmer confirmation before creating official farm records.



The system must never silently save uncertain extracted information.



A photograph of a record must not be treated as independent proof that the recorded activity actually happened.



**## 9.4 Implementation Restriction**



**\*\*THIS FEATURE MUST NOT BE IMPLEMENTED AS PART OF MODULE 2.\*\***



For the current development stage:



\- Do not build the camera capture interface.

\- Do not build the document upload workflow.

\- Do not integrate OCR services.

\- Do not integrate handwriting recognition.

\- Do not implement AI document extraction.

\- Do not implement automatic record classification.

\- Do not create mock AI processing that is presented as a completed feature.

\- Do not add unfinished user-facing controls for this capability.



The requirement must remain documented as a future platform capability.



Its implementation will be handled through a separate development plan when the main backend implementation begins.



The AI coding agent must not begin this work until explicit authorisation is provided.



This restriction applies even if the agent considers it useful to implement the feature while working on another module.



**---**



**# 10. DATA ARCHITECTURE AND SERVICE REQUIREMENTS**



**## 10.1 General Data Requirements**



All records must have:



\- Stable unique identifiers.

\- Farmer or account ownership references.

\- Farm references where applicable.

\- House references for house-level records and batch assignments.
- Relevant batch or inventory references.

\- Creation timestamps.

\- Last-update timestamps.

\- User attribution where applicable.



The architecture must support farmers managing multiple farms.



The relationship between farmers and farms should not assume that every farmer can only have one farm.



Records must be isolated by the appropriate farmer account and farm permissions.



**## 10.2 Farm and House Data Entities**



The simulated data architecture must support a dedicated `farm_houses` entity linked to the existing farm records, plus a `flock_house_assignments` (or equivalent event-ledger) structure for batch-to-house assignment history. Each house must have a stable ID and farm reference. Each batch must reference its current house, and every assignment or movement must retain its effective date, source house where applicable, destination house, responsible user and creation timestamp. Do not duplicate or contradict assignment history across multiple stores.



**## 10.3 Flock Data Entities**



The simulated data architecture should support the following logical entities:



\- \`flock_batches\`

\- \`flock_population_transactions\`

\- \`flock_mortality_records\`

\- \`flock_vaccination_records\`

\- \`flock_scheduled_activities\`

\- \`flock_lifecycle_events\`

\- \`flock_laying_milestones\`

\- \`flock_batch_closures\`



The implementation may consolidate compatible records where appropriate, but it must preserve the logical separation between lifecycle events, population movements, vaccination history and scheduled activities.



Avoid storing the same event independently in multiple places in a way that creates conflicting records.



**## 10.4 Inventory Data Entities**



The simulated data architecture should support:



\- \`inventory_items\`

\- \`inventory_transactions\`

\- \`inventory_categories\`

\- \`inventory_suppliers\`

\- \`inventory_purchases\`

\- \`inventory_storage_locations\`

\- \`inventory_consumption_records\`

\- \`inventory_alerts\`



Stock balances must remain consistent with the transaction history.



**## 10.5 Record Freshness Entities**



The system should support:



\- \`farm_reporting_preferences\`

\- \`record_update_status\`

\- \`farm_update_reminders\`

\- \`notification_history\`



These records must support daily and weekly reporting preferences, module-specific update monitoring and future notification integrations.



**## 10.6 Service Layer**



All data operations must go through the existing service architecture.



The implementation should first inspect and reuse:



\- \`frontend/src/services/index.ts\`

\- \`frontend/src/lib/simulated-data.ts\`



The agent must not introduce a second persistence layer or allow individual UI components to manipulate localStorage directly.



**### House Service Operations**

The service layer should provide equivalent operations for:

- Creating a house under a farm.
- Listing houses for a selected farm.
- Retrieving house details.
- Updating house information and capacity.
- Updating house operational status.
- Retrieving batches assigned to a house.
- Calculating recorded house population and capacity utilisation.
- Assigning a batch to a house.
- Moving a batch between houses while preserving assignment history.
- Retrieving the assignment history of a batch and the batches historically associated with a house.
- Retrieving house-level activity and assignment history.

**### Flock Service Operations**



The service layer should provide equivalent operations for:



\- Creating a flock batch.

\- Listing batches.

\- Retrieving batch details.

\- Updating batch information.

\- Recording population additions.

\- Recording mortality.

\- Recording culling.

\- Recording sales and removals.

\- Recording transfers.

\- Recording vaccinations.

\- Creating scheduled activities.

\- Updating and rescheduling activities.

\- Completing scheduled activities.

\- Recording laying milestones.

\- Closing and archiving batches.

\- Retrieving batch timelines.

\- Calculating population and mortality statistics.

\- Retrieving flock dashboard summaries.

\- Generating supported batch insights.



**### Inventory Service Operations**



The service layer should provide equivalent operations for:



\- Creating inventory items.

\- Listing and retrieving items.

\- Updating item details.

\- Receiving stock.

\- Issuing stock.

\- Recording stock adjustments.

\- Transferring stock.

\- Recording disposal.

\- Recording purchases.

\- Managing suppliers.

\- Managing storage locations.

\- Recording batch-level consumption.

\- Retrieving transaction history.

\- Calculating stock balances.

\- Generating low-stock alerts.

\- Generating expiry alerts.

\- Calculating supported depletion estimates.

\- Retrieving inventory dashboard summaries.

\- Generating supported inventory insights.



**### Record Freshness Service Operations**



The service layer should provide equivalent operations for:



\- Saving reporting preferences.

\- Updating record activity timestamps.

\- Calculating record freshness.

\- Identifying due updates.

\- Creating reminder records.

\- Snoozing reminders.

\- Recording no-activity confirmations.

\- Retrieving reminder history.



**---**



**# 11. USER EXPERIENCE REQUIREMENTS**



Both submodules must follow the existing JARI design system.



The implementation should provide:



\- Responsive desktop and mobile layouts.

\- Clear navigation.

\- Guided registration forms.

\- Search and filtering.

\- Useful empty states.

\- Confirmation dialogs for important transactions.

\- Clear validation messages.

\- Loading and error states.

\- Success feedback.

\- Accessible form controls.

\- Consistent date and quantity formatting.

\- Appropriate charts and visual summaries where useful.



Forms should be broken into manageable steps when they contain many independent fields.



The farmer must be able to navigate from farm to house to batch without mixing records. Farm-level summaries must aggregate their child records, while house and batch views must retain their own detail.



Historical records should remain accessible even when a batch or inventory item is inactive or archived.



**---**



**# 12. FIVE-PHASE DEVELOPMENT PLAN**



The complete implementation of Module 2 must be divided into five testable phases.



No phase should be considered complete merely because its screens have been created.



**## Phase 1: Existing Architecture Audit and Preparation**



Tasks:



1\. Inspect the current frontend structure.

2\. Review the existing service architecture.

3\. Review simulated data and localStorage persistence.

4\. Identify existing flock and inventory functionality.

5\. Identify reusable components and workflows.

6\. Identify existing authentication and account-isolation behaviour.

7\. Confirm multi-farm support in the frontend data model.

8\. Define the required entities and service contracts.

9\. Identify existing functionality that must be preserved.

10\. Document any architectural issues before implementation.



Deliverable:



A confirmed implementation plan that reuses the existing architecture without unnecessary restructuring.



**## Phase 2: House and Flock Management Implementation**

Tasks:

1\. Implement house registration and house management.
2\. Implement house details, status and capacity monitoring.
3\. Implement batch assignment to houses and preserve house-assignment history.
4\. Implement the flock dashboard with farm-level aggregation and house filtering.
5\. Implement batch registration and batch details.
6\. Implement population tracking.
7\. Implement mortality records and calculations.
8\. Implement vaccination history.
9\. Implement scheduled flock activities and reminders.
10\. Implement laying milestones.
11\. Implement sales, removals, transfers and batch closure.
12\. Implement chronological lifecycle timelines.
13\. Implement batch-specific insights using supported rules and available data.

Deliverable:

A fully functional House and Flock Management capability using persistent simulated data, with the Farm → Houses → Batches hierarchy and farm-level aggregation.

**## Phase 3: Inventory Management Implementation**



Tasks:



1\. Implement the inventory dashboard.

2\. Implement inventory item registration.

3\. Implement categories and measurement units.

4\. Implement stock transactions.

5\. Implement feed and resource consumption records.

6\. Implement supplier management.

7\. Implement purchase records.

8\. Implement stock transfers.

9\. Implement low-stock alerts.

10\. Implement expiry tracking.

11\. Implement inventory history.

12\. Implement stock depletion estimates where sufficient data exists.



Deliverable:



A fully functional Inventory Management submodule using persistent simulated data.



**## Phase 4: Integration and Farm Record Freshness**



Tasks:



1\. Connect relevant flock and inventory information.

2\. Implement batch-level feed issuance.

3\. Implement inventory availability checks for scheduled flock activities.

4\. Implement daily and weekly reporting preferences.

5\. Implement module-specific record freshness monitoring.

6\. Implement overdue update reminders.

7\. Implement no-activity confirmations.

8\. Implement reminder management.

9\. Refine dashboard insights.

10\. Validate multi-farm interactions and account isolation.



Deliverable:



Integrated Flock and Inventory Management with functional record freshness monitoring.



**## Phase 5: Testing, Refinement and Documentation**



Tasks:



1\. Test all flock registration workflows.

2\. Test population transactions and mortality calculations.

3\. Test vaccination and scheduled activities.

4\. Test laying milestones and batch closure.

5\. Test inventory registration and stock movements.

6\. Test feed consumption and batch associations.

7\. Test expiry and low-stock alerts.

8\. Test purchase and supplier workflows.

9\. Test stock transfers.

10\. Test record freshness reminders.

11\. Test account and farm isolation.

12\. Test persistence after page refresh and re-login.

13\. Test empty states and invalid inputs.

14\. Test mobile and desktop responsiveness.

15\. Resolve identified defects.

16\. Update technical documentation and \`progress.md\`.



Deliverable:



A tested and documented Module 2 ready for future backend integration.



**---**



**# 13. ACCEPTANCE CRITERIA**



Module 2 is complete only when the following conditions are satisfied.



**## House Management**

- Farmers can create multiple houses under each farm.
- Every house is associated with exactly one farm.
- Farmers can view, update and manage each house.
- House capacity and recorded population are displayed separately.
- House population is calculated from the current populations of its assigned batches.
- New batches require assignment to a house belonging to the selected farm.
- Farm dashboards aggregate records across houses and batches.
- Farmers can filter by house and inspect the batches assigned to it.
- Moving a batch between houses preserves assignment history and does not alter bird population.
- Capacity warnings and any confirmed override are handled transparently.
- Houses with historical records cannot be silently or permanently deleted.

**## Flock Management**



\- Farmers can register multiple flock batches.

\- Each batch is associated with the correct farm.

\- Farmers can track age using supported age information.

\- Farmers can record population changes.

\- Mortality rates are calculated correctly.

\- Vaccination history can be recorded.

\- Farmers can schedule and manage flock activities.

\- Upcoming and overdue activities are identified correctly.

\- Layer batches support laying milestones.

\- Sales, removals and transfers update population correctly.

\- Closed batches retain their historical records.

\- Every batch has a chronological activity history.

\- Insights use actual recorded information and clearly communicate uncertainty.



**## Inventory Management**



\- Farmers can register inventory items.

\- Inventory categories and measurement units work correctly.

\- Stock transactions update balances accurately.

\- Negative stock is prevented.

\- Feed can be issued to individual flock batches.

\- Stock balances remain consistent with transaction history.

\- Low-stock and out-of-stock conditions are detected.

\- Expiry alerts work correctly.

\- Expired stock is clearly identified.

\- Suppliers and purchases can be recorded.

\- Stock transfers maintain consistent balances.

\- Consumption and depletion insights use available records.



**## Record Freshness**



\- Farmers can configure daily or weekly reporting.

\- Reminder preferences persist.

\- Update status is tracked by module.

\- Overdue records are identified correctly.

\- Farmers can confirm no activity occurred.

\- Snoozing and completing reminders work correctly.

\- The system does not invent missing farm activities.

\- Reminder workflows are clearly distinguished from future background notification delivery.



**## Architecture and Persistence**



\- Existing branding is preserved.

\- Existing authentication workflows are not broken.

\- All implemented records persist using the existing simulated-data architecture.

\- Farmer accounts remain isolated.

\- Multiple farms are supported.

\- UI components do not manipulate localStorage directly.

\- No competing persistence system is introduced.

\- No backend implementation is added.

\- No intelligent record capture functionality is implemented.



**## Future Record Capture Restriction**



The intelligent record capture capability must remain documented only.



No camera interface, document upload, OCR integration, handwriting recognition, AI extraction or automatic record classification should be implemented until a separate plan is approved.



**---**



**# 14. SCOPE EXCLUSIONS**



The following capabilities are outside the implementation scope of Module 2:



1\. Backend API development.

2\. Database migrations or backend schema changes.

3\. Live SMS, email or push notification integrations.

4\. Actual background notification scheduling.

5\. Intelligent photograph and document capture.

6\. OCR and handwriting recognition.

7\. AI document extraction and automatic record classification.

8\. Full veterinary diagnosis and treatment management.

9\. Detailed egg production analytics.

10\. Bird weight and growth analytics.

11\. Feed conversion ratio and advanced performance analytics.

12\. Full financial accounting and profit/loss reporting.

13\. Payment processing.

14\. Insurance and lending workflows.

15\. Institutional dashboards.



Some of these features may be introduced in later JARI modules.



**---**



**# 15. IMPLEMENTATION RULES FOR THE AI DEVELOPMENT AGENT**

The development agent must follow these instructions throughout Module 2 implementation.

1\. Read and understand the existing codebase and all relevant documents in `docs/development-plan/` before making changes.
2\. Confirm and preserve the Farm → Houses → Batches hierarchy. Do not create a batch without a valid house assignment.
3\. Complete the mandatory documentation and architecture synchronisation before implementation.
4\. Follow the five development phases in the order provided.
5\. Do not skip a phase without documenting the reason.
6\. Maintain `progress.md` as the authoritative development progress record.
7\. Update `progress.md` after completing meaningful tasks and before moving to the next phase.
8\. Record completed tasks, pending tasks, discovered issues and test results.
9\. Do not claim that a feature works unless it has been tested.
10\. Reuse existing services, components and design patterns wherever appropriate.
11\. Do not introduce unnecessary dependencies.
12\. Do not change the existing branding.
13\. Do not implement the backend.
14\. Do not create duplicate persistence systems.
15\. Do not use fabricated records to make dashboards appear complete.
16\. Do not silently discard historical records, including batch-to-house assignment history.
17\. Do not implement the future intelligent record capture capability.
18\. Do not implement future production, expanded health or biosecurity modules as part of Module 2 beyond the explicitly defined current scope and extension points.
19\. Do not start another JARI module until Module 2 has met its acceptance criteria and has been reviewed.

If an existing architectural limitation prevents a requirement from being implemented correctly, document the limitation and propose a solution before making major structural changes.

**---

****# 16. FINAL DELIVERABLE**



At the completion of Module 2, JARI must provide:



**\*\*A. House and Flock Management\*\***

\- House registration and management under each farm.

\- House details, capacity and occupancy summaries.

\- Required batch-to-house assignment and assignment history.

\- Independent flock dashboard with farm aggregation and house filtering.

\- Batch registration and management.

\- Complete lifecycle tracking.

\- Mortality and vaccination records.

\- Activity scheduling and reminders.

\- Laying milestones.

\- Sales, transfers and closure.

\- Batch-specific insights and history.



**\*\*B. Inventory Management\*\***

\- Independent inventory dashboard.

\- Item and category management.

\- Stock transaction management.

\- Feed and resource consumption tracking.

\- Supplier and purchase records.

\- Low-stock and expiry alerts.

\- Stock transfers.

\- Inventory insights and forecasting.



**\*\*C. Shared Platform Capabilities\*\***

\- Daily and weekly farm record-update preferences.

\- Module-specific record freshness monitoring.

\- Overdue reminders.

\- No-activity confirmations.

\- Flock and inventory data integration.



**\*\*D. Future Capability Documentation\*\***

\- JARI Intelligent Record Capture documented as a planned platform-wide capability.

\- Separate implementation plan deferred until the main backend development stage.

\- No implementation without explicit approval.



**\*\*E. Technical Deliverables\*\***

\- Updated \`progress.md\`.

\- Updated technical documentation.

\- Tested simulated-data workflows.

\- Backend-ready service contracts and data structures.

\- No backend modifications.



**---**



**# 17. DEFINITION OF DONE**



Module 2 will be considered successfully completed when a farmer can independently manage flock batches and farm inventory, maintain records throughout the lifecycle of the birds, receive relevant management reminders, track stock consumption and availability, and access useful insights based on actual recorded farm information.



The two submodules must work independently while sharing relevant information when both are in use.



All workflows must persist correctly using the existing simulated-data architecture and remain structured for future backend integration.



The intelligent record capture capability must remain documented but unimplemented until explicitly authorised.



**\*\*End of Module 2 Specification.\*\***