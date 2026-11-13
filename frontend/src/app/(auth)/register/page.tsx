"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { registerWithBackend } from "@/lib/auth";
import { notifyToast } from "@/lib/toast";
import { InstitutionRegistrationWizard } from "../institution-registration-wizard";
import { PrivacyPolicyModal } from "../privacy-policy-modal";
import { AccountTypeDropdown } from "../account-type-dropdown";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<"farmer" | "institution">("farmer");
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const passwordMeetsMinimum = form.password.length >= 6;
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) {
      notifyToast("error", "Please accept the privacy and data-use terms before creating your account.");
      return;
    }
    if (form.password.length < 6) {
      notifyToast("error", "Use at least 6 characters for your password.");
      return;
    }
    if (!form.confirmPassword) {
      notifyToast("error", "Enter your password again to confirm it.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      notifyToast("error", "Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
        notifyToast("error", "Complete your name, email address and phone number to continue.");
        return;
      }
      await registerWithBackend(`${form.firstName.trim()} ${form.lastName.trim()}`, form.phone, form.password, form.email);
      router.push("/dashboard");
    } catch (registerError) {
      notifyToast("error", registerError instanceof Error ? registerError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueToCredentials = (event: React.MouseEvent<HTMLButtonElement>) => {
    const formElement = event.currentTarget.form;
    if (!formElement) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      notifyToast("error", "Enter your name, email address and phone number to continue.");
      return;
    }
    const invalidField = formElement.querySelector(":invalid") as HTMLInputElement | null;
    if (invalidField) {
      notifyToast("error", invalidField.validationMessage);
      invalidField.focus();
      return;
    }
    setRegistrationStep(2);
  };

  return (
    <>
      {accountType === "farmer" && registrationStep === 1 && <div className="auth-register-intro mb-4">
        <h1 className="font-serif text-2xl font-medium tracking-[-.04em] text-[#20291f] sm:text-3xl">Create your account</h1>
      </div>}

      {(accountType === "institution" || registrationStep === 1) && <div className={`auth-register-type ${accountType === "farmer" ? "auth-register-type-inline" : "auth-register-type-compact"}`}><span id="account-type-label" className="label-text">Account type</span><AccountTypeDropdown value={accountType} onChange={(value) => { setAccountType(value); setRegistrationStep(1); }} /></div>}

      {accountType === "institution" ? <InstitutionRegistrationWizard /> : <>
      <section className="auth-registration-card">
      <div className="auth-registration-stepper" aria-label={`Sign-up step ${registrationStep} of 2`}>
        {[{ number: 1, title: "Your details", icon: UserRound }, { number: 2, title: "Account security", icon: LockKeyhole }].map(({ number, title, icon: StepIcon }) => <div key={number} className={`auth-registration-step ${registrationStep === number ? "is-current" : registrationStep > number ? "is-complete" : ""}`} aria-current={registrationStep === number ? "step" : undefined}><span className="auth-registration-step-number">{registrationStep > number ? <CheckCircle2 size={17} aria-hidden="true" /> : <StepIcon size={16} aria-hidden="true" />}</span><span>{title}</span></div>)}
      </div>
      <form noValidate className="auth-register-form grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={onSubmit}>
        {registrationStep === 1 && <>
        <div><label htmlFor="firstName" className="label-text">First name</label><input id="firstName" autoComplete="given-name" required className="input-shell" placeholder="First name" value={form.firstName} onChange={(event) => handleChange("firstName", event.target.value)} /></div>
        <div><label htmlFor="lastName" className="label-text">Last name</label><input id="lastName" autoComplete="family-name" required className="input-shell" placeholder="Last name" value={form.lastName} onChange={(event) => handleChange("lastName", event.target.value)} /></div>
        <div><label htmlFor="register-email" className="label-text">Email address</label><input id="register-email" type="email" autoComplete="email" required className="input-shell" placeholder="you@example.com" value={form.email} onChange={(event) => handleChange("email", event.target.value)} /></div>
        <div><label htmlFor="register-phone" className="label-text">Phone number</label><input id="register-phone" type="tel" autoComplete="tel" required className="input-shell" placeholder="0803 000 0000" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} /></div>
        <p className="sm:col-span-2 text-xs leading-5 text-[#7a8577]">Sign-in uses your phone. Verification messages are not sent in this demo.</p>
        <button type="button" onClick={continueToCredentials} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#193d2b] sm:col-span-2">Continue <ArrowRight size={16} aria-hidden="true"/></button>
        </>}
        {registrationStep === 2 && <>
        <div>
          <label htmlFor="register-password" className="label-text">Password</label>
          <div className="relative"><input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" aria-describedby="password-guidance" minLength={6} required className="input-shell pr-11" placeholder="Create a password" value={form.password} onChange={(event) => handleChange("password", event.target.value)} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          <div id="password-guidance" className="auth-password-guidance" aria-live="polite">
            <div className="auth-password-tips-heading"><ShieldCheck size={15} aria-hidden="true"/><span>Password checklist</span></div>
            <p className="auth-password-hint">Choose a memorable phrase that you use only for JARI.</p>
            <ul className="auth-password-checklist">
              <li className={passwordMeetsMinimum ? "is-met" : ""}>{passwordMeetsMinimum ? <CheckCircle2 size={16} aria-hidden="true"/> : <Circle size={16} aria-hidden="true"/>}<span>At least 6 characters</span></li>
              <li className={passwordsMatch ? "is-met" : form.confirmPassword ? "is-unmatched" : ""}>{passwordsMatch ? <CheckCircle2 size={16} aria-hidden="true"/> : form.confirmPassword ? <AlertCircle size={16} aria-hidden="true"/> : <Circle size={16} aria-hidden="true"/>}<span>Passwords match</span></li>
            </ul>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label-text">Confirm password</label>
          <div className="relative"><input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" aria-describedby="password-match" minLength={6} required className="input-shell pr-11" placeholder="Enter your password again" value={form.confirmPassword} onChange={(event) => handleChange("confirmPassword", event.target.value)} /><button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#758071] transition-colors hover:text-[#244b35]">{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          <p id="password-match" className="sr-only" aria-live="polite">{form.confirmPassword ? passwordsMatch ? "Passwords match" : "Passwords do not match yet" : "Re-enter your password to confirm it."}</p>
        </div>

        <p className="sm:col-span-2 text-xs leading-5 text-[#697268]">Creating an account with <strong>{form.firstName} {form.lastName}</strong><br />{form.email} · {form.phone}</p>
        <div className="auth-consent-row sm:col-span-2">
          <label className="auth-consent-check" htmlFor="register-consent">
            <input id="register-consent" type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            <span className="auth-consent-box" aria-hidden="true">{agreed && <Check size={14} strokeWidth={2.6} />}</span>
            <span>I agree to the</span>
          </label>
          <button type="button" className="auth-policy-link" onClick={() => setPolicyOpen(true)}>Privacy Policy and Data Use Terms</button>
          <span className="auth-consent-period">for JARI.</span>
        </div>

        <div className="auth-register-actions flex flex-col-reverse gap-2 sm:flex-row"><button type="button" onClick={() => setRegistrationStep(1)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5e9e1] px-4 py-2 text-sm font-semibold text-[#526052]"><ArrowLeft size={16} aria-hidden="true"/>Back</button><button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#244b35] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_-12px_rgba(36,75,53,.8)] transition-all hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:bg-[#81947f]">{isSubmitting ? "Creating account..." : <>Create account <ArrowRight size={16} aria-hidden="true"/></>}</button></div>
        </>}
      </form>
      </section></>}

      <PrivacyPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />

    </>
  );
}
