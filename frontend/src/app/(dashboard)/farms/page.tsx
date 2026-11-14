"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { MapPin, Plus, Warehouse, Bird } from "lucide-react";
import { createFarmerFarm, getFarmerFarms, getFlockRecords, getPoultryHouses } from "@/services";
import type { FarmerFarmRecord } from "@/services";

export default function FarmsPage() {
  const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const refresh = () => setFarms(getFarmerFarms());
  useEffect(refresh, []);
  const addFarm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { createFarmerFarm(String(form.get("name") || ""), String(form.get("location") || "")); setError(""); setOpen(false); refresh(); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Could not add this farm."); }
  };
  const houses = getPoultryHouses(); const flocks = getFlockRecords();
  return <main className="space-y-6"><header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm records</p><h1 className="mt-1 font-serif text-3xl text-[#20291f]">Your farms</h1><p className="mt-2 text-sm text-[#737d70]">Keep each farm’s houses, bird groups and inventory separate.</p></div><button onClick={() => { setOpen(!open); setError(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={15} />Add farm</button></header>
    {error && <p role="alert" className="rounded-xl bg-[#fbefeb] px-4 py-3 text-sm text-[#9a493c]">{error}</p>}
    {open && <form onSubmit={addFarm} className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2"><label className="label-text">Farm name<input required name="name" maxLength={100} className="input-shell" placeholder="e.g. Rayfield Farm" /></label><label className="label-text">Location (optional)<input name="location" maxLength={160} className="input-shell" placeholder="Community, LGA, state" /></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setOpen(false)} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Save farm</button></div></form>}
    {farms.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{farms.map((farm) => { const farmHouses = houses.filter((house) => house.farmId === farm.id); const farmFlocks = flocks.filter((flock) => flock.farmId === farm.id); const birds = farmFlocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0); return <article key={farm.id} className="rounded-2xl bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#29352a]">{farm.name}</h2>{farm.isPrimary && <span className="mt-2 inline-flex rounded-full bg-[#edf2e8] px-2.5 py-1 text-[10px] font-semibold text-[#547253]">Primary farm</span>}</div><MapPin size={17} className="mt-1 text-[#7d9275]" /></div><p className="mt-3 text-xs text-[#788174]">{farm.location || "Location not added"}</p><div className="mt-5 grid grid-cols-3 gap-2"><Mini icon={<Warehouse size={14} />} label="Houses" value={farmHouses.length} /><Mini icon={<Bird size={14} />} label="Groups" value={farmFlocks.length} /><Mini icon={<Bird size={14} />} label="Active birds" value={birds.toLocaleString()} /></div><Link href="/poultry-houses" className="mt-5 inline-flex text-xs font-semibold text-[#547253]">View farm houses <span aria-hidden="true" className="ml-1">→</span></Link></article>; })}</section> : <section className="rounded-2xl bg-white p-7 text-center"><h2 className="font-serif text-xl text-[#29352a]">Farm setup needed</h2><p className="mx-auto mt-2 max-w-md text-sm text-[#788174]">Complete the farm details in onboarding before adding houses, flocks or stock.</p><Link href="/farm" className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Open farm profile</Link></section>}</main>;
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) { return <div className="rounded-xl bg-[#f7f8f4] p-3"><span className="flex items-center gap-1.5 text-[10px] text-[#788174]">{icon}{label}</span><p className="mt-1 text-sm font-semibold text-[#354237]">{value}</p></div>; }
