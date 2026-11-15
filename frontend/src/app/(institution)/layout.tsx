import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"institutional_user"> = ["institutional_user"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/institution", label: "Overview", soon: true }] },
  { label: "Portfolio", items: [{ href: "/institution/risk-profiles", label: "Farmer profiles", soon: true }, { href: "/institution/applications", label: "Applications", soon: true }] },
  { label: "Collaboration", items: [{ href: "/institution/requests", label: "Contact farmers", soon: true }] },
  { label: "Account", items: [{ href: "/institution/settings", label: "Settings", soon: true }] },
];

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Institution workspace" eyebrow="Authorized access" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
