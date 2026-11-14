"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Droplets, Warehouse, X, Bird, ArrowRightLeft } from "lucide-react";
import { JariSelect } from "@/components/ui/jari-select";
import { archivePoultryHouse, getFarmerFarms, getFlockAssignmentHistory, getFlockRecords, getPoultryHouses, moveFlockToHouse, updatePoultryHouse } from "@/services";
import type { FarmHouseRecord, FarmerFarmRecord } from "@/services";

export default function PoultryHousesPage() {
    const [houses, setHouses] = useState<FarmHouseRecord[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<FarmHouseRecord | null>(null);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<FarmHouseRecord | null>(null);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [birdCounts, setBirdCounts] = useState<Record<string, number>>({});
    const [farms, setFarms] = useState<FarmerFarmRecord[]>([]);
    const [farmId, setFarmId] = useState("");
    const [moveTargets, setMoveTargets] = useState<Record<string, string>>({});
    const [batches, setBatches] = useState<ReturnType<typeof getFlockRecords>>([]);

    const refresh = (selectedFarm = farmId) => {
        const availableFarms = getFarmerFarms();
        const chosenFarm = selectedFarm || availableFarms.find((farm) => farm.isPrimary)?.id || availableFarms[0]?.id || "";
        setFarms(availableFarms); setFarmId(chosenFarm);
        setHouses(getPoultryHouses().filter((house) => house.farmId === chosenFarm));
        const farmBatches = getFlockRecords().filter((flock) => flock.farmId === chosenFarm);
        setBatches(farmBatches);
        const counts = farmBatches.reduce<Record<string, number>>((values, flock) => {
            if (flock.status === "Active" && flock.houseId) values[flock.houseId] = (values[flock.houseId] || 0) + flock.birds;
            return values;
        }, {});
        setBirdCounts(counts);
    };
    useEffect(() => { refresh(""); }, []);

    const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedHouse || !draft) return;
        setIsSaving(true);
        try {
            const saved = await updatePoultryHouse(selectedHouse.id || selectedHouse.name, draft);
            setSelectedHouse(saved);
            setEditing(false);
            setError("");
            refresh();
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "We could not update this farm house.");
        } finally {
            setIsSaving(false);
        }
    };

    const archiveSelected = async () => {
        if (!selectedHouse || !window.confirm(`Archive ${selectedHouse.name}?`)) return;
        setIsArchiving(true);
        try {
            await archivePoultryHouse(selectedHouse.id || selectedHouse.name);
            setSelectedHouse(null);
            refresh();
        } catch (archiveError) {
            setError(archiveError instanceof Error ? archiveError.message : "This farm house could not be archived.");
        } finally {
            setIsArchiving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p>
                    <h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farm houses</h2>
                </div>
                <Link
                    href="/poultry-houses/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193d2b]"
                >
                    Add house
                </Link>
            </div>

            {farms.length > 1 && <label className="label-text flex max-w-sm flex-col gap-1">Farm<JariSelect className="input-shell" value={farmId} onChange={(event) => { setSelectedHouse(null); refresh(event.target.value); }}>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</JariSelect></label>}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {houses.map((house) => (
                    <button type="button" key={house.id} onClick={() => { setSelectedHouse(house); setDraft(house); setEditing(false); setError(""); }} className="group rounded-[1.25rem] bg-white p-5 text-left transition-colors hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a]">
                        <div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Warehouse size={17} /></span><ArrowUpRight size={16} className="text-[#879182] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
                        <h3 className="mt-4 font-serif text-xl font-medium text-[#29352a]">{house.name}</h3>
                        <p className="mt-1 text-xs text-[#788174]">{house.system} · {(birdCounts[house.id || ""] || 0).toLocaleString()} of {house.capacity.toLocaleString()} birds</p>
                        <p className="mt-1 text-[10px] text-[#788174]">{batches.filter((flock) => flock.houseId === house.id && flock.status === "Active").length} active groups · {house.status || "Active"}</p>
                        <span className="mt-4 inline-flex text-[10px] font-semibold text-[#547253]">View house details</span>
                    </button>
                ))}
            </div>

            {selectedHouse && draft && <HouseDetails house={selectedHouse} draft={draft} editing={editing} error={error} saving={isSaving} archiving={isArchiving} batches={batches.filter((flock) => flock.houseId === selectedHouse.id)} destinationHouses={houses.filter((house) => house.id !== selectedHouse.id && house.status === "Active" && !house.archived)} moveTargets={moveTargets} setMoveTargets={setMoveTargets} onClose={() => setSelectedHouse(null)} onEdit={() => { setDraft(selectedHouse); setEditing(true); }} onCancelEdit={() => { setDraft(selectedHouse); setEditing(false); }} onDraft={setDraft} onSave={saveEdit} onArchive={archiveSelected} onMove={(flockId, destinationId) => { try { moveFlockToHouse(flockId, destinationId); setError(""); refresh(); } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not move this group."); } }} />}
        </div>
    );
}

type HouseDetailsProps = {
    house: FarmHouseRecord;
    draft: FarmHouseRecord;
    editing: boolean;
    error: string;
    saving: boolean;
    archiving: boolean;
    batches: ReturnType<typeof getFlockRecords>;
    destinationHouses: FarmHouseRecord[];
    moveTargets: Record<string, string>;
    setMoveTargets: (value: Record<string, string>) => void;
    onClose: () => void;
    onEdit: () => void;
    onCancelEdit: () => void;
    onDraft: (value: FarmHouseRecord) => void;
    onSave: (event: FormEvent<HTMLFormElement>) => void;
    onArchive: () => void;
    onMove: (flockId: string, destinationId: string) => void;
};

function HouseDetails(props: HouseDetailsProps) {
    const { house, draft, editing, error, saving, archiving, batches, destinationHouses, moveTargets } = props;
    const occupancy = batches.filter((flock) => flock.status === "Active").reduce((total, flock) => total + flock.birds, 0);
    const history = batches.flatMap((flock) => getFlockAssignmentHistory(flock.id || "").map((assignment) => ({ ...assignment, flockName: flock.name }))).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate)).slice(0, 8);
    return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) props.onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="house-detail-title" className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">House details · {house.reference || house.name}</p><h3 id="house-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{editing ? "Update farm house" : house.name}</h3></div><button type="button" onClick={props.onClose} aria-label="Close house details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div>
        {editing ? <form onSubmit={props.onSave} className="mt-5 space-y-3"><div className="grid gap-3 sm:grid-cols-2"><label className="label-text block">House name<input required maxLength={80} className="input-shell" value={draft.name} onChange={(event) => props.onDraft({ ...draft, name: event.target.value })} /></label><label className="label-text block">Reference<input maxLength={50} className="input-shell" value={draft.reference || ""} onChange={(event) => props.onDraft({ ...draft, reference: event.target.value })} /></label></div><div className="grid gap-3 sm:grid-cols-2"><label className="label-text block">Purpose<JariSelect className="input-shell" value={draft.purpose || "Mixed"} onChange={(event) => props.onDraft({ ...draft, purpose: event.target.value as NonNullable<FarmHouseRecord["purpose"]> })}><option>Broiler</option><option>Layer</option><option>Mixed</option><option>Other</option></JariSelect></label><label className="label-text block">Housing system<input required className="input-shell" value={draft.system} onChange={(event) => props.onDraft({ ...draft, system: event.target.value })} /></label></div><div className="grid grid-cols-2 gap-3"><label className="label-text block">Capacity<input required min="0" type="number" className="input-shell" value={draft.capacity} onChange={(event) => props.onDraft({ ...draft, capacity: Number(event.target.value) })} /></label><label className="label-text block">Status<JariSelect className="input-shell" value={draft.status || "Active"} onChange={(event) => props.onDraft({ ...draft, status: event.target.value as NonNullable<FarmHouseRecord["status"]> })}><option>Active</option><option>Temporarily inactive</option><option>Under maintenance</option><option>Closed</option><option>Archived</option></JariSelect></label></div><div className="grid grid-cols-2 gap-3"><label className="label-text block">Water source<input className="input-shell" value={draft.water} onChange={(event) => props.onDraft({ ...draft, water: event.target.value })} /></label><label className="label-text block">Ventilation<input className="input-shell" value={draft.ventilation || ""} onChange={(event) => props.onDraft({ ...draft, ventilation: event.target.value })} /></label></div><label className="label-text block">Notes<textarea className="input-shell" value={draft.notes || ""} onChange={(event) => props.onDraft({ ...draft, notes: event.target.value })} /></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-xs text-[#9a493c]">{error}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={props.onCancelEdit} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button disabled={saving} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">{saving ? "Saving..." : "Save changes"}</button></div></form> : <><dl className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "Housing system", value: house.system }, { label: "Recorded population", value: `${occupancy.toLocaleString()} birds` }, { label: "Available capacity", value: `${Math.max(0, house.capacity - occupancy).toLocaleString()} birds` }, { label: "Declared capacity", value: `${house.capacity.toLocaleString()} birds` }, { label: "Status", value: house.status || "Active" }, { label: "Water", value: house.water || "Not recorded" }, { label: "Feed storage", value: house.feedStorage ? "Available" : "Not recorded" }, { label: "Ventilation", value: house.ventilation || "Not recorded" }, { label: "Notes", value: house.notes || "None" }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 text-sm font-medium text-[#354237]">{item.value}</dd></div>)}</dl>
          <section className="mt-6"><h4 className="flex items-center gap-2 font-serif text-lg text-[#29352a]"><Bird size={16} />Bird groups in this house</h4>{batches.length ? <div className="mt-3 space-y-2">{batches.map((flock) => <div key={flock.id} className="rounded-xl bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold text-[#354237]">{flock.name}</p><p className="mt-1 text-xs text-[#788174]">{flock.type} · {flock.breed || "Breed not recorded"} · {flock.birds.toLocaleString()} birds · {flock.status}</p></div>{flock.status === "Active" && destinationHouses.length > 0 && <div className="flex items-center gap-2"><JariSelect aria-label={`Move ${flock.name} to another house`} className="input-shell min-h-9 w-40" value={moveTargets[flock.id || ""] || ""} onChange={(event) => props.setMoveTargets({ ...moveTargets, [flock.id || ""]: event.target.value })}><option value="">Move to...</option>{destinationHouses.map((target) => <option key={target.id} value={target.id}>{target.name} · {Math.max(0, target.capacity - getFlockRecords().filter((item) => item.houseId === target.id && item.status === "Active").reduce((sum, item) => sum + item.birds, 0))} spaces</option>)}</JariSelect><button type="button" disabled={!moveTargets[flock.id || ""]} onClick={() => props.onMove(flock.id || "", moveTargets[flock.id || ""])} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[#e9efe3] px-3 text-[10px] font-semibold text-[#35543b] disabled:opacity-40"><ArrowRightLeft size={13} />Move</button></div>}</div></div>)}</div> : <p className="mt-3 rounded-xl bg-white p-4 text-sm text-[#788174]">No bird groups are assigned to this house yet.</p>}</section>
          <section className="mt-5"><h4 className="font-serif text-lg text-[#29352a]">Recent assignment history</h4>{history.length ? <ul className="mt-2 space-y-2">{history.map((record) => <li key={record.id} className="flex justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs"><span className="font-medium text-[#354237]">{record.flockName}</span><span className="text-[#788174]">{record.fromHouseId ? "Moved" : "Assigned"} · {record.effectiveDate}</span></li>)}</ul> : <p className="mt-2 text-xs text-[#788174]">No assignment history recorded.</p>}</section>
          {error && <p role="alert" className="mt-3 text-xs text-[#9a493c]">{error}</p>}<div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={props.onEdit} className="min-h-10 flex-1 rounded-full bg-[#244b35] text-xs font-semibold text-white">Edit house details</button>{house.status !== "Archived" && <button type="button" disabled={archiving} onClick={props.onArchive} className="min-h-10 rounded-full bg-[#f4eddd] px-4 text-xs font-semibold text-[#8a7141] disabled:opacity-60">{archiving ? "Archiving..." : "Archive"}</button>}</div></>}</section></div>;
}
