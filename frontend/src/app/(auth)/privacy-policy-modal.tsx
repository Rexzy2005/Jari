"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Check, ChevronRight, LockKeyhole, ShieldCheck, X } from "lucide-react";

type PrivacyPolicyModalProps = { open: boolean; onClose: () => void };

const sections = [
  {
    title: "1. Information we handle",
    paragraphs: ["The information depends on how you use JARI. Account details may include your name, phone number, email address, password credentials and account type. Farmer setup may include your state, LGA, community, farm name, ownership and registration details, farm address, poultry operation, capacity and basic infrastructure.", "If you choose to use device location, your browser can provide farm coordinates, accuracy and capture time. JARI requests this only after you tap the location action. You can decline and enter the farm location yourself. JARI does not track your location in the background.", "The product can also hold farm records such as flock, inventory, health, production, sales, expenses, assets, documents, support requests and institution applications. Institution representatives may provide organisation details and verification documents. Please do not submit sensitive personal information unless a JARI feature specifically asks for it."],
  },
  {
    title: "2. Why we use information",
    paragraphs: ["JARI uses information to create and secure accounts; save and resume onboarding; organize farm and organisation records; provide requested summaries, reports and farm insights; process verification or support requests; maintain the service; prevent misuse; and meet legal obligations.", "Account information needed to provide the service is processed to perform the requested service or take steps at your request. Optional location use and profile sharing rely on your choice. Other processing may rely on another lawful basis permitted by applicable law, such as a legal obligation or a legitimate interest that does not override your rights."],
  },
  {
    title: "3. Browser demo and connected services",
    paragraphs: ["Some JARI workflows are simulations. Farmer email, onboarding progress, GPS details and many demo farm records are stored in your browser. They can remain on that device after you close the page and may be visible to someone who can use your browser profile. Clearing browser data can remove them.", "Phone-based account creation and sign-in use the configured JARI API. The current registration API sends your name and phone number; the email you enter is stored with the browser-local onboarding record and is not currently added to the server account. Do not use a password you rely on elsewhere while testing a demo."],
  },
  {
    title: "4. When information is shared",
    paragraphs: ["JARI does not sell personal information. Information may be processed by service providers that host the JARI application or database, or disclosed when needed to provide a feature you request, protect the service, or comply with law. The current deployment configuration uses Render for API hosting and Supabase for PostgreSQL; the actual providers and processing regions depend on the deployment in use.", "The institution demo can show a limited farm profile summary in the same browser when you enable profile sharing in Settings. That summary can include your name, farm name, production type, bird and house counts, record count and profile score. It does not include your phone number, exact location, individual records or document contents. Sharing is off by default and can be turned off in Settings. The demo does not send this summary to a real institution or another device."],
  },
  {
    title: "5. Storage and retention",
    paragraphs: ["Browser-local demo records remain until you remove them, reset JARI data or clear browser storage. If information is stored in the connected backend, JARI retains it while needed to provide the service and for any applicable legal, security or recordkeeping requirements. Backups may retain deleted information for a limited period while they rotate out.", "You can request access, correction or deletion by emailing info@jari.com. The demo offers browser-local data controls, but deletion from a connected account may require support because self-service account deletion is not currently available."],
  },
  {
    title: "6. Your choices and privacy rights",
    paragraphs: ["Depending on the circumstances and applicable law, you may ask JARI to explain how your information is used; access or correct it; request deletion or restriction; object to certain processing; withdraw consent where processing is based on consent; and request a portable copy where applicable. Withdrawing consent does not undo processing that already took place.", "To make a request, contact info@jari.com from the email or phone associated with your account. JARI may need to verify your identity before responding. You may also complain to the Nigeria Data Protection Commission."],
  },
  {
    title: "7. Security and international processing",
    paragraphs: ["JARI uses safeguards intended to protect information, but no online service or browser storage can be guaranteed completely secure. Browser-local demo information is accessible to people who can use your device or browser profile. Sign out on shared devices and avoid using a reused password.", "If the connected hosting or database processes information outside Nigeria, JARI should use a transfer mechanism and safeguards required by Nigerian data protection law. The precise processing location depends on the selected service regions."],
  },
  {
    title: "8. Farm insights and automated decisions",
    paragraphs: ["JARI may calculate summaries or indicators from records you provide to help you understand farm activity. Such indicators are informational; they are not a guarantee of credit, insurance, funding or approval. JARI does not make solely automated decisions with legal or similarly significant effects through the demo workflows."],
  },
  {
    title: "9. Children and policy updates",
    paragraphs: ["JARI is designed for adults managing farms or representing organisations and is not directed to children. Contact us if you believe a child’s personal information was submitted.", "We may update this notice as JARI changes. We will update the revision date and provide additional notice where required. The current version is dated 13 November 2026."],
  },
];

export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return <dialog ref={dialogRef} className="jari-privacy-dialog" aria-labelledby="jari-privacy-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
    <div className="jari-privacy-dialog-frame">
      <header className="jari-privacy-dialog-header">
        <div className="jari-privacy-title-wrap"><span className="jari-privacy-icon"><ShieldCheck size={20} aria-hidden="true"/></span><div><p className="jari-privacy-eyebrow">JARI · YOUR DATA</p><h2 id="jari-privacy-title">Privacy Policy &amp; Data Use Terms</h2><p className="jari-privacy-date">Last updated 13 November 2026</p></div></div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close privacy policy" className="jari-privacy-close"><X size={19}/></button>
      </header>
      <div className="jari-privacy-scroll">
        <div className="jari-privacy-summary"><LockKeyhole size={17} aria-hidden="true"/><p>JARI uses information to run your account and organize farm records. You choose whether to share a farm summary with the institution demo.</p></div>
        <p className="jari-privacy-controller">JARI is the service responsible for this information. Privacy requests: <a href="mailto:info@jari.com">info@jari.com</a>.</p>
        <nav className="jari-privacy-toc" aria-label="Privacy policy sections">{sections.map((section) => <a key={section.title} href={`#${policyId(section.title)}`}><span>{section.title.replace(/^\d+\. /, "")}</span><ChevronRight size={14}/></a>)}</nav>
        <div className="jari-privacy-sections">{sections.map((section) => <section key={section.title} id={policyId(section.title)}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>
        <section className="jari-privacy-law"><h3>Applicable privacy law</h3><p>This notice is designed around the Nigeria Data Protection Act 2023. The Act describes lawful bases, transparency information, individual rights, security and cross-border transfer requirements.</p><a href="https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf" target="_blank" rel="noreferrer">Read the Nigeria Data Protection Act <ArrowUpRight size={14}/></a><a href="https://ndpc.gov.ng/" target="_blank" rel="noreferrer">Nigeria Data Protection Commission <ArrowUpRight size={14}/></a></section>
      </div>
      <footer className="jari-privacy-dialog-footer"><span><Check size={14} aria-hidden="true"/>You can change optional sharing later in Settings.</span><button type="button" onClick={onClose}>Done</button></footer>
    </div>
  </dialog>;
}

function policyId(title: string) { return `privacy-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`; }
