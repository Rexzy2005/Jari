"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { createInventorySupplier, getFarmerFarms, getInventorySuppliers, getInventoryPurchases, updateInventorySupplier } from "@/services";
import type { FarmerFarmRecord, InventorySupplierRecord } from "@/services";

export default function InventorySuppliersPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [suppliers, setSuppliers] = useState<InventorySupplierRecord[]>([]);
  const [purchaseCount, setPurchaseCount] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventorySupplierRecord | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refresh = (selected = farmId) => {
    const available = getFarmerFarms();
    const chosen = selected || available.find((farm) => farm.isPrimary)?.id || available[0]?.id || "";
    const records = getInventorySuppliers(chosen);
    const purchases = getInventoryPurchases(chosen);
    setFarms(available); setFarmId(chosen); setSuppliers(records);
    setPurchaseCount(Object.fromEntries(records.map((supplier) => [supplier.id, purchases.filter((purchase) => purchase.supplierId === supplier.id).length])));
  };
  useEffect(() => { refresh(""); const update = () => refresh(); window.addEventListener("jari:mock-data-changed", update); return () => window.removeEventListener("jari:mock-data-changed", update); }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    try { const values = { name: String(data.get("name") || ""), contactName: String(data.get("contactName") || ""), phone: String(data.get("phone") || ""), email: String(data.get("email") || ""), address: String(data.get("address") || ""), products: String(data.get("products") || "").split(","), notes: String(data.get("notes") || "") }; if (editing) updateInventorySupplier(editing.id, values); else createInventorySupplier({ farmId, ...values }); setOpen(false); setEditing(null); setError(""); setNotice(editing ? "Supplier details updated." : "Supplier saved."); refresh(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Could not save supplier."); }
  };
  const toggle = (supplier: InventorySupplierRecord) => { try { updateInventorySupplier(supplier.id, { active: !supplier.active }); setNotice(supplier.active ? "Supplier marked inactive. Purchase history is retained." : "Supplier reactivated."); setError(""); refresh(); } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not update supplier."); } };
  return <main className="mx-auto max-w-5xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-3"><div><Link href="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-[#547253]"><ArrowLeft size={14} /> Inventory</Link><p className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Inventory records</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Suppliers</h1><p className="mt-2 text-sm text-[#737d70]">Keep supplier details and purchase history together by farm.</p></div><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={14} />Add supplier</button></header>
    {farms.length > 1 && <label className="label-text block max-w-sm">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}{notice && <p role="status" className="text-sm text-[#4c7048]">{notice}</p>}{error && !open && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}
    {open && <form key={editing?.id || "new-supplier"} onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c] sm:col-span-2">{error}</p>}<label className="label-text">Supplier or business name<input required name="name" defaultValue={editing?.name} maxLength={120} className="input-shell" /></label><label className="label-text">Contact person<input name="contactName" defaultValue={editing?.contactName} maxLength={100} className="input-shell" /></label><label className="label-text">Phone<input name="phone" type="tel" defaultValue={editing?.phone} maxLength={40} className="input-shell" /></label><label className="label-text">Email<input name="email" type="email" defaultValue={editing?.email} maxLength={150} className="input-shell" /></label><label className="label-text sm:col-span-2">Address or location<input name="address" defaultValue={editing?.address} maxLength={200} className="input-shell" /></label><label className="label-text sm:col-span-2">Products supplied (comma separated)<input name="products" defaultValue={editing?.products?.join(", ")} maxLength={300} className="input-shell" placeholder="Feed, vitamins" /></label><label className="label-text sm:col-span-2">Notes<input name="notes" defaultValue={editing?.notes} maxLength={300} className="input-shell" /></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => { setOpen(false); setEditing(null); setError(""); }} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">{editing ? "Save changes" : "Save supplier"}</button></div></form>}
    <section className="space-y-3">{suppliers.map((supplier) => <article key={supplier.id} className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-[#354237]">{supplier.name}</h2><p className="mt-1 text-xs text-[#788174]">{supplier.contactName || "No contact person"}{supplier.phone ? ` · ${supplier.phone}` : ""}{supplier.email ? ` · ${supplier.email}` : ""}</p><p className="mt-2 text-xs text-[#788174]">{supplier.address || "No address recorded"} · {purchaseCount[supplier.id] || 0} purchase(s)</p>{supplier.products?.length ? <p className="mt-2 text-xs text-[#687466]">Supplies: {supplier.products.join(", ")}</p> : null}{supplier.notes && <p className="mt-2 text-xs text-[#788174]">{supplier.notes}</p>}</div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${supplier.active ? "bg-[#e5eee0] text-[#4c7048]" : "bg-[#f0eee8] text-[#7a7568]"}`}>{supplier.active ? "Active" : "Inactive"}</span><button type="button" onClick={() => toggle(supplier)} className={`text-xs font-semibold ${supplier.active ? "text-[#9a493c]" : "text-[#547253]"}`}>{supplier.active ? "Deactivate" : "Reactivate"}</button></div></div></article>)}{!suppliers.length && <p className="rounded-2xl bg-white p-6 text-sm text-[#788174]">No suppliers recorded for this farm. You can still record purchases without choosing a supplier.</p>}</section>
  </main>;
}
