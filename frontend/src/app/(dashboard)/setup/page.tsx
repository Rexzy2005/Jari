"use client";
import { JariSelect } from "@/components/ui/jari-select";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LocateFixed } from "lucide-react";
import { getSavedSession } from "@/lib/auth";
import { getFarmerOnboarding, initializeFarmerOnboarding, saveFarmerOnboarding } from "@/services";
import type { FarmerOnboardingRecord } from "@/services";

const steps = ["Your profile", "Farm identity", "Farm location", "Poultry and water", "Review"];
const emptyFarm: Record<string, string | number | null> = { name: "", ownership: "Personally owned", registration: "Unregistered", cac: "", yearStarted: "", state: "Plateau", lga: "", community: "", address: "", latitude: null, longitude: null, locationSource: "", locationAccuracy: null, locationCapturedAt: "", production: "Broilers", system: "Deep litter", operatingStatus: "Currently operating", capacity: "", currentBirds: "", houseCount: "", water: "", electricity: "", waste: "" };

export default function FarmerSetupPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(0);
  const [record, setRecord] = useState<FarmerOnboardingRecord | null>(null);
  const [profile, setProfile] = useState<{ state: string; lga: string; community: string; photoDataUrl?: string }>({ state: "Plateau", lga: "", community: "" });
  const [farm, setFarm] = useState(emptyFarm);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const session = getSavedSession();
    if (!session || session.role !== "farmer") { router.replace("/login"); return; }
    setUserId(session.id);
    const saved = getFarmerOnboarding(session.id) ?? initializeFarmerOnboarding(session.id);
    if (saved.completed) { router.replace("/dashboard"); return; }
    setRecord(saved);
    setStep(Math.min(saved.completedSteps.length, steps.length - 1));
    if (saved.profile) setProfile(saved.profile);
    if (saved.farm) setFarm({ ...emptyFarm, ...saved.farm });
  }, [router]);

  const setFarmValue = (key: string, value: string | number | null) => setFarm((current) => ({ ...current, [key]: value }));
  const readProfilePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose an image file for your profile picture."); return; }
    if (file.size > 1024 * 1024) { setError("Choose an image smaller than 1 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") setProfile((current) => ({ ...current, photoDataUrl: reader.result as string })); };
    reader.onerror = () => setError("We could not read this image. Try another file.");
    reader.readAsDataURL(file);
  };
  const persistStep = (nextStep: number) => {
    const updated = saveFarmerOnboarding(userId, { profile, farm, completedSteps: Array.from(new Set([...(record?.completedSteps ?? []), steps[step]])) });
    setRecord(updated);
    setStep(nextStep);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const useLocation = () => {
    if (!navigator.geolocation) { setError("Location is not available on this device. Enter the farm location manually."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition((position) => {
      setFarm((current) => ({ ...current, latitude: position.coords.latitude, longitude: position.coords.longitude, locationAccuracy: Math.round(position.coords.accuracy), locationCapturedAt: new Date(position.timestamp).toISOString(), locationSource: "gps" }));
      setLocating(false);
    }, (issue) => {
      setError(issue.code === 1 ? "Location permission was declined. You can continue by entering the farm location manually." : "We could not get a location fix. Try again or continue with manual location details.");
      setLocating(false);
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  };
  const complete = () => {
    try {
      saveFarmerOnboarding(userId, { profile, farm, completedSteps: steps, completed: true });
      router.replace("/dashboard");
    } catch { setError("Your setup could not be saved. Check browser storage and try again."); }
  };
  const saveAndExit = () => {
    try { saveFarmerOnboarding(userId, { profile, farm }); router.push("/dashboard"); }
    catch { setError("Your changes could not be saved. Check browser storage and try again."); }
  };
  const next = () => {
    const required: Record<number, [string, string][]> = {
      0: [[profile.state, "Choose your state."], [profile.lga, "Enter your LGA."], [profile.community, "Enter your community or town."]],
      1: [[String(farm.name), "Enter the farm name."], [String(farm.ownership), "Choose ownership type."], [String(farm.registration), "Choose business registration status."], [String(farm.yearStarted), "Enter the year farming started."]],
      2: [[String(farm.state), "Choose the farm state."], [String(farm.lga), "Enter the farm LGA."], [String(farm.community), "Enter the farm community."], [String(farm.address), "Enter a farm address or location description."]],
      3: [[String(farm.production), "Choose production type."], [String(farm.system), "Choose farming system."], [String(farm.operatingStatus), "Choose operating status."], [String(farm.water), "Choose a water source."], [String(farm.capacity), "Enter total bird capacity."], [String(farm.currentBirds), "Enter current bird count."]],
    };
    const missing = required[step]?.find(([value]) => !value.trim());
    if (missing) { setError(missing[1]); return; }
    if (step === 1) {
      const year = Number(farm.yearStarted);
      if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear()) { setError("Enter a valid year from 1900 through this year."); return; }
      if (farm.registration === "Registered" && !String(farm.cac).trim()) { setError("Enter the CAC registration number, or choose Unregistered."); return; }
    }
    if (step === 2 && ((farm.latitude === null) !== (farm.longitude === null))) { setError("Enter both latitude and longitude, or leave both blank."); return; }
    if (step === 2 && farm.latitude !== null && (Number(farm.latitude) < -90 || Number(farm.latitude) > 90 || Number(farm.longitude) < -180 || Number(farm.longitude) > 180)) { setError("Enter valid latitude and longitude coordinates."); return; }
    if (step === 3) {
      const capacity = Number(farm.capacity), birds = Number(farm.currentBirds);
      if (!Number.isInteger(capacity) || capacity < 0 || !Number.isInteger(birds) || birds < 0) { setError("Capacity and current bird count must be whole numbers of zero or more."); return; }
      const houses = farm.houseCount === "" ? 0 : Number(farm.houseCount);
      if (!Number.isInteger(houses) || houses < 0) { setError("Number of poultry houses must be a whole number of zero or more."); return; }
      if (birds > capacity) { setError("Current birds cannot exceed capacity. Correct either value to continue."); return; }
      if (farm.operatingStatus === "Preparing to start operations" && birds !== 0) { setError("A farm preparing to start should have zero current birds."); return; }
    }
    persistStep(Math.min(step + 1, steps.length - 1));
  };
  if (!userId || !record) return <div className="mx-auto max-w-2xl animate-pulse rounded-3xl bg-white p-8">Loading your saved setup…</div>;
  const input = (label: string, key: string, placeholder = "", type = "text", required = true) => <label className="block min-w-0"><span className="label-text">{label}{!required && <span className="ml-1 font-normal text-slate-400">Optional</span>}</span><input className="input-shell" type={type} required={required} value={String(farm[key] ?? "")} placeholder={placeholder} onChange={(event) => setFarmValue(key, event.target.value)} /></label>;
  const select = (label: string, key: string, options: string[], required = true) => <label className="block min-w-0"><span className="label-text">{label}</span><JariSelect className="input-shell" required={required} value={String(farm[key] ?? "")} onChange={(event) => setFarmValue(key, event.target.value)}><option value="">Choose {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</JariSelect></label>;
  return <main className="mx-auto w-full max-w-3xl px-1 pb-8">
    <header className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-700">Farmer setup · Step {step + 1} of {steps.length}</p><h1 className="mt-2 font-serif text-3xl text-slate-900">{steps[step]}</h1><p className="mt-2 text-sm leading-6 text-slate-600">Your progress is saved as you move through setup. You can leave and return later.</p><div className="mt-4 flex gap-1.5" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((item, index) => <span key={item} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-emerald-700" : "bg-slate-200"}`} />)}</div></header>
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {step === 0 && <><h2 className="text-xl font-semibold text-slate-900">Where do you farm?</h2><p className="text-sm text-slate-600">This helps JARI show relevant local information. Your personal location is kept separate from farm location.</p><div className="grid gap-4 sm:grid-cols-2"><label><span className="label-text">State</span><JariSelect className="input-shell" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })}><option>Plateau</option><option>Abuja FCT</option><option>Kaduna</option><option>Nasarawa</option><option>Other</option></JariSelect></label><label><span className="label-text">LGA</span><input className="input-shell" value={profile.lga} onChange={(e) => setProfile({ ...profile, lga: e.target.value })} /></label><label className="sm:col-span-2"><span className="label-text">Community or town</span><input className="input-shell" value={profile.community} onChange={(e) => setProfile({ ...profile, community: e.target.value })} /></label></div><div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 p-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-xs text-slate-400">{profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="Profile preview" className="h-full w-full object-cover"/> : "Photo"}</div><label className="min-w-0 flex-1"><span className="label-text">Profile picture <span className="font-normal text-slate-400">Optional · up to 1 MB</span></span><input className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-800" type="file" accept="image/*" onChange={(event) => readProfilePhoto(event.target.files?.[0])}/></label>{profile.photoDataUrl && <button type="button" onClick={() => setProfile((current) => ({ ...current, photoDataUrl: undefined }))} className="text-xs font-semibold text-slate-600">Remove</button>}</div></>}
      {step === 1 && <><h2 className="text-xl font-semibold text-slate-900">Tell us about your farm</h2><div className="grid gap-4 sm:grid-cols-2">{input("Farm name", "name", "e.g. Green Valley Poultry")} {select("Ownership", "ownership", ["Personally owned", "Family owned", "Leased or rented", "Managed on behalf of another person", "Other"])} {select("Business registration", "registration", ["Registered", "Unregistered"])}{farm.registration === "Registered" && input("CAC registration number", "cac", "RC number", "text", true)}{input("Year farming started", "yearStarted", "YYYY", "number")}</div></>}
      {step === 2 && <><h2 className="text-xl font-semibold text-slate-900">Where is the farm?</h2><p className="text-sm text-slate-600">Enter the farm's location. Device location is optional and only requested when you choose the button.</p><div className="grid gap-4 sm:grid-cols-2">{select("State", "state", ["Plateau", "Abuja FCT", "Kaduna", "Nasarawa", "Other"])}{input("LGA", "lga")}{input("Community or town", "community")}{input("Physical address or location description", "address", "Describe how to find the farm")}</div><button type="button" onClick={useLocation} disabled={locating} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-800 disabled:opacity-60"><LocateFixed size={16}/>{locating ? "Getting location…" : "Use my current location"}</button>{farm.latitude !== null && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Coordinates: {Number(farm.latitude).toFixed(5)}, {Number(farm.longitude).toFixed(5)} · accuracy ±{farm.locationAccuracy} m. Confirm these coordinates identify your farm; your device may be somewhere else.</p>}<p className="text-xs font-medium text-slate-700">Or enter coordinates manually <span className="font-normal text-slate-500">(optional)</span></p><div className="grid gap-4 sm:grid-cols-2"><label><span className="label-text">Latitude</span><input className="input-shell" type="number" min="-90" max="90" step="any" value={farm.locationSource === "manual" ? String(farm.latitude ?? "") : ""} placeholder="e.g. 9.0123" onChange={(event) => setFarm((current) => ({ ...current, latitude: event.target.value === "" ? null : Number(event.target.value), locationSource: "manual", locationAccuracy: null, locationCapturedAt: new Date().toISOString() }))}/></label><label><span className="label-text">Longitude</span><input className="input-shell" type="number" min="-180" max="180" step="any" value={farm.locationSource === "manual" ? String(farm.longitude ?? "") : ""} placeholder="e.g. 8.9100" onChange={(event) => setFarm((current) => ({ ...current, longitude: event.target.value === "" ? null : Number(event.target.value), locationSource: "manual", locationAccuracy: null, locationCapturedAt: new Date().toISOString() }))}/></label></div><p className="text-xs text-slate-500">If you are not at the farm or location access is unavailable, continue using the address. No continuous tracking is used.</p></>}
      {step === 3 && <><h2 className="text-xl font-semibold text-slate-900">What does the farm raise?</h2><div className="grid gap-4 sm:grid-cols-2">{select("Production type", "production", ["Broilers", "Layers", "Both broilers and layers"])}{select("Farming system", "system", ["Deep litter", "Battery cage", "Free range", "Semi-intensive", "Other"])}{select("Operating status", "operatingStatus", ["Currently operating", "Temporarily inactive", "Preparing to start operations"])}{input("Total bird capacity", "capacity", "e.g. 5000", "number")}{input("Current number of birds", "currentBirds", "0", "number")}{input("Number of poultry houses", "houseCount", "", "number", false)}{select("Water source", "water", ["Borehole", "Well", "Public water supply", "Stream or river", "Other"])}{select("Electricity source", "electricity", ["Grid", "Generator", "Solar", "None", "Other"], false)}{select("Waste disposal", "waste", ["Composting", "Manure sales", "Municipal collection", "Other"], false)}</div></>}
      {step === 4 && <><h2 className="text-xl font-semibold text-slate-900">Review before you finish</h2><p className="text-sm text-slate-600">Check the information below. Use Back to edit a section.</p><dl className="grid gap-3 sm:grid-cols-2">{[["Farmer location", [profile.community, profile.lga, profile.state].filter(Boolean).join(", ")], ["Farm", farm.name], ["Ownership", farm.ownership], ["Registration", farm.registration === "Registered" ? `Registered · ${farm.cac}` : "Unregistered"], ["Farm location", [farm.address, farm.community, farm.lga, farm.state].filter(Boolean).join(", ")], ["Coordinates", farm.latitude !== null ? `${Number(farm.latitude).toFixed(5)}, ${Number(farm.longitude).toFixed(5)} · ${farm.locationSource === "gps" ? `GPS, ±${farm.locationAccuracy} m` : "entered manually"}` : "Not provided"], ["Poultry", `${farm.production} · ${farm.system} · ${farm.operatingStatus}`], ["Birds", `${farm.currentBirds} current · ${farm.capacity} capacity`], ["Infrastructure", `Water: ${farm.water}${farm.electricity ? ` · Electricity: ${farm.electricity}` : ""}${farm.waste ? ` · Waste: ${farm.waste}` : ""}`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{value || "Not provided"}</dd></div>)}</dl><div className="flex flex-wrap gap-2">{steps.slice(0, 4).map((name, index) => <button type="button" key={name} onClick={() => setStep(index)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">Edit {name.toLowerCase()}</button>)}</div></>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={saveAndExit} className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-slate-600"><ArrowLeft size={16}/>Save and finish later</button><div className="flex gap-2">{step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">Back</button>}{step < 4 ? <button type="button" onClick={next} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white">Save and continue <ArrowRight size={16}/></button> : <button type="button" onClick={complete} className="min-h-11 rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white">Complete setup</button>}</div></footer>
    </section>
  </main>;
}
