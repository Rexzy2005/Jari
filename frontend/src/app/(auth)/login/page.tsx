"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Building2, Eye, EyeOff, Phone, ShieldCheck, Sprout } from "lucide-react";
import { loginWithBackend } from "@/lib/auth";
import { notifyToast } from "@/lib/toast";

const demoAccounts = [
  { label: "Farmer", icon: Sprout, phone: "08030000000", password: "password123" },
  { label: "Admin", icon: ShieldCheck, phone: "08040000000", password: "admin123" },
  { label: "Institution", icon: Building2, phone: "08060000000", password: "institution123" },
];

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ phone: "", password: "" });
  const [selectedDemo, setSelectedDemo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setSelectedDemo("");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalidField = formRef.current?.querySelector(":invalid") as HTMLInputElement | null;
    if (invalidField) {
      notifyToast("error", invalidField.validationMessage);
      invalidField.focus();
      return;
    }
    setIsSubmitting(true);

    try {
      const session = await loginWithBackend(form.phone, form.password);
      const target =
        session.role === "admin" || session.role === "verification_agent"
          ? "/admin"
          : session.role === "institutional_user"
            ? "/institution"
            : "/dashboard";
      router.push(target);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Login failed.";
      notifyToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-5 sm:mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#547253]">Your farm workspace</p>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-[-.04em] text-[#20291f] sm:text-[2.15rem]">Welcome back.</h1>
        <p className="mt-1.5 text-sm leading-5 text-[#697268]">Sign in to pick up where your farm left off.</p>
      </div>

      <section aria-label="Demo workspaces" className="auth-demo mb-3 flex flex-col gap-2 rounded-2xl border border-[#e6ebe2] bg-[#f8f9f6] p-2.5 sm:mb-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-between gap-2 sm:block sm:w-[8.75rem]">
          <div>
            <p className="text-[11px] font-semibold text-[#344536]">Try a demo</p>
            <p className="mt-0.5 text-[9px] leading-3 text-[#849080]">Prefills sign in</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#edf2e8] px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#597253] sm:hidden">Demo</span>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5">
          {demoAccounts.map(({ icon: Icon, ...account }) => (
            <button
              key={account.label}
              type="button"
              onClick={() => {
                setForm({ phone: account.phone, password: account.password });
                setSelectedDemo(account.phone);
              }}
              aria-pressed={selectedDemo === account.phone}
              className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-1.5 py-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a] sm:justify-start sm:px-2 ${selectedDemo === account.phone ? "border-[#78916e] bg-[#edf3e9]" : "border-white bg-white hover:border-[#dce5d7] hover:bg-[#fbfcfa]"}`}
            >
              <Icon size={13} className="shrink-0 text-[#547253]" />
              <span className="truncate text-[9px] font-bold text-[#36523b] sm:text-[10px]">{account.label}</span>
            </button>
          ))}
        </div>
      </section>

      <form ref={formRef} noValidate className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label htmlFor="phone" className="label-text">Phone number</label>
          <div className="relative">
            <Phone aria-hidden="true" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#879381]" />
            <input id="phone" type="tel" autoComplete="tel" required className="input-shell pl-10" placeholder="0803 000 0000" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label-text">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="input-shell pr-11"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <Link href="/forgot-password" className="font-semibold text-[#496b50] transition-colors hover:text-[#244a35]">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_-12px_rgba(36,75,53,.8)] transition-all hover:-translate-y-0.5 hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:bg-[#81947f] disabled:hover:translate-y-0"
        >
          {isSubmitting ? "Signing in..." : "Sign in to JARI"}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </form>

    </>
  );
}
