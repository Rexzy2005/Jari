export type SavedFarmProfile = {
    farmName: string;
    ownerName: string;
    phone: string;
    community: string;
    lga: string;
    state: string;
    establishmentDate: string;
    operationType: string;
    productionSystem: string;
    numberOfHouses: string;
    waterSource: string;
    numberOfWorkers: string;
    biosecurity: string[];
};

export type KycApplication = {
    farmName: string;
    location: string;
    phone: string;
    status: "pending" | "approved" | "needs_changes";
    submittedAt: string;
    reviewedAt?: string;
    reviewNote?: string;
};

export type FarmAssetRecord = {
    name: string;
    quantity: number;
    status: "Working" | "Needs repair";
    value: number;
    notes?: string;
};

export type FeedPurchaseRecord = {
    id: string;
    date: string;
    feedType: string;
    brand: string;
    supplier: string;
    quantity: number;
    unit: "bags" | "kg";
    bagWeightKg: number;
    amount: number;
    amountPaid: number;
    flock?: string;
    userId?: string;
    farmId?: string;
    flockId?: string;
    createdAt?: string;
    inventoryTransactionId?: string;
};

export type FeedUseRecord = {
    id: string;
    date: string;
    feedType: string;
    quantityKg: number;
    flock: string;
    notes?: string;
    userId?: string;
    farmId?: string;
    flockId?: string;
    createdAt?: string;
    inventoryTransactionId?: string;
};

export type ProductionRecord = {
    id: string;
    date: string;
    flock: string;
    type: string;
    liveBirds: number;
    eggsCollected: number;
    goodEggs: number;
    damagedEggs: number;
    birdsWeighed: number;
    averageWeight: number;
    birdsReady: number;
    notes?: string;
};

export type FarmHouseRecord = {
    id?: string;
    userId?: string;
    farmId?: string;
    name: string;
    reference?: string;
    purpose?: "Broiler" | "Layer" | "Mixed" | "Other";
    system: string;
    capacity: number;
    water: string;
    feedStorage: boolean;
    ventilation?: string;
    condition?: string;
    notes?: string;
    archived?: boolean;
    status?: "Active" | "Temporarily inactive" | "Under maintenance" | "Closed" | "Archived";
    dimensions?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type FarmerFarmRecord = {
    id: string;
    userId: string;
    name: string;
    location?: string;
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
};

export type FlockRecord = {
    id?: string;
    userId?: string;
    farmId?: string;
    houseId?: string;
    reference?: string;
    name: string;
    type: string;
    house: string;
    birds: number;
    initialBirds?: number;
    status: "Active" | "Completed" | "Closed" | "Archived";
    category?: string;
    breed?: string;
    hatchDate?: string;
    acquisitionDate?: string;
    cycleStart?: string;
    source?: string;
    supplier?: string;
    acquisitionMethod?: string;
    ageAtAcquisition?: number;
    ageUnit?: string;
    purchaseCost?: number;
    productionStatus?: "Not laying" | "Laying" | "Partially stopped" | "Stopped" | "Not applicable";
    sourceFlockId?: string;
    transferReference?: string;
    createdAt?: string;
    updatedAt?: string;
};
export type FlockClosureRecord = { id: string; userId: string; farmId: string; flockId: string; date: string; finalPopulation: number; reason: string; notes?: string; createdAt: string };
export type FlockLifecycleRecord = { id: string; userId: string; farmId: string; flockId: string; date: string; event: string; details?: string; createdAt: string };

export type FarmFlockMovement = {
    id: string;
    flock: string;
    flockId?: string;
    house?: string;
    date: string;
    type: "Initial stocking" | "Bird acquisition" | "Additional stocking" | "Mortality" | "Culling" | "Sale" | "Transfer in" | "Transfer out" | "Adjustment" | "Closure";
    quantity: number;
    reason: string;
    notes?: string;
    userId?: string;
    farmId?: string;
    responsibleUser?: string;
    createdAt?: string;
    adjustmentDirection?: "Increase" | "Decrease";
    referenceId?: string;
    reversesMovementId?: string;
};

export type FlockHouseAssignment = {
    id: string;
    userId: string;
    farmId: string;
    flockId: string;
    fromHouseId: string | null;
    toHouseId: string;
    effectiveDate: string;
    reason?: string;
    createdAt: string;
};
export type InventoryItemRecord = {
    id: string;
    userId: string;
    farmId: string;
    name: string;
    category: string;
    description?: string;
    feedType?: string;
    brand?: string;
    itemType: "Consumable" | "Equipment";
    unit: string;
    initialQuantity: number;
    minimumStock?: number;
    supplier?: string;
    supplierId?: string;
    purchaseDate?: string;
    purchaseCost?: number;
    lotNumber?: string;
    expiryDate?: string;
    storageLocation?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};
export type InventoryTransactionRecord = {
    id: string;
    userId: string;
    farmId: string;
    itemId: string;
    type: "Stock received" | "Stock issued" | "Adjustment" | "Transfer in" | "Transfer out" | "Disposal";
    quantity: number;
    unit: string;
    date: string;
    reason: string;
    flockId?: string;
    notes?: string;
    createdAt: string;
    referenceId?: string;
    relatedFarmId?: string;
    relatedStorageLocation?: string;
    supplier?: string;
    supplierId?: string;
    purchaseId?: string;
    unitCost?: number;
    purchaseCost?: number;
    amountPaid?: number;
    feedType?: string;
    brand?: string;
    bagWeightKg?: number;
    adjustmentDirection?: "Increase" | "Decrease";
};
export type InventorySupplierRecord = { id: string; userId: string; farmId: string; name: string; contactName?: string; phone?: string; email?: string; address?: string; products?: string[]; notes?: string; active: boolean; createdAt: string; updatedAt: string };
export type InventoryPurchaseRecord = { id: string; userId: string; farmId: string; supplierId?: string; supplierName?: string; itemId: string; itemName: string; quantity: number; unit: string; unitCost?: number; totalCost?: number; amountPaid?: number; date: string; paymentStatus: "Unpaid" | "Part paid" | "Paid"; inventoryTransactionId: string; notes?: string; createdAt: string };
export type FarmReportingPreference = { id: string; userId: string; farmId: string; frequency: "Daily" | "Weekly"; reminderTime: string; reminderDay: number; modules: Array<"Flock" | "Inventory">; updatedAt: string };
export type FarmUpdateReminder = { id: string; userId: string; farmId: string; module: "Flock" | "Inventory"; periodKey: string; dueAt: string; status: "Open" | "Snoozed" | "Completed" | "No activity" | "Information unavailable"; snoozedUntil?: string; note?: string; createdAt: string; updatedAt: string };
export type FinancialPaymentRecord = { id: string; date: string; amount: number; note?: string };

export type SalesEntry = { id?: string; date: string; item?: string; product?: string; amount: number | string; amountReceived?: number; payments?: FinancialPaymentRecord[]; quantity?: number; unit?: string; flock?: string; flockId?: string; farmId?: string; status?: string; outstanding?: number };
export type ExpenseEntry = { id?: string; date: string; category: string; amount: number | string; amountPaid?: number; payments?: FinancialPaymentRecord[]; outstanding?: number; flock?: string; note?: string };
export type OpportunityRequirementCheck = { met: string[]; missing: string[]; readiness: number };
export type OpportunityApplicationRecord = { id: string; opportunityId: string; opportunityName: string; type: string; status: "Interested" | "Preparing" | "Submitted" | "Reviewed" | "Needs information"; note: string; createdAt: string; farmerName?: string; farmName?: string; birdCount?: number; houseCount?: number; profileScore?: number; requirementCheck?: OpportunityRequirementCheck };
export type InstitutionRequestRecord = { id: string; institutionName: string; purpose: string; message: string; status: "Open" | "Acknowledged" | "Closed"; createdAt: string };
export type InstitutionCategory = "Lending Institution" | "Insurance Provider" | "Grant Provider";
export type InstitutionVerificationDocument = { id: string; name: string; type: string; size: number; dataUrl: string; category: string };
export type InstitutionRegistrationRecord = {
    id: string;
    userId: string;
    organisationName: string;
    organisationType: string;
    cacRegistrationNumber: string;
    yearEstablished: string;
    officialEmail: string;
    officialPhone: string;
    website: string;
    officeAddress: string;
    state: string;
    lga: string;
    logo?: string;
    categories: InstitutionCategory[];
    services: Partial<Record<InstitutionCategory, Record<string, string>>>;
    representative: { fullName: string; jobTitle: string; email: string; phone: string };
    documents: InstitutionVerificationDocument[];
    status: "Pending Verification";
    submittedAt: string;
};
export type UserPreferences = { productionReminders: boolean; healthReminders: boolean; financialUpdates: boolean; analyticsConsent: boolean };
export type FarmDocumentRecord = { id: string; name: string; type: string; size: number; addedAt: string; dataUrl: string };
export type InstitutionDemoAccess = { shared: boolean; updatedAt?: string };

export type FarmerOnboardingRecord = {
    userId: string;
    accountEmail: string;
    farmId: string | null;
    primaryFarmId: string | null;
    profile: { state: string; lga: string; community: string; photoDataUrl?: string } | null;
    farm: Record<string, string | number | null> | null;
    farmLocation: { farmId: string; state: string; lga: string; community: string; address: string; latitude: number | null; longitude: number | null; source: string; accuracy: number | null; capturedAt: string } | null;
    farmInfrastructure: { farmId: string; water: string; electricity: string; waste: string } | null;
    completedSteps: string[];
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};

const storageSchemaVersion = 1;
const storagePrefix = `jari-demo:v${storageSchemaVersion}:`;

const scopedStorageKey = (key: string) => `${storagePrefix}${key}`;
const module2OwnerKey = `${storagePrefix}module2:legacy-owner`;
const module2Key = (userId: string, collection: string) => `${storagePrefix}module2:${userId}:${collection}`;

const currentFarmerId = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
        const session = JSON.parse(window.localStorage.getItem("jari-simulated-session") || "null") as { id?: string; role?: string } | null;
        return session?.role === "farmer" && session.id ? session.id : null;
    } catch { return null; }
};

const readModule2Collection = <T,>(collection: string, legacyKey: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    const userId = currentFarmerId();
    if (!userId) return readStorage(legacyKey, fallback);
    try {
        const key = module2Key(userId, collection);
        const stored = window.localStorage.getItem(key);
        if (stored) return JSON.parse(stored) as T;
        const owner = window.localStorage.getItem(module2OwnerKey);
        if (owner && owner !== userId) return fallback;
        const legacy = readStorage<T | null>(legacyKey, null);
        if ((owner === userId || !owner) && legacy !== null) {
            window.localStorage.setItem(module2OwnerKey, userId);
            window.localStorage.setItem(key, JSON.stringify(legacy));
            return legacy;
        }
        if (!owner) window.localStorage.setItem(module2OwnerKey, userId);
        return fallback;
    } catch { return fallback; }
};

const writeModule2Collection = <T,>(collection: string, legacyKey: string, value: T) => {
    if (typeof window === "undefined") return;
    const userId = currentFarmerId();
    if (!userId) { writeStorage(legacyKey, value); return; }
    window.localStorage.setItem(module2OwnerKey, window.localStorage.getItem(module2OwnerKey) || userId);
    window.localStorage.setItem(module2Key(userId, collection), JSON.stringify(value));
    emitDataChanged(legacyKey);
};

const commitModule2Collections = (writes: Array<[string, string, unknown]>, activityText: string) => {
    if (typeof window === "undefined") return;
    const userId = currentFarmerId();
    if (!userId) {
        commitWithActivity(writes.map(([, legacyKey, value]) => [legacyKey, value]), activityText);
        return;
    }
    const prefixedWrites = writes.map(([collection]) => [module2Key(userId, collection), ""] as const);
    const previous = prefixedWrites.map(([key]) => [key, window.localStorage.getItem(key)] as const);
    const activity = { id: idFor("activity"), text: activityText, createdAt: new Date().toISOString() };
    const activityKey = scopedStorageKey(STORAGE_KEYS.activity);
    const priorActivity = window.localStorage.getItem(activityKey);
    try {
        window.localStorage.setItem(module2OwnerKey, window.localStorage.getItem(module2OwnerKey) || userId);
        writes.forEach(([collection, , value]) => window.localStorage.setItem(module2Key(userId, collection), JSON.stringify(value)));
        const activityRecords = priorActivity ? JSON.parse(priorActivity) as ActivityRecord[] : getActivityRecords();
        window.localStorage.setItem(activityKey, JSON.stringify([activity, ...activityRecords].slice(0, 100)));
    } catch (error) {
        previous.slice().reverse().forEach(([key, value]) => { try { if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value); } catch { /* Keep attempting rollback. */ } });
        try { if (priorActivity === null) window.localStorage.removeItem(activityKey); else window.localStorage.setItem(activityKey, priorActivity); } catch { /* Preserve the original write error. */ }
        throw error;
    }
    writes.forEach(([, legacyKey]) => emitDataChanged(legacyKey));
    emitDataChanged(STORAGE_KEYS.activity);
    window.dispatchEvent(new CustomEvent("jari:toast", { detail: { kind: "success", message: activityText } }));
};

const emitDataChanged = (key: string) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key } }));
    }
};

const readStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const versioned = scopedStorageKey(key);
        const stored = window.localStorage.getItem(versioned);
        if (stored) return JSON.parse(stored) as T;

        // One-time migration keeps demo records created by earlier JARI builds.
        const legacy = window.localStorage.getItem(key);
        if (legacy) {
            window.localStorage.setItem(versioned, legacy);
            return JSON.parse(legacy) as T;
        }
        return fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = <T,>(key: string, value: T) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
        emitDataChanged(key);
    }
};

export const STORAGE_KEYS = {
    farmProfile: "jari-simulated-farm-profile",
    flockRecords: "jari-simulated-flocks",
    poultryHouses: "jari-simulated-poultry-houses",
    productionRecords: "jari-simulated-production",
    salesRecords: "jari-simulated-sales",
    expensesRecords: "jari-simulated-expenses",
    kycApplication: "jari-simulated-kyc-application",
    farmAssets: "jari-simulated-farm-assets",
    feedPurchases: "jari-simulated-feed-purchases",
    feedUse: "jari-simulated-feed-use",
    production: "jari-simulated-production",
    vaccinations: "jari-simulated-vaccinations",
    healthIncidents: "jari-simulated-health-incidents",
    treatments: "jari-simulated-treatments",
    flockMovements: "jari-simulated-flock-movements",
    applications: "jari-simulated-applications",
    activity: "jari-simulated-activity",
    documents: "jari-simulated-documents",
    opportunityApplications: "jari-simulated-opportunity-applications",
    institutionRequests: "jari-simulated-institution-requests",
    userPreferences: "jari-simulated-user-preferences",
    institutionDemoAccess: "jari-simulated-institution-demo-access",
};
const INSTITUTION_REGISTRATIONS_KEY = "jari-simulated-institution-registrations";

export const defaultFarmProfile: SavedFarmProfile = {
    farmName: "",
    ownerName: "",
    phone: "",
    community: "",
    lga: "",
    state: "Plateau",
    establishmentDate: "",
    operationType: "Broiler",
    productionSystem: "Deep litter",
    numberOfHouses: "0",
    waterSource: "Borehole",
    numberOfWorkers: "0",
    biosecurity: [],
};

export const getFarmProfile = () => readStorage<SavedFarmProfile>(STORAGE_KEYS.farmProfile, defaultFarmProfile);
export const saveFarmProfile = (value: SavedFarmProfile) => writeWithActivity(STORAGE_KEYS.farmProfile, value);
const onboardingKey = (userId: string) => `farmer-onboarding:${userId}`;
export const getFarmerOnboarding = (userId: string): FarmerOnboardingRecord | null => {
    if (!userId || typeof window === "undefined") return null;
    return readStorage<FarmerOnboardingRecord | null>(onboardingKey(userId), null);
};
export const initializeFarmerOnboarding = (userId: string, accountEmail = "") => {
    if (!userId) throw new Error("A signed-in farmer is required to start onboarding.");
    const existing = getFarmerOnboarding(userId);
    if (existing) return existing;
    const now = new Date().toISOString();
    const record: FarmerOnboardingRecord = { userId, accountEmail: accountEmail.trim().toLowerCase(), farmId: null, primaryFarmId: null, profile: null, farm: null, farmLocation: null, farmInfrastructure: null, completedSteps: [], completed: false, createdAt: now, updatedAt: now };
    writeStorage(onboardingKey(userId), record);
    return record;
};
export const saveFarmerOnboarding = (userId: string, patch: Partial<Pick<FarmerOnboardingRecord, "profile" | "farm" | "completedSteps" | "completed">>) => {
    if (!userId) throw new Error("A signed-in farmer is required to save onboarding.");
    const current = getFarmerOnboarding(userId) ?? initializeFarmerOnboarding(userId);
    const farmId = patch.farm ? current.farmId ?? idFor("farm") : current.farmId;
    const farm = patch.farm ?? current.farm;
    const location = farm ? { farmId: farmId as string, state: String(farm.state ?? ""), lga: String(farm.lga ?? ""), community: String(farm.community ?? ""), address: String(farm.address ?? ""), latitude: typeof farm.latitude === "number" ? farm.latitude : null, longitude: typeof farm.longitude === "number" ? farm.longitude : null, source: String(farm.locationSource ?? ""), accuracy: typeof farm.locationAccuracy === "number" ? farm.locationAccuracy : null, capturedAt: String(farm.locationCapturedAt ?? "") } : current.farmLocation;
    const infrastructure = farm ? { farmId: farmId as string, water: String(farm.water ?? ""), electricity: String(farm.electricity ?? ""), waste: String(farm.waste ?? "") } : current.farmInfrastructure;
    const updated: FarmerOnboardingRecord = { ...current, ...patch, farmId, primaryFarmId: farm ? farmId : current.primaryFarmId, farm, farmLocation: location, farmInfrastructure: infrastructure, userId, updatedAt: new Date().toISOString() };
    writeStorage(onboardingKey(userId), updated);
    return updated;
};
export const getKycApplication = () => readStorage<KycApplication | null>(STORAGE_KEYS.kycApplication, null);
export const saveKycApplication = (value: KycApplication) => writeWithActivity(STORAGE_KEYS.kycApplication, value);

const primaryFarmIdForCurrentUser = () => {
    const userId = currentFarmerId();
    if (!userId || typeof window === "undefined") return "legacy-primary-farm";
    try {
        const onboarding = window.localStorage.getItem(scopedStorageKey(`farmer-onboarding:${userId}`));
        const farmId = onboarding ? (JSON.parse(onboarding) as FarmerOnboardingRecord).primaryFarmId : null;
        return farmId || `farm-${userId}-primary`;
    } catch { return `farm-${userId}-primary`; }
};

export const getFarmerFarms = (): FarmerFarmRecord[] => {
    const userId = currentFarmerId();
    if (!userId) return [];
    const saved = readModule2Collection<FarmerFarmRecord[]>("farms", "jari-simulated-module2-farms", []);
    if (saved.length) return saved;
    const onboarding = getFarmerOnboarding(userId);
    if (!onboarding?.farm) return [];
    const id = onboarding?.primaryFarmId || primaryFarmIdForCurrentUser();
    return [{ id, userId, name: String(onboarding.farm.farmName || onboarding.farm.name || "My farm"), location: [onboarding.profile?.community, onboarding.profile?.lga, onboarding.profile?.state].filter(Boolean).join(", "), isPrimary: true, createdAt: onboarding.createdAt || new Date(0).toISOString(), updatedAt: onboarding.updatedAt || new Date(0).toISOString() }];
};

export const createFarmerFarm = (name: string, location = "") => {
    const userId = currentFarmerId();
    if (!userId) throw new Error("Sign in as a farmer before adding another farm.");
    const trimmedName = name.trim();
    if (!trimmedName) throw new Error("Enter a name for this farm.");
    const farms = getFarmerFarms();
    if (farms.some((farm) => farm.name.trim().toLowerCase() === trimmedName.toLowerCase())) throw new Error("A farm with this name already exists.");
    const now = new Date().toISOString();
    const created = { id: idFor("farm"), userId, name: trimmedName, location: location.trim(), isPrimary: farms.length === 0, createdAt: now, updatedAt: now };
    writeModule2Collection("farms", "jari-simulated-module2-farms", [...farms, created]);
    return created;
};

export const getPrimaryFarmId = () => getFarmerFarms().find((farm) => farm.isPrimary)?.id || primaryFarmIdForCurrentUser();

export const getPoultryHouses = (): FarmHouseRecord[] => readModule2Collection<FarmHouseRecord[]>("houses", STORAGE_KEYS.poultryHouses, []).map((house, index) => {
    const userId = currentFarmerId() || house.userId || "legacy-user";
    return { ...house, id: house.id || `legacy-house-${index}-${house.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, userId, farmId: house.farmId || primaryFarmIdForCurrentUser(), reference: house.reference || house.name, status: house.status || (house.archived ? "Archived" : "Active"), createdAt: house.createdAt || new Date(0).toISOString(), updatedAt: house.updatedAt || new Date(0).toISOString() };
});

export const getFlockRecords = (): FlockRecord[] => readModule2Collection<FlockRecord[]>("flocks", STORAGE_KEYS.flockRecords, []).map((flock, index) => {
    const userId = currentFarmerId() || flock.userId || "legacy-user";
    const houses = getPoultryHouses();
    const house = houses.find((item) => item.id === flock.houseId) || houses.find((item) => item.name === flock.house && (!flock.farmId || item.farmId === flock.farmId));
    return { ...flock, id: flock.id || `legacy-flock-${index}-${flock.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, userId, farmId: flock.farmId || house?.farmId || primaryFarmIdForCurrentUser(), houseId: flock.houseId || house?.id, reference: flock.reference || flock.name, initialBirds: flock.initialBirds ?? flock.birds, createdAt: flock.createdAt || new Date(0).toISOString(), updatedAt: flock.updatedAt || new Date(0).toISOString() };
});
export const saveFlockRecords = (value: FlockRecord[]) => writeModule2Collection("flocks", STORAGE_KEYS.flockRecords, value);

export const getFlockMovements = () => readModule2Collection<FarmFlockMovement[]>("flock-movements", STORAGE_KEYS.flockMovements, getFlockRecords().map((flock) => ({
    id: `opening-${flock.id || flock.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    flock: flock.name,
    flockId: flock.id,
    userId: flock.userId,
    farmId: flock.farmId,
    houseId: flock.houseId,
    responsibleUser: flock.userId,
    createdAt: flock.createdAt,
    date: flock.acquisitionDate || flock.cycleStart || "2026-01-01",
    type: "Initial stocking",
    quantity: Number(flock.birds) || 0,
    reason: "Opening population from the farm's demo records",
}))).map((movement) => ({ ...movement, userId: movement.userId || currentFarmerId() || "legacy-user", createdAt: movement.createdAt || new Date(0).toISOString() }));
export const saveFlockMovements = (value: FarmFlockMovement[]) => writeModule2Collection("flock-movements", STORAGE_KEYS.flockMovements, value);
export const getFlockClosures = (flockId?: string) => readModule2Collection<FlockClosureRecord[]>("flock-closures", "jari-simulated-flock-closures", []).filter((record) => !flockId || record.flockId === flockId).sort((a, b) => b.date.localeCompare(a.date));
export const getFlockLifecycleEvents = (flockId?: string) => readModule2Collection<FlockLifecycleRecord[]>("flock-lifecycle-events", "jari-simulated-flock-lifecycle-events", []).filter((record) => !flockId || record.flockId === flockId);
export const closeFlockBatch = (entry: { flockId: string; date: string; reason: string; notes?: string }) => {
    const flocks = getFlockRecords();
    const flock = flocks.find((record) => record.id === entry.flockId);
    if (!flock || flock.status === "Archived" || flock.status === "Closed") throw new Error("Choose an open bird group to close.");
    if (!entry.date || entry.date > new Date().toISOString().slice(0, 10) || !entry.reason.trim()) throw new Error("Enter a valid closure date and reason.");
    if (flock.birds !== 0) throw new Error("Record the remaining birds as sales, removals or transfers before closing this group.");
    const now = new Date().toISOString();
    const closure: FlockClosureRecord = { id: idFor("flock-closure"), userId: currentFarmerId() || flock.userId || "legacy-user", farmId: flock.farmId || primaryFarmIdForCurrentUser(), flockId: flock.id!, date: entry.date, finalPopulation: flock.birds, reason: entry.reason.trim(), notes: entry.notes?.trim() || undefined, createdAt: now };
    const movement: FarmFlockMovement = { id: idFor("movement"), flock: flock.name, flockId: flock.id, userId: closure.userId, farmId: closure.farmId, houseId: flock.houseId, responsibleUser: closure.userId, createdAt: now, date: entry.date, type: "Closure", quantity: 0, reason: entry.reason.trim(), notes: entry.notes?.trim() };
    const lifecycle: FlockLifecycleRecord = { id: idFor("flock-event"), userId: closure.userId, farmId: closure.farmId, flockId: closure.flockId, date: entry.date, event: "Batch closed", details: `${closure.reason} · final recorded population ${closure.finalPopulation}${closure.notes ? ` · ${closure.notes}` : ""}`, createdAt: now };
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, flocks.map((record) => record.id === flock.id ? { ...record, status: "Closed" as const, updatedAt: now } : record)], ["flock-closures", "jari-simulated-flock-closures", [...getFlockClosures(), closure]], ["flock-lifecycle-events", "jari-simulated-flock-lifecycle-events", [...getFlockLifecycleEvents(), lifecycle]], ["flock-movements", STORAGE_KEYS.flockMovements, [...getFlockMovements(), movement]]], `Bird group ${flock.name} closed`);
    return closure;
};
export const archiveFlockBatch = (flockId: string) => {
    const flocks = getFlockRecords();
    const flock = flocks.find((record) => record.id === flockId);
    if (!flock || !["Closed", "Completed"].includes(flock.status)) throw new Error("Only completed or closed bird groups can be archived.");
    const now = new Date().toISOString();
    const lifecycle: FlockLifecycleRecord = { id: idFor("flock-event"), userId: currentFarmerId() || flock.userId || "legacy-user", farmId: flock.farmId || primaryFarmIdForCurrentUser(), flockId, date: now.slice(0, 10), event: "Batch archived", createdAt: now };
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, flocks.map((record) => record.id === flockId ? { ...record, status: "Archived" as const, updatedAt: now } : record)], ["flock-lifecycle-events", "jari-simulated-flock-lifecycle-events", [...getFlockLifecycleEvents(), lifecycle]]], `Bird group ${flock.name} archived`);
    return { ...flock, status: "Archived" as const, updatedAt: now };
};

export const getFlockPopulationStats = (flockId: string, fromDate?: string, toDate = new Date().toISOString().slice(0, 10)) => {
    const flock = getFlockRecords().find((record) => record.id === flockId);
    if (!flock) throw new Error("Bird group not found.");
    const movements = getFlockMovements().filter((movement) => movement.flockId === flockId).sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || "").localeCompare(b.createdAt || ""));
    const reversedMovementIds = new Set(movements.flatMap((movement) => movement.reversesMovementId ? [movement.reversesMovementId] : []));
    const delta = (movement: FarmFlockMovement) => {
        if (movement.type === "Mortality" && reversedMovementIds.has(movement.id)) return 0;
        if (["Mortality", "Culling", "Sale", "Transfer out"].includes(movement.type)) return -movement.quantity;
        if (movement.type === "Adjustment" && movement.adjustmentDirection === "Decrease") return -movement.quantity;
        if (movement.type === "Adjustment" && movement.adjustmentDirection !== "Increase") return 0;
        if (["Initial stocking", "Bird acquisition", "Additional stocking", "Transfer in"].includes(movement.type) || movement.type === "Adjustment") return movement.quantity;
        return 0;
    };
    const introductions = movements.filter((movement) => ["Initial stocking", "Bird acquisition", "Additional stocking", "Transfer in"].includes(movement.type)).reduce((sum, movement) => sum + movement.quantity, 0);
    const deathCount = movements.filter((movement) => movement.type === "Mortality" && !reversedMovementIds.has(movement.id)).reduce((sum, movement) => sum + movement.quantity, 0);
    const startDate = fromDate || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const openingPopulation = movements.filter((movement) => movement.date < startDate).reduce((population, movement) => Math.max(0, population + delta(movement)), 0);
    const periodDeaths = movements.filter((movement) => movement.type === "Mortality" && !reversedMovementIds.has(movement.id) && movement.date >= startDate && movement.date <= toDate).reduce((sum, movement) => sum + movement.quantity, 0);
    const otherReductions = movements.filter((movement) => ["Culling", "Sale", "Transfer out"].includes(movement.type)).reduce((sum, movement) => sum + movement.quantity, 0);
    return { introduced: introductions || flock.initialBirds || 0, deaths: deathCount, otherReductions, openingPopulation, periodDeaths, cumulativeRate: introductions || flock.initialBirds ? deathCount / (introductions || flock.initialBirds) * 100 : null, periodRate: openingPopulation > 0 ? periodDeaths / openingPopulation * 100 : null, fromDate: startDate, toDate };
};

export const getFlockHouseAssignments = (): FlockHouseAssignment[] => {
    const saved = readModule2Collection<FlockHouseAssignment[]>("flock-house-assignments", "jari-simulated-flock-house-assignments", []);
    if (saved.length) return saved;
    return getFlockRecords().filter((flock) => flock.houseId && flock.farmId).map((flock) => ({ id: `opening-assignment-${flock.id}`, userId: flock.userId || currentFarmerId() || "legacy-user", farmId: flock.farmId!, flockId: flock.id!, fromHouseId: null, toHouseId: flock.houseId!, effectiveDate: flock.acquisitionDate || flock.cycleStart || "2026-01-01", reason: "Initial house assignment from existing records", createdAt: flock.createdAt || new Date(0).toISOString() }));
};
export const getFlockAssignmentHistory = (flockId: string) => getFlockHouseAssignments().filter((assignment) => assignment.flockId === flockId).sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
export const getHousePopulation = (houseId: string) => getFlockRecords().filter((flock) => flock.houseId === houseId && flock.status === "Active").reduce((total, flock) => total + Math.max(0, Number(flock.birds) || 0), 0);

export const getInventoryItems = () => {
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    return items.map((item) => {
        const delta = transactions.filter((transaction) => transaction.itemId === item.id && transaction.farmId === item.farmId).reduce((balance, transaction) => balance + (transaction.type === "Stock received" || transaction.type === "Transfer in" || (transaction.type === "Adjustment" && transaction.adjustmentDirection !== "Decrease") ? transaction.quantity : transaction.type === "Stock issued" || transaction.type === "Transfer out" || transaction.type === "Disposal" || (transaction.type === "Adjustment" && transaction.adjustmentDirection === "Decrease") ? -transaction.quantity : 0), 0);
        const currentQuantity = Math.max(0, item.initialQuantity + delta);
        const today = new Date().toISOString().slice(0, 10);
        const daysToExpiry = item.expiryDate ? Math.ceil((new Date(`${item.expiryDate}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000) : null;
        const expired = daysToExpiry !== null && daysToExpiry < 0;
        return { ...item, currentQuantity, stockStatus: currentQuantity === 0 ? "Out of stock" as const : item.minimumStock !== undefined && currentQuantity <= item.minimumStock ? "Low stock" as const : "In stock" as const, expired, expiringSoon: daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry <= 30 };
    });
};

export const createInventoryItem = (item: Omit<InventoryItemRecord, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const userId = currentFarmerId();
    if (!userId) throw new Error("Sign in as a farmer before adding inventory.");
    const farm = getFarmerFarms().find((record) => record.id === item.farmId);
    if (!farm) throw new Error("Choose a farm that belongs to your account.");
    if (!item.name.trim() || !item.category.trim() || !item.unit.trim()) throw new Error("Enter an item name, category and unit.");
    if (!Number.isFinite(item.initialQuantity) || item.initialQuantity < 0 || !Number.isFinite(item.minimumStock ?? 0) || (item.minimumStock ?? 0) < 0) throw new Error("Stock quantity and low-stock threshold must be zero or more.");
    if (getInventoryItems().some((record) => record.farmId === item.farmId && record.name.trim().toLowerCase() === item.name.trim().toLowerCase() && (record.lotNumber || "").trim().toLowerCase() === (item.lotNumber || "").trim().toLowerCase() && (record.storageLocation || "").trim().toLowerCase() === (item.storageLocation || "").trim().toLowerCase())) throw new Error("This item, lot and storage location already exist on this farm.");
    const now = new Date().toISOString();
    const created: InventoryItemRecord = { ...item, id: idFor("inventory-item"), userId, name: item.name.trim(), createdAt: now, updatedAt: now };
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    if (created.initialQuantity > 0) transactions.push({ id: idFor("inventory-transaction"), userId, farmId: created.farmId, itemId: created.id, type: "Stock received", quantity: created.initialQuantity, unit: created.unit, date: item.purchaseDate || now.slice(0, 10), reason: "Opening stock", supplier: item.supplier, supplierId: item.supplierId, purchaseCost: item.purchaseCost, unitCost: item.purchaseCost !== undefined ? item.purchaseCost / created.initialQuantity : undefined, createdAt: now });
    const normalized = { ...created, initialQuantity: 0 };
    commitModule2Collections([["inventory-items", "jari-simulated-inventory-items", [...items, normalized]], ["inventory-transactions", "jari-simulated-inventory-transactions", transactions]], `Inventory item ${created.name} added`);
    return created;
};

export const getInventorySuppliers = (farmId?: string) => readModule2Collection<InventorySupplierRecord[]>("inventory-suppliers", "jari-simulated-inventory-suppliers", []).filter((supplier) => !farmId || supplier.farmId === farmId).sort((a, b) => a.name.localeCompare(b.name));
export const createInventorySupplier = (supplier: Omit<InventorySupplierRecord, "id" | "userId" | "createdAt" | "updatedAt" | "active">) => {
    const userId = currentFarmerId();
    if (!userId || !getFarmerFarms().some((farm) => farm.id === supplier.farmId)) throw new Error("Choose one of your farms before adding a supplier.");
    const name = supplier.name.trim();
    if (!name) throw new Error("Enter a supplier or business name.");
    if (getInventorySuppliers(supplier.farmId).some((record) => record.name.trim().toLowerCase() === name.toLowerCase())) throw new Error("This supplier already exists on this farm.");
    const now = new Date().toISOString();
    const created: InventorySupplierRecord = { ...supplier, name, products: supplier.products?.map((product) => product.trim()).filter(Boolean) || [], id: idFor("supplier"), userId, active: true, createdAt: now, updatedAt: now };
    commitModule2Collections([["inventory-suppliers", "jari-simulated-inventory-suppliers", [...getInventorySuppliers(), created]]], `Supplier ${name} added`);
    return created;
};
export const updateInventorySupplier = (id: string, changes: Partial<Pick<InventorySupplierRecord, "name" | "contactName" | "phone" | "email" | "address" | "products" | "notes" | "active">>) => {
    const records = getInventorySuppliers();
    const current = records.find((supplier) => supplier.id === id);
    if (!current) throw new Error("Supplier not found.");
    const name = (changes.name ?? current.name).trim();
    if (!name || records.some((supplier) => supplier.id !== id && supplier.farmId === current.farmId && supplier.name.trim().toLowerCase() === name.toLowerCase())) throw new Error("Enter a unique supplier name for this farm.");
    const updated = { ...current, ...changes, name, products: changes.products?.map((product) => product.trim()).filter(Boolean) ?? current.products, updatedAt: new Date().toISOString() };
    commitModule2Collections([["inventory-suppliers", "jari-simulated-inventory-suppliers", records.map((supplier) => supplier.id === id ? updated : supplier)]], `Supplier ${name} updated`);
    return updated;
};
export const getInventoryPurchases = (farmId?: string) => readModule2Collection<InventoryPurchaseRecord[]>("inventory-purchases", "jari-simulated-inventory-purchases", []).filter((purchase) => !farmId || purchase.farmId === farmId).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
export const addInventoryPurchase = (input: { farmId: string; itemId: string; supplierId?: string; quantity: number; date: string; unitCost?: number; totalCost?: number; amountPaid?: number; notes?: string }) => {
    const userId = currentFarmerId();
    const item = getInventoryItems().find((record) => record.id === input.itemId && record.farmId === input.farmId);
    const supplier = input.supplierId ? getInventorySuppliers(input.farmId).find((record) => record.id === input.supplierId && record.active) : undefined;
    if (!userId || !item || (input.supplierId && !supplier)) throw new Error("Choose an inventory item and an active supplier from this farm.");
    const today = new Date().toISOString().slice(0, 10);
    if (!input.date || input.date > today || !Number.isFinite(input.quantity) || input.quantity <= 0 || (Number.isInteger(input.quantity) === false && ["doses", "packs", "tablets", "pieces"].includes(item.unit.toLowerCase()))) throw new Error("Enter a valid purchase date and positive quantity in the item's units.");
    if (input.unitCost !== undefined && (!Number.isFinite(input.unitCost) || input.unitCost < 0)) throw new Error("Enter a valid unit cost.");
    const totalCost = input.totalCost ?? (input.unitCost !== undefined ? input.unitCost * input.quantity : undefined);
    const amountPaid = input.amountPaid ?? 0;
    if (totalCost !== undefined && (!Number.isFinite(totalCost) || totalCost < 0)) throw new Error("Enter a valid total purchase cost.");
    if (!Number.isFinite(amountPaid) || amountPaid < 0 || (amountPaid > 0 && totalCost === undefined) || (totalCost !== undefined && amountPaid > totalCost)) throw new Error("Amount paid must be between zero and the total purchase cost.");
    const id = idFor("purchase");
    const now = new Date().toISOString();
    const transaction: InventoryTransactionRecord = { id: idFor("inventory-transaction"), userId, farmId: input.farmId, itemId: item.id, type: "Stock received", quantity: input.quantity, unit: item.unit, date: input.date, reason: "Inventory purchase", supplier: supplier?.name, supplierId: supplier?.id, purchaseId: id, purchaseCost: totalCost, unitCost: input.unitCost, amountPaid, referenceId: `purchase:${id}`, notes: input.notes?.trim() || undefined, createdAt: now };
    const purchase: InventoryPurchaseRecord = { id, userId, farmId: input.farmId, supplierId: supplier?.id, supplierName: supplier?.name, itemId: item.id, itemName: item.name, quantity: input.quantity, unit: item.unit, unitCost: input.unitCost, totalCost, amountPaid, date: input.date, paymentStatus: totalCost === undefined || amountPaid === 0 ? "Unpaid" : amountPaid >= totalCost ? "Paid" : "Part paid", inventoryTransactionId: transaction.id, notes: input.notes?.trim() || undefined, createdAt: now };
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    const purchases = readModule2Collection<InventoryPurchaseRecord[]>("inventory-purchases", "jari-simulated-inventory-purchases", []);
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    const suppliers = readModule2Collection<InventorySupplierRecord[]>("inventory-suppliers", "jari-simulated-inventory-suppliers", []);
    const nextItems = items.map((record) => record.id === item.id ? { ...record, purchaseDate: input.date, supplierId: supplier?.id || record.supplierId, supplier: supplier?.name || record.supplier, purchaseCost: totalCost ?? record.purchaseCost, updatedAt: now } : record);
    const nextSuppliers = supplier ? suppliers.map((record) => record.id === supplier.id ? { ...record, products: Array.from(new Set([...(record.products || []), item.name])), updatedAt: now } : record) : suppliers;
    const writes: Array<[string, string, unknown]> = [["inventory-transactions", "jari-simulated-inventory-transactions", [...transactions, transaction]], ["inventory-purchases", "jari-simulated-inventory-purchases", [...purchases, purchase]], ["inventory-items", "jari-simulated-inventory-items", nextItems]];
    if (supplier) writes.push(["inventory-suppliers", "jari-simulated-inventory-suppliers", nextSuppliers]);
    commitModule2Collections(writes, `Purchase recorded for ${item.name}`);
    return purchase;
};
export const updateInventoryItem = (id: string, changes: Partial<Pick<InventoryItemRecord, "name" | "description" | "category" | "itemType" | "minimumStock" | "expiryDate" | "notes">>) => {
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    const current = items.find((item) => item.id === id);
    if (!current) throw new Error("Inventory item not found.");
    const name = (changes.name ?? current.name).trim();
    const category = (changes.category ?? current.category).trim();
    if (!name || !category || (changes.minimumStock !== undefined && (!Number.isFinite(changes.minimumStock) || changes.minimumStock < 0))) throw new Error("Enter an item name, category and non-negative stock threshold.");
    const updated: InventoryItemRecord = { ...current, name, category, itemType: changes.itemType ?? current.itemType, minimumStock: changes.minimumStock ?? current.minimumStock, description: changes.description?.trim() || current.description, expiryDate: changes.expiryDate, notes: changes.notes?.trim() || undefined, updatedAt: new Date().toISOString() };
    commitModule2Collections([["inventory-items", "jari-simulated-inventory-items", items.map((item) => item.id === id ? updated : item)]], `Inventory item ${name} updated`);
    return updated;
};

export const getInventoryTransactions = (itemId?: string) => readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []).filter((record) => !itemId || record.itemId === itemId).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

export const getInventoryDashboardSummary = (farmId?: string) => {
    const items = getInventoryItems().filter((item) => !farmId || item.farmId === farmId);
    const itemIds = new Set(items.map((item) => item.id));
    const transactions = getInventoryTransactions().filter((record) => itemIds.has(record.itemId));
    const purchases = getInventoryPurchases(farmId);
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const categories = Array.from(new Set(items.map((item) => item.category))).map((category) => ({ category, count: items.filter((item) => item.category === category).length, quantity: items.filter((item) => item.category === category).reduce((sum, item) => sum + item.currentQuantity, 0) }));
    let estimatedValue = 0;
    let valuedItems = 0;
    for (const item of items) {
        if (item.currentQuantity <= 0) continue;
        const receipts = transactions.filter((transaction) => transaction.itemId === item.id && transaction.type === "Stock received" && transaction.quantity > 0);
        const costed = receipts.filter((transaction) => transaction.unitCost !== undefined || transaction.purchaseCost !== undefined);
        const costQuantity = costed.reduce((sum, transaction) => sum + transaction.quantity, 0);
        const valueReceived = costed.reduce((sum, transaction) => sum + (transaction.unitCost !== undefined ? transaction.unitCost * transaction.quantity : (transaction.purchaseCost! / transaction.quantity) * transaction.quantity), 0);
        if (costQuantity > 0 && valueReceived >= 0) { estimatedValue += item.currentQuantity * (valueReceived / costQuantity); valuedItems += 1; }
    }
    return { totalItems: items.length, inStock: items.filter((item) => item.currentQuantity > 0 && item.stockStatus === "In stock").length, lowStock: items.filter((item) => item.stockStatus === "Low stock").length, outOfStock: items.filter((item) => item.stockStatus === "Out of stock").length, expiringSoon: items.filter((item) => item.expiringSoon && item.currentQuantity > 0).length, expired: items.filter((item) => item.expired && item.currentQuantity > 0).length, expiredQuantity: items.filter((item) => item.expired).reduce((sum, item) => sum + item.currentQuantity, 0), recentIssued: transactions.filter((record) => record.type === "Stock issued" && record.date >= cutoff && record.date <= new Date().toISOString().slice(0, 10)).reduce((sum, record) => sum + record.quantity, 0), purchases: purchases.length, purchaseSpend: purchases.reduce((sum, purchase) => sum + (purchase.totalCost || 0), 0), categories, estimatedValue: valuedItems ? estimatedValue : null, valuedItems };
};

export const getFarmReportingPreferences = (farmId?: string) => readModule2Collection<FarmReportingPreference[]>("reporting-preferences", "jari-simulated-reporting-preferences", []).filter((item) => !farmId || item.farmId === farmId);
export const saveFarmReportingPreference = (input: Omit<FarmReportingPreference, "id" | "userId" | "updatedAt">) => {
    const userId = currentFarmerId(); if (!userId) throw new Error("Sign in as a farmer to manage reporting reminders.");
    if (!getFarmerFarms().some((farm) => farm.id === input.farmId)) throw new Error("Choose one of your farms.");
    if (!input.modules.length || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.reminderTime) || (input.frequency === "Weekly" && (input.reminderDay < 0 || input.reminderDay > 6))) throw new Error("Choose a reporting category and valid reminder time/day.");
    const all = getFarmReportingPreferences(); const saved: FarmReportingPreference = { ...input, id: all.find((item) => item.farmId === input.farmId)?.id || idFor("reporting-pref"), userId, updatedAt: new Date().toISOString() };
    commitModule2Collections([["reporting-preferences", "jari-simulated-reporting-preferences", [...all.filter((item) => item.farmId !== input.farmId), saved]]], "Farm record reminder preferences saved"); return saved;
};
export const getFarmUpdateReminders = (farmId?: string) => readModule2Collection<FarmUpdateReminder[]>("update-reminders", "jari-simulated-update-reminders", []).filter((item) => !farmId || item.farmId === farmId).sort((a, b) => b.dueAt.localeCompare(a.dueAt));
const lastFarmRecordDate = (farmId: string, module: FarmUpdateReminder["module"]) => {
    const dates = module === "Inventory"
        ? getInventoryTransactions().filter((record) => record.farmId === farmId).map((record) => record.date)
        : [...getFlockMovements().filter((record) => record.farmId === farmId).map((record) => record.date), ...getFlockActivities().filter((record) => record.farmId === farmId && record.status === "Completed").map((record) => record.completedAt?.slice(0, 10) || record.createdAt.slice(0, 10)), ...getVaccinationRecords().filter((record) => record.farmId === farmId).map((record) => record.date), ...getFlockMilestones().filter((record) => getFlockRecords().some((flock) => flock.id === record.flockId && flock.farmId === farmId)).map((record) => record.date), ...getFeedUseRecords().filter((record) => record.farmId === farmId).map((record) => record.date), ...getHealthIncidents().filter((record) => record.farmId === farmId).map((record) => record.date), ...getTreatmentRecords().filter((record) => record.farmId === farmId).map((record) => record.date)];
    return dates.filter(Boolean).sort().at(-1) || null;
};
export const getFarmRecordFreshness = (farmId: string) => {
    const preference = getFarmReportingPreferences(farmId)[0]; if (!preference) return [];
    const now = new Date(); const reminders = getFarmUpdateReminders(); const additions: FarmUpdateReminder[] = [];
    const status = preference.modules.map((module) => {
        const lastUpdated = lastFarmRecordDate(farmId, module); const interval = preference.frequency === "Daily" ? 1 : 7;
        const resolvedAt = reminders.filter((item) => item.farmId === farmId && item.module === module && ["Completed", "No activity", "Information unavailable"].includes(item.status)).map((item) => item.updatedAt.slice(0, 10)).sort().at(-1) || null;
        const anchor = [lastUpdated, resolvedAt].filter((value): value is string => Boolean(value)).sort().at(-1);
        const dueDate = anchor ? new Date(`${anchor}T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - interval);
        if (preference.frequency === "Weekly") { dueDate.setDate(dueDate.getDate() + 1); while (dueDate.getDay() !== preference.reminderDay) dueDate.setDate(dueDate.getDate() + 1); }
        else dueDate.setDate(dueDate.getDate() + interval);
        const localDueDate = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}-${String(dueDate.getDate()).padStart(2, "0")}`;
        const dueAt = `${localDueDate}T${preference.reminderTime}:00`;
        const due = new Date(dueAt) <= now; const periodKey = `${module}:${dueAt.slice(0, 10)}`;
        let reminder = reminders.find((item) => item.farmId === farmId && item.periodKey === periodKey);
        if (due && !reminder) { reminder = { id: idFor("update-reminder"), userId: preference.userId, farmId, module, periodKey, dueAt, status: "Open", createdAt: now.toISOString(), updatedAt: now.toISOString() }; additions.push(reminder); }
        const effectiveReminder = reminder && reminder.status === "Snoozed" && reminder.snoozedUntil && new Date(reminder.snoozedUntil) <= now ? { ...reminder, status: "Open" as const, snoozedUntil: undefined, updatedAt: now.toISOString() } : reminder;
        return { module, lastUpdated, due, status: !lastUpdated ? "No records available" as const : due ? "Update due" as const : "Up to date" as const, reminder: effectiveReminder };
    });
    const changed = status.flatMap((entry) => entry.reminder && reminders.some((item) => item.id === entry.reminder!.id && item.status !== entry.reminder!.status) ? [entry.reminder] : []);
    if (additions.length || changed.length) { const ids = new Set([...additions, ...changed].map((item) => item.id)); writeModule2Collection("update-reminders", "jari-simulated-update-reminders", [...reminders.filter((item) => !ids.has(item.id)), ...changed, ...additions]); }
    return status;
};
export const respondToFarmUpdateReminder = (id: string, status: FarmUpdateReminder["status"], note?: string) => {
    if (!["Completed", "No activity", "Information unavailable", "Snoozed"].includes(status)) throw new Error("Choose a valid reminder response.");
    const records = getFarmUpdateReminders(); const current = records.find((item) => item.id === id); if (!current) throw new Error("This reminder is no longer available.");
    const snoozedUntil = status === "Snoozed" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined;
    const updated = { ...current, status, snoozedUntil, note: note?.trim().slice(0, 300) || undefined, updatedAt: new Date().toISOString() };
    commitModule2Collections([["update-reminders", "jari-simulated-update-reminders", records.map((item) => item.id === id ? updated : item)]], `Farm record reminder marked ${status.toLowerCase()}`); return updated;
};

export const getInventoryForecast = (itemId: string) => {
    const item = getInventoryItems().find((record) => record.id === itemId);
    if (!item || item.currentQuantity <= 0) return { sufficientData: false as const, reason: "No stock available to estimate." };
    const today = new Date();
    const cutoff = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);
    const issues = getInventoryTransactions(itemId).filter((record) => record.type === "Stock issued" && record.date >= cutoff && record.date <= today.toISOString().slice(0, 10));
    if (issues.length < 3) return { sufficientData: false as const, reason: "Record at least three stock issues in the past 30 days to see an estimate." };
    const spanDays = Math.max(1, Math.ceil((today.getTime() - new Date(`${issues[issues.length - 1].date}T00:00:00`).getTime()) / 86400000));
    const dailyAverage = issues.reduce((sum, issue) => sum + issue.quantity, 0) / spanDays;
    if (!Number.isFinite(dailyAverage) || dailyAverage <= 0) return { sufficientData: false as const, reason: "No recent stock use is available for an estimate." };
    const daysRemaining = item.currentQuantity / dailyAverage;
    const depletionDate = new Date(today.getTime() + Math.ceil(daysRemaining) * 86400000).toISOString().slice(0, 10);
    return { sufficientData: true as const, dailyAverage, daysRemaining, depletionDate };
};

export const recordInventoryTransaction = (transaction: Omit<InventoryTransactionRecord, "id" | "userId" | "createdAt" | "unit">) => {
    const userId = currentFarmerId();
    if (!userId) throw new Error("Sign in as a farmer before recording stock movement.");
    const item = getInventoryItems().find((record) => record.id === transaction.itemId && record.farmId === transaction.farmId);
    if (!item) throw new Error("Choose an inventory item from this farm.");
    if (transaction.type === "Transfer in" || transaction.type === "Transfer out") throw new Error("Use the paired farm transfer action so both stock ledgers update together.");
    const wholeUnit = ["doses", "packs", "tablets", "pieces"].includes(item.unit.toLowerCase());
    if (!transaction.date || !transaction.reason.trim() || !Number.isFinite(transaction.quantity) || transaction.quantity <= 0 || (wholeUnit && !Number.isInteger(transaction.quantity))) throw new Error(wholeUnit ? "Enter a date, reason and whole positive quantity." : "Enter a date, reason and positive quantity.");
    if (transaction.type === "Adjustment" && !transaction.adjustmentDirection) throw new Error("Choose whether this adjustment increases or decreases stock.");
    if (transaction.flockId && !getFlockRecords().some((flock) => flock.id === transaction.flockId && flock.farmId === item.farmId)) throw new Error("The selected bird group must belong to the same farm.");
    if (transaction.type === "Stock issued" && item.expired) throw new Error("This lot is expired. Record disposal if it is no longer usable.");
    if (transaction.purchaseCost !== undefined && (!Number.isFinite(transaction.purchaseCost) || transaction.purchaseCost < 0)) throw new Error("Enter a valid purchase cost.");
    if (transaction.type !== "Stock received" && (transaction.purchaseCost !== undefined || transaction.supplier?.trim())) throw new Error("Supplier and purchase cost can only be recorded for stock received.");
    if (transaction.amountPaid !== undefined && (!Number.isFinite(transaction.amountPaid) || transaction.amountPaid < 0 || transaction.purchaseCost === undefined || transaction.amountPaid > transaction.purchaseCost)) throw new Error("Amount paid must be between zero and the recorded purchase cost.");
    const decreases = transaction.type === "Stock issued" || transaction.type === "Transfer out" || transaction.type === "Disposal" || (transaction.type === "Adjustment" && transaction.adjustmentDirection === "Decrease");
    const amount = Math.abs(transaction.quantity);
    if (decreases && amount > item.currentQuantity) throw new Error(`Only ${item.currentQuantity} ${item.unit} are currently available.`);
    const created: InventoryTransactionRecord = { ...transaction, quantity: amount, id: idFor("inventory-transaction"), userId, unit: item.unit, createdAt: new Date().toISOString() };
    const records = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    commitModule2Collections([["inventory-transactions", "jari-simulated-inventory-transactions", [...records, created]]], `${item.name} stock ${decreases ? "reduced" : "increased"}`);
    return created;
};

export const transferInventoryBetweenFarms = (transfer: { itemId: string; destinationFarmId: string; quantity: number; date: string; reason: string; notes?: string }) => {
    const userId = currentFarmerId();
    const source = getInventoryItems().find((item) => item.id === transfer.itemId);
    const destinationFarm = getFarmerFarms().find((farm) => farm.id === transfer.destinationFarmId);
    const quantity = Number(transfer.quantity);
    if (!userId || !source || !destinationFarm) throw new Error("Choose stock and a destination farm in your account.");
    if (destinationFarm.id === source.farmId) throw new Error("Choose another farm for this transfer.");
    const wholeUnit = ["doses", "packs", "tablets", "pieces"].includes(source.unit.toLowerCase());
    if (!Number.isFinite(quantity) || quantity <= 0 || (wholeUnit && !Number.isInteger(quantity)) || quantity > source.currentQuantity) throw new Error(`Enter a quantity greater than zero${wholeUnit ? " in whole units" : ""} and no more than ${source.currentQuantity} ${source.unit}.`);
    if (!transfer.date || !transfer.reason.trim()) throw new Error("Enter a transfer date and reason.");
    if (source.expired) throw new Error("Expired stock cannot be transferred as usable inventory.");
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    const destinationItem = getInventoryItems().find((item) => item.farmId === destinationFarm.id && item.name.trim().toLowerCase() === source.name.trim().toLowerCase() && (item.lotNumber || "") === (source.lotNumber || ""));
    let nextItems = items;
    let target = destinationItem;
    const now = new Date().toISOString();
    if (target && target.unit !== source.unit) throw new Error("The matching destination item uses a different unit. Reconcile the unit before transferring stock.");
    if (!target) {
        target = { ...source, id: idFor("inventory-item"), farmId: destinationFarm.id, userId, initialQuantity: 0, createdAt: now, updatedAt: now };
        nextItems = [...items, target];
    }
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    const referenceId = idFor("inventory-transfer");
    const pair: InventoryTransactionRecord[] = [
        { id: `${referenceId}-out`, userId, farmId: source.farmId, relatedFarmId: destinationFarm.id, itemId: source.id, type: "Transfer out", quantity, unit: source.unit, date: transfer.date, reason: transfer.reason.trim(), notes: transfer.notes, referenceId, createdAt: now },
        { id: `${referenceId}-in`, userId, farmId: destinationFarm.id, relatedFarmId: source.farmId, itemId: target.id, type: "Transfer in", quantity, unit: source.unit, date: transfer.date, reason: transfer.reason.trim(), notes: transfer.notes, referenceId, createdAt: now },
    ];
    commitModule2Collections([["inventory-items", "jari-simulated-inventory-items", nextItems], ["inventory-transactions", "jari-simulated-inventory-transactions", [...transactions, ...pair]]], `Transferred ${quantity} ${source.unit} of ${source.name} to ${destinationFarm.name}`);
    return { referenceId, transactions: pair };
};

export const transferInventoryBetweenLocations = (transfer: { itemId: string; destinationStorageLocation: string; quantity: number; date: string; reason: string; notes?: string }) => {
    const userId = currentFarmerId();
    const source = getInventoryItems().find((item) => item.id === transfer.itemId);
    const destinationLocation = transfer.destinationStorageLocation.trim();
    const quantity = Number(transfer.quantity);
    if (!userId || !source || !destinationLocation) throw new Error("Choose inventory stock and a destination storage location.");
    if (destinationLocation.toLowerCase() === (source.storageLocation || "").trim().toLowerCase()) throw new Error("Choose a different storage location.");
    const wholeUnit = ["doses", "packs", "tablets", "pieces"].includes(source.unit.toLowerCase());
    if (!Number.isFinite(quantity) || quantity <= 0 || (wholeUnit && !Number.isInteger(quantity)) || quantity > source.currentQuantity) throw new Error(`Enter a positive quantity${wholeUnit ? " in whole units" : ""} no greater than ${source.currentQuantity} ${source.unit}.`);
    if (!transfer.date || transfer.date > new Date().toISOString().slice(0, 10) || !transfer.reason.trim()) throw new Error("Enter a valid transfer date and reason.");
    if (source.expired) throw new Error("Expired stock cannot be transferred as usable inventory.");
    const items = readModule2Collection<InventoryItemRecord[]>("inventory-items", "jari-simulated-inventory-items", []);
    let target = getInventoryItems().find((item) => item.farmId === source.farmId && item.name.trim().toLowerCase() === source.name.trim().toLowerCase() && (item.lotNumber || "").trim().toLowerCase() === (source.lotNumber || "").trim().toLowerCase() && (item.storageLocation || "").trim().toLowerCase() === destinationLocation.toLowerCase());
    const now = new Date().toISOString();
    let nextItems = items;
    if (target && target.unit !== source.unit) throw new Error("The destination item uses a different measurement unit.");
    if (!target) {
        target = { ...source, id: idFor("inventory-item"), initialQuantity: 0, storageLocation: destinationLocation, createdAt: now, updatedAt: now };
        nextItems = [...items, target];
    }
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    const referenceId = idFor("location-transfer");
    const pair: InventoryTransactionRecord[] = [
        { id: `${referenceId}-out`, userId, farmId: source.farmId, itemId: source.id, type: "Transfer out", quantity, unit: source.unit, date: transfer.date, reason: transfer.reason.trim(), notes: transfer.notes, referenceId, relatedStorageLocation: destinationLocation, createdAt: now },
        { id: `${referenceId}-in`, userId, farmId: source.farmId, itemId: target.id, type: "Transfer in", quantity, unit: source.unit, date: transfer.date, reason: transfer.reason.trim(), notes: transfer.notes, referenceId, relatedStorageLocation: source.storageLocation, createdAt: now },
    ];
    commitModule2Collections([["inventory-items", "jari-simulated-inventory-items", nextItems], ["inventory-transactions", "jari-simulated-inventory-transactions", [...transactions, ...pair]]], `Transferred ${quantity} ${source.unit} to ${destinationLocation}`);
    return { referenceId, transactions: pair };
};

export const addFlockMovement = (movement: Omit<FarmFlockMovement, "id">) => {
    const quantity = Number(movement.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Enter a whole number of birds greater than zero.");
    if (!movement.date || !movement.reason.trim() || movement.date > new Date().toISOString().slice(0, 10)) throw new Error("Add a valid date on or before today and the reason for this bird count change.");
    if (movement.type === "Adjustment" && !movement.adjustmentDirection) throw new Error("Choose whether the population correction adds or removes birds.");
    const flocks = getFlockRecords();
    const flockIndex = flocks.findIndex((flock) => movement.flockId ? flock.id === movement.flockId : flock.name === movement.flock && (!movement.farmId || flock.farmId === movement.farmId));
    if (flockIndex < 0) throw new Error("Choose a bird group that exists on your farm.");
    if (flocks[flockIndex].status !== "Active") throw new Error("Only active bird groups can receive population changes.");
    const reducesBirds = ["Mortality", "Culling", "Sale", "Transfer out"].includes(movement.type) || (movement.type === "Adjustment" && movement.adjustmentDirection === "Decrease");
    const nextCount = flocks[flockIndex].birds + (reducesBirds ? -quantity : quantity);
    if (nextCount < 0) throw new Error("This record is greater than the number of birds in the group.");
    if (!reducesBirds && flocks[flockIndex].status === "Active") {
        const house = getPoultryHouses().find((item) => item.id === flocks[flockIndex].houseId);
        const houseBirds = getHousePopulation(flocks[flockIndex].houseId || "");
        if (house && houseBirds + quantity > house.capacity) throw new Error(`There is only ${Math.max(0, house.capacity - houseBirds).toLocaleString()} spaces left in ${house.name}.`);
    }
    const nextFlocks = [...flocks];
    nextFlocks[flockIndex] = { ...nextFlocks[flockIndex], birds: nextCount, status: nextCount === 0 ? "Completed" : "Active", updatedAt: new Date().toISOString() };
    const nextMovement: FarmFlockMovement = { ...movement, id: idFor("movement"), quantity, userId: currentFarmerId() || "legacy-user", responsibleUser: movement.responsibleUser || currentFarmerId() || undefined, farmId: movement.farmId || flocks[flockIndex].farmId, flockId: movement.flockId || flocks[flockIndex].id, houseId: movement.houseId || flocks[flockIndex].houseId, createdAt: new Date().toISOString() };
    const movements = getFlockMovements();
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...movements, nextMovement]]], "Bird group record added");
    return nextMovement;
};

export const addFlockTransfer = (transfer: { source: string; destination: string; sourceId?: string; destinationId?: string; date: string; quantity: number; reason: string; notes?: string }) => {
    const quantity = Number(transfer.quantity);
    if (transfer.sourceId ? transfer.sourceId === transfer.destinationId : transfer.source === transfer.destination) throw new Error("Choose two different bird groups.");
    if (!transfer.date || !transfer.reason.trim() || !Number.isInteger(quantity) || quantity < 1) throw new Error("Enter a date, reason and whole number of birds to transfer.");
    const flocks = getFlockRecords();
    const source = flocks.find((flock) => (transfer.sourceId ? flock.id === transfer.sourceId : flock.name === transfer.source) && flock.status === "Active");
    const destination = flocks.find((flock) => (transfer.destinationId ? flock.id === transfer.destinationId : flock.name === transfer.destination) && flock.status === "Active");
    if (!source || !destination) throw new Error("Choose two active bird groups on your farm.");
    if (source.farmId !== destination.farmId) throw new Error("A transfer between farms must be recorded through the farm transfer workflow.");
    if (quantity > source.birds) throw new Error(`Only ${source.birds.toLocaleString()} birds are currently in ${source.name}.`);
    const destinationHouse = getPoultryHouses().find((house) => house.id === destination.houseId);
    const inDestinationHouse = getHousePopulation(destination.houseId || "");
    if (source.houseId !== destination.houseId && destinationHouse && inDestinationHouse + quantity > destinationHouse.capacity) throw new Error(`There is only ${Math.max(0, destinationHouse.capacity - inDestinationHouse).toLocaleString()} spaces left in ${destination.house}.`);

    const nextFlocks = flocks.map((flock) => flock.id === source.id ? { ...flock, birds: flock.birds - quantity, status: flock.birds === quantity ? "Completed" as const : flock.status, updatedAt: new Date().toISOString() } : flock.id === destination.id ? { ...flock, birds: flock.birds + quantity, updatedAt: new Date().toISOString() } : flock);
    const movements = getFlockMovements();
    const pairId = idFor("transfer");
    const notes = [transfer.notes, `Transfer reference: ${pairId}`].filter(Boolean).join("\n");
    const nextMovements: FarmFlockMovement[] = [
        { id: `${pairId}-out`, flock: source.name, flockId: source.id, userId: source.userId, farmId: source.farmId, houseId: source.houseId, responsibleUser: currentFarmerId() || undefined, createdAt: new Date().toISOString(), date: transfer.date, type: "Transfer out", quantity, reason: transfer.reason.trim(), notes },
        { id: `${pairId}-in`, flock: destination.name, flockId: destination.id, userId: destination.userId, farmId: destination.farmId, houseId: destination.houseId, responsibleUser: currentFarmerId() || undefined, createdAt: new Date().toISOString(), date: transfer.date, type: "Transfer in", quantity, reason: transfer.reason.trim(), notes },
    ];
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...movements, ...nextMovements]]], `Transferred ${quantity.toLocaleString()} birds from ${source.name} to ${destination.name}`);
    return { reference: pairId, movements: nextMovements };
};

export const transferFlockBetweenFarms = (transfer: { flockId: string; destinationFarmId: string; destinationHouseId: string; destinationBatchName: string; date: string; quantity: number; reason: string; notes?: string }) => {
    const flocks = getFlockRecords();
    const source = flocks.find((flock) => flock.id === transfer.flockId && flock.status === "Active");
    const userId = currentFarmerId();
    const destinationFarm = getFarmerFarms().find((farm) => farm.id === transfer.destinationFarmId);
    const destinationHouse = getPoultryHouses().find((house) => house.id === transfer.destinationHouseId && house.farmId === transfer.destinationFarmId && house.status === "Active" && !house.archived);
    const quantity = Number(transfer.quantity);
    const destinationName = transfer.destinationBatchName.trim();
    if (!source || !destinationFarm || !destinationHouse || !userId) throw new Error("Choose an active source group and a destination farm house in your account.");
    if (source.farmId === transfer.destinationFarmId) throw new Error("For the same farm, use the house reassignment or group transfer action.");
    if (!destinationName || !transfer.date || !transfer.reason.trim() || !Number.isInteger(quantity) || quantity < 1) throw new Error("Enter a destination group name, date, reason and whole positive bird count.");
    if (quantity > source.birds) throw new Error(`Only ${source.birds.toLocaleString()} birds are currently in ${source.name}.`);
    if (flocks.some((flock) => flock.farmId === transfer.destinationFarmId && flock.name.trim().toLowerCase() === destinationName.toLowerCase())) throw new Error("A bird group with this name already exists on the destination farm.");
    const occupancy = getHousePopulation(destinationHouse.id!);
    if (occupancy + quantity > destinationHouse.capacity) throw new Error(`There are only ${Math.max(0, destinationHouse.capacity - occupancy).toLocaleString()} spaces in ${destinationHouse.name}.`);
    const now = new Date().toISOString();
    const pairId = idFor("farm-flock-transfer");
    const destination: FlockRecord = { ...source, id: idFor("flock"), userId, farmId: destinationFarm.id, houseId: destinationHouse.id, house: destinationHouse.name, name: destinationName, reference: destinationName, birds: quantity, initialBirds: quantity, status: "Active", sourceFlockId: source.id, transferReference: pairId, acquisitionDate: transfer.date, createdAt: now, updatedAt: now };
    const nextFlocks = flocks.map((flock) => flock.id === source.id ? { ...flock, birds: flock.birds - quantity, status: flock.birds === quantity ? "Completed" as const : flock.status, updatedAt: now } : flock).concat(destination);
    const notes = [transfer.notes, `Cross-farm transfer reference: ${pairId}`].filter(Boolean).join("\n");
    const movements = getFlockMovements();
    const pair: FarmFlockMovement[] = [
        { id: `${pairId}-out`, flock: source.name, flockId: source.id, farmId: source.farmId, houseId: source.houseId, userId, responsibleUser: userId, createdAt: now, date: transfer.date, type: "Transfer out", quantity, reason: transfer.reason.trim(), notes },
        { id: `${pairId}-in`, flock: destination.name, flockId: destination.id, farmId: destination.farmId, houseId: destination.houseId, userId, responsibleUser: userId, createdAt: now, date: transfer.date, type: "Transfer in", quantity, reason: transfer.reason.trim(), notes },
    ];
    const assignments = getFlockHouseAssignments().filter((record) => !record.id.startsWith("opening-assignment-"));
    assignments.push({ id: idFor("house-assignment"), userId, farmId: destination.farmId, flockId: destination.id!, fromHouseId: null, toHouseId: destinationHouse.id!, effectiveDate: transfer.date, reason: `Received via ${pairId}`, createdAt: now });
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...movements, ...pair]], ["flock-house-assignments", "jari-simulated-flock-house-assignments", assignments]], `Transferred ${quantity.toLocaleString()} birds from ${source.name} to ${destination.name} on ${destinationFarm.name}`);
    return { reference: pairId, flock: destination, movements: pair };
};

export const createFlockRecord = (flock: Omit<FlockRecord, "id" | "birds" | "status"> & { birds: number }) => {
    const existing = getFlockRecords();
    if (!flock.name.trim()) throw new Error("Enter a name for this bird group.");
    const farmId = flock.farmId || primaryFarmIdForCurrentUser();
    if (currentFarmerId() && !getFarmerFarms().some((farm) => farm.id === farmId)) throw new Error("Choose a farm that belongs to your account.");
    if (existing.some((record) => record.farmId === farmId && record.name.trim().toLowerCase() === flock.name.trim().toLowerCase())) throw new Error("A bird group with this name already exists on this farm.");
    if (!Number.isInteger(flock.birds) || flock.birds <= 0) throw new Error("Enter a whole opening number of birds greater than zero.");
    if ((flock.ageAtAcquisition !== undefined && (!Number.isFinite(flock.ageAtAcquisition) || flock.ageAtAcquisition < 0)) || (flock.purchaseCost !== undefined && (!Number.isFinite(flock.purchaseCost) || flock.purchaseCost < 0))) throw new Error("Check the bird age and purchase cost.");
    const isValidDate = (value?: string) => !value || Number.isFinite(new Date(`${value}T00:00:00`).getTime());
    const today = new Date().toISOString().slice(0, 10);
    if (!isValidDate(flock.acquisitionDate) || !isValidDate(flock.hatchDate) || (flock.acquisitionDate && flock.acquisitionDate > today) || (flock.hatchDate && flock.hatchDate > today) || (flock.hatchDate && flock.acquisitionDate && flock.hatchDate > flock.acquisitionDate)) throw new Error("Check the hatch and acquisition dates.");
    if (flock.ageAtAcquisition !== undefined && (!flock.acquisitionDate || flock.hatchDate)) throw new Error("Enter an acquisition date with age at acquisition, or use the hatch date instead.");
    const house = getPoultryHouses().find((item) => (flock.houseId ? item.id === flock.houseId : item.name === flock.house) && item.farmId === farmId && !item.archived && (item.status || "Active") === "Active");
    if (!house) throw new Error("Choose an active house that belongs to this farm.");
    const alreadyInHouse = getHousePopulation(house.id!);
    if (alreadyInHouse + flock.birds > house.capacity) throw new Error(`This group would exceed ${house.name}'s capacity. There are ${Math.max(0, house.capacity - alreadyInHouse).toLocaleString()} spaces available.`);
    const now = new Date().toISOString();
    const created: FlockRecord = { ...flock, id: idFor("flock"), userId: currentFarmerId() || "legacy-user", farmId, houseId: house.id, house: house.name, reference: flock.reference || flock.name.trim(), name: flock.name.trim(), status: "Active", initialBirds: flock.birds, birds: flock.birds, createdAt: now, updatedAt: now };
    const movements = getFlockMovements();
    const date = flock.acquisitionDate || flock.cycleStart || new Date().toISOString().slice(0, 10);
    const initialMovement: FarmFlockMovement = { id: idFor("movement"), flock: created.name, flockId: created.id, farmId, houseId: house.id, userId: created.userId, responsibleUser: created.userId, createdAt: now, date, type: "Initial stocking", quantity: flock.birds, reason: "Opening bird count" };
    const assignments = getFlockHouseAssignments().filter((item) => !item.id.startsWith("opening-assignment-"));
    const assignment: FlockHouseAssignment = { id: idFor("house-assignment"), userId: created.userId!, farmId, flockId: created.id!, fromHouseId: null, toHouseId: house.id!, effectiveDate: date, reason: "Initial batch registration", createdAt: now };
    const lifecycle: FlockLifecycleRecord = { id: idFor("flock-event"), userId: created.userId!, farmId, flockId: created.id!, date, event: "Batch registered", details: `${created.type} · ${created.birds.toLocaleString()} birds · ${house.name}`, createdAt: now };
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, [...existing, created]], ["flock-movements", STORAGE_KEYS.flockMovements, [...movements, initialMovement]], ["flock-house-assignments", "jari-simulated-flock-house-assignments", [...assignments, assignment]], ["flock-lifecycle-events", "jari-simulated-flock-lifecycle-events", [...getFlockLifecycleEvents(), lifecycle]]], `Bird group ${created.name} added`);
    return created;
};

export const updateFlockRecord = (flockId: string, changes: Partial<Pick<FlockRecord, "name" | "type" | "category" | "breed" | "hatchDate" | "acquisitionDate" | "ageAtAcquisition" | "ageUnit" | "source" | "supplier">>) => {
    const records = getFlockRecords();
    const current = records.find((record) => record.id === flockId);
    if (!current) throw new Error("Bird group not found.");
    if (current.status === "Archived") throw new Error("Archived groups are read-only.");
    const name = (changes.name ?? current.name).trim();
    if (!name) throw new Error("Enter a bird group name.");
    if (records.some((record) => record.id !== flockId && record.farmId === current.farmId && record.name.trim().toLowerCase() === name.toLowerCase())) throw new Error("A bird group with this name already exists on this farm.");
    const updated = { ...current, ...changes, name, reference: changes.name ? name : current.reference, breed: changes.breed?.trim() || (changes.breed === "" ? undefined : current.breed), source: changes.source?.trim() || (changes.source === "" ? undefined : current.source), supplier: changes.supplier?.trim() || (changes.supplier === "" ? undefined : current.supplier) };
    const today = new Date().toISOString().slice(0, 10);
    const isValidDate = (value?: string) => !value || Number.isFinite(new Date(`${value}T00:00:00`).getTime());
    if (!isValidDate(updated.hatchDate) || !isValidDate(updated.acquisitionDate) || (updated.hatchDate && updated.hatchDate > today) || (updated.acquisitionDate && updated.acquisitionDate > today) || (updated.hatchDate && updated.acquisitionDate && updated.hatchDate > updated.acquisitionDate)) throw new Error("Check the hatch and acquisition dates.");
    if (updated.ageAtAcquisition !== undefined && (!Number.isFinite(updated.ageAtAcquisition) || updated.ageAtAcquisition < 0 || !updated.acquisitionDate || updated.hatchDate)) throw new Error("Enter a non-negative age with an acquisition date, or use the hatch date instead.");
    const now = new Date().toISOString();
    const saved = { ...updated, updatedAt: now };
    const lifecycle: FlockLifecycleRecord = { id: idFor("flock-event"), userId: currentFarmerId() || current.userId || "legacy-user", farmId: current.farmId || primaryFarmIdForCurrentUser(), flockId, date: today, event: "Batch details updated", details: `Updated: ${Object.keys(changes).join(", ")}`, createdAt: now };
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, records.map((record) => record.id === flockId ? saved : record)], ["flock-lifecycle-events", "jari-simulated-flock-lifecycle-events", [...getFlockLifecycleEvents(), lifecycle]]], `Bird group ${name} updated`);
    return saved;
};

export const savePoultryHouses = (value: FarmHouseRecord[]) => writeModule2Collection("houses", STORAGE_KEYS.poultryHouses, value);

export const createPoultryHouse = (house: FarmHouseRecord) => {
    const houses = getPoultryHouses();
    const farmId = house.farmId || primaryFarmIdForCurrentUser();
    if (currentFarmerId() && !getFarmerFarms().some((farm) => farm.id === farmId)) throw new Error("Choose a farm that belongs to your account.");
    if (houses.some((item) => item.farmId === farmId && item.name.trim().toLowerCase() === house.name.trim().toLowerCase())) throw new Error("A farm house with this name already exists on this farm.");
    if (!house.name.trim() || !Number.isInteger(house.capacity) || house.capacity < 0) throw new Error("Add a house name and a non-negative whole-number capacity.");
    const now = new Date().toISOString();
    const created: FarmHouseRecord = { ...house, id: house.id || idFor("house"), userId: currentFarmerId() || "legacy-user", farmId, reference: house.reference || house.name.trim(), name: house.name.trim(), status: house.status || "Active", archived: house.status === "Archived", createdAt: now, updatedAt: now };
    commitModule2Collections([["houses", STORAGE_KEYS.poultryHouses, [...houses, created]]], `House ${created.name} added`);
    return created;
};

export const updatePoultryHouse = (previousName: string, updated: FarmHouseRecord) => {
    const houses = getPoultryHouses();
    const existing = houses.find((item) => item.id === previousName || item.name === previousName);
    if (!existing) throw new Error("This farm house could not be found.");
    if (houses.some((item) => item.id !== existing.id && item.farmId === existing.farmId && item.name.trim().toLowerCase() === updated.name.trim().toLowerCase())) throw new Error("A farm house with this name already exists on this farm.");
    if (!updated.name.trim() || !Number.isInteger(updated.capacity) || updated.capacity < 0) throw new Error("Add a house name and a non-negative whole-number capacity.");
    const assignedBirds = getHousePopulation(existing.id!);
    if (updated.capacity < assignedBirds) throw new Error(`This house has ${assignedBirds} birds. Its capacity cannot be set lower than that.`);
    const now = new Date().toISOString();
    if (updated.status === "Archived" && getHousePopulation(existing.id!) > 0) throw new Error("Move or finish the bird groups in this house before archiving it.");
    const saved: FarmHouseRecord = { ...existing, ...updated, id: existing.id, userId: existing.userId, farmId: existing.farmId, name: updated.name.trim(), reference: updated.reference?.trim() || existing.reference || updated.name.trim(), status: updated.status || existing.status || "Active", archived: updated.status === "Archived", updatedAt: now };
    const next = houses.map((item) => item.id === existing.id ? saved : item);
    const nextFlocks = getFlockRecords().map((flock) => flock.houseId === existing.id ? { ...flock, house: saved.name, updatedAt: now } : flock);
    commitModule2Collections([["houses", STORAGE_KEYS.poultryHouses, next], ["flocks", STORAGE_KEYS.flockRecords, nextFlocks]], `House ${saved.name} updated`);
    return saved;
};

export const updatePoultryHouseStatus = (id: string, status: NonNullable<FarmHouseRecord["status"]>) => {
    const house = getPoultryHouses().find((item) => item.id === id);
    if (!house) throw new Error("This farm house could not be found.");
    if (status === "Archived" && getHousePopulation(id) > 0) throw new Error("Move or complete the active batches before archiving this house.");
    const now = new Date().toISOString();
    const updated = { ...house, status, archived: status === "Archived", updatedAt: now };
    commitModule2Collections([["houses", STORAGE_KEYS.poultryHouses, getPoultryHouses().map((item) => item.id === id ? updated : item)]], `House ${house.name} marked ${status.toLowerCase()}`);
    return updated;
};

export const moveFlockToHouse = (flockId: string, toHouseId: string, effectiveDate = new Date().toISOString().slice(0, 10), reason = "House reassignment") => {
    const flocks = getFlockRecords();
    const flock = flocks.find((item) => item.id === flockId);
    const destination = getPoultryHouses().find((item) => item.id === toHouseId);
    if (!flock || !destination) throw new Error("Choose a batch and a valid destination house.");
    if (flock.farmId !== destination.farmId) throw new Error("A batch can only be moved between houses on the same farm. Use a farm transfer for cross-farm movement.");
    if (destination.status !== "Active" || destination.archived) throw new Error("Choose an active destination house.");
    if (flock.houseId === destination.id) throw new Error("This batch is already assigned to that house.");
    const occupancy = getHousePopulation(destination.id!);
    if (occupancy + (flock.status === "Active" ? flock.birds : 0) > destination.capacity) throw new Error(`This move would exceed ${destination.name}'s capacity (${occupancy} of ${destination.capacity} birds are recorded).`);
    const now = new Date().toISOString();
    const assignment: FlockHouseAssignment = { id: idFor("house-assignment"), userId: flock.userId || currentFarmerId() || "legacy-user", farmId: flock.farmId!, flockId, fromHouseId: flock.houseId || null, toHouseId: destination.id!, effectiveDate, reason, createdAt: now };
    const nextFlocks = flocks.map((item) => item.id === flockId ? { ...item, houseId: destination.id, house: destination.name, updatedAt: now } : item);
    const assignments = getFlockHouseAssignments().filter((item) => !item.id.startsWith("opening-assignment-"));
    const movement: FarmFlockMovement = { id: idFor("movement"), flock: flock.name, flockId, farmId: flock.farmId, houseId: destination.id, userId: assignment.userId, responsibleUser: assignment.userId, createdAt: now, date: effectiveDate, type: "Adjustment", quantity: 0, reason, notes: `House assignment changed from ${flock.house} to ${destination.name}. Bird population is unchanged.` };
    commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-house-assignments", "jari-simulated-flock-house-assignments", [...assignments, assignment]], ["flock-movements", STORAGE_KEYS.flockMovements, [...getFlockMovements(), movement]]], `Moved ${flock.name} to ${destination.name}`);
    return assignment;
};

export const archivePoultryHouse = (idOrName: string) => {
    const house = getPoultryHouses().find((item) => item.id === idOrName || item.name === idOrName);
    if (!house) throw new Error("This farm house could not be found.");
    const hasActiveBirds = getFlockRecords().some((flock) => flock.houseId === house.id && flock.status === "Active");
    if (hasActiveBirds) throw new Error("Move or finish the bird groups in this house before archiving it.");
    updatePoultryHouseStatus(house.id!, "Archived");
};

export const getProductionRecords = () => readStorage<ProductionRecord[]>(STORAGE_KEYS.productionRecords, []);
export const saveProductionRecords = (value: ProductionRecord[]) => writeWithActivity(STORAGE_KEYS.productionRecords, value);

const readSalesRecords = () => readModule2Collection<SalesEntry[]>("sales", STORAGE_KEYS.salesRecords, []);
export const getSalesRecords = () => readSalesRecords().map((record, index) => {
    const amount = numberFromAmount(record.amount);
    const amountReceived = record.amountReceived ?? Math.max(0, amount - (record.outstanding ?? amount));
    const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock && (!record.farmId || item.farmId === record.farmId)));
    return { ...record, id: record.id || `legacy-sale-${index}`, flockId: record.flockId || flock?.id, farmId: record.farmId || flock?.farmId, amount, amountReceived, outstanding: record.outstanding ?? Math.max(0, amount - amountReceived), status: record.status || (amountReceived >= amount ? "Paid" : amountReceived > 0 ? "Part paid" : "Unpaid") };
});
export const saveSalesRecords = (value: SalesEntry[]) => commitModule2Collections([["sales", STORAGE_KEYS.salesRecords, value]], "Sales records updated");

const readExpensesRecords = () => readStorage<ExpenseEntry[]>(STORAGE_KEYS.expensesRecords, []);
export const getExpensesRecords = () => readExpensesRecords().map((record, index) => {
    const amount = numberFromAmount(record.amount);
    const amountPaid = record.amountPaid ?? Math.max(0, amount - (record.outstanding ?? amount));
    return { ...record, id: record.id || `legacy-expense-${index}`, amount, amountPaid, outstanding: record.outstanding ?? Math.max(0, amount - amountPaid) };
});
export const saveExpensesRecords = (value: ExpenseEntry[]) => writeWithActivity(STORAGE_KEYS.expensesRecords, value);

export const getFarmAssets = () => readStorage<FarmAssetRecord[]>(STORAGE_KEYS.farmAssets, []);
export const saveFarmAssets = (value: FarmAssetRecord[]) => {
    const names = new Set<string>();
    value.forEach((asset) => {
        const name = asset.name.trim().toLocaleLowerCase();
        if (!name || names.has(name)) throw new Error("Equipment names must be filled in and unique.");
        names.add(name);
        if (!Number.isInteger(asset.quantity) || asset.quantity < 0 || !Number.isFinite(asset.value) || asset.value < 0 || !["Working", "Needs repair"].includes(asset.status)) throw new Error("Check each equipment count, value and condition.");
    });
    writeWithActivity(STORAGE_KEYS.farmAssets, value);
};
export const addFarmAsset = (asset: FarmAssetRecord) => {
    if (getFarmAssets().some((item) => item.name.trim().toLocaleLowerCase() === asset.name.trim().toLocaleLowerCase())) throw new Error("Equipment with this name already exists.");
    saveFarmAssets([...getFarmAssets(), { ...asset, name: asset.name.trim() }]);
};

const idFor = (prefix: string) => `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;

const activityLabels: Record<string, string> = {
    [STORAGE_KEYS.farmProfile]: "Farm details updated",
    [STORAGE_KEYS.flockRecords]: "Bird group records updated",
    [STORAGE_KEYS.poultryHouses]: "Farm house records updated",
    [STORAGE_KEYS.productionRecords]: "Production record added",
    [STORAGE_KEYS.salesRecords]: "Sale recorded",
    [STORAGE_KEYS.expensesRecords]: "Farm spending recorded",
    [STORAGE_KEYS.farmAssets]: "Equipment details updated",
    [STORAGE_KEYS.feedPurchases]: "Feed purchase recorded",
    [STORAGE_KEYS.feedUse]: "Feed use recorded",
    [STORAGE_KEYS.vaccinations]: "Vaccination record added",
    [STORAGE_KEYS.healthIncidents]: "Bird health record added",
    [STORAGE_KEYS.treatments]: "Treatment record added",
    [STORAGE_KEYS.opportunityApplications]: "Opportunity application updated",
    [STORAGE_KEYS.institutionRequests]: "Institution request updated",
    [STORAGE_KEYS.documents]: "Farm document updated",
    [STORAGE_KEYS.institutionDemoAccess]: "Institution demo sharing updated",
};

export type ActivityRecord = { id: string; text: string; createdAt: string };
export const getActivityRecords = () => readStorage<ActivityRecord[]>(STORAGE_KEYS.activity, []);
export const saveActivityRecord = (text: string) => {
    const event = { id: idFor("activity"), text, createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.activity, [event, ...getActivityRecords()].slice(0, 100));
};

const commitWithActivity = (writes: Array<[string, unknown]>, activityText: string) => {
    if (typeof window === "undefined") return;
    const event: ActivityRecord = { id: idFor("activity"), text: activityText, createdAt: new Date().toISOString() };
    const allWrites: Array<[string, unknown]> = [...writes, [STORAGE_KEYS.activity, [event, ...getActivityRecords()].slice(0, 100)]];
    const previous = allWrites.map(([key]) => [key, window.localStorage.getItem(scopedStorageKey(key))] as const);
    try {
        allWrites.forEach(([key, value]) => window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(value)));
    } catch (error) {
        previous.slice().reverse().forEach(([key, value]) => {
            try { if (value === null) window.localStorage.removeItem(scopedStorageKey(key)); else window.localStorage.setItem(scopedStorageKey(key), value); }
            catch { /* Preserve the original write error; rollback attempts continue for remaining keys. */ }
        });
        throw error;
    }
    allWrites.forEach(([key]) => emitDataChanged(key));
    window.dispatchEvent(new CustomEvent("jari:toast", { detail: { kind: "success", message: activityText } }));
};

export const getOpportunityApplications = () => readStorage<OpportunityApplicationRecord[]>(STORAGE_KEYS.opportunityApplications, []);
export const applyToOpportunity = (application: Omit<OpportunityApplicationRecord, "id" | "createdAt" | "status"> & { status?: OpportunityApplicationRecord["status"] }) => {
    const records = getOpportunityApplications();
    if (records.some((record) => record.opportunityId === application.opportunityId)) throw new Error("You have already saved this opportunity.");
    const created: OpportunityApplicationRecord = { ...application, id: idFor("application"), status: application.status || "Interested", createdAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.opportunityApplications, [...records, created]);
    return created;
};
export const updateOpportunityApplication = (id: string, status: OpportunityApplicationRecord["status"], note?: string, details?: Partial<Pick<OpportunityApplicationRecord, "requirementCheck" | "farmerName" | "farmName" | "birdCount" | "houseCount" | "profileScore">>) => {
    const records = getOpportunityApplications();
    if (!records.some((record) => record.id === id)) throw new Error("Application not found.");
    const next = records.map((record) => record.id === id ? { ...record, ...details, status, note: note ?? record.note } : record);
    writeWithActivity(STORAGE_KEYS.opportunityApplications, next);
    return next;
};
export const getInstitutionRequests = () => readStorage<InstitutionRequestRecord[]>(STORAGE_KEYS.institutionRequests, []);
export const addInstitutionRequest = (request: Omit<InstitutionRequestRecord, "id" | "status" | "createdAt">) => {
    if (!request.institutionName.trim() || !request.purpose.trim() || !request.message.trim()) throw new Error("Add an institution name, request purpose and message.");
    const created: InstitutionRequestRecord = { ...request, institutionName: request.institutionName.trim(), purpose: request.purpose.trim(), message: request.message.trim(), id: idFor("institution-request"), status: "Open", createdAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.institutionRequests, [...getInstitutionRequests(), created]);
    return created;
};
export const updateInstitutionRequest = (id: string, status: InstitutionRequestRecord["status"]) => {
    const records = getInstitutionRequests();
    if (!records.some((record) => record.id === id)) throw new Error("This request could not be found.");
    const next = records.map((record) => record.id === id ? { ...record, status } : record);
    writeWithActivity(STORAGE_KEYS.institutionRequests, next);
    return next;
};
export const getUserPreferences = () => readStorage<UserPreferences>(STORAGE_KEYS.userPreferences, { productionReminders: true, healthReminders: true, financialUpdates: true, analyticsConsent: false });
export const saveUserPreferences = (preferences: UserPreferences) => writeStorage(STORAGE_KEYS.userPreferences, preferences);
export const getInstitutionDemoAccess = () => {
    const access = readStorage<InstitutionDemoAccess>(STORAGE_KEYS.institutionDemoAccess, { shared: false });
    // Only a saved, timestamped choice enables sharing; legacy defaults are not consent.
    if (!access.updatedAt) return { shared: false };
    return access;
};
export const saveInstitutionDemoAccess = (shared: boolean) => writeWithActivity(STORAGE_KEYS.institutionDemoAccess, { shared, updatedAt: new Date().toISOString() });
export const getInstitutionRegistrations = () => readStorage<InstitutionRegistrationRecord[]>(INSTITUTION_REGISTRATIONS_KEY, []);
export const getInstitutionRegistration = (userId: string) => getInstitutionRegistrations().find((application) => application.userId === userId) || null;
export const saveInstitutionRegistration = (application: Omit<InstitutionRegistrationRecord, "id" | "submittedAt" | "status">) => {
    if (!application.userId || !application.organisationName.trim() || !application.categories.length || !application.representative.fullName.trim()) throw new Error("Complete the required institution details before submitting.");
    if (!application.documents.length) throw new Error("Add the verification documents required for the selected services.");
    const existing = getInstitutionRegistrations();
    const created: InstitutionRegistrationRecord = { ...application, id: idFor("institution"), status: "Pending Verification", submittedAt: new Date().toISOString() };
    const next = [...existing.filter((item) => item.userId !== application.userId), created];
    commitWithActivity([[INSTITUTION_REGISTRATIONS_KEY, next]], `${created.organisationName} institution application submitted`);
    return created;
};
export const getFarmDocuments = () => readStorage<FarmDocumentRecord[]>(STORAGE_KEYS.documents, []);
export const addFarmDocument = (document: Omit<FarmDocumentRecord, "id" | "addedAt">) => {
    if (!document.name.trim() || !document.dataUrl.startsWith("data:")) throw new Error("Choose a valid file to upload.");
    if (document.size > 1_500_000) throw new Error("This demo supports files up to 1.5 MB.");
    const next: FarmDocumentRecord = { ...document, id: idFor("document"), name: document.name.trim(), addedAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.documents, [...getFarmDocuments(), next]);
    return next;
};
export const removeFarmDocument = (id: string) => writeWithActivity(STORAGE_KEYS.documents, getFarmDocuments().filter((item) => item.id !== id));

const baseWriteStorage = writeStorage;
// Wrap the storage writer once so every saved workflow leaves a visible activity trail.
const originalWriteStorage = baseWriteStorage;
const writeWithActivity = <T,>(key: string, value: T) => {
    const label = activityLabels[key];
    if (label && key !== STORAGE_KEYS.activity) commitWithActivity([[key, value]], label);
    else originalWriteStorage(key, value);
};

export const getFeedPurchases = () => readModule2Collection<FeedPurchaseRecord[]>("feed-purchases", STORAGE_KEYS.feedPurchases, []).map((record) => {
    const flock = getFlockRecords().find((item) => record.flockId ? item.id === record.flockId : record.flock ? item.name === record.flock : false);
    return { ...record, userId: record.userId || currentFarmerId() || undefined, farmId: record.farmId || flock?.farmId || primaryFarmIdForCurrentUser(), flockId: record.flockId || flock?.id, createdAt: record.createdAt || new Date(0).toISOString() };
});
export const saveFeedPurchases = (value: FeedPurchaseRecord[]) => writeModule2Collection("feed-purchases", STORAGE_KEYS.feedPurchases, value);
export const addFeedPurchase = (purchase: Omit<FeedPurchaseRecord, "id">) => {
    if (!purchase.date || !purchase.feedType.trim() || !purchase.brand.trim()) throw new Error("Choose a purchase date and feed type, then enter the brand.");
    if (!Number.isFinite(purchase.quantity) || purchase.quantity <= 0 || !Number.isFinite(purchase.amount) || purchase.amount < 0) throw new Error("Enter a feed quantity greater than zero and a valid cost.");
    if (purchase.unit === "bags" && (!Number.isFinite(purchase.bagWeightKg) || purchase.bagWeightKg <= 0)) throw new Error("Enter the weight of each feed bag.");
    if (!Number.isFinite(purchase.amountPaid) || purchase.amountPaid < 0 || purchase.amountPaid > purchase.amount) throw new Error("The amount paid cannot be greater than the purchase cost.");
    migrateFeedLedger();
    const userId = currentFarmerId();
    if (!userId) throw new Error("Sign in as a farmer before recording a feed purchase.");
    const flock = purchase.flockId ? getFlockRecords().find((item) => item.id === purchase.flockId) : purchase.flock ? getFlockRecords().find((item) => item.name === purchase.flock) : undefined;
    if (purchase.flock && !flock) throw new Error("Choose a bird group that exists on your farm.");
    const farmId = purchase.farmId || flock?.farmId || primaryFarmIdForCurrentUser();
    if (flock && flock.farmId !== farmId) throw new Error("A feed purchase and its bird group must belong to the same farm.");
    const feedItem = getInventoryItems().find((item) => item.farmId === farmId && item.category === "Feed" && item.feedType === purchase.feedType && item.brand === purchase.brand);
    const inventoryItem = feedItem || createInventoryItem({ farmId, name: `${purchase.feedType} · ${purchase.brand}`, category: "Feed", feedType: purchase.feedType, brand: purchase.brand, itemType: "Consumable", unit: "kg", initialQuantity: 0, minimumStock: 0, supplier: purchase.supplier });
    const id = idFor("feed-purchase");
    const now = new Date().toISOString();
    const transaction: InventoryTransactionRecord = { id: idFor("inventory-transaction"), userId, farmId, itemId: inventoryItem.id, type: "Stock received", quantity: purchase.quantity * (purchase.unit === "bags" ? purchase.bagWeightKg : 1), unit: "kg", date: purchase.date, reason: `Feed purchase · ${purchase.brand}`, supplier: purchase.supplier, purchaseCost: purchase.amount, amountPaid: purchase.amountPaid, feedType: purchase.feedType, brand: purchase.brand, bagWeightKg: purchase.unit === "bags" ? purchase.bagWeightKg : 1, flockId: flock?.id, referenceId: `feed-purchase:${id}`, createdAt: now };
    const created = { ...purchase, id, userId, farmId, flockId: flock?.id, flock: flock?.name, createdAt: now, inventoryTransactionId: transaction.id };
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    commitModule2Collections([["inventory-transactions", "jari-simulated-inventory-transactions", [...transactions, transaction]], ["feed-purchases", STORAGE_KEYS.feedPurchases, [...getFeedPurchases(), created]]], `${purchase.feedType} feed purchase recorded`);
    return created;
};

export const getFeedUseRecords = () => readModule2Collection<FeedUseRecord[]>("feed-use", STORAGE_KEYS.feedUse, []).map((record) => {
    const flock = getFlockRecords().find((item) => record.flockId ? item.id === record.flockId : item.name === record.flock);
    return { ...record, userId: record.userId || currentFarmerId() || undefined, farmId: record.farmId || flock?.farmId || primaryFarmIdForCurrentUser(), flockId: record.flockId || flock?.id, createdAt: record.createdAt || new Date(0).toISOString() };
});
export const saveFeedUseRecords = (value: FeedUseRecord[]) => writeModule2Collection("feed-use", STORAGE_KEYS.feedUse, value);

const migrateFeedLedger = () => {
    const userId = currentFarmerId();
    if (!userId || typeof window === "undefined") return;
    const marker = module2Key(userId, "feed-ledger-migrated");
    if (window.localStorage.getItem(marker) === "true") return;
    const purchases = getFeedPurchases();
    const uses = getFeedUseRecords();
    const transactions = readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []);
    for (const purchase of purchases) {
        const referenceId = `feed-purchase:${purchase.id}`;
        if (transactions.some((record) => record.referenceId === referenceId)) continue;
        const flock = purchase.flockId ? getFlockRecords().find((item) => item.id === purchase.flockId) : purchase.flock ? getFlockRecords().find((item) => item.name === purchase.flock && item.farmId === purchase.farmId) : undefined;
        const farmId = purchase.farmId || flock?.farmId || primaryFarmIdForCurrentUser();
        const item = getInventoryItems().find((record) => record.farmId === farmId && record.category === "Feed" && record.feedType === purchase.feedType && record.brand === purchase.brand) || createInventoryItem({ farmId, name: `${purchase.feedType} · ${purchase.brand}`, category: "Feed", feedType: purchase.feedType, brand: purchase.brand, itemType: "Consumable", unit: "kg", initialQuantity: 0, minimumStock: 0, supplier: purchase.supplier });
        recordInventoryTransaction({ farmId, itemId: item.id, type: "Stock received", quantity: purchase.quantity * (purchase.unit === "bags" ? purchase.bagWeightKg : 1), date: purchase.date, reason: `Feed purchase · ${purchase.brand}`, supplier: purchase.supplier, purchaseCost: purchase.amount, amountPaid: purchase.amountPaid, feedType: purchase.feedType, brand: purchase.brand, bagWeightKg: purchase.unit === "bags" ? purchase.bagWeightKg : 1, flockId: flock?.id, referenceId });
    }
    for (const use of uses) {
        const referenceId = `feed-use:${use.id}`;
        if (transactions.some((record) => record.referenceId === referenceId)) continue;
        const flock = use.flockId ? getFlockRecords().find((item) => item.id === use.flockId) : getFlockRecords().find((item) => item.name === use.flock);
        const farmId = use.farmId || flock?.farmId || primaryFarmIdForCurrentUser();
        const inventory = getInventoryItems().filter((record) => record.farmId === farmId && record.category === "Feed" && (record.feedType || record.name) === use.feedType && !record.expired).sort((a, b) => (a.expiryDate || "9999-12-31").localeCompare(b.expiryDate || "9999-12-31"));
        let remaining = use.quantityKg;
        const additions: InventoryTransactionRecord[] = [];
        for (const item of inventory) {
            if (remaining <= 0) break;
            const quantity = Math.min(remaining, item.currentQuantity);
            if (quantity <= 0) continue;
            additions.push({ id: idFor("inventory-transaction"), userId, farmId, itemId: item.id, type: "Stock issued", quantity, unit: item.unit, date: use.date, reason: "Feed issued to bird group", flockId: flock?.id, notes: use.notes, referenceId, feedType: use.feedType, createdAt: new Date().toISOString() });
            remaining -= quantity;
        }
        if (remaining > 0) throw new Error(`Legacy feed use ${use.id} exceeds the matching recorded stock by ${remaining.toLocaleString()} kg; reconcile the records before continuing.`);
        if (additions.length) commitModule2Collections([["inventory-transactions", "jari-simulated-inventory-transactions", [...readModule2Collection<InventoryTransactionRecord[]>("inventory-transactions", "jari-simulated-inventory-transactions", []), ...additions]]], "Legacy feed use added to the inventory ledger");
    }
    window.localStorage.setItem(marker, "true");
};

export const getFeedInventory = (farmId?: string) => {
    migrateFeedLedger();
    const items = getInventoryItems().filter((item) => item.category === "Feed" && (!farmId || item.farmId === farmId));
    const transactions = getInventoryTransactions();
    const types = Array.from(new Set(items.map((item) => item.feedType || item.name)));
    return types.map((feedType) => {
        const matched = items.filter((item) => (item.feedType || item.name) === feedType);
        const itemIds = new Set(matched.map((item) => item.id));
        const boughtKg = transactions.filter((record) => itemIds.has(record.itemId) && record.type === "Stock received").reduce((sum, record) => sum + record.quantity, 0);
        const usedKg = transactions.filter((record) => itemIds.has(record.itemId) && record.type === "Stock issued").reduce((sum, record) => sum + record.quantity, 0);
        const availableKg = matched.reduce((sum, item) => sum + item.currentQuantity, 0);
        return { feedType, boughtKg, usedKg, availableKg };
    });
};
export const addFeedUse = (entry: Omit<FeedUseRecord, "id">) => {
    if (!entry.date || !entry.flock || !entry.feedType.trim()) throw new Error("Choose a date, bird group and feed type.");
    migrateFeedLedger();
    const flock = entry.flockId ? getFlockRecords().find((item) => item.id === entry.flockId) : getFlockRecords().find((item) => item.name === entry.flock);
    if (!flock || flock.status !== "Active") throw new Error("Choose an active bird group that exists on your farm.");
    if (!Number.isFinite(entry.quantityKg) || entry.quantityKg <= 0) throw new Error("Enter a quantity greater than zero.");
    const available = getInventoryItems().filter((item) => item.farmId === flock.farmId && item.category === "Feed" && (item.feedType || item.name) === entry.feedType && !item.expired).reduce((sum, item) => sum + item.currentQuantity, 0);
    if (entry.quantityKg > available) throw new Error(`Only ${available.toLocaleString()} kg of ${entry.feedType} feed is available.`);
    const id = idFor("feed-use");
    const created: FeedUseRecord = { ...entry, flock: flock.name, flockId: flock.id, farmId: flock.farmId, userId: currentFarmerId() || flock.userId, createdAt: new Date().toISOString(), id };
    const items = getInventoryItems().filter((item) => item.farmId === flock.farmId && item.category === "Feed" && (item.feedType || item.name) === entry.feedType && !item.expired).sort((a, b) => (a.expiryDate || "9999-12-31").localeCompare(b.expiryDate || "9999-12-31"));
    const transactions = getInventoryTransactions();
    let remaining = entry.quantityKg;
    const stockIssues: InventoryTransactionRecord[] = [];
    for (const item of items) {
        if (remaining <= 0) break;
        const quantity = Math.min(remaining, item.currentQuantity);
        if (quantity <= 0) continue;
        stockIssues.push({ id: idFor("inventory-transaction"), userId: created.userId || "legacy-user", farmId: flock.farmId || "legacy-primary-farm", itemId: item.id, type: "Stock issued", quantity, unit: item.unit, date: entry.date, reason: "Feed issued to bird group", flockId: flock.id, notes: entry.notes, referenceId: `feed-use:${id}`, feedType: entry.feedType, createdAt: created.createdAt! });
        remaining -= quantity;
    }
    if (remaining > 0) throw new Error("The selected feed stock changed while recording. Refresh and try again.");
    commitModule2Collections([["inventory-transactions", "jari-simulated-inventory-transactions", [...transactions, ...stockIssues]], ["feed-use", STORAGE_KEYS.feedUse, [...getFeedUseRecords(), { ...created, inventoryTransactionId: stockIssues[0]?.id }]]], `Recorded ${entry.quantityKg} kg of ${entry.feedType} feed for ${flock.name}`);
    return created;
};

type BatchRecordLink = { userId?: string; farmId?: string; flockId?: string; createdAt?: string };
export type VaccinationRecord = { id: string; flock: string; vaccine: string; date: string; birds: number; nextDate?: string; manufacturer?: string; lotNumber?: string; givenBy?: string; notes?: string } & BatchRecordLink;
export type HealthIncidentRecord = { id: string; flock: string; date: string; symptoms: string; affectedBirds: number; birdsLost?: number; action: string; confirmedDiagnosis?: string; outcome?: string; notes?: string; voidedAt?: string; voidReason?: string } & BatchRecordLink;
export type TreatmentRecord = { id: string; flock: string; date: string; treatment: string; medicine?: string; birdsTreated: number; givenBy?: string; notes?: string } & BatchRecordLink;
export type FlockTimelineEntry = { id: string; flockId: string; date: string; category: string; title: string; detail?: string; createdAt: string; quantity?: number };
export type FlockActivityRecord = { id: string; userId: string; farmId: string; flockId: string; activity: string; category: "Vaccination" | "Deworming" | "Health check" | "Treatment follow-up" | "Other"; scheduledDate: string; scheduledTime?: string; inventoryItemId?: string; plannedQuantity?: number; status: "Upcoming" | "Overdue" | "Completed" | "Rescheduled" | "Cancelled"; notes?: string; completionNotes?: string; createdAt: string; completedAt?: string };
export type FlockMilestoneRecord = { id: string; userId: string; farmId: string; flockId: string; milestone: "First egg recorded" | "Production resumed" | "Production declining" | "Production stopped"; date: string; notes?: string; createdAt: string };
export const getFlockMilestones = (flockId?: string) => readModule2Collection<FlockMilestoneRecord[]>("flock-milestones", "jari-simulated-flock-milestones", []).filter((record) => !flockId || record.flockId === flockId).sort((a, b) => b.date.localeCompare(a.date));
export const addFlockMilestone = (entry: Omit<FlockMilestoneRecord, "id" | "userId" | "createdAt">) => {
    const userId = currentFarmerId();
    const flock = getFlockRecords().find((item) => item.id === entry.flockId && item.farmId === entry.farmId);
    if (!userId || !flock) throw new Error("Choose a bird group that belongs to your account.");
    if (!["Layer", "Mixed", "Both"].includes(flock.type)) throw new Error("Laying milestones are available for layer or mixed bird groups.");
    if (!entry.date) throw new Error("Choose the date this milestone occurred.");
    const record: FlockMilestoneRecord = { ...entry, notes: entry.notes?.trim() || undefined, id: idFor("flock-milestone"), userId, createdAt: new Date().toISOString() };
    const status = entry.milestone === "Production declining" ? "Partially stopped" : entry.milestone === "Production stopped" ? "Stopped" : entry.milestone === "Production resumed" ? "Laying" : flock.productionStatus || "Laying";
    const flocks = getFlockRecords().map((item) => item.id === flock.id ? { ...item, productionStatus: status, updatedAt: new Date().toISOString() } : item);
    commitModule2Collections([["flock-milestones", "jari-simulated-flock-milestones", [...getFlockMilestones(), record]], ["flocks", STORAGE_KEYS.flockRecords, flocks]], "Layer milestone recorded");
    return record;
};
export const getFlockActivities = () => readModule2Collection<FlockActivityRecord[]>("flock-activities", "jari-simulated-flock-activities", []).map((record) => ({ ...record, status: (record.status === "Upcoming" || record.status === "Rescheduled") && record.scheduledDate < new Date().toISOString().slice(0, 10) ? "Overdue" as const : record.status }));
export const createFlockActivity = (activity: Omit<FlockActivityRecord, "id" | "userId" | "createdAt" | "status" | "completedAt" | "completionNotes">) => {
    const userId = currentFarmerId();
    if (!userId) throw new Error("Sign in as a farmer before scheduling an activity.");
    const flock = getFlockRecords().find((item) => item.id === activity.flockId && item.farmId === activity.farmId && item.status === "Active");
    if (!flock || !getFarmerFarms().some((farm) => farm.id === activity.farmId)) throw new Error("Choose an active bird group on one of your farms.");
    if (!activity.activity.trim() || !activity.scheduledDate) throw new Error("Enter an activity and scheduled date.");
    if (activity.inventoryItemId) { const item = getInventoryItems().find((record) => record.id === activity.inventoryItemId && record.farmId === activity.farmId); if (!item) throw new Error("Choose an inventory item recorded on the same farm."); if (!Number.isFinite(activity.plannedQuantity) || (activity.plannedQuantity || 0) <= 0) throw new Error("Enter the planned quantity to check against current stock."); }
    const created: FlockActivityRecord = { ...activity, activity: activity.activity.trim(), id: idFor("flock-activity"), userId, status: "Upcoming", createdAt: new Date().toISOString() };
    const records = readModule2Collection<FlockActivityRecord[]>("flock-activities", "jari-simulated-flock-activities", []);
    commitModule2Collections([["flock-activities", "jari-simulated-flock-activities", [...records, created]]], "Flock activity scheduled");
    return created;
};
export const updateFlockActivity = (id: string, changes: Pick<FlockActivityRecord, "activity" | "category" | "scheduledDate" | "scheduledTime" | "notes" | "inventoryItemId" | "plannedQuantity">) => {
    const records = readModule2Collection<FlockActivityRecord[]>("flock-activities", "jari-simulated-flock-activities", []);
    const current = records.find((record) => record.id === id);
    if (!current || !["Upcoming", "Overdue", "Rescheduled"].includes(current.status)) throw new Error("Only open scheduled activities can be edited.");
    if (!changes.activity.trim() || !changes.scheduledDate) throw new Error("Enter an activity name and scheduled date.");
    if (changes.inventoryItemId) { const item = getInventoryItems().find((record) => record.id === changes.inventoryItemId && record.farmId === current.farmId); if (!item) throw new Error("Choose an inventory item recorded on the same farm."); if (!Number.isFinite(changes.plannedQuantity) || (changes.plannedQuantity || 0) <= 0) throw new Error("Enter the planned quantity to check against current stock."); }
    const updated = records.map((record) => record.id === id ? { ...record, ...changes, activity: changes.activity.trim(), notes: changes.notes?.trim() || undefined } : record);
    commitModule2Collections([["flock-activities", "jari-simulated-flock-activities", updated]], "Flock activity details updated");
    return updated.find((record) => record.id === id)!;
};
export const updateFlockActivityStatus = (id: string, status: "Completed" | "Rescheduled" | "Cancelled", scheduledDate?: string, completionNotes?: string) => {
    const records = readModule2Collection<FlockActivityRecord[]>("flock-activities", "jari-simulated-flock-activities", []);
    const current = records.find((record) => record.id === id);
    if (!current) throw new Error("Scheduled activity not found.");
    if (status === "Rescheduled" && !scheduledDate) throw new Error("Choose the new activity date.");
    const updated = records.map((record) => record.id === id ? { ...record, status, scheduledDate: status === "Rescheduled" ? scheduledDate! : record.scheduledDate, completedAt: status === "Completed" ? new Date().toISOString() : undefined, completionNotes: status === "Completed" ? completionNotes?.trim() || undefined : undefined } : record);
    commitModule2Collections([["flock-activities", "jari-simulated-flock-activities", updated]], `Flock activity ${status.toLowerCase()}`);
    return updated.find((record) => record.id === id)!;
};
export const getVaccinationRecords = () => readModule2Collection<VaccinationRecord[]>("vaccinations", STORAGE_KEYS.vaccinations, []).map((record) => { const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock)); return { ...record, userId: record.userId || currentFarmerId() || undefined, farmId: record.farmId || flock?.farmId, flockId: record.flockId || flock?.id }; });
export const saveVaccinationRecords = (value: VaccinationRecord[]) => writeModule2Collection("vaccinations", STORAGE_KEYS.vaccinations, value);
export const addVaccinationRecord = (record: Omit<VaccinationRecord, "id">) => {
    const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock) && item.status === "Active");
    if (!flock) throw new Error("Choose an active bird group on your farm.");
    if (!record.vaccine.trim() || !record.date || record.date > new Date().toISOString().slice(0, 10) || (record.nextDate && record.nextDate < record.date) || !Number.isInteger(record.birds) || record.birds < 1 || record.birds > flock.birds) throw new Error("Check the vaccine, dates and number of birds covered.");
    const created = { ...record, flock: flock.name, flockId: flock.id, farmId: flock.farmId, userId: currentFarmerId() || flock.userId, createdAt: new Date().toISOString(), id: idFor("vaccination") };
    const vaccinations = [...getVaccinationRecords(), created];
    const scheduled = record.nextDate ? readModule2Collection<FlockActivityRecord[]>("flock-activities", "jari-simulated-flock-activities", []) : undefined;
    const followUp = scheduled && record.nextDate ? { id: idFor("flock-activity"), userId: currentFarmerId() || flock.userId || "legacy-user", farmId: flock.farmId!, flockId: flock.id!, activity: `Follow-up: ${record.vaccine.trim()}`, category: "Vaccination" as const, scheduledDate: record.nextDate, status: "Upcoming" as const, notes: "Scheduled from the vaccination record. Mark complete only after vaccination is administered.", createdAt: new Date().toISOString() } : undefined;
    if (followUp && scheduled) commitModule2Collections([["vaccinations", STORAGE_KEYS.vaccinations, vaccinations], ["flock-activities", "jari-simulated-flock-activities", [...scheduled, followUp]]], "Vaccination history and follow-up saved");
    else saveVaccinationRecords(vaccinations);
    return created;
};
export const getHealthIncidents = () => readModule2Collection<HealthIncidentRecord[]>("health-incidents", STORAGE_KEYS.healthIncidents, []).map((record) => { const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock)); return { ...record, userId: record.userId || currentFarmerId() || undefined, farmId: record.farmId || flock?.farmId, flockId: record.flockId || flock?.id }; });
export const saveHealthIncidents = (value: HealthIncidentRecord[]) => writeModule2Collection("health-incidents", STORAGE_KEYS.healthIncidents, value);
export const addHealthIncident = (record: Omit<HealthIncidentRecord, "id"> & { birdsLost?: number }) => {
    const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock) && item.status === "Active");
    if (!flock) throw new Error("Choose an active bird group on your farm.");
    const birdsLost = Number(record.birdsLost) || 0;
    if (!record.date || !record.symptoms.trim() || !Number.isInteger(record.affectedBirds) || record.affectedBirds < 1 || record.affectedBirds > flock.birds) throw new Error("Check the date, symptoms and number of affected birds.");
    if (!Number.isInteger(birdsLost) || birdsLost < 0 || birdsLost > record.affectedBirds || birdsLost > flock.birds) throw new Error("Birds lost must be a whole number no greater than birds affected or currently in the group.");
    const created: HealthIncidentRecord = { ...record, flock: flock.name, flockId: flock.id, farmId: flock.farmId, userId: currentFarmerId() || flock.userId, createdAt: new Date().toISOString(), id: idFor("health"), birdsLost };
    if (birdsLost > 0) {
        const flocks = getFlockRecords();
        const nextFlocks = flocks.map((item) => item.id === flock.id ? { ...item, birds: item.birds - birdsLost, status: item.birds === birdsLost ? "Completed" as const : item.status, updatedAt: new Date().toISOString() } : item);
        const movement: FarmFlockMovement = { id: idFor("movement"), flock: flock.name, flockId: flock.id, userId: flock.userId, farmId: flock.farmId, houseId: flock.houseId, responsibleUser: currentFarmerId() || undefined, createdAt: new Date().toISOString(), date: record.date, type: "Mortality", quantity: birdsLost, reason: record.symptoms, notes: record.notes, referenceId: `health:${created.id}` };
        commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...getFlockMovements(), movement]], ["health-incidents", STORAGE_KEYS.healthIncidents, [...getHealthIncidents(), created]]], "Bird health record and loss recorded");
    } else saveHealthIncidents([...getHealthIncidents(), created]);
    return created;
};

export const updateHealthIncident = (id: string, changes: Pick<HealthIncidentRecord, "date" | "symptoms" | "affectedBirds" | "action" | "outcome" | "notes">) => {
    const records = getHealthIncidents();
    const current = records.find((record) => record.id === id);
    if (!current) throw new Error("Health record not found.");
    if (current.voidedAt) throw new Error("This health record has already been voided.");
    const flock = getFlockRecords().find((item) => current.flockId ? item.id === current.flockId : item.name === current.flock);
    const birdsLost = current.birdsLost || 0;
    if (!flock || !changes.date || !changes.symptoms.trim() || !Number.isInteger(changes.affectedBirds) || changes.affectedBirds < 1 || changes.affectedBirds > flock.birds + birdsLost || birdsLost > changes.affectedBirds) throw new Error("Check the date, symptoms and birds affected. Birds affected must include any recorded losses.");
    const updated = { ...current, ...changes };
    saveHealthIncidents(records.map((record) => record.id === id ? updated : record));
    return updated;
};

export const deleteHealthIncident = (id: string) => {
    const records = getHealthIncidents();
    const current = records.find((record) => record.id === id);
    if (!current) throw new Error("Health record not found.");
    if (current.voidedAt) throw new Error("This health record has already been voided.");
    const birdsLost = current.birdsLost || 0;
    const flocks = getFlockRecords();
    const flock = flocks.find((item) => current.flockId ? item.id === current.flockId : item.name === current.flock);
    if (birdsLost && !flock) throw new Error("The bird group for this loss could not be found; the record was kept.");
    if (birdsLost && flock) {
        // Restore the flock and remove the incident in one rollback-safe write set.
        const now = new Date().toISOString();
        const nextFlocks = flocks.map((item) => item.id === flock.id ? { ...item, birds: item.birds + birdsLost, status: "Active" as const, updatedAt: now } : item);
        const lossMovement = getFlockMovements().find((movement) => movement.referenceId === `health:${id}`);
        const correction: FarmFlockMovement = { id: idFor("movement"), flock: flock.name, flockId: flock.id, userId: flock.userId, farmId: flock.farmId, houseId: flock.houseId, responsibleUser: currentFarmerId() || undefined, createdAt: now, date: now.slice(0, 10), type: "Adjustment", adjustmentDirection: "Increase", quantity: birdsLost, reason: "Health loss record voided; bird count restored", notes: `Restored ${birdsLost} birds from health record ${id}.`, reversesMovementId: lossMovement?.id };
        commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...getFlockMovements(), correction]], ["health-incidents", STORAGE_KEYS.healthIncidents, records.map((record) => record.id === id ? { ...record, voidedAt: now, voidReason: "Record voided; related bird count restored." } : record)]], "Health record voided and bird count restored");
    } else saveHealthIncidents(records.map((record) => record.id === id ? { ...record, voidedAt: new Date().toISOString(), voidReason: "Record voided by farmer." } : record));
    return { ...current, voidedAt: current.voidedAt || new Date().toISOString() };
};

export const getTreatmentRecords = () => readModule2Collection<TreatmentRecord[]>("treatments", STORAGE_KEYS.treatments, []).map((record) => { const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock)); return { ...record, userId: record.userId || currentFarmerId() || undefined, farmId: record.farmId || flock?.farmId, flockId: record.flockId || flock?.id }; });
export const saveTreatmentRecords = (records: TreatmentRecord[]) => writeModule2Collection("treatments", STORAGE_KEYS.treatments, records);
export const addTreatmentRecord = (record: Omit<TreatmentRecord, "id">) => {
    const flock = getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock) && item.status === "Active");
    if (!flock || !record.date || !record.treatment.trim() || !Number.isInteger(record.birdsTreated) || record.birdsTreated < 1 || record.birdsTreated > flock.birds) throw new Error("Choose an active bird group and check the treatment date and bird count.");
    const created = { ...record, flock: flock.name, flockId: flock.id, farmId: flock.farmId, userId: currentFarmerId() || flock.userId, createdAt: new Date().toISOString(), id: idFor("treatment"), treatment: record.treatment.trim() };
    saveTreatmentRecords([...getTreatmentRecords(), created]);
    return created;
};

export const getFlockTimeline = (flockId: string): FlockTimelineEntry[] => {
    const movements = getFlockMovements().filter((record) => record.flockId === flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Population", title: record.type, detail: [record.reason, record.notes].filter(Boolean).join(" · "), createdAt: record.createdAt || `${record.date}T00:00:00.000Z`, quantity: record.quantity }));
    const vaccines = getVaccinationRecords().filter((record) => record.flockId === flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Vaccination", title: record.vaccine, detail: `${record.birds.toLocaleString()} birds covered${record.givenBy ? ` · given by ${record.givenBy}` : ""}${record.notes ? ` · ${record.notes}` : ""}`, createdAt: record.createdAt || `${record.date}T00:00:00.000Z` }));
    const activities = getFlockActivities().filter((record) => record.flockId === flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.status === "Completed" && record.completedAt ? record.completedAt.slice(0, 10) : record.scheduledDate, category: "Scheduled activity", title: record.activity, detail: `${record.category} · ${record.status}${record.notes ? ` · ${record.notes}` : ""}`, createdAt: record.createdAt }));
    const health = getHealthIncidents().filter((record) => record.flockId === flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Health", title: record.voidedAt ? "Health record voided" : "Health observation", detail: `${record.symptoms} · ${record.affectedBirds.toLocaleString()} affected${record.birdsLost ? ` · ${record.birdsLost} losses` : ""}`, createdAt: record.createdAt || `${record.date}T00:00:00.000Z` }));
    const care = getTreatmentRecords().filter((record) => record.flockId === flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Care", title: record.treatment, detail: [record.medicine, `${record.birdsTreated.toLocaleString()} birds treated`, record.givenBy, record.notes].filter(Boolean).join(" · "), createdAt: record.createdAt || `${record.date}T00:00:00.000Z` }));
    const milestones = getFlockMilestones(flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Layer milestone", title: record.milestone, detail: record.notes, createdAt: record.createdAt }));
    const sales = getSalesRecords().filter((record) => record.flockId === flockId && (record.product || record.item) === "Live birds").map((record): FlockTimelineEntry => ({ id: record.id!, flockId, date: record.date, category: "Sale", title: "Live birds sold", detail: `${record.quantity || 0} ${record.unit || "birds"} · ${record.product || record.item || ""}`, createdAt: `${record.date}T00:00:00.000Z`, quantity: record.quantity }));
    const closures = getFlockClosures(flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Lifecycle", title: "Batch closed", detail: `${record.reason} · final recorded population ${record.finalPopulation}${record.notes ? ` · ${record.notes}` : ""}`, createdAt: record.createdAt }));
    const lifecycle = getFlockLifecycleEvents(flockId).map((record): FlockTimelineEntry => ({ id: record.id, flockId, date: record.date, category: "Lifecycle", title: record.event, detail: record.details, createdAt: record.createdAt }));
    return [...movements, ...vaccines, ...activities, ...health, ...care, ...milestones, ...sales, ...closures, ...lifecycle].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

export const addProductionRecord = (record: Omit<ProductionRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock);
    if (!flock) throw new Error("Choose a bird group that exists on your farm.");
    if (!record.date) throw new Error("Choose the day you recorded production.");
    if (record.type !== flock.type) throw new Error("The production record type must match the selected bird group.");
    const countFields = [record.liveBirds, record.eggsCollected, record.goodEggs, record.damagedEggs, record.birdsWeighed, record.birdsReady];
    if (countFields.some((value) => !Number.isInteger(value) || value < 0) || !Number.isFinite(record.averageWeight) || record.averageWeight < 0) throw new Error("Enter whole counts of zero or more and a valid average weight.");
    if (record.liveBirds > flock.birds || record.birdsWeighed > flock.birds || record.birdsReady > flock.birds) throw new Error("Production bird counts cannot be greater than the group's current size.");
    if (record.type === "Layer") {
        if (record.liveBirds < 1 || record.liveBirds > flock.birds) throw new Error("Enter a live bird count within the current group size.");
        if (record.eggsCollected < 0 || record.goodEggs + record.damagedEggs > record.eggsCollected) throw new Error("Good and damaged eggs cannot exceed the eggs collected.");
    }
    const created = { ...record, id: idFor("production") };
    saveProductionRecords([...getProductionRecords(), created]);
    return created;
};

export const addSaleRecord = (record: Omit<SalesEntry, "id" | "outstanding" | "status">) => {
    const amount = numberFromAmount(record.amount);
    const received = Number(record.amountReceived) || 0;
    if (!record.date || amount <= 0 || received < 0 || received > amount || (record.quantity !== undefined && (!Number.isInteger(record.quantity) || record.quantity < 0))) throw new Error("Check the sale date, total, amount received and quantity.");
    const product = record.product || record.item || "";
    const flock = product === "Live birds" ? getFlockRecords().find((item) => (record.flockId ? item.id === record.flockId : item.name === record.flock && (!record.farmId || item.farmId === record.farmId)) && item.status === "Active") : undefined;
    if (product === "Live birds" && (!flock || !Number.isInteger(record.quantity) || !record.quantity || record.quantity < 1 || record.quantity > flock.birds)) throw new Error("Choose an active bird group and a number of birds within its current count.");
    const payments = received > 0 ? [{ id: idFor("payment"), date: record.date, amount: received, note: "Payment received when sale was recorded" }] : [];
    const created = { ...record, flock: flock?.name || record.flock, flockId: flock?.id || record.flockId, farmId: flock?.farmId || record.farmId, amount, amountReceived: received, payments, id: idFor("sale"), outstanding: amount - received, status: received >= amount ? "Paid" : received > 0 ? "Part paid" : "Unpaid" };
    if (flock && record.quantity) {
        const now = new Date().toISOString();
        const nextFlocks = getFlockRecords().map((item) => item.id === flock.id ? { ...item, birds: item.birds - record.quantity!, status: item.birds === record.quantity ? "Completed" as const : item.status, updatedAt: now } : item);
        const movement: FarmFlockMovement = { id: idFor("movement"), flock: flock.name, flockId: flock.id, userId: flock.userId, farmId: flock.farmId, houseId: flock.houseId, responsibleUser: currentFarmerId() || undefined, createdAt: now, date: record.date, type: "Sale", quantity: record.quantity, reason: `Sale of ${record.quantity} birds` };
        commitModule2Collections([["flocks", STORAGE_KEYS.flockRecords, nextFlocks], ["flock-movements", STORAGE_KEYS.flockMovements, [...getFlockMovements(), movement]], ["sales", STORAGE_KEYS.salesRecords, [...getSalesRecords(), created]]], "Bird sale recorded");
    } else saveSalesRecords([...getSalesRecords(), created]);
    return created;
};

export const recordSalePayment = (id: string, payment: number, date = new Date().toISOString().slice(0, 10), note?: string) => {
    const records = getSalesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Sale record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountReceived) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    if (!date) throw new Error("Choose the date the payment was received.");
    const amountReceived = paid + payment;
    const next = [...records];
    const payments = [...(records[index].payments || (paid > 0 ? [{ id: idFor("payment"), date: records[index].date, amount: paid, note: "Previously recorded payment" }] : [])), { id: idFor("payment"), date, amount: payment, note }];
    next[index] = { ...records[index], amount: total, amountReceived, payments, outstanding: total - amountReceived, status: amountReceived >= total ? "Paid" : "Part paid" };
    saveSalesRecords(next);
    return next[index];
};

export const addExpenseRecord = (record: Omit<ExpenseEntry, "id" | "outstanding">) => {
    const amount = numberFromAmount(record.amount);
    const amountPaid = Number(record.amountPaid) || 0;
    if (!record.date || !record.category.trim() || amount <= 0 || amountPaid < 0 || amountPaid > amount) throw new Error("Check the date, category, total and amount paid.");
    const payments = amountPaid > 0 ? [{ id: idFor("payment"), date: record.date, amount: amountPaid, note: "Payment made when expense was recorded" }] : [];
    const created = { ...record, id: idFor("expense"), amount, amountPaid, payments, outstanding: amount - amountPaid };
    saveExpensesRecords([...getExpensesRecords(), created]);
    return created;
};

export const recordExpensePayment = (id: string, payment: number, date = new Date().toISOString().slice(0, 10), note?: string) => {
    const records = getExpensesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Expense record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountPaid) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    if (!date) throw new Error("Choose the date the payment was made.");
    const amountPaid = paid + payment;
    const next = [...records];
    const payments = [...(records[index].payments || (paid > 0 ? [{ id: idFor("payment"), date: records[index].date, amount: paid, note: "Previously recorded payment" }] : [])), { id: idFor("payment"), date, amount: payment, note }];
    next[index] = { ...records[index], amount: total, amountPaid, payments, outstanding: total - amountPaid };
    saveExpensesRecords(next);
    return next[index];
};

const numberFromAmount = (value: unknown) => Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;

export const getDashboardTotals = () => {
    const flocks = getFlockRecords();
    const activeFlocks = flocks.filter((flock) => flock.status === "Active");
    const sales = getSalesRecords();
    const expenses = getExpensesRecords();
    const feedPurchases = getFeedPurchases();
    const salesTotal = sales.reduce((sum, item) => sum + numberFromAmount(item.amount), 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + numberFromAmount(item.amount), 0);
    const feedTotal = feedPurchases.reduce((sum, item) => sum + item.amount, 0);
    const birds = activeFlocks.reduce((sum, flock) => sum + Number(flock.birds || 0), 0);
    const stockKg = getFeedInventory().reduce((sum, item) => sum + item.availableKg, 0);
    return { activeFlocks: activeFlocks.length, birds, salesTotal, expenseTotal, feedTotal, stockKg: Math.max(0, stockKg), houses: getPoultryHouses().filter((house) => !house.archived).length, productionRecords: getProductionRecords().length };
};

export const getDemoDatabaseSnapshot = () => ({
    version: storageSchemaVersion,
    exportedAt: new Date().toISOString(),
    farmProfile: getFarmProfile(),
    poultryHouses: getPoultryHouses(),
    flocks: getFlockRecords(),
    flockMovements: getFlockMovements(),
    flockAssignments: getFlockHouseAssignments(),
    flockClosures: getFlockClosures(),
    flockLifecycleEvents: getFlockLifecycleEvents(),
    farms: getFarmerFarms(),
    inventoryItems: getInventoryItems(),
    inventoryTransactions: getInventoryTransactions(),
    inventorySuppliers: getInventorySuppliers(),
    inventoryPurchases: getInventoryPurchases(),
    reportingPreferences: getFarmReportingPreferences(),
    updateReminders: getFarmUpdateReminders(),
    flockActivities: getFlockActivities(),
    flockMilestones: getFlockMilestones(),
    feedPurchases: getFeedPurchases(),
    feedUse: getFeedUseRecords(),
    production: getProductionRecords(),
    vaccinations: getVaccinationRecords(),
    healthIncidents: getHealthIncidents(),
    treatments: getTreatmentRecords(),
    sales: getSalesRecords(),
    expenses: getExpensesRecords(),
    assets: getFarmAssets(),
    opportunityApplications: getOpportunityApplications(),
    institutionRequests: getInstitutionRequests(),
    userPreferences: getUserPreferences(),
    institutionDemoAccess: getInstitutionDemoAccess(),
    documents: getFarmDocuments(),
    kycApplication: getKycApplication(),
    activity: getActivityRecords(),
});

export const resetDemoDatabase = () => {
    if (typeof window === "undefined") return;
    const userId = currentFarmerId();
    const module2Prefix = userId ? `${storagePrefix}module2:${userId}:` : "";
    const module2Keys = userId ? Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index)).filter((key): key is string => Boolean(key && key.startsWith(module2Prefix))) : [];
    module2Keys.forEach((key) => window.localStorage.removeItem(key));
    Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(scopedStorageKey(key));
        window.localStorage.removeItem(key);
    });
    window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: "*" } }));
};

export const importDemoDatabase = (value: unknown) => {
    if (!value || typeof value !== "object") throw new Error("Choose a valid JARI backup file.");
    const snapshot = value as Record<string, unknown>;
    if (snapshot.version !== storageSchemaVersion) throw new Error("This backup version is not supported.");
    const schemas: Record<string, Record<string, "string" | "number" | "boolean">> = {
        poultryHouses: { name: "string", system: "string", capacity: "number", water: "string", feedStorage: "boolean" },
        flocks: { name: "string", type: "string", house: "string", birds: "number", status: "string" },
        flockMovements: { id: "string", flock: "string", date: "string", type: "string", quantity: "number", reason: "string" },
        flockAssignments: { id: "string", userId: "string", farmId: "string", flockId: "string", effectiveDate: "string", createdAt: "string" },
        flockClosures: { id: "string", userId: "string", farmId: "string", flockId: "string", date: "string", finalPopulation: "number", reason: "string", createdAt: "string" },
        flockLifecycleEvents: { id: "string", userId: "string", farmId: "string", flockId: "string", date: "string", event: "string", createdAt: "string" },
        farms: { id: "string", userId: "string", name: "string", isPrimary: "boolean", createdAt: "string", updatedAt: "string" },
        inventoryItems: { id: "string", userId: "string", farmId: "string", name: "string", category: "string", unit: "string", initialQuantity: "number", createdAt: "string", updatedAt: "string" },
        inventoryTransactions: { id: "string", userId: "string", farmId: "string", itemId: "string", type: "string", quantity: "number", unit: "string", date: "string", reason: "string", createdAt: "string" },
        inventorySuppliers: { id: "string", userId: "string", farmId: "string", name: "string", active: "boolean", createdAt: "string", updatedAt: "string" },
        inventoryPurchases: { id: "string", userId: "string", farmId: "string", itemId: "string", itemName: "string", quantity: "number", unit: "string", date: "string", paymentStatus: "string", inventoryTransactionId: "string", createdAt: "string" },
        reportingPreferences: { id: "string", userId: "string", farmId: "string", frequency: "string", reminderTime: "string", reminderDay: "number", modules: "object", updatedAt: "string" },
        updateReminders: { id: "string", userId: "string", farmId: "string", module: "string", periodKey: "string", dueAt: "string", status: "string", createdAt: "string", updatedAt: "string" },
        flockActivities: { id: "string", userId: "string", farmId: "string", flockId: "string", activity: "string", category: "string", scheduledDate: "string", status: "string", createdAt: "string" },
        flockMilestones: { id: "string", userId: "string", farmId: "string", flockId: "string", milestone: "string", date: "string", createdAt: "string" },
        feedPurchases: { id: "string", date: "string", feedType: "string", brand: "string", supplier: "string", quantity: "number", unit: "string", bagWeightKg: "number", amount: "number", amountPaid: "number" },
        feedUse: { id: "string", date: "string", feedType: "string", quantityKg: "number", flock: "string" },
        production: { id: "string", date: "string", flock: "string", type: "string", liveBirds: "number", eggsCollected: "number", goodEggs: "number", damagedEggs: "number", birdsWeighed: "number", averageWeight: "number", birdsReady: "number" },
        vaccinations: { id: "string", flock: "string", vaccine: "string", date: "string", birds: "number" },
        healthIncidents: { id: "string", flock: "string", date: "string", symptoms: "string", affectedBirds: "number", action: "string" },
        treatments: { id: "string", flock: "string", date: "string", treatment: "string", birdsTreated: "number" },
        sales: { date: "string" }, expenses: { date: "string", category: "string" },
        assets: { name: "string", quantity: "number", status: "string", value: "number" },
        activity: { id: "string", text: "string", createdAt: "string" },
        opportunityApplications: { id: "string", opportunityId: "string", opportunityName: "string", type: "string", status: "string", note: "string", createdAt: "string" },
        institutionRequests: { id: "string", institutionName: "string", purpose: "string", message: "string", status: "string", createdAt: "string" },
        documents: { id: "string", name: "string", type: "string", size: "number", addedAt: "string", dataUrl: "string" },
    };
    const collections: Array<[string, string]> = [
        ["farmProfile", STORAGE_KEYS.farmProfile], ["poultryHouses", STORAGE_KEYS.poultryHouses], ["flocks", STORAGE_KEYS.flockRecords], ["flockMovements", STORAGE_KEYS.flockMovements],
        ["feedPurchases", STORAGE_KEYS.feedPurchases], ["feedUse", STORAGE_KEYS.feedUse], ["production", STORAGE_KEYS.productionRecords],
        ["vaccinations", STORAGE_KEYS.vaccinations], ["healthIncidents", STORAGE_KEYS.healthIncidents], ["treatments", STORAGE_KEYS.treatments], ["sales", STORAGE_KEYS.salesRecords],
        ["expenses", STORAGE_KEYS.expensesRecords], ["assets", STORAGE_KEYS.farmAssets], ["activity", STORAGE_KEYS.activity], ["opportunityApplications", STORAGE_KEYS.opportunityApplications], ["institutionRequests", STORAGE_KEYS.institutionRequests], ["userPreferences", STORAGE_KEYS.userPreferences], ["institutionDemoAccess", STORAGE_KEYS.institutionDemoAccess], ["documents", STORAGE_KEYS.documents],
    ];
    // Validate every provided section before writing any values so a malformed
    // backup never leaves a half-imported farm profile.
    collections.forEach(([property]) => {
        const valueToWrite = snapshot[property];
        if (valueToWrite === undefined) return;
        if (property === "farmProfile") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The farmProfile section must be a farm profile.");
            const profile = valueToWrite as Record<string, unknown>;
            ["farmName", "ownerName", "phone", "community", "lga", "state", "establishmentDate", "operationType", "productionSystem", "numberOfHouses", "waterSource", "numberOfWorkers"].forEach((field) => { if (typeof profile[field] !== "string") throw new Error(`farmProfile.${field} must be a string.`); });
            if (!Array.isArray(profile.biosecurity) || !profile.biosecurity.every((item) => typeof item === "string")) throw new Error("farmProfile.biosecurity must be a list of text values.");
            return;
        }
        if (property === "userPreferences") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The userPreferences section must be an object.");
            const preferences = valueToWrite as Record<string, unknown>;
            ["productionReminders", "healthReminders", "financialUpdates", "analyticsConsent"].forEach((field) => { if (typeof preferences[field] !== "boolean") throw new Error(`userPreferences.${field} must be a boolean.`); });
            return;
        }
        if (property === "institutionDemoAccess") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite) || typeof (valueToWrite as Record<string, unknown>).shared !== "boolean") throw new Error("The institutionDemoAccess section must contain a sharing choice.");
            return;
        }
        if (!Array.isArray(valueToWrite)) throw new Error(`The ${property} section must be a list.`);
        const schema = schemas[property];
        if (!schema) return;
        valueToWrite.forEach((entry, index) => {
            if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`${property}[${index}] must be an object.`);
            const item = entry as Record<string, unknown>;
            Object.entries(schema).forEach(([field, expected]) => {
                if (typeof item[field] !== expected || (expected === "number" && !Number.isFinite(item[field]))) throw new Error(`${property}[${index}].${field} must be a ${expected}.`);
            });
            if ((property === "sales" || property === "expenses") && typeof item.amount !== "number" && typeof item.amount !== "string") throw new Error(`${property}[${index}].amount must be a number or string.`);
            if (property === "documents" && ((item.size as number) < 0 || (item.size as number) > 1_500_000 || !(item.dataUrl as string).startsWith("data:") || (item.dataUrl as string).length > 2_100_000)) throw new Error(`${property}[${index}] contains invalid file data.`);
        });
    });
    if (snapshot.kycApplication !== undefined && snapshot.kycApplication !== null && (typeof snapshot.kycApplication !== "object" || Array.isArray(snapshot.kycApplication))) throw new Error("The kycApplication section must be an object or null.");
    const writes = collections.filter(([property]) => snapshot[property] !== undefined).map(([property, key]) => [key, snapshot[property]] as const);
    if (snapshot.kycApplication !== undefined) writes.push([STORAGE_KEYS.kycApplication, snapshot.kycApplication] as const);
    const userId = currentFarmerId();
    const module2Map: Array<[string, string]> = [["poultryHouses", "houses"], ["flocks", "flocks"], ["flockMovements", "flock-movements"], ["flockAssignments", "flock-house-assignments"], ["flockClosures", "flock-closures"], ["flockLifecycleEvents", "flock-lifecycle-events"], ["farms", "farms"], ["feedPurchases", "feed-purchases"], ["feedUse", "feed-use"], ["sales", "sales"], ["inventoryItems", "inventory-items"], ["inventoryTransactions", "inventory-transactions"], ["inventorySuppliers", "inventory-suppliers"], ["inventoryPurchases", "inventory-purchases"], ["reportingPreferences", "reporting-preferences"], ["updateReminders", "update-reminders"], ["vaccinations", "vaccinations"], ["healthIncidents", "health-incidents"], ["treatments", "treatments"], ["flockActivities", "flock-activities"], ["flockMilestones", "flock-milestones"]];
    const module2Writes = module2Map.filter(([property]) => snapshot[property] !== undefined).map(([property, collection]) => [module2Key(userId || "legacy", collection), snapshot[property]] as const);
    if (module2Writes.length && !userId) throw new Error("Sign in to the farmer account before restoring a Module 2 backup.");
    const storageWrites = [...writes.map(([key, content]) => [scopedStorageKey(key), content] as const), ...module2Writes];
    if (module2Writes.length) storageWrites.push([module2OwnerKey, userId] as const);
    const previousValues = storageWrites.map(([key]) => [key, window.localStorage.getItem(key)] as const);
    try {
        storageWrites.forEach(([key, content]) => window.localStorage.setItem(key, typeof content === "string" && key === module2OwnerKey ? content : JSON.stringify(content)));
    } catch (error) {
        previousValues.forEach(([key, previous]) => {
            if (previous === null) window.localStorage.removeItem(key);
            else window.localStorage.setItem(key, previous);
        });
        throw error;
    }
    window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: "*" } }));
};

export const getStorageSchemaVersion = () => storageSchemaVersion;
