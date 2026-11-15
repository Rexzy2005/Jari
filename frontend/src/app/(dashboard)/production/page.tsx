"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, Archive, ArrowRight, BarChart3, Egg, History, Plus, Scale, Wheat } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import {
  archiveProductionRecord, calculateFeedConversionRatio, calculateFeedPerDozenEggs,
  calculateLayingRate, calculateWeightGain, createEggCollectionRecord,
  createProductionFeedConsumptionRecord, createWeightRecord, generateProductionAlerts,
  getBatchPerformance, getEggCollectionRecords, getEggProductionSummary, getFarmerFarms,
  getFarmPerformance, getFlockRecords, getInventoryItems, getProductionFeedConsumptionRecords,
  getProductionHistory, getProductionSummary, getProductionTargets, getPoultryHouses,
  getWeightHistory, getWeightRecords, saveProductionTarget, updateEggCollectionRecord,
  updateProductionFeedConsumptionRecord, updateWeightRecord,
} from "@/services";
import type {
  EggCollectionRecord, FarmerFarmRecord, FarmHouseRecord, FlockRecord,
  ProductionCategory, ProductionFilters, ProductionHistoryEntry, ProductionRecordKind,
  ProductionTargetRecord, ProductionFeedConsumptionRecord, WeightRecord,
} from "@/services";

type View = "Overview" | "Eggs" | "Broilers" | "Weights" | "Feed" | "Performance" | "History";
type FormKind = "Egg collection" | "Weight measurement" | "Feed consumption";
type Editing = { kind: FormKind; id: string; value: EggCollectionRecord | WeightRecord | ProductionFeedConsumptionRecord } | null;
const views: Array<{ name: View; icon: typeof Activity }> = [
  { name: "Overview", icon: Activity }, { name: "Eggs", icon: Egg }, { name: "Broilers", icon: Wheat },
  { name: "Weights", icon: Scale }, { name: "Feed", icon: Wheat }, { name: "Performance", icon: BarChart3 }, { name: "History", icon: History },
];
const today = () => new Date().toISOString().slice(0, 10);
const n = (value: FormDataEntryValue | null) => value === null || value === "" ? undefined : Number(value);
const asCategory = (flock?: FlockRecord): ProductionCategory | null => {
  if (!flock) return null;
  const type = `${flock.type} ${flock.category || ""}`.toLowerCase();
  if (type.includes("layer")) return "Layer";
  if (type.includes("broiler")) return "Broiler";
  if (type.includes("mixed")) return "Mixed";
  return null;
};
const prettyNumber = (value: number, digits = 0) => new Intl.NumberFormat("en-NG", { maximumFractionDigits: digits }).format(value);

export default function ProductionPage() {
  const [view, setView] = useState<View>("Overview");
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [houses, setHouses] = useState<FarmHouseRecord[]>([]);
  const [batches, setBatches] = useState<FlockRecord[]>([]);
  const [inventory, setInventory] = useState<ReturnType<typeof getInventoryItems>>([]);
  const [farmId, setFarmId] = useState("");
  const [houseId, setHouseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [category, setCategory] = useState<"All" | ProductionCategory>("All");
  const [recordKindFilter, setRecordKindFilter] = useState("All record types");
  const [fromDate, setFromDate] = useState(() => new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deepLinkInitialized, setDeepLinkInitialized] = useState(false);
  const [formKind, setFormKind] = useState<FormKind | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(() => {
    const availableFarms = getFarmerFarms();
    const params = !deepLinkInitialized && typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const requestedFarm = params?.get("farmId") || "";
    const requestedHouse = params?.get("houseId") || "";
    const requestedBatch = params?.get("batchId") || "";
    const chosenFarm = availableFarms.some((farm) => farm.id === requestedFarm) ? requestedFarm : availableFarms.some((farm) => farm.id === farmId) ? farmId : availableFarms.find((farm) => farm.isPrimary)?.id || availableFarms[0]?.id || "";
    const availableHouses = getPoultryHouses().filter((house) => house.farmId === chosenFarm && !house.archived && house.status !== "Archived");
    const chosenHouse = availableHouses.some((house) => house.id === requestedHouse) ? requestedHouse : availableHouses.some((house) => house.id === houseId) ? houseId : availableHouses[0]?.id || "";
    const availableBatches = getFlockRecords().filter((flock) => flock.farmId === chosenFarm && flock.houseId === chosenHouse);
    const chosenBatch = availableBatches.some((flock) => flock.id === requestedBatch) ? requestedBatch : availableBatches.some((flock) => flock.id === batchId) ? batchId : availableBatches.find((flock) => flock.status === "Active")?.id || availableBatches[0]?.id || "";
    setFarms(availableFarms); setHouses(getPoultryHouses()); setBatches(getFlockRecords()); setInventory(getInventoryItems());
    setFarmId(chosenFarm); setHouseId(chosenHouse); setBatchId(chosenBatch); setRefreshKey((key) => key + 1);
    if (!deepLinkInitialized) setDeepLinkInitialized(true);
  }, [farmId, houseId, batchId, deepLinkInitialized]);
  useEffect(() => {
    refresh();
    const update = () => refresh();
    window.addEventListener("jari:mock-data-changed", update);
    return () => window.removeEventListener("jari:mock-data-changed", update);
  }, [refresh]);

  const selectedFarm = farms.find((farm) => farm.id === farmId);
  const farmHouses = useMemo(() => houses.filter((house) => house.farmId === farmId && !house.archived && house.status !== "Archived"), [houses, farmId]);
  const houseBatches = useMemo(() => batches.filter((flock) => flock.farmId === farmId && flock.houseId === houseId), [batches, farmId, houseId]);
  const selectedBatch = batches.find((flock) => flock.id === batchId);
  const batchCategory = asCategory(selectedBatch);
  const filters: ProductionFilters = { farmId: farmId || undefined, houseId: houseId || undefined, batchId: batchId || undefined, category: category === "All" ? undefined : category, fromDate, toDate };
  const summary = useMemo(() => getProductionSummary(filters), [refreshKey, farmId, houseId, batchId, category, fromDate, toDate]);
  const history = useMemo(() => getProductionHistory(filters), [refreshKey, farmId, houseId, batchId, category, fromDate, toDate]);
  const eggs = useMemo(() => getEggCollectionRecords(filters), [refreshKey, farmId, houseId, batchId, category, fromDate, toDate]);
  const eggSummary = useMemo(() => getEggProductionSummary(filters), [refreshKey, farmId, houseId, batchId, category, fromDate, toDate]);
  const weights = useMemo(() => getWeightHistory({ ...filters, category: "Broiler" }), [refreshKey, farmId, houseId, batchId, fromDate, toDate]);
  const feed = useMemo(() => getProductionFeedConsumptionRecords(filters), [refreshKey, farmId, houseId, batchId, category, fromDate, toDate]);
  const alerts = useMemo(() => generateProductionAlerts({ farmId: farmId || undefined, houseId: houseId || undefined, batchId: batchId || undefined }), [refreshKey, farmId, houseId, batchId]);
  const target = useMemo(() => getProductionTargets(batchId)[0], [refreshKey, batchId]);
  const feedItems = inventory.filter((item) => item.farmId === farmId && item.category.toLowerCase().includes("feed"));

  const openForm = (kind: FormKind, entry?: EggCollectionRecord | WeightRecord | ProductionFeedConsumptionRecord) => {
    if (entry) { setFarmId(entry.farmId); setHouseId(entry.houseId); setBatchId(entry.batchId); }
    setFormKind(kind); setEditing(entry ? { kind, id: entry.id, value: entry } : null); setError(""); setNotice("");
    setView(kind === "Egg collection" ? "Eggs" : kind === "Weight measurement" ? "Weights" : "Feed");
  };
  const saveRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const common = { date: String(form.get("date") || ""), measurementStatus: String(form.get("measurementStatus") || "Actual") as "Actual" | "Estimated", notes: String(form.get("notes") || "").trim() || undefined };
    try {
      if (!formKind || !selectedFarm || !selectedBatch || !houseId) throw new Error("Choose a farm, house and bird batch first.");
      if (formKind === "Egg collection") {
        const values = { ...common, farmId, houseId, batchId, totalEggs: Number(form.get("totalEggs") || 0), marketableEggs: n(form.get("marketableEggs")), brokenEggs: n(form.get("brokenEggs")), crackedEggs: n(form.get("crackedEggs")), dirtyEggs: n(form.get("dirtyEggs")), rejectedEggs: n(form.get("rejectedEggs")), liveHensAtCollection: n(form.get("liveHensAtCollection")), averageEggWeightGrams: n(form.get("averageEggWeightGrams")), allowHistorical: form.get("allowHistorical") === "on" };
        if (editing?.kind === "Egg collection") updateEggCollectionRecord(editing.id, values);
        else createEggCollectionRecord(values);
      } else if (formKind === "Weight measurement") {
        const method = String(form.get("method") || "Sample average") as WeightRecord["method"];
        const values = { ...common, farmId, houseId, batchId, method, sampleSize: Number(form.get("sampleSize") || 0), averageWeightKg: n(form.get("averageWeight")), totalSampleWeight: n(form.get("totalSampleWeight")), weightUnit: String(form.get("weightUnit") || "kg") as "kg" | "g", individualWeights: String(form.get("individualWeights") || "").split(/[ ,;]+/).map(Number).filter(Number.isFinite), allowHistorical: form.get("allowHistorical") === "on" };
        if (editing?.kind === "Weight measurement") updateWeightRecord(editing.id, values);
        else createWeightRecord(values);
      } else {
        const values = { ...common, feedType: String(form.get("feedType") || "").trim(), quantity: Number(form.get("quantity") || 0), unit: String(form.get("unit") || "kg") as "kg" | "g" | "bags", bagWeightKg: n(form.get("bagWeightKg")), source: String(form.get("source") || "Manual record") as "Inventory issue" | "Manual record", inventoryItemId: String(form.get("inventoryItemId") || "") || undefined, recordedCost: n(form.get("recordedCost")), allowHistorical: form.get("allowHistorical") === "on" };
        if (editing?.kind === "Feed consumption") updateProductionFeedConsumptionRecord(editing.id, values);
        else createProductionFeedConsumptionRecord({ ...values, farmId, houseId, batchId });
      }
      setNotice(editing ? "Production record updated." : formKind === "Feed consumption" && form.get("source") === "Inventory issue" ? "Feed issue saved and inventory updated once." : "Production record saved.");
      setFormKind(null); setEditing(null); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not save this production record."); }
  };
  const archive = (entry: ProductionHistoryEntry) => {
    if (!window.confirm(`Archive this ${entry.kind.toLowerCase()} record? Its history will be retained.`)) return;
    try { archiveProductionRecord(entry.kind as ProductionRecordKind, entry.id); setNotice(entry.kind === "Feed consumption" ? "Record archived. Any linked stock issue was reversed." : "Record archived; its history is retained."); setError(""); refresh(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Could not archive this record."); }
  };
  const saveTarget = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    try {
      if (!selectedFarm || !selectedBatch || !houseId) throw new Error("Choose a farm, house and bird batch first.");
      const values = { farmId, houseId, batchId, targetWeightKg: n(data.get("targetWeightKg")), targetAgeDays: n(data.get("targetAgeDays")), expectedStartOfLay: String(data.get("expectedStartOfLay") || "") || undefined };
      saveProductionTarget(values); setNotice("Your production target was saved."); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not save the target."); }
  };

  const batchPerformance = batchId ? getBatchPerformance(batchId, filters) : null;
  const farmPerformance = farmId ? getFarmPerformance(farmId, { ...filters, houseId: undefined, batchId: undefined }) : null;
  const batchOptions = houseBatches.filter((flock) => category === "All" || asCategory(flock) === category);
  const filteredHistory = recordKindFilter === "All record types" ? history : history.filter((entry) => entry.kind === recordKindFilter);
  const currentView = views.find((item) => item.name === view);
  const exportCsv = () => {
    const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [["Farm", "House", "Batch", "Category", "Record type", "Date", "Measurement status", "Summary", "Notes"], ...filteredHistory.map((record) => [selectedFarm?.name || "", houses.find((house) => house.id === record.houseId)?.name || "", batches.find((batch) => batch.id === record.batchId)?.name || "", record.category, record.kind, record.date, record.measurementStatus, record.summary, record.notes || ""])];
    const csv = rows.map((row) => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `jari-production-${farmId || "farm"}-${fromDate}-to-${toDate}.csv`; link.click(); URL.revokeObjectURL(url);
  };
  const comparableBatches = batches.filter((flock) => flock.farmId === farmId && (!houseId || flock.houseId === houseId) && (!category || category === "All" || asCategory(flock) === category));
  const batchComparisons = comparableBatches.map((flock) => {
    const batchFilters = { ...filters, batchId: flock.id };
    const batchEggs = getEggCollectionRecords(batchFilters).reduce((sum, record) => sum + record.totalEggs, 0);
    const batchWeights = getWeightRecords({ ...batchFilters, category: "Broiler" });
    const batchFeed = getProductionFeedConsumptionRecords(batchFilters).reduce((sum, record) => sum + record.quantityKg, 0);
    return { flock, eggs: batchEggs, latestWeight: batchWeights[0]?.averageWeightKg ?? null, feedKg: batchFeed };
  }).filter((row) => row.eggs || row.latestWeight !== null || row.feedKg);
  const houseComparisons = farmHouses.map((house) => {
    const houseRows = batchComparisons.filter((row) => row.flock.houseId === house.id);
    return { house, eggs: houseRows.reduce((sum, row) => sum + row.eggs, 0), weights: houseRows.flatMap((row) => row.latestWeight === null ? [] : [row.latestWeight]), feedKg: houseRows.reduce((sum, row) => sum + row.feedKg, 0) };
  }).filter((row) => row.eggs || row.weights.length || row.feedKg);

  return <main className="mx-auto w-full max-w-7xl space-y-5 pb-10">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm operations</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Production</h1><p className="mt-2 max-w-xl text-sm leading-5 text-[#737d70]">Record what your birds produce. Performance figures appear when the records support them.</p></div>
      <button type="button" onClick={() => openForm(batchCategory === "Layer" ? "Egg collection" : "Weight measurement")} disabled={!selectedBatch || selectedBatch.status !== "Active"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white transition hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15}/>Record production</button>
    </header>
    <div className="flex justify-end"><button type="button" onClick={exportCsv} disabled={!filteredHistory.length} className="min-h-9 rounded-full bg-white px-3 text-xs font-semibold text-[#456447] disabled:opacity-50">Export filtered records</button></div>
    <section aria-label="Production filters" className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="label-text">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => { setFarmId(event.target.value); setHouseId(""); setBatchId(""); }}><option value="">Choose farm</option>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>
      <label className="label-text">House<JariSelect className="input-shell" value={houseId} onChange={(event) => { setHouseId(event.target.value); setBatchId(""); }}><option value="">All houses</option>{farmHouses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</JariSelect></label>
      <label className="label-text">Bird batch<JariSelect className="input-shell" value={batchId} onChange={(event) => setBatchId(event.target.value)}><option value="">All batches</option>{(houseId ? batchOptions : batches.filter((flock) => flock.farmId === farmId && (category === "All" || asCategory(flock) === category))).map((flock) => <option key={flock.id} value={flock.id}>{flock.name}{flock.status !== "Active" ? ` · ${flock.status}` : ""}</option>)}</JariSelect></label>
      <label className="label-text">Production type<JariSelect className="input-shell" value={category} onChange={(event) => { setCategory(event.target.value as "All" | ProductionCategory); setBatchId(""); }}><option value="All">All production</option><option value="Broiler">Broilers</option><option value="Layer">Layers</option><option value="Mixed">Mixed batches</option></JariSelect></label>
      <div className="grid grid-cols-2 gap-2"><label className="label-text">From<input className="input-shell" type="date" max={toDate || today()} value={fromDate} onChange={(event) => setFromDate(event.target.value)}/></label><label className="label-text">To<input className="input-shell" type="date" min={fromDate} max={today()} value={toDate} onChange={(event) => setToDate(event.target.value)}/></label></div>
    </section>
    {error && <p role="alert" className="rounded-xl bg-[#fbefeb] px-4 py-3 text-sm text-[#9a493c]">{error}</p>}{notice && <p role="status" className="rounded-xl bg-[#edf4e9] px-4 py-3 text-sm text-[#426746]">{notice}</p>}
    <nav aria-label="Production sections" className="flex gap-2 overflow-x-auto pb-1">{views.map(({ name, icon: Icon }) => <button key={name} type="button" onClick={() => { setView(name); setFormKind(null); setEditing(null); setError(""); }} aria-current={view === name ? "page" : undefined} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition ${view === name ? "bg-[#244b35] text-white" : "bg-white text-[#62705f] hover:bg-[#e9efe3]"}`}><Icon size={14}/>{name}</button>)}</nav>

    {formKind && <ProductionForm key={`${formKind}-${editing?.id || "new"}`} kind={formKind} editing={editing} selectedBatch={selectedBatch} target={target} feedItems={feedItems} onCancel={() => { setFormKind(null); setEditing(null); setError(""); }} onSubmit={saveRecord} onSaveTarget={saveTarget}/>}
    {!farms.length ? <Empty title="Add a farm to start recording" text="Production records need a farm, house and bird batch so the information stays connected to the right birds." /> : !farmHouses.length ? <Empty title="No house on this farm yet" text="Add a poultry house and assign your bird batches before recording production." /> : !houseBatches.length ? <Empty title="No bird batches in this house" text="Add a batch under this house in Birds to start tracking production." /> : null}

    {!formKind && view === "Overview" && <>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Active batches" value={summary.activeBatches} hint={`${summary.liveBirds.toLocaleString()} live birds recorded`}/><Metric label="Active houses" value={summary.activeHouses}/><Metric label="Eggs collected" value={category === "Broiler" ? "—" : prettyNumber(summary.eggsCollected)} hint={`${summary.eggCollections} collection records`}/><Metric label="Feed issued / recorded" value={`${prettyNumber(summary.feedIssuedKg, 1)} kg`} hint={`${summary.feedRecords} records in period`}/></section>
      <section className="grid gap-4 lg:grid-cols-[1.35fr_.85fr]"><article className="rounded-2xl bg-white p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Recent production</h2><p className="mt-1 text-xs text-[#788174]">{selectedFarm?.name || "Your farm"} · {fromDate} to {toDate}</p></div><button onClick={() => setView("History")} className="text-xs font-semibold text-[#4b704e]">View history <ArrowRight size={13} className="inline"/></button></div><HistoryList records={history.slice(0, 5)} onEdit={openForm} onArchive={archive}/>{history.length === 0 && <Empty title="No production recorded for this period" text="Start with egg collection, a bird weight, or feed issued to a batch."/>}</article><article className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Latest activity</h2>{summary.latestActivity ? <div className="mt-4 rounded-xl bg-[#f6f8f3] p-4"><p className="text-xs font-semibold text-[#36533b]">{summary.latestActivity.kind}</p><p className="mt-2 text-sm text-[#354237]">{summary.latestActivity.summary}</p><p className="mt-2 text-[11px] text-[#788174]">{summary.latestActivity.date} · {summary.latestActivity.measurementStatus.toLowerCase()} record</p></div> : <p className="mt-3 text-sm leading-6 text-[#788174]">Your saved production activity will appear here.</p>}<h3 className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#788174]">Record shortcuts</h3><div className="mt-2 grid grid-cols-3 gap-2"><QuickAction label="Eggs" onClick={() => openForm("Egg collection")} disabled={!selectedBatch || !["Layer", "Mixed"].includes(batchCategory || "")}/><QuickAction label="Weight" onClick={() => openForm("Weight measurement")} disabled={!selectedBatch || !["Broiler", "Mixed"].includes(batchCategory || "")}/><QuickAction label="Feed" onClick={() => openForm("Feed consumption")} disabled={!selectedBatch || selectedBatch.status !== "Active"}/></div></article></section>
      {alerts.length > 0 && <AlertSection alerts={alerts}/>}
    </>}

    {!formKind && view === "Eggs" && <><section className="grid gap-4 lg:grid-cols-[1fr_1fr]"><Metric label="Eggs collected" value={prettyNumber(eggSummary.totalEggs)} hint={`${eggSummary.records} batch collection records · not assumed marketable`}/><article className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Daily egg collection</h2><TrendBars rows={eggSummary.byDate.map((row) => ({ label: row.date.slice(5), value: row.eggs }))}/></article></section><section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Egg collection history</h2><HistoryList records={history.filter((record) => record.kind === "Egg collection")} onEdit={openForm} onArchive={archive}/>{!eggs.length && <Empty title="No egg collections in this period" text="Choose a layer or mixed batch, then record the total eggs collected. Classification is optional."/>}</section></>}

    {!formKind && view === "Eggs" && <section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-lg text-[#29352a]">Layer target</h2><p className="mt-1 text-xs text-[#788174]">Save the expected first day of egg production if you know it. This is your estimate.</p><form onSubmit={saveTarget} className="mt-3 flex flex-wrap items-end gap-3"><label className="label-text min-w-56 flex-1">Expected start of laying<input name="expectedStartOfLay" type="date" min={today()} defaultValue={target?.expectedStartOfLay || ""} className="input-shell"/></label><button disabled={!selectedBatch || selectedBatch.status !== "Active" || (batchCategory !== "Layer" && batchCategory !== "Mixed")} className="min-h-11 rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b] disabled:opacity-50">Save layer target</button></form></section>}
    {!formKind && view === "Broilers" && <section className="space-y-4"><article className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Broiler growth</h2><p className="mt-1 text-sm text-[#788174]">Sample measurements show average bird weight, not the weight of the whole flock.</p></div><button onClick={() => openForm("Weight measurement")} disabled={!selectedBatch || selectedBatch.status !== "Active"} className="rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Record weight</button></div>{selectedBatch && batchCategory !== "Layer" ? <div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Current sample average" value={weights.at(-1) ? `${weights.at(-1)!.averageWeightKg.toFixed(3)} kg` : "Not recorded"} hint={weights.at(-1) ? `${weights.at(-1)!.sampleSize} birds · ${weights.at(-1)!.date}` : "Use a sample; do not weigh every bird"}/><Metric label="Weight gain" value={batchPerformance?.weightGain?.value === null || batchPerformance?.weightGain?.value === undefined ? "Unavailable" : `${batchPerformance.weightGain.value.toFixed(3)} kg`} hint={batchPerformance?.weightGain?.explanation || "Select a batch"}/><Metric label="Daily gain" value={batchPerformance?.weightGain?.averageDailyGrams === null || batchPerformance?.weightGain?.averageDailyGrams === undefined ? "Unavailable" : `${batchPerformance.weightGain.averageDailyGrams.toFixed(1)} g/day`} hint={batchPerformance?.weightGain?.days ? `Across ${batchPerformance.weightGain.days} days` : "Needs two dated measurements"}/></div> : <Empty title="Choose a broiler or mixed batch" text="Select a batch above to see its sample weights and recorded growth."/>}</article><article className="rounded-2xl bg-white p-5"><h3 className="font-serif text-lg text-[#29352a]">Farmer-set target</h3>{target && <p className="mt-2 text-xs text-[#788174]">Target weight: {target.targetWeightKg ? `${target.targetWeightKg} kg` : "not set"} · Expected age: {target.targetAgeDays ? `${target.targetAgeDays} days` : "not set"} · Source: farmer entered</p>}<form onSubmit={saveTarget} className="mt-3 grid gap-3 sm:grid-cols-3"><label className="label-text">Target average weight (kg)<input className="input-shell" name="targetWeightKg" type="number" min="0.01" step="0.01" defaultValue={target?.targetWeightKg}/></label><label className="label-text">Expected production age (days)<input className="input-shell" name="targetAgeDays" type="number" min="1" step="1" defaultValue={target?.targetAgeDays}/></label><div className="flex items-end"><button disabled={!selectedBatch || selectedBatch.status !== "Active"} className="min-h-11 w-full rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b] disabled:opacity-50">Save my target</button></div></form></article><article className="rounded-2xl bg-white p-5"><h3 className="font-serif text-lg text-[#29352a]">Weight history</h3><HistoryList records={history.filter((record) => record.kind === "Weight measurement")} onEdit={openForm} onArchive={archive}/>{!weights.length && <p className="py-6 text-center text-sm text-[#788174]">No weight records in the selected period.</p>}</article></section>}

    {!formKind && view === "Weights" && <section className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Weight monitoring</h2><p className="mt-1 text-sm text-[#788174]">Each record shows the sample size and how its average was measured.</p></div><button onClick={() => openForm("Weight measurement")} disabled={!selectedBatch || selectedBatch.status !== "Active"} className="rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Record weight</button></div><div className="mt-4"><TrendBars rows={weights.map((row) => ({ label: row.date.slice(5), value: row.averageWeightKg * 1000 }))} unit="g average"/></div><HistoryList records={history.filter((record) => record.kind === "Weight measurement")} onEdit={openForm} onArchive={archive}/>{!weights.length && <Empty title="No weights recorded" text="Record an individual bird, a group average, a group total, or a sample."/>}</section>}

    {!formKind && view === "Feed" && <><section className="grid gap-3 sm:grid-cols-3"><Metric label="Feed recorded" value={`${prettyNumber(summary.feedIssuedKg, 2)} kg`} hint="Issued or manually recorded"/><Metric label="Feed records" value={feed.length}/><Metric label="Feed cost" value={feed.some((record) => record.recordedCost !== undefined) ? `₦${prettyNumber(feed.reduce((sum, record) => sum + (record.recordedCost || 0), 0))}` : "Not recorded"} hint="Only farmer-entered cost is included"/></section><section className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Feed use by batch</h2><p className="mt-1 text-sm text-[#788174]">An inventory issue reduces stock once; a manual record does not change inventory.</p></div><button onClick={() => openForm("Feed consumption")} disabled={!selectedBatch || selectedBatch.status !== "Active"} className="rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Record feed</button></div><HistoryList records={history.filter((record) => record.kind === "Feed consumption")} onEdit={openForm} onArchive={archive}/>{!feed.length && <Empty title="No feed records in this period" text="Record an inventory issue or enter a manual estimate when you do not track feed stock."/>}</section></>}

    {!formKind && view === "Performance" && <><section className="grid gap-4 lg:grid-cols-2">{(category === "All" || category === "Layer") && <PerformancePanel title="Layer performance" values={[
      { label: "Laying rate", value: batchId ? calculateLayingRate(batchId, filters) : null, unit: "%" },
      { label: "Eggs per bird", value: batchId ? { value: getBatchPerformance(batchId, filters).eggsPerBird?.value ?? null, explanation: getBatchPerformance(batchId, filters).eggsPerBird?.explanation || "Choose a layer batch" } : null, unit: "eggs / live-hen-day" },
      { label: "Feed per dozen eggs", value: batchId ? calculateFeedPerDozenEggs(batchId, filters) : null, unit: "kg / dozen" },
    ]}/>}{(category === "All" || category === "Broiler") && <PerformancePanel title="Broiler performance" values={[
      { label: "Average weight gain", value: batchId ? calculateWeightGain(batchId, fromDate, toDate) : null, unit: "kg" },
      { label: "Feed conversion ratio", value: batchId ? calculateFeedConversionRatio(batchId, filters) : null, unit: "kg feed / kg gain" },
      { label: "Sample average weight", value: batchId && getWeightRecords({ ...filters, category: "Broiler" }).length ? { value: getWeightRecords({ ...filters, category: "Broiler" })[0].averageWeightKg, explanation: `Latest measured sample; ${getWeightRecords({ ...filters, category: "Broiler" })[0].sampleSize} birds weighed. This is not a whole-flock average.` } : null, unit: "kg" },
    ]}/> }</section><section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Farm comparison</h2><p className="mt-1 text-xs text-[#788174]">Categories stay separate. Totals use the selected farm and reporting period.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{Array.isArray(farmPerformance?.categories) && farmPerformance.categories.map((item) => <div key={item.category} className="rounded-xl bg-[#f6f8f3] p-4"><p className="text-xs font-semibold text-[#446548]">{item.category === "Layer" ? "Layers" : "Broilers"}</p>{item.category === "Layer" ? <><p className="mt-2 text-xl font-semibold text-[#29352a]">{prettyNumber(item.totalEggs)} eggs</p><p className="mt-1 text-xs text-[#788174]">{item.layingRate === null ? item.explanation : `${item.layingRate.toFixed(1)}% laying rate · ${item.explanation}`}</p></> : <><p className="mt-2 text-xl font-semibold text-[#29352a]">{item.averageSampleWeightKg === null ? "No weights recorded" : `${item.averageSampleWeightKg.toFixed(3)} kg sample average`}</p><p className="mt-1 text-xs text-[#788174]">{item.explanation} · ${item.batches} batch(es)</p></>}</div>)}</div>{Array.isArray(farmPerformance?.categories) && farmPerformance.categories.length === 0 && <p className="mt-4 text-sm text-[#788174]">There are no categorized production records to compare.</p>}</section></>}

    {!formKind && view === "History" && <section className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Production history</h2><p className="mt-1 text-sm text-[#788174]">{filteredHistory.length} records · archived entries are excluded from totals.</p></div><JariSelect aria-label="Filter record type" value={recordKindFilter} className="input-shell max-w-[13rem]" onChange={(event) => setRecordKindFilter(event.target.value)}><option>All record types</option><option>Egg collection</option><option>Weight measurement</option><option>Feed consumption</option></JariSelect></div><HistoryList records={filteredHistory} onEdit={openForm} onArchive={archive}/>{!filteredHistory.length && <Empty title="No production history in this period" text="Use the date filters above or record new production."/>}</section>}
    {!formKind && view === "Performance" && <section className="grid gap-4 xl:grid-cols-2"><ComparisonTable title="Batch comparison" description={`Recorded values for ${fromDate} to ${toDate}. Egg counts and broiler sample weights stay separate.`} rows={batchComparisons.map((row) => ({ id: row.flock.id || row.flock.name, name: row.flock.name, category: asCategory(row.flock) || "Unclassified", eggs: row.eggs, weight: row.latestWeight, feed: row.feedKg }))}/><ComparisonTable title="House comparison" description="House totals aggregate recorded batches for the selected period." rows={houseComparisons.map((row) => ({ id: row.house.id || row.house.name, name: row.house.name, category: "House totals", eggs: row.eggs, weight: row.weights.length ? row.weights.reduce((sum, value) => sum + value, 0) / row.weights.length : null, feed: row.feedKg }))}/></section>}
  </main>;
}

function ProductionForm({ kind, editing, selectedBatch, feedItems, target, onCancel, onSubmit, onSaveTarget }: { kind: FormKind; editing: Editing; selectedBatch?: FlockRecord; feedItems: ReturnType<typeof getInventoryItems>; target?: ProductionTargetRecord; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onSaveTarget: (event: FormEvent<HTMLFormElement>) => void }) {
  const entry = editing?.value;
  const egg = entry && "totalEggs" in entry ? entry : undefined;
  const weight = entry && "averageWeightKg" in entry ? entry : undefined;
  const feedRecord = entry && "quantityKg" in entry ? entry : undefined;
  const [historical, setHistorical] = useState(Boolean(entry && selectedBatch?.status !== "Active"));
  const [source, setSource] = useState(feedRecord?.source || "Manual record");
  const [method, setMethod] = useState(weight?.method || "Sample average");
  return <section className="rounded-2xl bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#587354]">{editing ? "Correct a record" : "New record"}</p><h2 className="mt-1 font-serif text-2xl text-[#29352a]">{kind}</h2><p className="mt-1 text-xs text-[#788174]">{selectedBatch?.name || "Choose a batch above"} {selectedBatch?.status !== "Active" ? `· ${selectedBatch?.status}` : ""}</p></div><button type="button" onClick={onCancel} className="rounded-full bg-[#f2f4ee] px-3 py-2 text-xs font-semibold text-[#63705f]">Cancel</button></div>
    {selectedBatch && <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="label-text">Record date<input required name="date" type="date" max={today()} defaultValue={entry?.date || today()} className="input-shell"/></label>
      <label className="label-text">How sure is this figure?<JariSelect name="measurementStatus" defaultValue={entry?.measurementStatus || "Actual"} className="input-shell"><option>Actual</option><option>Estimated</option></JariSelect></label>
      {kind === "Egg collection" && <>
        <label className="label-text">Total eggs collected<input required name="totalEggs" type="number" min="0" step="1" defaultValue={egg?.totalEggs} className="input-shell"/></label>
        <label className="label-text">Live hens on this date (optional)<input name="liveHensAtCollection" type="number" min="1" step="1" defaultValue={egg?.liveHensAtCollection} className="input-shell"/><span className="mt-1 block text-[10px] font-normal text-[#899184]">Used to calculate laying rate if population history is unavailable.</span></label>
        <p className="sm:col-span-2 text-xs font-semibold text-[#657061]">Egg classification (optional)</p>
        <label className="label-text">Marketable eggs<input name="marketableEggs" type="number" min="0" step="1" defaultValue={egg?.marketableEggs} className="input-shell"/></label>
        <label className="label-text">Broken eggs<input name="brokenEggs" type="number" min="0" step="1" defaultValue={egg?.brokenEggs} className="input-shell"/></label>
        <label className="label-text">Cracked eggs<input name="crackedEggs" type="number" min="0" step="1" defaultValue={egg?.crackedEggs} className="input-shell"/></label>
        <label className="label-text">Dirty eggs<input name="dirtyEggs" type="number" min="0" step="1" defaultValue={egg?.dirtyEggs} className="input-shell"/></label>
        <label className="label-text">Other rejected eggs<input name="rejectedEggs" type="number" min="0" step="1" defaultValue={egg?.rejectedEggs} className="input-shell"/></label>
        <label className="label-text">Average egg weight in grams (optional)<input name="averageEggWeightGrams" type="number" min="0.1" max="200" step="0.1" defaultValue={egg?.averageEggWeightGrams} className="input-shell"/></label>
      </>}
      {kind === "Weight measurement" && <>
        <label className="label-text">How did you measure?<JariSelect name="method" value={method} onChange={(event) => setMethod(event.target.value as WeightRecord["method"])} className="input-shell"><option>Sample average</option><option>Individual birds</option><option>Group average</option><option>Group total</option></JariSelect></label>
        {method !== "Individual birds" && <label className="label-text">Birds weighed<input required name="sampleSize" type="number" min="1" step="1" defaultValue={weight?.sampleSize || 1} className="input-shell"/></label>}
        {method === "Group total" ? <><label className="label-text">Total sample weight<input required name="totalSampleWeight" type="number" min="0.001" step="any" defaultValue={weight?.totalSampleWeightKg} className="input-shell"/></label><UnitField defaultValue="kg"/></> : method === "Individual birds" ? <><label className="label-text sm:col-span-2">Individual weights (comma-separated)<input required name="individualWeights" placeholder="1.2, 1.4, 1.3" defaultValue={weight?.individualWeightsKg?.join(", ")} className="input-shell"/><span className="mt-1 block text-[10px] font-normal text-[#899184]">Enter each bird’s weight. The average is calculated for this sample only.</span></label><UnitField defaultValue="kg"/></> : <><label className="label-text">Average sample weight<input required name="averageWeight" type="number" min="0.001" step="any" defaultValue={weight?.averageWeightKg} className="input-shell"/></label><UnitField defaultValue="kg"/></>}
      </>}
      {kind === "Feed consumption" && <>
        <label className="label-text">Feed type or stage<input required name="feedType" list="jari-production-feed-types" defaultValue={feedRecord?.feedType} placeholder="Broiler starter, layer feed…" className="input-shell"/><datalist id="jari-production-feed-types"><option>Broiler starter</option><option>Broiler grower</option><option>Broiler finisher</option><option>Layer starter</option><option>Layer grower</option><option>Layer developer</option><option>Layer pre-layer</option><option>Layer production feed</option></datalist></label>
        <label className="label-text">Record source<JariSelect name="source" value={source} onChange={(event) => setSource(event.target.value as "Inventory issue" | "Manual record")} className="input-shell"><option>Manual record</option><option>Inventory issue</option></JariSelect></label>
        {source === "Inventory issue" && <label className="label-text sm:col-span-2">Feed item<JariSelect name="inventoryItemId" required={source === "Inventory issue"} defaultValue={feedRecord?.inventoryItemId || ""} className="input-shell"><option value="">Choose feed stock</option>{feedItems.map((item) => <option key={item.id} value={item.id}>{item.name} · {prettyNumber(item.currentQuantity, 2)} {item.unit}</option>)}</JariSelect>{!feedItems.length && <span className="mt-1 block text-[10px] font-normal text-[#9a493c]">There are no feed items in inventory for this farm. Choose Manual record or add feed stock first.</span>}</label>}
        <label className="label-text">Quantity<input required name="quantity" type="number" min="0.01" step="any" defaultValue={feedRecord?.quantityEntered} className="input-shell"/></label>
        <label className="label-text">Unit<JariSelect name="unit" defaultValue={feedRecord?.unitEntered || "kg"} className="input-shell"><option value="kg">Kilograms</option><option value="g">Grams</option><option value="bags">Bags</option></JariSelect></label>
        <label className="label-text">Weight of each bag (kg)<input name="bagWeightKg" type="number" min="0.01" step="any" defaultValue={feedRecord?.bagWeightKg} className="input-shell"/><span className="mt-1 block text-[10px] font-normal text-[#899184]">Required when recording bags. JARI will not assume a bag size.</span></label>
        <label className="label-text">Recorded cost (optional)<input name="recordedCost" type="number" min="0" step="0.01" defaultValue={feedRecord?.recordedCost} className="input-shell"/><span className="mt-1 block text-[10px] font-normal text-[#899184]">Enter only the cost you can verify for this feed.</span></label>
      </>}
      <label className="label-text sm:col-span-2">Notes (optional)<textarea name="notes" maxLength={500} defaultValue={entry?.notes} className="input-shell min-h-20"/></label>
      <label className="flex items-start gap-2 text-xs text-[#687466] sm:col-span-2"><input type="checkbox" checked={historical} onChange={(event) => setHistorical(event.target.checked)} name="allowHistorical" className="mt-0.5 accent-[#31583c]"/><span>Allow recording for a closed batch when the date is before its closure.</span></label>
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onCancel} className="min-h-11 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-11 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white">{editing ? "Save correction" : "Save record"}</button></div>
    </form>}
    {!selectedBatch && <Empty title="Choose a bird batch first" text="Select its farm, house and batch in the filters above."/>}
  </section>;
}

function UnitField({ defaultValue }: { defaultValue: string }) { return <label className="label-text">Weight unit<JariSelect name="weightUnit" defaultValue={defaultValue} className="input-shell"><option value="kg">Kilograms</option><option value="g">Grams</option></JariSelect></label>; }
function Metric({ label, value, hint }: { label: string; value: number | string; hint?: string }) { return <article className="min-w-0 rounded-2xl bg-white p-4 sm:p-5"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 break-words font-serif text-2xl text-[#29352a]">{typeof value === "number" ? prettyNumber(value) : value}</p>{hint && <p className="mt-1 text-[10px] leading-4 text-[#899184]">{hint}</p>}</article>; }
function ComparisonTable({ title, description, rows }: { title: string; description: string; rows: Array<{ id: string; name: string; category: string; eggs: number; weight: number | null; feed: number }> }) { return <article className="min-w-0 rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#788174]">{description}</p>{rows.length ? <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[32rem] text-left text-xs"><thead className="text-[#788174]"><tr><th className="py-2">Name</th><th>Type</th><th>Eggs</th><th>Sample avg.</th><th>Feed</th></tr></thead><tbody className="divide-y divide-[#edf0e9]">{rows.map((row) => <tr key={row.id}><td className="py-2 font-semibold text-[#354237]">{row.name}</td><td>{row.category}</td><td>{row.eggs ? prettyNumber(row.eggs) : "—"}</td><td>{row.weight === null ? "—" : `${row.weight.toFixed(3)} kg`}</td><td>{row.feed ? `${prettyNumber(row.feed, 2)} kg` : "—"}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-[#788174]">No records to compare for this period.</p>}</article>; }
function Empty({ title, text }: { title: string; text: string }) { return <div className="my-4 rounded-xl bg-[#f7f8f4] p-5 text-center"><p className="text-sm font-semibold text-[#354237]">{title}</p><p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-[#788174]">{text}</p></div>; }
function QuickAction({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) { return <button type="button" disabled={disabled} onClick={onClick} className="min-h-10 rounded-xl bg-white px-2 text-[11px] font-semibold text-[#456447] hover:bg-[#edf3e9] disabled:cursor-not-allowed disabled:text-[#adb4a8]">{label}</button>; }
function HistoryList({ records, onEdit, onArchive }: { records: ProductionHistoryEntry[]; onEdit: (kind: FormKind, record?: EggCollectionRecord | WeightRecord | ProductionFeedConsumptionRecord) => void; onArchive: (entry: ProductionHistoryEntry) => void }) {
  const eggs = getEggCollectionRecords({ includeArchived: true }); const weights = getWeightRecords({ includeArchived: true }); const feed = getProductionFeedConsumptionRecords({ includeArchived: true });
  return <div className="mt-3 divide-y divide-[#edf0e9]">{records.map((record) => {
    const editable = record.kind === "Egg collection" ? eggs.find((entry) => entry.id === record.id) : record.kind === "Weight measurement" ? weights.find((entry) => entry.id === record.id) : feed.find((entry) => entry.id === record.id);
    const kind = record.kind === "Egg collection" ? "Egg collection" : record.kind === "Weight measurement" ? "Weight measurement" : "Feed consumption";
    return <article key={`${record.kind}-${record.id}`} className="flex flex-wrap items-start justify-between gap-3 py-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[#354237]">{record.summary}</p>{record.archivedAt && <span className="rounded-full bg-[#f0f1ed] px-2 py-0.5 text-[9px] font-semibold text-[#7f877a]">Archived</span>}</div><p className="mt-1 text-[11px] text-[#788174]">{record.date} · {record.kind} · {record.measurementStatus.toLowerCase()}</p>{record.notes && <p className="mt-1 break-words text-xs text-[#899184]">{record.notes}</p>}</div>{!record.archivedAt && <div className="flex shrink-0 items-center gap-2"><button type="button" disabled={!editable} onClick={() => { if (editable) onEdit(kind, editable); }} title="Edit record" className="min-h-9 rounded-full bg-[#f2f4ee] px-3 text-[10px] font-semibold text-[#4b654d] disabled:opacity-45">Edit</button><button type="button" onClick={() => onArchive(record)} aria-label={`Archive ${record.kind} from ${record.date}`} className="grid h-9 w-9 place-items-center rounded-full bg-[#fbefeb] text-[#a34d42] hover:bg-[#f5dfd8]"><Archive size={14}/></button></div>}</article>;
  })}</div>;
}
function TrendBars({ rows, unit }: { rows: Array<{ label: string; value: number }>; unit?: string }) {
  if (!rows.length) return <p className="mt-4 rounded-xl bg-[#f7f8f4] p-4 text-xs text-[#788174]">No trend can be drawn until there are records in this period.</p>;
  const max = Math.max(...rows.map((row) => row.value), 1);
  return <div className="mt-4"><div className="flex h-36 items-end gap-1.5 overflow-x-auto border-b border-[#e8ede5] px-1">{rows.slice(-28).map((row, index) => <div key={`${row.label}-${index}`} title={`${row.label}: ${prettyNumber(row.value, 1)}${unit ? ` ${unit}` : ""}`} className="flex h-full min-w-3 flex-1 flex-col justify-end"><div className="min-h-1 rounded-t bg-[#789273]" style={{ height: `${Math.max(3, row.value / max * 100)}%` }}/></div>)}</div><div className="mt-2 flex justify-between text-[9px] text-[#899184]"><span>{rows.slice(-28)[0]?.label}</span><span>{unit || "Recorded amount by date"}</span><span>{rows.at(-1)?.label}</span></div></div>;
}
function PerformancePanel({ title, values }: { title: string; values: Array<{ label: string; value: { value: number | null; explanation: string } | null; unit: string }> }) {
  return <article className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">{title}</h2><div className="mt-3 divide-y divide-[#edf0e9]">{values.map(({ label, value, unit }) => <div key={label} className="py-3"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold text-[#354237]">{label}</p><p className="text-sm font-semibold text-[#416345]">{value?.value === null || value?.value === undefined ? "Not available" : `${value.value.toFixed(2)} ${unit}`}</p></div><p className="mt-1 text-xs leading-5 text-[#788174]">{value?.explanation || "Choose a matching batch and date range to view this calculation."}</p></div>)}</div></article>;
}
function AlertSection({ alerts }: { alerts: ReturnType<typeof generateProductionAlerts> }) { return <section className="rounded-2xl bg-[#fbf7ee] p-4"><h2 className="text-sm font-semibold text-[#80663b]">Record freshness</h2><div className="mt-2 grid gap-2 sm:grid-cols-2">{alerts.map((alert) => <article key={alert.key} className="rounded-xl bg-white/80 p-3"><p className="text-xs font-semibold text-[#695839]">{alert.title}</p><p className="mt-1 text-[11px] leading-4 text-[#788174]">{alert.description}</p></article>)}</div></section>; }
