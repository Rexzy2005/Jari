"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ChevronDown, Plus, X } from "lucide-react";
import { addFlockMilestone, getFarmerFarms, getFlockMilestones, getFlockMovements, getFlockRecords, getPoultryHouses } from "@/services";
import type { FarmFlockMovement, FlockMilestoneRecord, FlockRecord, FarmerFarmRecord, FarmHouseRecord } from "@/services";
import { JariSelect } from "@/components/ui/jari-select";
import { FlockMovementDialog } from "@/components/dashboard/flock-movement-dialog";
import { FlockTransferDialog } from "@/components/dashboard/flock-transfer-dialog";
import { FlockFarmTransferDialog } from "@/components/dashboard/flock-farm-transfer-dialog";

export default function BirdsPage() {
  const router = useRouter();
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [movements, setMovements] = useState<FarmFlockMovement[]>([]);
  const [milestones, setMilestones] = useState<FlockMilestoneRecord[]>([]);
  const [milestoneError, setMilestoneError] = useState("");
  const [selectedFlock, setSelectedFlock] = useState<FlockRecord | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [farmTransferOpen, setFarmTransferOpen] = useState(false);
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [houses, setHouses] = useState<FarmHouseRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [houseId, setHouseId] = useState("");

  const refresh = (selectedFarm = farmId, selectedHouse = houseId) => {
    const availableFarms = getFarmerFarms();
    const chosenFarm = selectedFarm || availableFarms.find((farm) => farm.isPrimary)?.id || availableFarms[0]?.id || "";
    setFarms(availableFarms); setFarmId(chosenFarm);
    const farmHouses = getPoultryHouses().filter((house) => house.farmId === chosenFarm);
    setHouses(farmHouses);
    const chosenHouse = farmHouses.some((house) => house.id === selectedHouse) ? selectedHouse : "";
    setHouseId(chosenHouse);
    setFlocks(getFlockRecords().filter((flock) => flock.farmId === chosenFarm && (!chosenHouse || flock.houseId === chosenHouse)));
    setMovements(getFlockMovements().filter((movement) => movement.farmId === chosenFarm));
    setMilestones(getFlockMilestones());
  };
  useEffect(() => { refresh("", ""); }, []);
  const activeBirds = flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + Number(flock.birds || 0), 0);
  const visibleMovements = houseId ? movements.filter((movement) => movement.houseId === houseId) : movements;

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Birds and care</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Your bird groups</h2><p className="mt-2 text-sm text-[#737d70]">Select a group to see its details.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMovementOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b]"><Plus size={14} />Record bird change</button><button type="button" onClick={() => setTransferOpen(true)} disabled={flocks.filter((flock) => flock.status === "Active").length < 2} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b] disabled:opacity-50">Transfer between groups</button>{farms.length > 1 && <button type="button" onClick={() => setFarmTransferOpen(true)} disabled={!getFlockRecords().some((flock) => flock.status === "Active")} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b] disabled:opacity-50">Transfer to another farm</button>}<Link href="/birds/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193d2b]">Add bird group</Link></div></div>

      {(farms.length > 1 || houses.length > 0) && <section className="grid gap-3 rounded-[1.25rem] bg-white p-4 sm:grid-cols-2 sm:p-5">{farms.length > 1 && <label className="label-text">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value, "")}>
        {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
      </JariSelect></label>}{houses.length > 0 && <label className="label-text">House<JariSelect className="input-shell" value={houseId} onChange={(event) => refresh(farmId, event.target.value)}><option value="">All houses</option>{houses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</JariSelect></label>}</section>}
      <section className="grid gap-3 sm:grid-cols-2"><article className="rounded-[1.25rem] bg-white p-5"><p className="text-xs text-[#788174]">Birds in active groups</p><p className="mt-2 font-serif text-3xl text-[#29352a]">{activeBirds.toLocaleString()}</p></article><article className="rounded-[1.25rem] bg-white p-5"><p className="text-xs text-[#788174]">Groups in this view</p><p className="mt-2 font-serif text-3xl text-[#29352a]">{flocks.length}</p></article></section>

      <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><h3 className="font-serif text-xl font-medium text-[#29352a]">Bird groups</h3>{flocks.length ? <div className="mt-3 space-y-2">{flocks.map((flock) => <button type="button" key={flock.id} onClick={() => { setSelectedFlock(flock); router.push(`/birds/${flock.id}`); }} className="group flex w-full flex-col gap-3 rounded-xl bg-[#f7f8f4] p-4 text-left transition-colors hover:bg-[#eef2e9] sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#354237]">{flock.name}</span><span className="mt-1 block text-xs text-[#788174]">{flock.type} birds · {flock.house} · {Number(flock.birds).toLocaleString()} birds</span></span><span className="flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${flock.status === "Active" ? "bg-[#e5eee0] text-[#4c7048]" : "bg-[#eeefe9] text-[#70776b]"}`}>{flock.status === "Active" ? "Being raised" : flock.status}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Details <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></button>)}</div> : <p className="mt-3 rounded-xl bg-[#f7f8f4] p-5 text-sm text-[#788174]">{houseId ? "No bird groups have been assigned to this house." : "No bird groups are registered on this farm yet."} <Link href="/birds/new" className="font-semibold text-[#547253]">Add the first group</Link></p>}</section>

      <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird count history</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">Recent changes</h3></div><div className="mt-3 space-y-2">{visibleMovements.slice(-5).reverse().map((movement) => <div key={movement.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7f8f4] p-3"><div><p className="text-xs font-semibold text-[#354237]">{movement.type} - {movement.flock}</p><p className="mt-1 text-[10px] text-[#788174]">{movement.date} - {movement.reason}</p></div><span className="text-xs font-semibold text-[#547253]">{movement.quantity.toLocaleString()} birds</span></div>)}</div></section>

      {selectedFlock && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedFlock(null); }}><section role="dialog" aria-modal="true" aria-labelledby="flock-detail-title" className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird group · {selectedFlock.reference || selectedFlock.name}</p><h3 id="flock-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{selectedFlock.name}</h3></div><button type="button" onClick={() => setSelectedFlock(null)} aria-label="Close bird group details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div><dl className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "Bird type", value: selectedFlock.type }, { label: "Current birds", value: Number(selectedFlock.birds).toLocaleString() }, { label: "Opening birds", value: Number(selectedFlock.initialBirds ?? selectedFlock.birds).toLocaleString() }, { label: "Farm house", value: selectedFlock.house }, { label: "Breed", value: selectedFlock.breed || "Not recorded" }, { label: "Current age", value: flockAge(selectedFlock) }, { label: "Acquisition date", value: selectedFlock.acquisitionDate || "Not recorded" }, { label: "Group status", value: selectedFlock.status }, { label: "Production", value: selectedFlock.productionStatus || "Not recorded" }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 flex items-center gap-2 text-sm font-medium text-[#354237]">{item.label === "Bird type" && <Bird size={14} className="text-[#688363]" />}{item.value}</dd></div>)}</dl>{["Layer", "Mixed", "Both"].includes(selectedFlock.type) && <section className="mt-6 rounded-xl bg-[#f1f4ed] p-4"><h4 className="font-serif text-lg text-[#29352a]">Laying milestones</h4><form className="mt-3 grid gap-3 sm:grid-cols-3" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); try { addFlockMilestone({ farmId: selectedFlock.farmId!, flockId: selectedFlock.id!, milestone: String(data.get("milestone")) as FlockMilestoneRecord["milestone"], date: String(data.get("date") || ""), notes: String(data.get("notes") || "") }); setMilestoneError(""); refresh(); setSelectedFlock(getFlockRecords().find((flock) => flock.id === selectedFlock.id) || selectedFlock); } catch (issue) { setMilestoneError(issue instanceof Error ? issue.message : "Could not save milestone."); } }}><JariSelect name="milestone" className="input-shell sm:col-span-1"><option>First egg recorded</option><option>Production resumed</option><option>Production declining</option><option>Production stopped</option></JariSelect><input required name="date" type="date" className="input-shell" /><button className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Add milestone</button><input name="notes" maxLength={300} placeholder="Optional note" className="input-shell sm:col-span-3" />{milestoneError && <p role="alert" className="text-xs text-[#9a493c] sm:col-span-3">{milestoneError}</p>}</form><ol className="mt-3 space-y-2">{milestones.filter((milestone) => milestone.flockId === selectedFlock.id).map((milestone) => <li key={milestone.id} className="rounded-lg bg-white p-3 text-xs"><span className="font-semibold text-[#354237]">{milestone.milestone}</span><span className="ml-2 text-[#788174]">{milestone.date}</span>{milestone.notes && <p className="mt-1 text-[#788174]">{milestone.notes}</p>}</li>)}{!milestones.some((milestone) => milestone.flockId === selectedFlock.id) && <p className="text-xs text-[#788174]">No laying milestones recorded.</p>}</ol></section>}<section className="mt-6"><h4 className="font-serif text-lg text-[#29352a]">Batch history</h4>{movements.filter((record) => record.flockId ? record.flockId === selectedFlock.id : record.flock === selectedFlock.name).slice().sort((a, b) => b.date.localeCompare(a.date)).length ? <ol className="mt-3 space-y-2">{movements.filter((record) => record.flockId ? record.flockId === selectedFlock.id : record.flock === selectedFlock.name).slice().sort((a, b) => b.date.localeCompare(a.date)).map((record) => <li key={record.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3"><div><p className="text-xs font-semibold text-[#354237]">{record.type} · {record.reason}</p><p className="mt-1 text-[10px] text-[#788174]">{record.date}{record.notes ? ` · ${record.notes}` : ""}</p></div><span className="text-xs font-semibold text-[#547253]">{record.quantity ? `${record.quantity.toLocaleString()} birds` : "No population change"}</span></li>)}</ol> : <p className="mt-3 rounded-xl bg-white p-4 text-sm text-[#788174]">No population history recorded yet.</p>}</section></section></div>}
      {movementOpen && <FlockMovementDialog flocks={flocks.filter((flock) => flock.status === "Active")} onClose={() => setMovementOpen(false)} onSaved={() => { refresh(); setMovementOpen(false); }} />}
      {transferOpen && <FlockTransferDialog flocks={flocks.filter((flock) => flock.status === "Active")} onClose={() => setTransferOpen(false)} onSaved={() => { refresh(); setTransferOpen(false); }} />}
      {farmTransferOpen && <FlockFarmTransferDialog flocks={getFlockRecords()} farms={farms} houses={getPoultryHouses()} onClose={() => setFarmTransferOpen(false)} onSaved={() => { refresh(); setFarmTransferOpen(false); }} />}
    </div>
  );
}

function flockAge(flock: FlockRecord) {
  if (flock.hatchDate) {
    const days = Math.max(0, Math.floor((Date.now() - new Date(`${flock.hatchDate}T00:00:00`).getTime()) / 86400000));
    return `${days} days (from hatch date)`;
  }
  if (flock.acquisitionDate && Number.isFinite(flock.ageAtAcquisition)) {
    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(`${flock.acquisitionDate}T00:00:00`).getTime()) / 86400000));
    const baseDays = (flock.ageAtAcquisition || 0) * (flock.ageUnit?.toLowerCase().startsWith("week") ? 7 : flock.ageUnit?.toLowerCase().startsWith("month") ? 30.4375 : 1);
    return `${Math.floor(baseDays + elapsed)} days`;
  }
  return "Unknown";
}
