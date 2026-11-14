"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Wheat } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { getFarmerFarms, getFeedInventory, getFeedPurchases, getFeedUseRecords } from "@/services";
import type { FarmerFarmRecord } from "@/services";

export default function FeedPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [farmId, setFarmId] = useState("");
  const [inventory, setInventory] = useState(getFeedInventory());
  const [purchases, setPurchases] = useState(getFeedPurchases());
  const [useRecords, setUseRecords] = useState(getFeedUseRecords());
  const refresh = (selectedFarm = farmId) => {
    const available = getFarmerFarms(); const chosen = selectedFarm || available.find((farm) => farm.isPrimary)?.id || available[0]?.id || "";
    setFarms(available); setFarmId(chosen); setInventory(getFeedInventory(chosen)); setPurchases(getFeedPurchases().filter((item) => item.farmId === chosen)); setUseRecords(getFeedUseRecords().filter((item) => item.farmId === chosen));
  };
  useEffect(() => { refresh(""); }, []);
  const spent = purchases.reduce((sum, item) => sum + item.amount, 0);
  const remaining = inventory.reduce((sum, item) => sum + item.availableKg, 0);
  const boughtKg = inventory.reduce((sum, item) => sum + item.boughtKg, 0);
  const latest = [...purchases.map((item) => ({ id: item.id, date: item.date, text: `${item.feedType} feed purchase`, amount: `${item.quantity} ${item.unit}`, kind: "Bought" })), ...useRecords.map((item) => ({ id: item.id, date: item.date, text: `${item.feedType} feed issued`, amount: `${item.quantityKg} kg`, kind: "Issued" }))].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
  return <main className="space-y-5 sm:space-y-7"><header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm inventory · Feed</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Feed stock</h1><p className="mt-2 text-sm text-[#737d70]">Feed balances come from the inventory transaction ledger.</p></div><div className="flex flex-wrap gap-2"><Link href="/feed/purchases/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b]">Record purchase</Link><Link href="/feed/consumption/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Issue to a group</Link></div></header>{farms.length > 1 && <label className="label-text block max-w-sm">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => refresh(event.target.value)}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3"><Metric label="Available feed" value={`${Math.round(remaining).toLocaleString()} kg`} /><Metric label="Feed received" value={`${Math.round(boughtKg).toLocaleString()} kg`} /><Metric label="Recorded purchase cost" value={money.format(spent)} /></section>
    <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><h2 className="font-serif text-xl text-[#29352a]">Available by type</h2>{inventory.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{inventory.map((item) => <div key={item.feedType} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f8f4] p-4"><span className="flex items-center gap-2 text-sm font-semibold text-[#354237]"><Wheat size={15} className="text-[#688363]" />{item.feedType}</span><span className="text-sm font-semibold text-[#547253]">{Math.round(item.availableKg).toLocaleString()} kg</span></div>)}</div> : <p className="mt-3 rounded-xl bg-[#f7f8f4] p-4 text-sm text-[#788174]">No feed stock has been recorded for this farm.</p>}</section>
    <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-xl text-[#29352a]">Recent feed records</h2><Link href="/feed/purchases" className="inline-flex items-center gap-1 text-xs font-semibold text-[#547253]">All purchases <ArrowRight size={13} /></Link></div><div className="mt-3 space-y-2">{latest.map((item) => <div key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7f8f4] p-3"><div><p className="text-xs font-semibold text-[#354237]">{item.text}</p><p className="mt-1 text-[10px] text-[#788174]">{item.date}</p></div><span className="text-xs font-medium text-[#59645a]">{item.kind} · {item.amount}</span></div>)}{!latest.length && <p className="rounded-xl bg-[#f7f8f4] p-4 text-sm text-[#788174]">Your recorded purchases and feed issues will appear here.</p>}</div></section></main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <article className="rounded-2xl bg-white p-4"><p className="text-xs text-[#788174]">{label}</p><p className="mt-2 font-serif text-xl text-[#29352a] sm:text-2xl">{value}</p></article>; }
