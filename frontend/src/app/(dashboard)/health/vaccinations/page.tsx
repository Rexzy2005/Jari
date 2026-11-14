"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarClock, Syringe } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { addVaccinationRecord, getFarmerFarms, getFlockRecords, getVaccinationRecords } from "@/services";
import type { FarmerFarmRecord, FlockRecord, VaccinationRecord } from "@/services";

export default function VaccinationsPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const refresh = (selectedFarm = farmId) => {
    const availableFarms = getFarmerFarms();
    const chosenFarm = selectedFarm || availableFarms.find((farm) => farm.isPrimary)?.id || availableFarms[0]?.id || "";
    setFarms(availableFarms); setFarmId(chosenFarm);
    setFlocks(getFlockRecords().filter((flock) => flock.farmId === chosenFarm && flock.status === "Active"));
    setRecords(getVaccinationRecords().filter((record) => record.farmId === chosenFarm));
  };
  useEffect(() => { refresh(""); const sync = () => refresh(); window.addEventListener("jari:mock-data-changed", sync); return () => window.removeEventListener("jari:mock-data-changed", sync); }, []);
  const due = useMemo(() => records.filter((record) => record.nextDate && record.nextDate <= today).length, [records, today]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const flockId = String(form.get("flockId") || ""); const flock = flocks.find((item) => item.id === flockId);
    try {
      if (!flock) throw new Error("Choose an active bird group.");
      addVaccinationRecord({ flock: flock.name, flockId: flock.id, farmId: flock.farmId, vaccine: String(form.get("vaccine") || ""), date: String(form.get("date") || ""), birds: Number(form.get("birds") || 0), nextDate: String(form.get("nextDate") || "") || undefined, manufacturer: String(form.get("manufacturer") || ""), lotNumber: String(form.get("lotNumber") || ""), givenBy: String(form.get("givenBy") || ""), notes: String(form.get("notes") || "") });
      setOpen(false); setError(""); setNotice("Vaccination record saved."); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not save this record."); }
  };
  return <main className="space-y-6"><header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Flock care</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Vaccination history</h1><p className="mt-2 text-sm text-[#737d70]">Record completed vaccinations and set the next due date.</p></div><button onClick={() => { setOpen((value) => !value); setError(""); }} disabled={!flocks.length} className="min-h-11 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-50">{open ? "Close form" : "Add vaccination"}</button></header>
    {farms.length > 1 && <label className="label-text flex max-w-sm flex-col gap-1">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}
    {error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}{notice && <p role="status" className="rounded-xl bg-[#edf4e9] p-3 text-sm text-[#35543b]">{notice}</p>}
    <section className="grid gap-3 sm:grid-cols-2"><Metric label="Vaccination records" value={records.length} /><Metric label="Due or overdue" value={due} /></section>
    {open && <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2"><label className="label-text">Bird group<JariSelect required name="flockId" className="input-shell">{flocks.map((flock) => <option key={flock.id} value={flock.id}>{flock.name} · {flock.house}</option>)}</JariSelect></label><label className="label-text">Vaccine<input required name="vaccine" maxLength={120} className="input-shell" placeholder="e.g. Newcastle disease" /></label><label className="label-text">Date given<input required name="date" type="date" max={today} defaultValue={today} className="input-shell" /></label><label className="label-text">Birds covered<input required name="birds" type="number" min="1" className="input-shell" /></label><label className="label-text">Manufacturer (optional)<input name="manufacturer" maxLength={120} className="input-shell" /></label><label className="label-text">Vaccine lot (optional)<input name="lotNumber" maxLength={100} className="input-shell" /></label><label className="label-text">Next due date (optional)<input name="nextDate" type="date" className="input-shell" /></label><label className="label-text">Given by (optional)<input name="givenBy" maxLength={100} className="input-shell" /></label><label className="label-text sm:col-span-2">Notes (optional)<input name="notes" maxLength={400} className="input-shell" /></label><div className="flex justify-end sm:col-span-2"><button className="min-h-11 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white">Save vaccination</button></div></form>}
    <section className="space-y-3">{records.slice().sort((a, b) => b.date.localeCompare(a.date)).map((record) => { const isDue = Boolean(record.nextDate && record.nextDate <= today); return <article key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Syringe size={16} /></span><div><h2 className="font-semibold text-[#354237]">{record.vaccine}</h2><p className="mt-1 text-xs text-[#788174]">{record.flock} · {record.birds.toLocaleString()} birds · given {record.date}</p>{record.givenBy && <p className="mt-1 text-[10px] text-[#92998e]">Recorded by {record.givenBy}</p>}</div></div>{record.nextDate && <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold ${isDue ? "bg-[#fbefeb] text-[#9a493c]" : "bg-[#edf2e8] text-[#547253]"}`}><CalendarClock size={13} />{isDue ? "Due" : "Next due"} · {record.nextDate}</span>}</article>; })}{!records.length && <p className="rounded-2xl bg-white p-6 text-sm text-[#788174]">No vaccinations recorded for this farm.</p>}</section>
  </main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <article className="rounded-2xl bg-white p-4"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{value}</p></article>; }
