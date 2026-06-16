import { LockKeyhole, ShieldAlert, Unlock } from "lucide-react";
import type { ProtectionLevel } from "../../types/user";

const badgeStyles: Record<ProtectionLevel, string> = {
  Public: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Paid: "bg-amber-50 text-amber-800 ring-amber-200",
  "Member Only": "bg-sky-50 text-sky-800 ring-sky-200",
  Protected: "bg-rose-50 text-rose-800 ring-rose-200",
  "Sacred / Restricted": "bg-stone-950 text-white ring-stone-800",
};

export default function ProtectionBadge({
  level,
}: {
  level: ProtectionLevel;
}) {
  const Icon =
    level === "Public" ? Unlock : level === "Sacred / Restricted" ? LockKeyhole : ShieldAlert;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${badgeStyles[level]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {level}
    </span>
  );
}
