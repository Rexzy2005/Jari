"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarClock, Check, Plus } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { createFlockActivity, getFarmerFarms, getFlockActivities, getFlockRecords, getInventoryItems, updateFlockActivity, updateFlockActivityStatus } from "@/services";
import type { FarmerFarmRecord, FlockActivityRecord, FlockRecord } from "@/services";

export default function FlockActivitiesPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [activities, setActivities] = useState<FlockActivityRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<ReturnType<typeof getInventoryItems>>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FlockActivityRecord | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = (selectedFarm = farmId) => {
    const availableFarms = getFarmerFarms();
    const chosenFarm = selectedFarm || availableFarms.find((farm) => farm.isPrimary)?.id || availableFarms[0]?.id || "";
    setFarms(availableFarms);
    setFarmId(chosenFarm);
    setFlocks(getFlockRecords().filter((flock) => flock.farmId === chosenFarm && flock.status === "Active"));
    setInventoryItems(getInventoryItems().filter((item) => item.farmId === chosenFarm));
    setActivities(getFlockActivities().filter((activity) => activity.farmId === chosenFarm).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)));
  };
  useEffect(() => {
    const onChange = () => refresh();
    refresh("");
    window.addEventListener("jari:mock-data-changed", onChange);
    return () => window.removeEventListener("jari:mock-data-changed", onChange);
  }, []);

  const activeCount = useMemo(() => activities.filter((activity) => activity.status === "Upcoming" || activity.status === "Overdue" || activity.status === "Rescheduled").length, [activities]);
  const saveActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const activity = { activity: String(data.get("activity") || ""), category: String(data.get("category") || "Other") as FlockActivityRecord["category"], scheduledDate: String(data.get("scheduledDate") || ""), scheduledTime: String(data.get("scheduledTime") || "") || undefined, inventoryItemId: String(data.get("inventoryItemId") || "") || undefined, plannedQuantity: data.get("plannedQuantity") ? Number(data.get("plannedQuantity")) : undefined, notes: String(data.get("notes") || "").trim() || undefined };
      if (editing) updateFlockActivity(editing.id, activity);
      else createFlockActivity({ farmId, flockId: String(data.get("flockId") || ""), ...activity });
      setNotice(editing ? "Activity updated." : "Activity scheduled."); setEditing(null); setError(""); setShowForm(false); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not schedule this activity."); }
  };
  const changeStatus = (activity: FlockActivityRecord, status: "Completed" | "Rescheduled" | "Cancelled", newDate?: string, completionNotes?: string) => {
    try {
      if (status === "Rescheduled" && !newDate) return;
      updateFlockActivityStatus(activity.id, status, newDate, completionNotes);
      setNotice(status === "Completed" ? "Activity marked complete." : status === "Rescheduled" ? "Activity rescheduled." : "Activity cancelled."); setError(""); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not update this activity."); }
  };

  return <main className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Birds and care</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Flock activities</h1><p className="mt-2 text-sm text-[#737d70]">Plan and track care for each active bird group.</p></div><button type="button" onClick={() => { setEditing(null); setShowForm((value) => !value); setError(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={15} />Schedule activity</button></header>
    {farms.length > 1 && <label className="label-text block max-w-sm">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}
    {notice && <p role="status" className="text-sm text-[#4c7048]">{notice}</p>}{error && !showForm && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}
    {showForm && <form key={editing?.id || "new-activity"} onSubmit={saveActivity} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">{error && <p role="alert" className="sm:col-span-2 rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}{!editing && <label className="label-text">Bird group<JariSelect name="flockId" className="input-shell" required>{flocks.map((flock) => <option key={flock.id} value={flock.id}>{flock.name}</option>)}</JariSelect></label>}<label className="label-text">Activity type<JariSelect name="category" className="input-shell" defaultValue={editing?.category || "Vaccination"}><option>Vaccination</option><option>Deworming</option><option>Health check</option><option>Treatment follow-up</option><option>Other</option></JariSelect></label><label className="label-text sm:col-span-2">Activity name<input name="activity" required maxLength={120} className="input-shell" defaultValue={editing?.activity || ""} placeholder="Newcastle disease vaccination" /></label><label className="label-text">Scheduled date<input name="scheduledDate" type="date" required className="input-shell" defaultValue={editing?.scheduledDate || ""} /></label><label className="label-text">Reminder time (optional)<input name="scheduledTime" type="time" className="input-shell" defaultValue={editing?.scheduledTime || ""} /></label><label className="label-text">Product (optional stock check)<JariSelect name="inventoryItemId" className="input-shell" defaultValue={editing?.inventoryItemId || ""}><option value="">No product linked</option>{inventoryItems.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.currentQuantity} {item.unit}{item.expired ? " · Expired" : ""}</option>)}</JariSelect></label><label className="label-text">Planned quantity<input name="plannedQuantity" type="number" min="0.01" step="0.01" defaultValue={editing?.plannedQuantity || ""} className="input-shell" /></label><p className="text-xs text-[#788174] sm:col-span-2">The recorded stock balance is shown for planning. Stock is not reserved and product suitability is not confirmed.</p><label className="label-text sm:col-span-2">Notes (optional)<input name="notes" maxLength={400} className="input-shell" defaultValue={editing?.notes || ""} /></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => { setShowForm(false); setEditing(null); setError(""); }} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button disabled={!editing && !flocks.length} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-50">{editing ? "Save changes" : "Save activity"}</button></div>{!editing && !flocks.length && <p className="text-xs text-[#788174] sm:col-span-2">Register an active bird group before scheduling flock activities.</p>}</form>}
    <section className="grid grid-cols-2 gap-3"><Metric label="Open activities" value={activeCount} /><Metric label="Scheduled or recorded" value={activities.length} /></section>
    <section className="rounded-2xl bg-white p-5"><h2 className="font-serif text-xl text-[#29352a]">Schedule and history</h2>{activities.length ? <div className="mt-4 space-y-2">{activities.map((activity) => <ActivityRow key={activity.id} activity={activity} inventoryItem={inventoryItems.find((record) => record.id === activity.inventoryItemId)} flock={flocks.find((flock) => flock.id === activity.flockId) || getFlockRecords().find((flock) => flock.id === activity.flockId)} onStatus={changeStatus} onEdit={(item) => { setEditing(item); setShowForm(true); setError(""); }} />)}</div> : <div className="mt-4 rounded-xl bg-[#f7f8f4] p-6 text-center"><CalendarClock size={23} className="mx-auto text-[#7d9275]" /><p className="mt-2 text-sm font-semibold text-[#354237]">No flock activities yet</p><p className="mt-1 text-xs text-[#788174]">Scheduled activities and completed care will appear here.</p></div>}</section>
  </main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <article className="rounded-2xl bg-white p-4"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{value}</p></article>; }
function ActivityRow({ activity, flock, inventoryItem, onStatus, onEdit }: { activity: FlockActivityRecord; inventoryItem?: ReturnType<typeof getInventoryItems>[number]; flock?: FlockRecord; onStatus: (activity: FlockActivityRecord, status: "Completed" | "Rescheduled" | "Cancelled", date?: string, completionNotes?: string) => void; onEdit: (activity: FlockActivityRecord) => void }) {
  const [rescheduleDate, setRescheduleDate] = useState(activity.scheduledDate);
  const [rescheduling, setRescheduling] = useState(false);
  const open = activity.status === "Upcoming" || activity.status === "Overdue" || activity.status === "Rescheduled";
  return <article className="flex flex-col gap-3 rounded-xl bg-[#f7f8f4] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[#354237]">{activity.activity}</p><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${activity.status === "Overdue" ? "bg-[#f9e8e2] text-[#9a493c]" : activity.status === "Completed" ? "bg-[#e5eee0] text-[#4c7048]" : "bg-[#edf0e9] text-[#687466]"}`}>{activity.status}</span></div><p className="mt-1 text-xs text-[#788174]">{flock?.name || "Bird group"} Â· {activity.category} Â· {activity.scheduledDate}{activity.scheduledTime ? ` Â· ${activity.scheduledTime}` : ""}</p>{activity.inventoryItemId && <p className="mt-1 text-xs text-[#788174]">Stock check: {inventoryItem ? `${inventoryItem.currentQuantity} ${inventoryItem.unit} on hand; ${inventoryItem.expired ? "expired" : activity.plannedQuantity && inventoryItem.currentQuantity >= activity.plannedQuantity ? "planned quantity appears available" : "below planned quantity"}` : "item unavailable"}. Stock is not reserved.</p>}{activity.notes && <p className="mt-1 text-xs text-[#788174]">{activity.notes}</p>}{activity.completionNotes && <p className="mt-1 text-xs text-[#788174]">Completed: {activity.completionNotes}</p>}</div>{open && <div className="flex flex-wrap items-center gap-2">{rescheduling ? <><input aria-label="New scheduled date" type="date" value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} className="min-h-9 rounded-full border border-[#e2e8dc] bg-white px-3 text-xs" /><button type="button" onClick={() => { onStatus(activity, "Rescheduled", rescheduleDate); setRescheduling(false); }} className="min-h-9 rounded-full bg-[#244b35] px-3 text-[10px] font-semibold text-white">Save date</button><button type="button" onClick={() => setRescheduling(false)} className="min-h-9 rounded-full px-2 text-[10px] text-[#788174]">Cancel</button></> : <><button type="button" onClick={() => onEdit(activity)} className="min-h-9 rounded-full bg-white px-3 text-[10px] font-semibold text-[#547253]">Edit</button><button type="button" onClick={() => onStatus(activity, "Completed")} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[#e5eee0] px-3 text-[10px] font-semibold text-[#4c7048]"><Check size={13} />Complete</button><button type="button" onClick={() => setRescheduling(true)} className="min-h-9 rounded-full bg-white px-3 text-[10px] font-semibold text-[#547253]">Reschedule</button><button type="button" onClick={() => onStatus(activity, "Cancelled")} className="min-h-9 rounded-full px-3 text-[10px] font-semibold text-[#9a493c]">Cancel</button></>}</div>}</article>;
}
