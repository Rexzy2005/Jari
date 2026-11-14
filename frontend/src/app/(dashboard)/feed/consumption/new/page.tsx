"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { JariSelect } from "@/components/ui/jari-select";
import { addFeedUse, getFarmerFarms, getFeedInventory, getFlockRecords } from "@/services";
import type { FarmerFarmRecord, FlockRecord } from "@/services";

export default function NewFeedUsePage() {
  const router = useRouter();
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [inventory, setInventory] = useState(getFeedInventory());
  const [flockId, setFlockId] = useState("");
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), feedType: "", quantityKg: "", notes: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { const available = getFarmerFarms(); setFarms(available); setFarmId(available.find((farm) => farm.isPrimary)?.id || available[0]?.id || ""); }, []);
  useEffect(() => { const active = getFlockRecords().filter((flock) => flock.farmId === farmId && flock.status === "Active"); const stock = getFeedInventory(farmId); setFlocks(active); setInventory(stock); setFlockId(active[0]?.id || ""); setForm((old) => ({ ...old, feedType: stock[0]?.feedType || "" })); }, [farmId]);
  const available = inventory.find((item) => item.feedType === form.feedType)?.availableKg ?? 0;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSaving(true);
    try { const flock = flocks.find((item) => item.id === flockId); if (!flock) throw new Error("Choose an active bird group."); await addFeedUse({ farmId, flockId: flock.id, flock: flock.name, date: form.date, feedType: form.feedType, quantityKg: Number(form.quantityKg), notes: form.notes.trim() || undefined }); router.push("/feed/consumption"); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "We could not save this feed record."); }
    finally { setSaving(false); }
  };
  return <main className="mx-auto max-w-3xl space-y-5"><header><Link href="/feed/consumption" className="text-xs font-semibold text-[#547253]">Back to feed use</Link><h1 className="mt-2 font-serif text-3xl text-[#20291f]">Record feed issue</h1><p className="mt-2 text-sm text-[#737d70]">Stock will be deducted from the selected farm and linked to this bird group.</p></header>{farms.length > 1 && <label className="label-text block max-w-sm">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => setFarmId(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}{!inventory.length && <p className="rounded-xl bg-[#fbf7ee] p-4 text-sm text-[#80663b]">No feed stock is recorded on this farm yet. Add a purchase before recording use.</p>}<form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2"><label className="label-text">Date<input required type="date" className="input-shell" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label className="label-text">Bird group<JariSelect required className="input-shell" value={flockId} onChange={(event) => setFlockId(event.target.value)}>{flocks.map((flock) => <option key={flock.id} value={flock.id}>{flock.name}</option>)}</JariSelect></label><label className="label-text">Feed type<JariSelect required className="input-shell" value={form.feedType} onChange={(event) => setForm({ ...form, feedType: event.target.value })}>{inventory.map((item) => <option key={item.feedType} value={item.feedType}>{item.feedType} · {item.availableKg.toLocaleString()} kg</option>)}</JariSelect></label><label className="label-text">Quantity issued (kg)<input required type="number" min="0.01" max={available || undefined} step="0.01" className="input-shell" value={form.quantityKg} onChange={(event) => setForm({ ...form, quantityKg: event.target.value })} /></label><label className="label-text sm:col-span-2">Notes (optional)<textarea maxLength={300} className="input-shell" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c] sm:col-span-2">{error}</p>}<div className="flex justify-end sm:col-span-2"><button type="submit" disabled={saving || available <= 0 || !flocks.length} className="min-h-11 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save feed issue"}</button></div></form></main>;
}
