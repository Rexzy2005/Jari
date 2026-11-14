import { getFarmNotifications } from "@/lib/notifications";
import {
    addExpenseRecord as simAddExpenseRecord,
    addFarmAsset as simAddFarmAsset,
    addFeedPurchase as simAddFeedPurchase,
    addFeedUse as simAddFeedUse,
    addFlockMovement as simAddFlockMovement,
    addFlockTransfer as simAddFlockTransfer,
    transferFlockBetweenFarms as simTransferFlockBetweenFarms,
    addHealthIncident as simAddHealthIncident,
    createFlockActivity as simCreateFlockActivity,
    updateFlockActivity as simUpdateFlockActivity,
    updateFlockActivityStatus as simUpdateFlockActivityStatus,
    addFlockMilestone as simAddFlockMilestone,
    closeFlockBatch as simCloseFlockBatch,
    archiveFlockBatch as simArchiveFlockBatch,
    updateFlockRecord as simUpdateFlockRecord,
    createInventorySupplier as simCreateInventorySupplier,
    updateInventorySupplier as simUpdateInventorySupplier,
    addInventoryPurchase as simAddInventoryPurchase,
    updateInventoryItem as simUpdateInventoryItem,
    addTreatmentRecord as simAddTreatmentRecord,
    addProductionRecord as simAddProductionRecord,
    addSaleRecord as simAddSaleRecord,
    recordSalePayment as simRecordSalePayment,
    recordExpensePayment as simRecordExpensePayment,
    addVaccinationRecord as simAddVaccinationRecord,
    applyToOpportunity,
    addFarmDocument as simAddFarmDocument,
    archivePoultryHouse as simArchivePoultryHouse,
    createFarmerFarm as simCreateFarmerFarm,
    createPoultryHouse as simCreatePoultryHouse,
    defaultFarmProfile,
    createFlockRecord as simCreateFlockRecord,
    getDashboardTotals,
    getExpensesRecords,
    getFarmAssets,
    getFarmProfile as getSavedFarmProfile,
    getFeedPurchases,
    getFeedInventory,
    getFeedUseRecords,
    getFlockRecords,
    getFlockActivities,
    getFlockMilestones,
    getFlockClosures,
    getFlockTimeline,
    getFlockPopulationStats,
    getFlockLifecycleEvents,
    getFlockMovements,
    getFlockAssignmentHistory,
    getFlockHouseAssignments,
    getFarmerFarms,
    getInventoryItems,
    getInventoryTransactions,
    getInventorySuppliers,
    getInventoryPurchases,
    getInventoryDashboardSummary,
    getInventoryForecast,
    getFarmReportingPreferences,
    saveFarmReportingPreference,
    getFarmUpdateReminders,
    getFarmRecordFreshness,
    respondToFarmUpdateReminder,
    createInventoryItem as simCreateInventoryItem,
    recordInventoryTransaction as simRecordInventoryTransaction,
    transferInventoryBetweenFarms as simTransferInventoryBetweenFarms,
    transferInventoryBetweenLocations as simTransferInventoryBetweenLocations,
    getHousePopulation,
    getProductionRecords,
    getOpportunityApplications,
    getInstitutionRequests,
    getInstitutionRegistration,
    getInstitutionRegistrations,
    getUserPreferences,
    getInstitutionDemoAccess,
    getFarmDocuments,
    getPoultryHouses,
    getSalesRecords,
    saveExpensesRecords,
    saveFarmAssets,
    saveFarmProfile as simSaveFarmProfile,
    saveFeedPurchases,
    saveFeedUseRecords,
    saveFlockRecords,
    saveFlockMovements,
    saveProductionRecords,
    savePoultryHouses,
    saveSalesRecords,
    updatePoultryHouse as simUpdatePoultryHouse,
    updatePoultryHouseStatus as simUpdatePoultryHouseStatus,
    moveFlockToHouse as simMoveFlockToHouse,
    updateOpportunityApplication,
    addInstitutionRequest,
    updateInstitutionRequest,
    saveUserPreferences,
    saveInstitutionDemoAccess,
    saveInstitutionRegistration,
    removeFarmDocument as simRemoveFarmDocument,
    getActivityRecords,
    getDemoDatabaseSnapshot,
    getHealthIncidents,
    getTreatmentRecords,
    getKycApplication,
    getVaccinationRecords,
    importDemoDatabase,
    resetDemoDatabase,
    saveHealthIncidents,
    saveTreatmentRecords,
    updateHealthIncident,
    deleteHealthIncident,
    saveKycApplication as simSaveKycApplication,
    saveVaccinationRecords,
    getFarmerOnboarding as simGetFarmerOnboarding,
    initializeFarmerOnboarding as simInitializeFarmerOnboarding,
    saveFarmerOnboarding as simSaveFarmerOnboarding,
} from "@/lib/simulated-data";
import type {
    ExpenseEntry,
    FarmAssetRecord,
    FeedPurchaseRecord,
    FeedUseRecord,
    FlockRecord,
    ProductionRecord,
    SavedFarmProfile,
} from "@/lib/simulated-data";
import type {
    AssetRecord,
    DashboardSummary,
    ExpenseRecord,
    FarmProfile,
    FeedConsumption,
    FeedPurchase,
    FlockRecord as ApiFlock,
    NotificationItem,
    OpportunityItem,
    SalesRecord,
} from "@/types";
import {
    syncAllFromBackend,
    backendSaveFarmProfile,
    backendRecordSalePayment,
    backendAddExpense,
    backendRecordExpensePayment,
    backendSubmitKyc,
    backendUploadDocument,
    backendDeleteDocument,
} from "@/lib/backend-sync";
import { getStoredToken } from "@/lib/api-client";

// Initiate background data sync with FastAPI backend on startup
if (typeof window !== "undefined") {
    if (getStoredToken()) {
        syncAllFromBackend().catch(() => { });
    }
}

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));
const currency = (amount: number | string) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
        Number(String(amount).replace(/[^\d.-]/g, "")) || 0
    );
const monthKey = (value: string) => {
    const direct = value.match(/^(\d{4})-(\d{2})/);
    if (direct) return `${direct[1]}-${direct[2]}`;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

const farmForApi = (farm: SavedFarmProfile): FarmProfile => ({
    id: "farm-primary",
    name: farm.farmName,
    ownerName: farm.ownerName,
    phone: farm.phone,
    community: farm.community,
    lga: farm.lga,
    state: farm.state,
    establishmentDate: farm.establishmentDate,
    operationType: farm.operationType as FarmProfile["operationType"],
    productionSystem: farm.productionSystem as FarmProfile["productionSystem"],
    numberOfHouses: Number(farm.numberOfHouses) || 0,
    waterSource: farm.waterSource as FarmProfile["waterSource"],
    numberOfWorkers: Number(farm.numberOfWorkers) || 0,
    biosecurityMeasures: farm.biosecurity,
    housingCapacity: getPoultryHouses().reduce((total, house) => total + house.capacity, 0),
});

const flockForApi = (flock: FlockRecord): ApiFlock => ({
    id: flock.id || flock.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: flock.name,
    type: flock.type as ApiFlock["type"],
    breed: flock.breed || "Not added",
    house: flock.house,
    birds: flock.birds,
    status: flock.status,
    acquisitionDate: flock.acquisitionDate || "",
    cycleStart: flock.cycleStart || "",
});

export const mockApi = {
    async getDashboardSummary(): Promise<DashboardSummary> {
        await delay();
        const totals = getDashboardTotals();
        const currentMonth = monthKey(new Date().toISOString());
        const revenueThisMonth = getSalesRecords()
            .filter((sale) => monthKey(sale.date) === currentMonth)
            .reduce((sum, sale) => sum + (Number(String(sale.amount).replace(/[^\d.-]/g, "")) || 0), 0);
        const feedCost = getFeedPurchases()
            .filter((purchase) => monthKey(purchase.date) === currentMonth)
            .reduce((sum, purchase) => sum + purchase.amount, 0);
        return { activeFlocks: String(totals.activeFlocks), revenueThisMonth: currency(revenueThisMonth), feedCost: currency(feedCost), riskScore: "Not assessed" };
    },
    async getFarmProfile(): Promise<FarmProfile> {
        await delay();
        return farmForApi(getSavedFarmProfile() || defaultFarmProfile);
    },
    async getFlocks(): Promise<ApiFlock[]> {
        await delay();
        return getFlockRecords().map(flockForApi);
    },
    async getFeedPurchases(): Promise<FeedPurchase[]> {
        await delay();
        return getFeedPurchases().map((purchase) => ({
            id: purchase.id,
            date: purchase.date,
            feedType: purchase.feedType as FeedPurchase["feedType"],
            brand: purchase.brand,
            quantity: `${purchase.quantity} ${purchase.unit}`,
            amount: currency(purchase.amount),
        }));
    },
    async getFeedConsumption(): Promise<FeedConsumption[]> {
        await delay();
        return getFeedUseRecords().map((entry) => ({
            id: entry.id,
            date: entry.date,
            feedType: entry.feedType as FeedConsumption["feedType"],
            quantity: `${entry.quantityKg} kg`,
        }));
    },
    async getSales(): Promise<SalesRecord[]> {
        await delay();
        return getSalesRecords().map((record) => ({
            id: record.id || record.date,
            date: record.date,
            product: (record.product || record.item || "Other poultry products") as SalesRecord["product"],
            amount: currency(record.amount),
        }));
    },
    async getExpenses(): Promise<ExpenseRecord[]> {
        await delay();
        return getExpensesRecords().map((record) => ({
            id: record.id || record.date,
            date: record.date,
            category: record.category,
            amount: currency(record.amount),
        }));
    },
    async getAssets(): Promise<AssetRecord[]> {
        await delay();
        return getFarmAssets().map((asset) => ({
            id: asset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: asset.name,
            quantity: asset.quantity,
            status: asset.status === "Working" ? "Functional" : asset.status,
            value: currency(asset.value),
        }));
    },
    async getOpportunities(): Promise<OpportunityItem[]> {
        await delay();
        return [
            { id: "opportunity-001", name: "Poultry Expansion Grant", type: "Grant", match: "Eligibility not assessed" },
            { id: "opportunity-002", name: "Working Capital Facility", type: "Loan", match: "Eligibility not assessed" },
            { id: "opportunity-003", name: "Poultry Health Cover", type: "Insurance", match: "Eligibility not assessed" },
        ];
    },
    async getNotifications(): Promise<NotificationItem[]> {
        await delay();
        return getFarmNotifications().map(({ id, title, detail, time }) => ({ id, title, detail, time }));
    },
    async updateFarm(profile: SavedFarmProfile) {
        return saveFarmProfile(profile);
    },
    async createFlock(flocks: FlockRecord[]) {
        await delay();
        saveFlockRecords(flocks);
        return flocks;
    },
    async createHouse(houses: ReturnType<typeof getPoultryHouses>) {
        await delay();
        savePoultryHouses(houses);
        return houses;
    },
    async addFarmHouse(house: Parameters<typeof createPoultryHouse>[0]) {
        return createPoultryHouse(house);
    },
    async archiveFarmHouse(name: string) {
        archivePoultryHouse(name);
    },
    async createFeedPurchase(purchases: FeedPurchaseRecord[]) {
        await delay();
        saveFeedPurchases(purchases);
        return purchases;
    },
    async createFeedUse(records: FeedUseRecord[]) {
        await delay();
        saveFeedUseRecords(records);
        return records;
    },
    async createProduction(records: ProductionRecord[]) {
        await delay();
        saveProductionRecords(records);
        return records;
    },
    async createSale(records: ReturnType<typeof getSalesRecords>) {
        await delay();
        saveSalesRecords(records);
        return records;
    },
    async createExpense(records: ExpenseEntry[]) {
        await delay();
        saveExpensesRecords(records);
        return records;
    },
    async updateAssets(records: FarmAssetRecord[]) {
        await delay();
        saveFarmAssets(records);
        return records;
    },
    async recordFeedPurchase(record: Parameters<typeof addFeedPurchase>[0]) {
        return addFeedPurchase(record);
    },
    async recordFeedUse(record: Parameters<typeof addFeedUse>[0]) {
        return addFeedUse(record);
    },
    async recordProduction(record: Parameters<typeof addProductionRecord>[0]) {
        return addProductionRecord(record);
    },
    async recordSale(record: Parameters<typeof addSaleRecord>[0]) {
        return addSaleRecord(record);
    },
    async recordExpense(record: Parameters<typeof addExpenseRecord>[0]) {
        return addExpenseRecord(record);
    },
    async collectSalePayment(id: string, amount: number, date?: string, note?: string) {
        return recordSalePayment(id, amount, date, note);
    },
    async payExpenseBalance(id: string, amount: number, date?: string, note?: string) {
        return recordExpensePayment(id, amount, date, note);
    },
    async recordVaccination(record: Parameters<typeof addVaccinationRecord>[0]) {
        return addVaccinationRecord(record);
    },
    async recordHealthIncident(record: Parameters<typeof addHealthIncident>[0]) {
        return addHealthIncident(record);
    },
};

export type MockApi = typeof mockApi;

export const getFarmerOnboarding = simGetFarmerOnboarding;
export const initializeFarmerOnboarding = simInitializeFarmerOnboarding;
export const saveFarmerOnboarding = simSaveFarmerOnboarding;

export function getFarmerFarmProfile(userId: string, ownerName = "", phone = ""): SavedFarmProfile {
    const onboarding = simGetFarmerOnboarding(userId);
    if (!onboarding?.farm) return getSavedFarmProfile();
    const farm = onboarding.farm;
    const saved = getSavedFarmProfile();
    const yearStarted = String(farm.yearStarted ?? "");
    return {
        ...saved,
        farmName: String(farm.name ?? saved.farmName),
        ownerName: ownerName || saved.ownerName,
        phone: phone || saved.phone,
        community: String(farm.community ?? onboarding.profile?.community ?? saved.community),
        lga: String(farm.lga ?? onboarding.profile?.lga ?? saved.lga),
        state: String(farm.state ?? onboarding.profile?.state ?? saved.state),
        establishmentDate: /^\d{4}$/.test(yearStarted) ? `${yearStarted}-01-01` : saved.establishmentDate,
        operationType: String(farm.production ?? saved.operationType),
        productionSystem: String(farm.system ?? saved.productionSystem),
        numberOfHouses: String(farm.houseCount ?? saved.numberOfHouses),
        waterSource: String(farm.water ?? saved.waterSource),
    };
}

export async function saveFarmerFarmProfile(userId: string, profile: SavedFarmProfile): Promise<SavedFarmProfile> {
    await saveFarmProfile(profile);
    const onboarding = userId ? simGetFarmerOnboarding(userId) : null;
    if (onboarding?.farm) {
        const existingFarm = onboarding.farm;
        simSaveFarmerOnboarding(userId, {
            profile: { ...(onboarding.profile ?? { state: "", lga: "", community: "" }), state: profile.state, lga: profile.lga, community: profile.community },
            farm: {
                ...existingFarm,
                name: profile.farmName,
                community: profile.community,
                lga: profile.lga,
                state: profile.state,
                yearStarted: profile.establishmentDate.slice(0, 4),
                production: profile.operationType,
                system: profile.productionSystem,
                houseCount: profile.numberOfHouses,
                water: profile.waterSource,
            },
        });
    }
    return profile;
}

// ============================================================================
// WRAPPED EXPORTS (REAL BACKEND FIRST + REACTIVE UI SYNC)
// ============================================================================

export async function saveFarmProfile(profile: SavedFarmProfile): Promise<SavedFarmProfile> {
    simSaveFarmProfile(profile);
    if (getStoredToken()) {
        try {
            await backendSaveFarmProfile(profile);
        } catch (e: any) {
            console.error("Backend farm profile save failed:", e.message);
            throw e;
        }
    }
    return profile;
}

export async function createPoultryHouse(house: Parameters<typeof simCreatePoultryHouse>[0]) {
    return simCreatePoultryHouse(house);
}

export async function archivePoultryHouse(name: string) {
    return simArchivePoultryHouse(name);
}

export async function updatePoultryHouse(name: string, draft: Parameters<typeof simUpdatePoultryHouse>[1]) {
    return simUpdatePoultryHouse(name, draft);
}

export async function createFlockRecord(flock: Parameters<typeof simCreateFlockRecord>[0]) {
    return simCreateFlockRecord(flock);
}

export async function addFlockMovement(movement: Parameters<typeof simAddFlockMovement>[0]) {
    return simAddFlockMovement(movement);
}

export async function addFlockTransfer(transfer: Parameters<typeof simAddFlockTransfer>[0]) {
    return simAddFlockTransfer(transfer);
}

export async function transferFlockBetweenFarms(transfer: Parameters<typeof simTransferFlockBetweenFarms>[0]) {
    return simTransferFlockBetweenFarms(transfer);
}

export async function transferInventoryBetweenFarms(transfer: Parameters<typeof simTransferInventoryBetweenFarms>[0]) {
    return simTransferInventoryBetweenFarms(transfer);
}

export async function addFeedPurchase(purchase: Parameters<typeof simAddFeedPurchase>[0]) {
    return simAddFeedPurchase(purchase);
}

export async function addFeedUse(use: Parameters<typeof simAddFeedUse>[0]) {
    return simAddFeedUse(use);
}

export async function addProductionRecord(record: Parameters<typeof simAddProductionRecord>[0]) {
    return simAddProductionRecord(record);
}

export async function addHealthIncident(incident: Parameters<typeof simAddHealthIncident>[0]) {
    return simAddHealthIncident(incident);
}

export async function addVaccinationRecord(vacc: Parameters<typeof simAddVaccinationRecord>[0]) {
    return simAddVaccinationRecord(vacc);
}

export async function addTreatmentRecord(treat: Parameters<typeof simAddTreatmentRecord>[0]) {
    return simAddTreatmentRecord(treat);
}

export async function addSaleRecord(sale: Parameters<typeof simAddSaleRecord>[0]) {
    return simAddSaleRecord(sale);
}

export async function recordSalePayment(id: string, amount: number, date?: string, note?: string) {
    const res = simRecordSalePayment(id, amount, date, note);
    if (getStoredToken()) {
        try {
            await backendRecordSalePayment(id, amount, date, note);
        } catch (e: any) {
            console.error("Backend sale payment failed:", e.message);
            throw e;
        }
    }
    return res;
}

export async function addExpenseRecord(expense: Parameters<typeof simAddExpenseRecord>[0]) {
    const created = simAddExpenseRecord(expense);
    if (getStoredToken()) {
        const numAmount = typeof expense.amount === "number" ? expense.amount : parseFloat(String(expense.amount).replace(/[^\d.-]/g, "")) || 0;
        const numPaid = typeof expense.amountPaid === "number" ? expense.amountPaid : numAmount;
        const flocks = getFlockRecords();
        const matchedFlock = expense.flock ? flocks.find((f) => f.name === expense.flock || f.id === expense.flock) : undefined;
        try {
            await backendAddExpense({
                date: expense.date,
                category: expense.category,
                description: expense.note || expense.category,
                totalAmount: numAmount,
                amountPaid: numPaid,
                flockId: matchedFlock?.id,
                notes: expense.note,
            });
        } catch (e: any) {
            console.error("Backend expense record failed:", e.message);
            throw e;
        }
    }
    return created;
}

export async function recordExpensePayment(id: string, amount: number, date?: string, note?: string) {
    const res = simRecordExpensePayment(id, amount, date, note);
    if (getStoredToken()) {
        try {
            await backendRecordExpensePayment(id, amount, date, note);
        } catch (e: any) {
            console.error("Backend expense payment failed:", e.message);
            throw e;
        }
    }
    return res;
}

export async function saveKycApplication(application: Parameters<typeof simSaveKycApplication>[0]) {
    simSaveKycApplication(application);
    if (getStoredToken()) {
        try {
            await backendSubmitKyc(application);
        } catch (e: any) {
            console.error("Backend KYC submission failed:", e.message);
            throw e;
        }
    }
}

export async function addFarmDocument(doc: Parameters<typeof simAddFarmDocument>[0]) {
    const created = simAddFarmDocument(doc);
    if (getStoredToken()) {
        try {
            await backendUploadDocument(doc);
        } catch (e: any) {
            console.error("Backend document upload failed:", e.message);
            throw e;
        }
    }
    return created;
}

export async function removeFarmDocument(id: string) {
    simRemoveFarmDocument(id);
    if (getStoredToken()) {
        try {
            await backendDeleteDocument(id);
        } catch (e: any) {
            console.error("Backend document removal failed:", e.message);
            throw e;
        }
    }
}

// Re-export other simulated helpers
export {
    applyToOpportunity,
    simAddFarmAsset as addFarmAsset,
    defaultFarmProfile,
    getDashboardTotals,
    getExpensesRecords,
    getFarmAssets,
    getSavedFarmProfile as getFarmProfile,
    getFeedPurchases,
    getFeedInventory,
    getFeedUseRecords,
    getFlockRecords,
    getFlockActivities,
    getFlockMilestones,
    getFlockClosures,
    getFlockTimeline,
    getFlockPopulationStats,
    getFlockLifecycleEvents,
    simAddFlockMilestone as addFlockMilestone,
    simCloseFlockBatch as closeFlockBatch,
    simArchiveFlockBatch as archiveFlockBatch,
    simUpdateFlockRecord as updateFlockRecord,
    simCreateFlockActivity as createFlockActivity,
    simUpdateFlockActivityStatus as updateFlockActivityStatus,
    simUpdateFlockActivity as updateFlockActivity,
    getFlockMovements,
    getFlockAssignmentHistory,
    getFlockHouseAssignments,
    getFarmerFarms,
    getInventoryItems,
    getInventoryTransactions,
    getInventorySuppliers,
    getInventoryPurchases,
    getInventoryDashboardSummary,
    getInventoryForecast,
    getFarmReportingPreferences,
    saveFarmReportingPreference,
    getFarmUpdateReminders,
    getFarmRecordFreshness,
    respondToFarmUpdateReminder,
    simCreateInventoryItem as createInventoryItem,
    simRecordInventoryTransaction as recordInventoryTransaction,
    transferInventoryBetweenFarms,
    simTransferInventoryBetweenLocations as transferInventoryBetweenLocations,
    simCreateInventorySupplier as createInventorySupplier,
    simUpdateInventorySupplier as updateInventorySupplier,
    simAddInventoryPurchase as addInventoryPurchase,
    simUpdateInventoryItem as updateInventoryItem,
    getHousePopulation,
    getProductionRecords,
    getOpportunityApplications,
    getInstitutionRequests,
    getInstitutionRegistration,
    getInstitutionRegistrations,
    getUserPreferences,
    getInstitutionDemoAccess,
    getFarmDocuments,
    getPoultryHouses,
    transferFlockBetweenFarms,
    simCreateFarmerFarm as createFarmerFarm,
    simMoveFlockToHouse as moveFlockToHouse,
    simUpdatePoultryHouseStatus as updatePoultryHouseStatus,
    getSalesRecords,
    saveExpensesRecords,
    saveFarmAssets,
    saveFeedPurchases,
    saveFeedUseRecords,
    saveFlockRecords,
    saveFlockMovements,
    saveProductionRecords,
    savePoultryHouses,
    saveSalesRecords,
    updateOpportunityApplication,
    addInstitutionRequest,
    updateInstitutionRequest,
    saveUserPreferences,
    saveInstitutionDemoAccess,
    saveInstitutionRegistration,
    getActivityRecords,
    getDemoDatabaseSnapshot,
    getHealthIncidents,
    getTreatmentRecords,
    getKycApplication,
    getVaccinationRecords,
    importDemoDatabase,
    resetDemoDatabase,
    saveHealthIncidents,
    saveTreatmentRecords,
    updateHealthIncident,
    deleteHealthIncident,
    saveVaccinationRecords,
    syncAllFromBackend,
};

export type {
    ActivityRecord,
    ExpenseEntry,
    FarmAssetRecord,
    FarmHouseRecord,
    FarmerFarmRecord,
    InventoryItemRecord,
    InventoryTransactionRecord,
    InventorySupplierRecord,
    InventoryPurchaseRecord,
    FarmReportingPreference,
    FarmUpdateReminder,
    FarmFlockMovement,
    FarmDocumentRecord,
    FinancialPaymentRecord,
    FeedPurchaseRecord,
    FeedUseRecord,
    FlockRecord,
    FlockActivityRecord,
    FlockMilestoneRecord,
    FlockClosureRecord,
    FlockLifecycleRecord,
    FlockTimelineEntry,
    KycApplication,
    OpportunityApplicationRecord,
    ProductionRecord,
    SalesEntry,
    SavedFarmProfile,
    UserPreferences,
    VaccinationRecord,
    HealthIncidentRecord,
    TreatmentRecord,
    InstitutionDemoAccess,
    InstitutionRequestRecord,
    InstitutionCategory,
    InstitutionRegistrationRecord,
    InstitutionVerificationDocument,
    FarmerOnboardingRecord,
} from "@/lib/simulated-data";
