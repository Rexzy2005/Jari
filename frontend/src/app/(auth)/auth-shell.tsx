"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Check, ClipboardCheck, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { JariLogo } from "@/components/brand/jari-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showAccountTabs = pathname === "/login" || pathname === "/register";

  return (
    <main className="auth-page flex h-dvh min-h-0 items-center justify-center overflow-hidden bg-[#f1f3ed] p-0 sm:p-3 lg:p-5">
      <div className="auth-frame grid h-full min-h-0 w-full max-w-[1440px] overflow-hidden bg-white shadow-[0_32px_100px_-52px_rgba(20,48,31,.36)] sm:rounded-[1.75rem] lg:grid-cols-[.92fr_1.08fr]">
        <aside className="auth-visual relative hidden min-h-0 flex-col justify-between overflow-hidden bg-[#173a28] p-8 text-white lg:flex xl:p-11">
          <Image
            src="/images/nigerian-poultry-house.jpg"
            alt="Poultry flock inside a farm in Nigeria"
            fill
            priority
            sizes="(max-width: 1440px) 46vw, 620px"
            className="absolute inset-0 object-cover object-[center_62%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,35,23,.58)_0%,rgba(12,35,23,.18)_35%,rgba(12,35,23,.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(203,222,176,.22),transparent_35%)]" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <Link href="/" aria-label="JARI home" className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <JariLogo size={29} theme="dark" subtitle="Poultry farm intelligence" />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[.15em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c3d9a5]" /> Built for poultry farms
            </span>
          </div>

          <div className="relative z-10 mb-1 max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.17em] text-[#dce9cc]">
              <MapPin size={13} /> Jos South · Plateau State
            </p>
            <h2 className="max-w-lg font-serif text-4xl font-medium leading-[1.04] tracking-[-.04em] xl:text-[3.55rem]">
              Run your farm with a clearer picture.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Keep flock, health, production, and financial records together, so the next decision starts with better information.
            </p>

            <div className="mt-7 grid max-w-lg grid-cols-3 gap-2.5">
              {[
                { icon: Sprout, title: "Flock", detail: "Track every cycle" },
                { icon: ClipboardCheck, title: "Records", detail: "Keep work together" },
                { icon: ShieldCheck, title: "Risk", detail: "See what needs care" },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-[#d8e7c6]"><Icon size={15} /></span>
                  <p className="text-xs font-semibold text-white">{title}</p>
                  <p className="mt-1 text-[9px] leading-4 text-white/65">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4 text-[10px] text-white/65">
            <span>Better farm information. Better-informed next steps.</span>
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-[#c9dfb0]" /> Your work, in one place</span>
          </div>
        </aside>

        <section className="auth-content relative flex min-h-0 min-w-0 flex-col bg-white px-5 py-4 sm:px-10 sm:py-5 lg:px-10 xl:px-[4rem]">
          <header className="mb-3 flex shrink-0 items-center justify-between gap-4 sm:mb-4">
            <Link href="/" aria-label="JARI home" className="lg:hidden">
              <JariLogo size={24} theme="light" subtitle="Farm intelligence" />
            </Link>
            <span className="hidden items-center gap-2 rounded-full bg-[#f4f6f1] px-3 py-2 text-[10px] font-semibold text-[#62705f] sm:inline-flex lg:ml-auto">
              <ShieldCheck size={14} className="text-[#547253]" /> Secure account access
            </span>
            <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#647160] transition hover:text-[#244b35] lg:ml-0">
              Website <ArrowUpRight size={14} />
            </Link>
          </header>

          <div className="auth-content-main mx-auto flex min-h-0 w-full max-w-[500px] flex-1 flex-col justify-center">
            {showAccountTabs && (
              <nav aria-label="Account access" className="mb-3 grid grid-cols-2 gap-1 rounded-2xl bg-[#f1f3ed] p-1 sm:mb-4">
                <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined} className={`rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-all ${pathname === "/login" ? "bg-white text-[#23452f] shadow-[0_3px_12px_-8px_rgba(29,58,36,.5)]" : "text-[#758071] hover:text-[#294430]"}`}>Sign in</Link>
                <Link href="/register" aria-current={pathname === "/register" ? "page" : undefined} className={`rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-all ${pathname === "/register" ? "bg-white text-[#23452f] shadow-[0_3px_12px_-8px_rgba(29,58,36,.5)]" : "text-[#758071] hover:text-[#294430]"}`}>Create account</Link>
              </nav>
            )}
            {children}
          </div>

          <footer className="auth-footer mx-auto mt-5 w-full max-w-[430px] shrink-0 border-t border-[#edf0e9] pt-3 text-center text-[10px] leading-4 text-[#879082] sm:mt-6">
            <span>JARI farm records are used to build a clearer picture of your operation.</span>
            <span className="mx-2 text-[#c2c9bd]">·</span>
            <a href="mailto:info@jari.com" className="font-semibold text-[#547253] hover:text-[#244a35]">Get help</a>
          </footer>
        </section>
      </div>
    </main>
  );
}
