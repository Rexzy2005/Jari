"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { addInventoryPurchase, getFarmerFarms, getInventoryItems, getInventoryPurchases, getInventorySuppliers } from "@/services";
import type { FarmerFarmRecord, InventoryPurchaseRecord } from "@/services";

const money = (amount?: number) => amount === undefined ? "Not recorded" : new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(amount);

export default function InventoryPurchasesPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [items, setItems] = useState<ReturnType<typeof getInventoryItems>>([]);
  const [suppliers, setSuppliers] = useState<InventorySupplierRecord[]>([]);
  const [purchases, setPurchases] = useState<InventoryPurchaseRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refresh = (selected = farmId) => {
    const available = getFarmerFarms();
    const chosen = selected || available.find((farm) => farm.isPrimary)?.id || available[0]?.id || "";
    setFarms(available); setFarmId(chosen); setItems(getInventoryItems().filter((item) => item.farmId === chosen)); setSuppliers(getInventorySuppliers(chosen).filter((supplier) => supplier.active)); setPurchases(getInventoryPurchases(chosen));
  };
  useEffect(() => { refresh(""); const update = () => refresh(); window.addEventListener("jari:mock-data-changed", update); return () => window.removeEventListener("jari:mock-data-changed", update); }, []);
  const totalSpend = useMemo(() => purchases.reduce((sum, purchase) => sum + (purchase.totalCost || 0), 0), [purchases]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    try {
      addInventoryPurchase({ farmId, itemId: String(data.get("itemId") || ""), supplierId: String(data.get("supplierId") || "") || undefined, quantity: Number(data.get("quantity") || 0), date: String(data.get("date") || ""), unitCost: data.get("unitCost") ? Number(data.get("unitCost")) : undefined, totalCost: data.get("totalCost") ? Number(data.get("totalCost")) : undefined, amountPaid: data.get("amountPaid") ? Number(data.get("amountPaid")) : 0, notes: String(data.get("notes") || "") });
      setOpen(false); setError(""); setNotice("Purchase saved and stock received in the inventory ledger."); refresh();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not record purchase."); }
  };
  return <main className="mx-auto max-w-5xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-3"><div><Link href="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-[#547253]"><ArrowLeft size={14} /> Inventory</Link><p className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Inventory records</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Purchases</h1><p className="mt-2 text-sm text-[#737d70]">Each purchase adds stock through a linked receipt transaction.</p></div><button type="button" onClick={() => { setOpen((value) => !value); setError(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={14} />Record purchase</button></header>
    {farms.length > 1 && <label className="label-text block max-w-sm">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}{notice && <p role="status" className="text-sm text-[#4c7048]">{notice}</p>}{error && !open && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}
    <section className="grid grid-cols-2 gap-3"><Metric label="Purchases recorded" value={purchases.length} /><Metric label="Recorded purchase spend" value={money(totalSpend)} /></section>
    {open && <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2">{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c] sm:col-span-2">{error}</p>}<label className="label-text">Inventory item<JariSelect name="itemId" className="input-shell" required>{items.map((item) => <option key={item.id} value={item.id}>{item.name}{item.lotNumber ? ` · lot ${item.lotNumber}` : ""} · {item.unit}</option>)}</JariSelect></label><label className="label-text">Supplier (optional)<JariSelect name="supplierId" className="input-shell"><option value="">Not recorded</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</JariSelect></label><label className="label-text">Purchase date<input required name="date" type="date" max={new Date().toISOString().slice(0, 10)} defaultValue={new Date().toISOString().slice(0, 10)} className="input-shell" /></label><label className="label-text">Quantity received<input required name="quantity" type="number" min="0.01" step="0.01" className="input-shell" /></label><label className="label-text">Unit cost (optional)<input name="unitCost" type="number" min="0" step="0.01" className="input-shell" /></label><label className="label-text">Total cost (optional)<input name="totalCost" type="number" min="0" step="0.01" className="input-shell" /></label><label className="label-text">Amount paid (optional)<input name="amountPaid" type="number" min="0" step="0.01" defaultValue="0" className="input-shell" /></label><label className="label-text sm:col-span-2">Notes (optional)<input name="notes" maxLength={400} className="input-shell" /></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => { setOpen(false); setError(""); }} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button disabled={!items.length} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-50">Save purchase</button></div>{!items.length && <p className="text-xs text-[#788174] sm:col-span-2">Add an inventory item before recording a purchase.</p>} {!suppliers.length && <p className="text-xs text-[#788174] sm:col-span-2">You can <Link href="/inventory/suppliers" className="font-semibold text-[#547253]">add a supplier</Link> now or continue without one.</p>}</form>}
    <section className="space-y-3">{purchases.map((purchase) => <PurchaseRow key={purchase.id} purchase={purchase} />)}{!purchases.length && <p className="rounded-2xl bg-white p-6 text-sm text-[#788174]">No purchases recorded for this farm.</p>}</section>
  </main>;
}

function Metric({ label, value }: { label: string; value: string | number }) { return <article className="rounded-2xl bg-white p-4"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{value}</p></article>; }
function PurchaseRow({ purchase }: { purchase: InventoryPurchaseRecord }) { return <article className="rounded-2xl bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-[#354237]">{purchase.itemName}</h2><p className="mt-1 text-xs text-[#788174]">{purchase.date} · {purchase.supplierName || "Supplier not recorded"} · {purchase.quantity.toLocaleString()} {purchase.unit}</p></div><span className="rounded-full bg-[#edf0e9] px-3 py-1 text-[10px] font-semibold text-[#687466]">{purchase.paymentStatus}</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#687466]"><span>Unit cost: {money(purchase.unitCost)}</span><span>Total: {money(purchase.totalCost)}</span><span>Paid: {money(purchase.amountPaid)}</span></div>{purchase.notes && <p className="mt-2 text-xs text-[#788174]">{purchase.notes}</p>}</article>; }
