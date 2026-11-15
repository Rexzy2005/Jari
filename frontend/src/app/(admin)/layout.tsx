import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"admin" | "verification_agent"> = ["admin", "verification_agent"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/admin", label: "Overview", soon: true }] },
  { label: "Farm operations", items: [{ href: "/admin/farmers", label: "Farmers", soon: true }, { href: "/admin/farms", label: "Farms", soon: true }, { href: "/admin/verification", label: "Verification", soon: true }, { href: "/admin/assessments", label: "Farm risk profiles", soon: true }] },
  { label: "Programs & partners", items: [{ href: "/admin/opportunities", label: "Opportunities", soon: true }, { href: "/admin/institutions", label: "Institutions", soon: true }] },
  { label: "Administration", items: [{ href: "/admin/reports", label: "Reports", soon: true }, { href: "/admin/settings", label: "Settings", soon: true }] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Admin workspace" eyebrow="Platform operations" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
