"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { JariSelect } from "@/components/ui/jari-select";
import { addFeedPurchase, getFarmerFarms, getFlockRecords } from "@/services";
import type { FarmerFarmRecord, FlockRecord } from "@/services";

export default function NewFeedPurchasePage() {
  const router = useRouter();
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [flockId, setFlockId] = useState("");
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), feedType: "Starter", brand: "", supplier: "", quantity: "", unit: "bags" as "bags" | "kg", bagWeightKg: "25", amount: "", amountPaid: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { const available = getFarmerFarms(); setFarms(available); setFarmId(available.find((farm) => farm.isPrimary)?.id || available[0]?.id || ""); }, []);
  useEffect(() => { const active = getFlockRecords().filter((flock) => flock.farmId === farmId && flock.status === "Active"); setFlocks(active); setFlockId(""); }, [farmId]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      const flock = flocks.find((item) => item.id === flockId);
      await addFeedPurchase({ farmId, flockId: flock?.id, flock: flock?.name, date: form.date, feedType: form.feedType, brand: form.brand.trim(), supplier: form.supplier.trim(), quantity: Number(form.quantity), unit: form.unit, bagWeightKg: form.unit === "bags" ? Number(form.bagWeightKg) : 1, amount: Number(form.amount), amountPaid: Number(form.amountPaid) || 0 });
      router.push("/feed/purchases");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "We could not save this purchase."); }
    finally { setSaving(false); }
  };
  return <main className="mx-auto max-w-3xl space-y-5"><header><Link href="/feed/purchases" className="text-xs font-semibold text-[#547253]">Back to purchases</Link><h1 className="mt-2 font-serif text-3xl text-[#20291f]">Add a feed purchase</h1><p className="mt-2 text-sm text-[#737d70]">The purchase will update the farm inventory ledger and retain its supplier and cost record.</p></header>{!farms.length && <p className="rounded-xl bg-[#fbf7ee] p-4 text-sm text-[#80663b]">Complete your farm profile before adding feed purchases.</p>}<form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">{farms.length > 1 && <label className="label-text">Farm<JariSelect required className="input-shell" value={farmId} onChange={(event) => setFarmId(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}<label className="label-text">Purchase date<input required type="date" className="input-shell" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label className="label-text">Feed type<JariSelect className="input-shell" value={form.feedType} onChange={(event) => setForm({ ...form, feedType: event.target.value })}>{["Starter", "Grower", "Finisher", "Layer", "Breeder", "Other"].map((type) => <option key={type}>{type}</option>)}</JariSelect></label><label className="label-text">Brand<input required className="input-shell" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} placeholder="Feed brand" /></label><label className="label-text">Supplier<input className="input-shell" value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} placeholder="Supplier name" /></label><label className="label-text">Quantity<input required type="number" min="0.01" step="0.01" className="input-shell" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></label><label className="label-text">Unit<JariSelect className="input-shell" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value as "bags" | "kg" })}><option value="bags">Bags</option><option value="kg">Kilograms</option></JariSelect></label>{form.unit === "bags" && <label className="label-text">Weight per bag<input required type="number" min="1" step="0.1" className="input-shell" value={form.bagWeightKg} onChange={(event) => setForm({ ...form, bagWeightKg: event.target.value })} /></label>}<label className="label-text">Total cost (naira)<input required type="number" min="0" step="0.01" className="input-shell" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label><label className="label-text">Amount paid (naira)<input type="number" min="0" max={form.amount || undefined} step="0.01" className="input-shell" value={form.amountPaid} onChange={(event) => setForm({ ...form, amountPaid: event.target.value })} /></label><label className="label-text">Bird group (optional)<JariSelect className="input-shell" value={flockId} onChange={(event) => setFlockId(event.target.value)}><option value="">Not linked to a group</option>{flocks.map((flock) => <option key={flock.id} value={flock.id}>{flock.name}</option>)}</JariSelect></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c] sm:col-span-2">{error}</p>}<div className="flex justify-end sm:col-span-2"><button type="submit" disabled={saving || !farmId} className="min-h-11 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save purchase"}</button></div></form></main>;
}
