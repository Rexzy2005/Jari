"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, Sprout } from "lucide-react";

export type AccountType = "farmer" | "institution";

export function AuthDropdown({ value, options, placeholder, label, onChange }: { value: string; options: string[]; placeholder: string; label: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  useEffect(() => { if (open) optionRefs.current[activeIndex]?.focus(); }, [open, activeIndex]);
  const choose = (index: number) => { const next = options[index]; if (!next) return; onChange(next); setActiveIndex(index); setOpen(false); buttonRef.current?.focus(); };
  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); const delta = event.key === "ArrowDown" ? 1 : -1; setActiveIndex((current) => (current + delta + options.length) % options.length); }
    if (event.key === "Home") { event.preventDefault(); setActiveIndex(0); }
    if (event.key === "End") { event.preventDefault(); setActiveIndex(options.length - 1); }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); const focusedIndex = optionRefs.current.findIndex((item) => item === document.activeElement); choose(focusedIndex >= 0 ? focusedIndex : activeIndex); }
  };
  return <div ref={rootRef} className="auth-account-select">
    <button ref={buttonRef} type="button" className="auth-account-select-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={() => { const current = options.indexOf(value); setActiveIndex(current >= 0 ? current : 0); setOpen((previous) => !previous); }} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); } }}>
      <span className="auth-account-select-value">{value || placeholder}</span><ChevronDown size={17} className={`auth-account-select-chevron ${open ? "is-open" : ""}`} aria-hidden="true" />
    </button>
    {open && <div className="auth-account-select-menu" role="listbox" aria-label={label} onKeyDown={onMenuKeyDown}>{options.map((option, index) => <button key={option} ref={(element) => { optionRefs.current[index] = element; }} type="button" role="option" aria-selected={value === option} tabIndex={activeIndex === index ? 0 : -1} className={`auth-account-select-option ${value === option ? "is-selected" : ""}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(index)}><span className="auth-account-select-copy"><strong>{option}</strong></span>{value === option && <Check className="auth-account-select-check" size={17} aria-hidden="true" />}</button>)}</div>}
  </div>;
}

const options: { value: AccountType; label: string; description: string; Icon: typeof Sprout }[] = [
  { value: "farmer", label: "Farmer", description: "Manage a poultry farm", Icon: Sprout },
  { value: "institution", label: "Institution", description: "Register an organisation", Icon: Building2 },
];

export function AccountTypeDropdown({ value, onChange }: { value: AccountType; onChange: (value: AccountType) => void }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(options.findIndex((option) => option.value === value));
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const choose = (index: number) => {
    const next = options[index];
    if (!next) return;
    onChange(next.value);
    setActiveIndex(index);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + delta + options.length) % options.length);
    }
    if (event.key === "Home") { event.preventDefault(); setActiveIndex(0); }
    if (event.key === "End") { event.preventDefault(); setActiveIndex(options.length - 1); }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const focusedIndex = optionRefs.current.findIndex((item) => item === document.activeElement);
      choose(focusedIndex >= 0 ? focusedIndex : activeIndex);
    }
  };

  return <div ref={rootRef} className="auth-account-select">
    <button ref={buttonRef} type="button" className="auth-account-select-trigger" aria-labelledby="account-type-label" aria-haspopup="listbox" aria-expanded={open} onClick={() => { setActiveIndex(options.findIndex((option) => option.value === value)); setOpen((current) => !current); }} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); } }}>
      <span className="auth-account-select-value"><span className="auth-account-select-icon"><selected.Icon size={17} aria-hidden="true" /></span><span>{selected.label}</span></span>
      <ChevronDown size={17} className={`auth-account-select-chevron ${open ? "is-open" : ""}`} aria-hidden="true" />
    </button>
    {open && <div className="auth-account-select-menu" role="listbox" aria-labelledby="account-type-label" onKeyDown={onMenuKeyDown}>
      {options.map(({ value: optionValue, label, description, Icon }, index) => <button key={optionValue} ref={(element) => { optionRefs.current[index] = element; }} type="button" role="option" aria-selected={value === optionValue} tabIndex={activeIndex === index ? 0 : -1} className={`auth-account-select-option ${value === optionValue ? "is-selected" : ""}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(index)}>
        <span className="auth-account-select-icon"><Icon size={17} aria-hidden="true" /></span><span className="auth-account-select-copy"><strong>{label}</strong><small>{description}</small></span>{value === optionValue && <Check className="auth-account-select-check" size={17} aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
