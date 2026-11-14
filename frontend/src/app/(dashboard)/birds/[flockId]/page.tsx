"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleAlert, Plus, X } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { FlockMovementDialog } from "@/components/dashboard/flock-movement-dialog";
import { archiveFlockBatch, closeFlockBatch, getFlockActivities, getFlockMilestones, getFlockPopulationStats, getFlockRecords, getFlockTimeline, getPoultryHouses, addFlockMilestone, updateFlockRecord } from "@/services";
import type { FlockActivityRecord, FlockMilestoneRecord, FlockRecord, FlockTimelineEntry } from "@/services";

export default function FlockDetailsPage() {
  const { flockId } = useParams<{ flockId: string }>();
  const [flock, setFlock] = useState<FlockRecord | null>(null);
  const [timeline, setTimeline] = useState<FlockTimelineEntry[]>([]);
  const [activities, setActivities] = useState<FlockActivityRecord[]>([]);
  const [milestones, setMilestones] = useState<FlockMilestoneRecord[]>([]);
  const [days, setDays] = useState(30);
  const [movementOpen, setMovementOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [milestoneError, setMilestoneError] = useState("");

  const refresh = useCallback(() => {
    const current = getFlockRecords().find((record) => record.id === flockId) || null;
    setFlock(current);
    if (!current) return;
    setTimeline(getFlockTimeline(current.id!));
    setActivities(getFlockActivities().filter((activity) => activity.flockId === current.id));
    setMilestones(getFlockMilestones(current.id));
  }, [flockId]);

  useEffect(() => {
    refresh();
    window.addEventListener("jari:mock-data-changed", refresh);
    return () => window.removeEventListener("jari:mock-data-changed", refresh);
  }, [refresh]);

  const stats = useMemo(() => {
    if (!flock) return null;
    const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    return getFlockPopulationStats(flock.id!, from);
  }, [flock, days]);
  const house = flock ? getPoultryHouses().find((item) => item.id === flock.houseId) : undefined;
  const layerType = flock && ["Layer", "Mixed", "Both"].includes(flock.type);
  const openActivities = activities.filter((activity) => ["Upcoming", "Overdue", "Rescheduled"].includes(activity.status));
  const age = flock ? flockAge(flock) : "Unknown";

  const saveMilestone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!flock) return;
    const data = new FormData(event.currentTarget);
    try {
      addFlockMilestone({ farmId: flock.farmId!, flockId: flock.id!, milestone: String(data.get("milestone")) as FlockMilestoneRecord["milestone"], date: String(data.get("date") || ""), notes: String(data.get("notes") || "") });
      event.currentTarget.reset(); setMilestoneError(""); setNotice("Milestone saved to this batch history."); refresh();
    } catch (issue) { setMilestoneError(issue instanceof Error ? issue.message : "Could not save milestone."); }
  };
  const saveBatchDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!flock) return;
    const data = new FormData(event.currentTarget);
    const age = String(data.get("ageAtAcquisition") || "");
    try {
      updateFlockRecord(flock.id!, { name: String(data.get("name") || ""), type: String(data.get("type") || flock.type), category: String(data.get("category") || "") || undefined, breed: String(data.get("breed") || ""), hatchDate: String(data.get("hatchDate") || "") || undefined, acquisitionDate: String(data.get("acquisitionDate") || "") || undefined, ageAtAcquisition: age.trim() ? Number(age) : undefined, ageUnit: String(data.get("ageUnit") || "Days"), source: String(data.get("source") || ""), supplier: String(data.get("supplier") || "") });
      setEditOpen(false); setError(""); setNotice("Batch details updated and added to the lifecycle timeline."); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not update batch details."); }
  };
  const saveClosure = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!flock) return;
    const data = new FormData(event.currentTarget);
    try {
      closeFlockBatch({ flockId: flock.id!, date: String(data.get("date") || ""), reason: String(data.get("reason") || ""), notes: String(data.get("notes") || "") });
      setError(""); setNotice("Batch closed. Its history remains available."); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not close this batch."); }
  };
  const archive = () => {
    if (!flock || !window.confirm(`Archive ${flock.name}? Its history will remain available.`)) return;
    try { archiveFlockBatch(flock.id!); setError(""); setNotice("Batch archived. Its records remain in history."); refresh(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Could not archive this batch."); }
  };

  if (!flock) return <main className="mx-auto max-w-3xl rounded-2xl bg-white p-6"><Link href="/birds" className="inline-flex items-center gap-2 text-sm font-semibold text-[#547253]"><ArrowLeft size={15} /> Back to bird groups</Link><h1 className="mt-5 font-serif text-2xl text-[#20291f]">Bird group not found</h1><p className="mt-2 text-sm text-[#737d70]">This batch may belong to another account or may have been removed.</p></main>;

  return <main className="mx-auto max-w-6xl space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><Link href="/birds" className="inline-flex items-center gap-2 text-xs font-semibold text-[#547253]"><ArrowLeft size={14} /> All bird groups</Link><p className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">{flock.reference || flock.name} · {house?.name || flock.house}</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">{flock.name}</h1><p className="mt-2 text-sm text-[#737d70]">{flock.type} · {flock.breed || "Breed not recorded"} · {age}</p></div><div className="flex flex-wrap gap-2">{flock.status !== "Archived" && <button type="button" onClick={() => setEditOpen((value) => !value)} className="min-h-11 rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b]">{editOpen ? "Close edit" : "Edit details"}</button>}<button type="button" onClick={() => setMovementOpen(true)} disabled={flock.status !== "Active"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b] disabled:opacity-50"><Plus size={14} />Record bird change</button><Link href="/flock-activities" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><CalendarClock size={14} />Activities</Link></div></header>
    {editOpen && <form onSubmit={saveBatchDetails} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"><label className="label-text">Group name<input required name="name" defaultValue={flock.name} maxLength={100} className="input-shell" /></label><label className="label-text">Production type<JariSelect name="type" defaultValue={flock.type} className="input-shell"><option>Broiler</option><option>Layer</option><option>Mixed</option><option>Other</option></JariSelect></label><label className="label-text">Bird category<input name="category" defaultValue={flock.category || ""} className="input-shell" /></label><label className="label-text">Breed<input name="breed" defaultValue={flock.breed || ""} className="input-shell" /></label><label className="label-text">Hatch date<input name="hatchDate" type="date" max={new Date().toISOString().slice(0, 10)} defaultValue={flock.hatchDate || ""} className="input-shell" /></label><label className="label-text">Acquisition date<input name="acquisitionDate" type="date" max={new Date().toISOString().slice(0, 10)} defaultValue={flock.acquisitionDate || ""} className="input-shell" /></label><label className="label-text">Age at acquisition<input name="ageAtAcquisition" type="number" min="0" defaultValue={flock.ageAtAcquisition ?? ""} className="input-shell" /></label><label className="label-text">Age unit<JariSelect name="ageUnit" defaultValue={flock.ageUnit || "Days"} className="input-shell"><option>Days</option><option>Weeks</option></JariSelect></label><label className="label-text">Source<input name="source" defaultValue={flock.source || ""} className="input-shell" /></label><label className="label-text">Supplier<input name="supplier" defaultValue={flock.supplier || ""} className="input-shell" /></label><div className="flex justify-end gap-2 sm:col-span-2 lg:col-span-3"><button type="button" onClick={() => setEditOpen(false)} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Save details</button></div></form>}
    {notice && <p role="status" className="text-sm text-[#4c7048]">{notice}</p>}{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Current population" value={flock.birds.toLocaleString()} /><Metric label="Opening population" value={(flock.initialBirds ?? flock.birds).toLocaleString()} /><Metric label="Cumulative mortality" value={stats?.cumulativeRate === null ? "Not calculable" : `${stats?.cumulativeRate.toFixed(1)}%`} note={`${stats?.deaths ?? 0} deaths / ${stats?.introduced ?? 0} birds introduced`} /><Metric label={`${days}-day mortality`} value={stats?.periodRate === null ? "Not calculable" : `${stats?.periodRate.toFixed(1)}%`} note={`${stats?.periodDeaths ?? 0} deaths / ${stats?.openingPopulation ?? 0} birds at period start`} /></section>
    <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><article className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Population and mortality</h2><p className="mt-1 text-xs text-[#788174]">Deaths are separate from sales, culling and transfers.</p></div><label className="label-text">Period<JariSelect value={days} onChange={(event) => setDays(Number(event.target.value))} className="input-shell"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></JariSelect></label></div><div className="mt-4 grid grid-cols-2 gap-3"><Stat label="Birds sold, culled or transferred out" value={stats?.otherReductions.toLocaleString() || "0"} /><Stat label="Recorded period" value={`${stats?.fromDate} to ${stats?.toDate}`} /></div><p className="mt-3 text-[11px] leading-5 text-[#8a9185]">Rates use the population movements currently recorded for this batch. A zero or missing opening population is shown as not calculable.</p></article><article className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Batch status</h2><dl className="mt-3 space-y-3 text-sm"><Info label="Farm house" value={house?.name || flock.house} /><Info label="Production status" value={flock.productionStatus || "Not recorded"} /><Info label="Administrative status" value={flock.status} /><Info label="Hatch date" value={flock.hatchDate || "Not recorded"} /><Info label="Acquisition date" value={flock.acquisitionDate || "Not recorded"} /><Info label="Acquisition source" value={flock.source || "Not recorded"} /><Info label="Supplier" value={flock.supplier || "Not recorded"} /></dl></article></section>
    <section className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">Upcoming care</h2><p className="mt-1 text-xs text-[#788174]">A reminder is not proof that care was given.</p></div><Link href="/flock-activities" className="text-xs font-semibold text-[#547253]">Manage</Link></div>{openActivities.length ? <ul className="mt-4 space-y-2">{openActivities.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map((activity) => <li key={activity.id} className="flex items-start gap-3 rounded-xl bg-[#f7f8f4] p-3"><CalendarClock size={15} className="mt-0.5 text-[#688363]" /><div><p className="text-sm font-semibold text-[#354237]">{activity.activity}</p><p className="mt-1 text-xs text-[#788174]">{activity.scheduledDate} · {activity.status}</p></div></li>)}</ul> : <p className="mt-4 rounded-xl bg-[#f7f8f4] p-4 text-sm text-[#788174]">No upcoming or overdue activities recorded.</p>}<p className="mt-4 text-xs text-[#788174]">Vaccinations recorded: {timeline.filter((entry) => entry.category === "Vaccination").length || "None"}. JARI does not mark a batch fully vaccinated when records are missing.</p></article>
      <article className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Batch insights</h2><ul className="mt-3 space-y-2 text-sm text-[#566351]">{openActivities.some((activity) => activity.status === "Overdue") && <li className="flex gap-2"><CircleAlert size={16} className="mt-0.5 shrink-0 text-[#b26e35]" />{openActivities.filter((activity) => activity.status === "Overdue").length} activity record(s) are overdue.</li>}{!timeline.some((entry) => entry.category === "Vaccination") && <li className="flex gap-2"><CircleAlert size={16} className="mt-0.5 shrink-0 text-[#b26e35]" />No vaccination records are stored for this batch.</li>}{stats?.periodRate !== null && stats && stats.periodRate >= 0 && <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#688363]" />{stats.periodDeaths} mortality event(s) recorded in the last {days} days ({stats.periodRate.toFixed(1)}% of opening population).</li>}{!openActivities.some((activity) => activity.status === "Overdue") && timeline.some((entry) => entry.category === "Vaccination") && (!stats || stats.periodDeaths === 0) && <li className="text-[#788174]">No due activity or mortality concerns are supported by the records currently available.</li>}</ul><p className="mt-3 text-[11px] text-[#8a9185]">Insights summarize recorded data; they are not a veterinary diagnosis or treatment recommendation.</p></article></section>
    {layerType && <section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Laying milestones</h2><form onSubmit={saveMilestone} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="label-text">Milestone<JariSelect name="milestone" className="input-shell"><option>First egg recorded</option><option>Production resumed</option><option>Production declining</option><option>Production stopped</option></JariSelect></label><label className="label-text">Date<input required type="date" name="date" max={new Date().toISOString().slice(0, 10)} className="input-shell" /></label><label className="label-text lg:col-span-1">Notes (optional)<input name="notes" maxLength={300} className="input-shell" /></label><div className="flex items-end"><button className="min-h-11 w-full rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Save milestone</button></div>{milestoneError && <p role="alert" className="text-xs text-[#9a493c] sm:col-span-2 lg:col-span-4">{milestoneError}</p>}</form>{milestones.length > 0 && <div className="mt-4 space-y-2">{milestones.map((milestone) => <div key={milestone.id} className="rounded-xl bg-[#f7f8f4] p-3"><p className="text-sm font-semibold text-[#354237]">{milestone.milestone} · {milestone.date}</p>{milestone.notes && <p className="mt-1 text-xs text-[#788174]">{milestone.notes}</p>}</div>)}</div>}</section>}
    <section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Complete batch timeline</h2><p className="mt-1 text-xs text-[#788174]">Population changes, care, vaccinations, milestones, sales, transfers and closure.</p>{timeline.length ? <ol className="mt-4 space-y-2">{timeline.map((entry) => <li key={`${entry.category}-${entry.id}`} className="grid gap-1 rounded-xl bg-[#f7f8f4] p-3 sm:grid-cols-[7rem_1fr_auto] sm:items-start"><time className="text-xs font-medium text-[#788174]">{entry.date}</time><div><p className="text-sm font-semibold text-[#354237]">{entry.title}</p><p className="mt-1 text-xs text-[#788174]">{entry.category}{entry.detail ? ` · ${entry.detail}` : ""}</p></div>{entry.quantity !== undefined && <span className="text-xs font-semibold text-[#547253]">{entry.quantity.toLocaleString()} birds</span>}</li>)}</ol> : <p className="mt-4 rounded-xl bg-[#f7f8f4] p-4 text-sm text-[#788174]">No lifecycle events are recorded yet.</p>}</section>
    {flock.status !== "Closed" && flock.status !== "Archived" && <section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Close this batch</h2><p className="mt-1 text-xs text-[#788174]">First record all remaining birds as sold, removed or transferred. Closing preserves the batch history.</p><form onSubmit={saveClosure} className="mt-4 grid gap-3 sm:grid-cols-2"><label className="label-text">Closure date<input required name="date" type="date" max={new Date().toISOString().slice(0, 10)} className="input-shell" /></label><label className="label-text">Reason<JariSelect name="reason" className="input-shell"><option>End of production cycle</option><option>All birds sold</option><option>Flock retired</option><option>Other</option></JariSelect></label><label className="label-text sm:col-span-2">Notes (optional)<input name="notes" maxLength={300} className="input-shell" /></label><div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2"><p className="text-xs text-[#788174]">Final recorded population: {flock.birds.toLocaleString()}</p><button disabled={flock.birds !== 0 || flock.status === "Archived"} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-50">Close batch</button></div></form></section>}
    {(flock.status === "Closed" || flock.status === "Completed") && <section className="flex justify-end rounded-2xl bg-white p-4"><button type="button" onClick={archive} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#9a493c]">Archive batch</button></section>}
    {movementOpen && <FlockMovementDialog flocks={[flock]} onClose={() => setMovementOpen(false)} onSaved={() => { setMovementOpen(false); refresh(); }} />}
  </main>;
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) { return <article className="rounded-2xl bg-white p-4"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{value}</p>{note && <p className="mt-1 text-[10px] text-[#788174]">{note}</p>}</article>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#f7f8f4] p-3"><p className="text-[10px] text-[#788174]">{label}</p><p className="mt-1 text-sm font-semibold text-[#354237]">{value}</p></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3"><dt className="text-[#788174]">{label}</dt><dd className="text-right font-medium text-[#354237]">{value}</dd></div>; }
function flockAge(flock: FlockRecord) {
  const from = flock.hatchDate || flock.acquisitionDate;
  if (!from) return "Unknown age";
  const elapsed = Math.max(0, Math.floor((Date.now() - new Date(`${from}T00:00:00`).getTime()) / 86400000));
  const base = flock.hatchDate ? 0 : (flock.ageAtAcquisition || 0) * (flock.ageUnit?.toLowerCase().startsWith("week") ? 7 : 1);
  return `${Math.floor(elapsed + base)} days${flock.hatchDate ? " from hatch" : ""}`;
}
