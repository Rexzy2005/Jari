import { RoleShell } from "@/components/layout/role-shell";

const allowedRoles: Array<"farmer"> = ["farmer"];

const navigation = [
  { label: "Overview", collapsible: false, items: [{ href: "/dashboard", label: "Overview" }] },
  { label: "Your farm", items: [{ href: "/farm", label: "My farm" }, { href: "/farms", label: "Farms" }, { href: "/poultry-houses", label: "Farm houses" }, { href: "/kyc", label: "Farm verification", soon: true }] },
  { label: "Birds and care", items: [{ href: "/birds", label: "My birds" }, { href: "/flock-activities", label: "Flock activities" }, { href: "/inventory", label: "Inventory" }, { href: "/feed", label: "Feed" }, { href: "/production", label: "Eggs and production" }, { href: "/health", label: "Bird health", soon: true }] },
  { label: "Money and sales", items: [{ href: "/sales", label: "Sales", soon: true }, { href: "/expenses", label: "Money spent", soon: true }, { href: "/assets", label: "Farm equipment", soon: true }] },
  { label: "Farm progress", items: [{ href: "/record-keeping", label: "Record keeping" }, { href: "/assessments", label: "Farm risk profile", soon: true }, { href: "/analytics", label: "Farm records", soon: true }, { href: "/documents", label: "Documents", soon: true }, { href: "/reports", label: "Reports", soon: true }, { href: "/opportunities", label: "Ways to get support", soon: true }, { href: "/notifications", label: "Notifications", soon: true }] },
  { label: "Account", items: [{ href: "/settings", label: "Settings", soon: true }] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell workspace="Farmer workspace" eyebrow="Your farm" navigation={navigation} allowedRoles={allowedRoles}>{children}</RoleShell>;
}
