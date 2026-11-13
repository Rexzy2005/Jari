**# JARI MODULE 1: FARMER ONBOARDING AND FARM REGISTRATION**

**\*\*Complete Development Plan | Frontend and Mock Data Implementation\*\***



**## 1. Module Overview**



The purpose of Module 1 is to enable a poultry farmer to create a JARI account, complete their basic farmer profile, register their primary poultry farm and gain access to a fully initialized farmer dashboard. The flow needs to be very seemless and clean and very user friendly



**\*\*Development scope:\*\*** Frontend implementation using mock data persisted in \`localStorage\`. No backend endpoints, database migrations or backend logic should be implemented at this stage.



However, the frontend architecture, service methods, data structures and validation rules must be designed to reflect a clean, consistent backend-ready contract. When the backend is introduced, the mock data adapter should be replaceable without rebuilding the user interface or rewriting the business workflows.



**\*\*Module completion flow:\*\***



Account Creation → Contact Verification → Incomplete Dashboard → Farmer Profile → Farm Registration → Review and Submission → Dashboard Activation.



**## 2. Core Development Principles**



\- Reuse the existing JARI branding, components, authentication flow and service architecture.

\- Inspect and understand existing implementations before changing or creating files.

\- Extend the existing \`services/index.ts\` and \`simulated-data.ts\` architecture. Do not introduce a competing persistence system.

\- Keep account creation separate from profile completion and farm registration.

\- Collect only information with a clear purpose in JARI.

\- Save progress so farmers can leave and resume onboarding.

\- Support broiler, layer and mixed poultry operations.

\- Design the data model to support multiple farms belonging to one farmer, even though onboarding initially registers one primary farm.

\- Never fabricate farm, production, inventory or risk data.

\- Every visible button, action, form and navigation item must work.

\- Use reusable components and maintain consistent validation, error handling and loading states.

\- Do not make backend changes during this module.



**## 2A. Mandatory Pre-Implementation: Project-Wide Documentation and Architecture Synchronisation**

This task is a mandatory gate before any Module 1 implementation begins. The purpose is to ensure that the existing codebase, project documentation and all development plans describe the same JARI product architecture.

**The agent must complete this synchronisation before writing, modifying or deleting application code for Module 1.**

**A. Read the complete development-plan folder**

1. Inspect and read all relevant files in `docs/development-plan/`, including the Module 1 and Module 2 plans and any other module plans already present.
2. Treat these documents as the primary source for the agreed product scope and development sequence. Do not assume that separate module documents describe separate or disconnected products.
3. Identify overlapping responsibilities, dependencies and any contradictions between the module plans.
4. Do not silently discard, rewrite or override an existing product decision. Record any genuine ambiguity for review.

**B. Inspect the actual codebase**

Review the existing project structure and the relevant implementation, including:

- `README.md` and existing project documentation.
- `progress.md`, if present.
- Existing architecture and data-model documentation, if present.
- Frontend routes, navigation, dashboards and reusable components.
- Existing service and simulated-data layers, especially `frontend/src/services/index.ts` and `frontend/src/lib/simulated-data.ts`, where those paths exist.
- Existing farm, flock, inventory and related data structures.
- Existing tests and documented implementation status.

The agent must distinguish between features that are documented, features that are implemented, and features that have been tested. Do not describe a planned feature as already implemented.

**C. Synchronise the agreed JARI product architecture**

The documentation must reflect the following product-wide structure:

1. **Farm hierarchy:** A farm can contain multiple houses, and each house can contain multiple flock batches. The relationship is Farm → Houses → Batches.
2. **Farm level:** Farm identity, ownership, location and farm-wide information belong to the farm.
3. **House level:** House identity, capacity, infrastructure and house-level biosecurity records belong to the relevant house.
4. **Batch level:** Each batch belongs to a farm and a house. Its population, mortality, vaccination, health history, production and performance records must be attributable to that batch where applicable.
5. **Farm-level aggregation:** Farm dashboards and farm-wide summaries must aggregate the underlying house and batch records without losing the ability to inspect each individual house or batch.
6. **Connected operational capabilities:** Production and performance, flock health and related operational capabilities extend the existing farm, house, batch and inventory workflows. They may be delivered through separate development modules, but they must use connected records and shared relationships rather than create disconnected systems.
7. **Independent farmer-facing capabilities:** Farm Documentation and Records, Risk Intelligence and Advisory, and Financial Readiness and Opportunities remain distinct modules. They use relevant information from across the farm but should not be embedded as sub-pages or data stores of Flock Management.
8. **Institutional platform:** Institution onboarding and institutional dashboards follow the farmer-side foundation and consume the appropriate farmer, farm, documentation, risk and financial-readiness information.

**D. Preserve Module 1's implementation boundary**

The architecture must be prepared for the Farm → Houses → Batches relationship, but this does not expand Module 1 into House Management or Flock Management.

For Module 1:

- Register the farm and collect the optional number of poultry houses as already specified.
- Keep the farm data contract compatible with adding multiple house records later.
- Do not create house or batch management workflows, house records, flock records or production records in this module.
- Do not move work assigned to Module 2 or later modules into Module 1.
- Implement only the farmer account, farmer profile, primary farm registration and dashboard activation scope defined in this document.

**E. Update the required project documentation**

After reviewing the repository, update the relevant existing documentation so that it is consistent with the development plans and the architecture above. This should include, where those files exist and are relevant:

- `progress.md`: current status, completed work, outstanding work, module sequence and the documentation synchronisation result.
- `README.md`: the current JARI purpose, product structure and how the development-plan documents are organised, if the README contains project or product information.
- Architecture documentation: the Farm → Houses → Batches hierarchy, record ownership, aggregation rules and relationships between connected and independent modules.
- Data-model documentation: the intended entities and relationships, clearly distinguishing current implementation from planned future structures.
- Module development plans: resolve only genuine inconsistencies and keep their scope, dependencies and sequence aligned.

Use existing canonical documents where possible. Do not create duplicate roadmaps or competing architecture documents. If a required document does not exist, decide whether it is genuinely necessary before creating it and record that decision.

**F. Report and verify synchronisation before coding**

Before starting Module 1 implementation, provide a concise synchronisation summary containing:

- Documents inspected and updated.
- The agreed architecture and module dependencies reflected in the documents.
- Existing code that already supports the architecture.
- Gaps or conflicts between the current code and the agreed architecture.
- Any decisions that require the project owner's approval.
- Confirmation that Module 1's scope has not been expanded.

Update `progress.md` with this result. If a significant product or architecture conflict cannot be resolved from the approved development plans, stop and ask for clarification rather than guessing.

**Completion gate:** Module 1 implementation may begin only after this documentation and architecture synchronisation is complete, the relevant documents agree, and the synchronisation summary has been recorded. This gate does not authorise backend implementation or implementation of later modules.

**## 3. Stage One: Farmer Account Creation**



Keep registration short. Collect only:



\| Field | Requirement |

\|---|---|

\| First name | Required |

\| Last name | Required |

\| Email address | Required |

\| Phone number | Required |

\| Password | Required |

\| Confirm password | Required |

\| Privacy policy acceptance | Required |



Implement field validation, password confirmation, clear error messages, duplicate-account handling within the mock environment and successful registration feedback.



Contact verification should follow the verification mechanism already supported by the existing application. Do not simulate a real email or SMS delivery if no provider exists. Use a clearly identified demo verification flow where necessary.



After account creation, preserve the authenticated session and direct the farmer to their dashboard.



**## 4. Stage Two: Incomplete Dashboard**



A newly registered farmer should be able to enter the dashboard without completing their profile or registering a farm.



However, the dashboard must display an onboarding completion screen instead of normal operational metrics.



Show:

\- A welcome message.

\- A clear explanation that setup is required.

\- A progress indicator.

\- Farmer profile setup status.

\- Farm registration status.

\- A prominent Continue Setup action.



The farmer must not see fabricated inventory, flock, production, financial or risk figures.



If the farmer leaves before completing onboarding, their progress must be saved. On their next login, take them back to the appropriate unfinished step.



**## 5. Stage Three: Farmer Profile Setup**



Collect only the following information:



\| Field | Requirement | Purpose |

\|---|---|---|

\| State | Required | Geographic classification |

\| LGA | Required | Localized risk and advisory context |

\| Community or town | Required | Identifies the farmer's operating area |

\| Profile picture | Optional | Account personalization |



First name, last name, email and phone number should come from account registration. Do not ask the farmer to enter them again.



Do not collect date of birth, gender, educational background, years of experience or residential address during this module.



**## 6. Stage Four: Primary Farm Registration**



Farm registration is a core part of onboarding. Organize it into four manageable sections.



**### A. Farm Identity**



\| Field | Requirement |

\|---|---|

\| Farm name | Required |

\| Ownership type | Required |

\| Business registration status | Required |

\| CAC registration number | Conditional |

\| Year farming started | Required |



Ownership options:

\- Personally owned.

\- Family owned.

\- Leased or rented.

\- Managed on behalf of another person.

\- Other.



Registration status should distinguish registered and unregistered businesses. Only request a CAC number when applicable. Do not prevent unregistered farms from joining JARI.



**### B. Farm Location and GPS**



\| Field | Requirement |

\|---|---|

\| State | Required |

\| LGA | Required |

\| Community or town | Required |

\| Physical address or location description | Required |

\| GPS coordinates | Requested through location permission; manual alternative available |



**\*\*Location permission implementation:\*\***



Provide a clearly visible **\*\*Use My Current Location\*\*** action within the farm location section.



When the farmer selects it:

1\. Explain briefly that JARI wants to use the device's location to identify the farm's geographic position.

2\. Request browser/device location permission through the Geolocation API.

3\. Retrieve latitude, longitude, accuracy and capture timestamp.

4\. Display the retrieved location to the farmer for confirmation.

5\. Allow the farmer to retry or manually enter the location if permission is denied, unavailable or inaccurate.

6\. Save the location and its capture metadata with the farm record.



Important requirements:

\- Never request location automatically when a page loads.

\- Request permission only after the farmer initiates the action.

\- Do not confuse the farmer's current device location with the farm's actual location. Ask the farmer to confirm that the returned coordinates identify the farm.

\- If the farmer is not physically at the farm, allow manual location entry or defer GPS capture.

\- Location permission must not prevent onboarding when unavailable. Manual location details must remain available.

\- Do not collect or store continuous location tracking.

\- Store whether coordinates were captured through GPS or entered manually.

\- Handle permission denial, timeout, unavailable location and poor accuracy gracefully.

\- Do not claim reverse geocoding is available unless an actual geocoding provider has been integrated.



The farmer's personal location and the farm's location must remain separate records.



**### C. Poultry Operation**



\| Field | Requirement |

\|---|---|

\| Production type | Required |

\| Farming system | Required |

\| Operating status | Required |

\| Total bird capacity | Required |

\| Current number of birds | Required |

\| Number of poultry houses | Optional |



Production type:

\- Broilers.

\- Layers.

\- Both broilers and layers.



Farming system:

\- Deep litter.

\- Battery cage.

\- Free range.

\- Semi-intensive.

\- Other.



Operating status:

\- Currently operating.

\- Temporarily inactive.

\- Preparing to start operations.



Capacity and current bird count must be separate fields. Validate that values are non-negative and that current bird count does not exceed declared capacity without an explicit explanation or correction.



For a farm preparing to start, allow current bird count to be zero. Make conditional validation reflect the operating status.



**### D. Basic Infrastructure**



\| Field | Requirement |

\|---|---|

\| Water source | Required |

\| Electricity source | Optional |

\| Waste disposal method | Optional |



Water source options should include borehole, well, public water supply, stream or river, and other.



Do not turn this section into a full infrastructure inspection. Detailed biosecurity, ventilation, housing and operational risk assessments belong in later modules.



**## 7. Stage Five: Review and Submission**



Before completing registration, show a review screen containing:



\- Farmer profile.

\- Farm identity.

\- Farm location and GPS status.

\- Poultry production type.

\- Farm capacity and current bird count.

\- Infrastructure details.



Allow the farmer to return to any section and edit information.



On submission:

1\. Validate all required information.

2\. Save the farmer profile.

3\. Create the primary farm record.

4\. Associate the farm with the authenticated farmer.

5\. Mark the farm as the farmer's primary farm.

6\. Update the onboarding completion status.

7\. Display a clear success message.

8\. Redirect the farmer to the fully activated dashboard.



The submission must be handled as one logical operation. If saving fails, do not mark onboarding complete or leave partially created, inconsistent records.



**## 8. Dashboard Activation**



After successful onboarding, the farmer should access the normal JARI dashboard.



The dashboard must reflect actual persisted mock data. It should show the registered farm information and genuine empty states for modules that have not yet been configured.



For example:

\- Farm registered.

\- Inventory not configured.

\- No flock records.

\- No production records.

\- No financial records.

\- Risk profile awaiting sufficient farm data.



Provide a clear next action directing the farmer to **\*\*Inventory Setup\*\***, which will be handled in the next module.



Do not generate risk scores, production statistics or financial insights using information that has not been collected.



**## 9. Data Architecture and Mock Persistence**



Implement the mock data through the existing service and simulation layers.



Use a backend-ready structure that separates the following logical records:



\- **\*\*User:\*\*** Account identity and authentication-related metadata.

\- **\*\*Farmer profile:\*\*** Farmer-specific profile and location details.

\- **\*\*Farm:\*\*** Farm identity, ownership, registration status and operational details.

\- **\*\*Farm location:\*\*** Physical location, administrative location and GPS metadata.

\- **\*\*Farm infrastructure:\*\*** Basic infrastructure information.

\- **\*\*User-farm relationship:\*\*** Associates a farmer with one or more farms and identifies the primary farm.

\- **\*\*Onboarding state:\*\*** Tracks the farmer's progress and completion status.



Each record should have a stable unique ID, creation timestamp and update timestamp where applicable. Related records must reference each other through IDs, not duplicated objects with inconsistent values.



The mock implementation must support:

\- Creating and updating records.

\- Retrieving the authenticated farmer's profile.

\- Retrieving all farms associated with a farmer.

\- Identifying the primary farm.

\- Saving and resuming onboarding progress.

\- Editing farm and profile details.

\- Handling missing, invalid or corrupted localStorage data.

\- Preventing one demo account from accessing another account's records.

\- Preserving data across page refreshes and browser restarts.



Use account-scoped persistence and safe migration of existing demo records. Do not clear all farmers' data when one farmer logs out.



Do not persist actual passwords in localStorage. Keep authentication simulation clearly separated from production authentication and never treat the mock environment as secure storage.



**## 10. Service Layer Requirements**



All onboarding operations must pass through the existing service layer. The UI should not directly manipulate localStorage.



Implement or extend methods equivalent to:



\- \`registerFarmerAccount()\`

\- \`getCurrentFarmer()\`

\- \`getFarmerProfile()\`

\- \`saveFarmerProfile()\`

\- \`getFarmerFarms()\`

\- \`registerFarm()\`

\- \`updateFarm()\`

\- \`getPrimaryFarm()\`

\- \`getOnboardingStatus()\`

\- \`saveOnboardingProgress()\`

\- \`completeFarmerOnboarding()\`



Use the existing naming conventions where they differ.



Return consistent success and error results. Validate data before persistence and handle loading, empty, validation, permission and storage-error states.



Keep components independent of the mock storage implementation so a future backend adapter can implement the same service contracts.



**## 11. User Experience and Validation**



The onboarding experience must be simple, mobile-friendly and easy for farmers who may not be technically experienced.



Requirements:

\- Use guided steps rather than one long scrolling form.

\- Show clear progress and step names.

\- Include Back, Continue and Save/Resume actions where appropriate.

\- Use conditional fields to avoid irrelevant questions.

\- Clearly distinguish required and optional information.

\- Display field-level validation messages.

\- Preserve entered values when navigating between steps.

\- Prevent accidental duplicate submissions.

\- Show useful success and failure feedback.

\- Make location permission understandable and user-initiated.

\- Ensure forms work on mobile and desktop.

\- Support keyboard navigation and accessible labels.



**## 12. Implementation Phases**



Complete this module in five testable phases. Update \`progress.md\` throughout development.



**\*\*Phase 1: Existing Codebase Audit and Onboarding Architecture\*\***

\- Inspect existing registration, login, authentication, dashboard, farmer profile, farm registration and service implementations.

\- Identify reusable components and existing data structures.

\- Map current code to the agreed onboarding workflow.

\- Define data contracts, onboarding states and service methods.

\- Document required changes before implementation.



**\*\*Phase 2: Account Creation and Incomplete Dashboard\*\***

\- Implement or refine farmer account creation.

\- Preserve the existing authentication experience.

\- Implement incomplete onboarding state.

\- Build the setup dashboard and resume flow.

\- Test account isolation and persistence.



**\*\*Phase 3: Farmer Profile and Farm Registration\*\***

\- Implement the farmer profile form.

\- Implement farm identity, location, poultry operation and infrastructure sections.

\- Integrate user-initiated GPS location retrieval.

\- Implement manual location fallback.

\- Add validation, conditional fields and save/resume functionality.



**\*\*Phase 4: Review, Submission and Dashboard Activation\*\***

\- Implement the review screen.

\- Save and associate all farmer and farm records.

\- Implement reliable onboarding completion.

\- Activate the normal farmer dashboard.

\- Display accurate empty states and the next inventory setup action.



**\*\*Phase 5: Testing, Refinement and Documentation\*\***

\- Test the entire journey from account creation to dashboard activation.

\- Test interrupted onboarding and resumed sessions.

\- Test GPS success, denial, timeout and manual fallback.

\- Test different poultry production types and farm operating statuses.

\- Test validation, duplicate submissions, storage failures and account isolation.

\- Test mobile and desktop layouts.

\- Run available TypeScript checks, linting and production build.

\- Resolve issues introduced by this module.

\- Update \`progress.md\` and module documentation with completed work, outstanding issues and test results.



**## 13. Acceptance Criteria**



Module 1 is complete only when:



1\. A farmer can create an account using the essential registration fields.

2\. A farmer can enter the dashboard before completing onboarding.

3\. An incomplete farmer sees the setup experience rather than fabricated dashboard metrics.

4\. A farmer can complete and save their profile.

5\. A farmer can register a primary poultry farm.

6\. Broiler, layer and mixed production types are supported.

7\. Farm location can be retrieved through explicit device permission.

8\. Manual location entry works when GPS is unavailable or denied.

9\. The farmer can review and edit information before submission.

10\. Progress survives refreshes, logout and subsequent login.

11\. Farmer and farm records are correctly associated.

12\. Multiple farms can be supported by the mock data model.

13\. Successful submission activates the dashboard.

14\. The dashboard reflects actual saved records and honest empty states.

15\. Existing JARI functionality and branding remain intact.

16\. All module workflows pass their relevant tests.



**## 14. Scope Restrictions**



Do not implement inventory management, flock management, production tracking, feed management, veterinary records, financial management, documentation management, risk assessment, insurance matching or institutional workflows in this module.



Do not implement backend endpoints, database schemas, migrations or backend authentication changes.



Do not introduce new paid services or external integrations for GPS or geocoding. Use the browser/device Geolocation API for coordinate retrieval and provide manual fallback.



Do not redesign the entire application or replace working components without a clear reason.



**\*\*Final deliverable:\*\*** A fully working farmer onboarding and primary farm registration experience, implemented entirely through the existing frontend architecture and mock persistence, with backend-ready data contracts and a functional dashboard activation flow. The next development module is Module 2: Flock and Inventory Management. Later modules extend the same connected farm structure and must follow the agreed development plans in `docs/development-plan/`.