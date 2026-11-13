"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

type OptionProps = { value?: string; disabled?: boolean; children?: ReactNode };
type SelectChangeEvent = { target: { name?: string; value: string } };
type JariSelectProps = {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (event: SelectChangeEvent) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function JariSelect({ children, value, defaultValue, onChange, name, id, className, required, disabled, placeholder, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }: JariSelectProps) {
  const generatedId = useId();
  const listId = `${id ?? generatedId}-options`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const options = Children.toArray(children).filter(isValidElement).map((child) => {
    const option = child as React.ReactElement<OptionProps>;
    const label = Children.toArray(option.props.children).join("");
    return { value: option.props.value ?? label, label, disabled: Boolean(option.props.disabled) };
  });
  const firstValue = options.find((option) => !option.disabled)?.value ?? "";
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue ?? firstValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.findIndex((option) => option.value === (value ?? defaultValue ?? firstValue))));
  const selectedOption = options.find((option) => option.value === selectedValue);
  const activeOption = options[activeIndex];

  useEffect(() => { if (value !== undefined) setSelectedValue(value); }, [value]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  useEffect(() => {
    if (!open || !activeOption) return;
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, activeOption, listId]);
  useEffect(() => () => { if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current); }, []);

  const findEnabled = (from: number, direction: 1 | -1) => {
    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (from + offset * direction + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return -1;
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelectedValue(option.value);
    setActiveIndex(index);
    onChange?.({ target: { name, value: option.value } });
    setOpen(false);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!open) {
        const selectedIndex = options.findIndex((option) => option.value === selectedValue);
        setActiveIndex(findEnabled(selectedIndex >= 0 ? selectedIndex + direction : 0, direction));
        setOpen(true);
      } else setActiveIndex((current) => findEnabled(current + direction, direction));
    } else if (event.key === "Home" && open) {
      event.preventDefault(); setActiveIndex(findEnabled(0, 1));
    } else if (event.key === "End" && open) {
      event.preventDefault(); setActiveIndex(findEnabled(options.length - 1, -1));
    } else if (event.key === "Escape" && open) {
      event.preventDefault(); setOpen(false);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault(); choose(activeIndex);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      typeaheadRef.current += event.key.toLocaleLowerCase();
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = setTimeout(() => { typeaheadRef.current = ""; }, 600);
      const start = options.findIndex((option) => option.value === selectedValue);
      const match = [...options.slice(Math.max(0, start + 1)), ...options.slice(0, Math.max(0, start + 1))].find((option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeaheadRef.current));
      if (match) {
        const index = options.indexOf(match);
        setActiveIndex(index);
        choose(index);
      }
    }
  };

  return <div ref={rootRef} className={`jari-select ${open ? "is-open" : ""} ${className ?? ""}`}>
    <button ref={triggerRef} id={id} type="button" className="jari-select-trigger" role="combobox" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-haspopup="listbox" aria-controls={listId} aria-expanded={open} aria-activedescendant={open && activeOption ? `${listId}-${activeIndex}` : undefined} aria-required={required} disabled={disabled} onClick={() => { if (!disabled) { setActiveIndex(Math.max(0, options.findIndex((option) => option.value === selectedValue))); setOpen((previous) => !previous); } }} onKeyDown={handleKeyDown}>
      <span className={`jari-select-value ${!selectedOption ? "is-placeholder" : ""}`}>{selectedOption?.label || placeholder || "Select an option"}</span>
      <ChevronDown size={17} aria-hidden="true" className={`jari-select-chevron ${open ? "is-open" : ""}`} />
    </button>
    {(name || required) && <input className="jari-select-form-value" type="text" name={name} value={selectedValue} required={required} disabled={disabled} tabIndex={-1} aria-hidden="true" onChange={() => undefined} onInvalid={(event) => { event.preventDefault(); triggerRef.current?.focus(); }} />}
    {open && <div id={listId} role="listbox" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className="jari-select-menu">
      {options.map((option, index) => <div key={`${option.value}-${index}`} id={`${listId}-${index}`} role="option" aria-selected={selectedValue === option.value} aria-disabled={option.disabled || undefined} className={`jari-select-option ${selectedValue === option.value ? "is-selected" : ""} ${activeIndex === index ? "is-active" : ""} ${option.disabled ? "is-disabled" : ""}`} onMouseEnter={() => !option.disabled && setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}>
        <span>{option.label}</span>{selectedValue === option.value && <Check size={16} aria-hidden="true" />}
      </div>)}
    </div>}
  </div>;
}
