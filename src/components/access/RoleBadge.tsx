import { ShieldCheck } from "lucide-react";
import { UserRole } from "../../types/user";

const roleStyles: Record<UserRole, string> = {
  [UserRole.Visitor]: "bg-stone-100 text-stone-700",
  [UserRole.RegisteredUser]: "bg-sky-100 text-sky-800",
  [UserRole.ProductBuyer]: "bg-amber-100 text-amber-800",
  [UserRole.Member]: "bg-emerald-100 text-emerald-800",
  [UserRole.Steward]: "bg-purple-100 text-purple-800",
  [UserRole.Admin]: "bg-stone-950 text-white",
};

export default function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${roleStyles[role]}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      {role}
    </span>
  );
}
