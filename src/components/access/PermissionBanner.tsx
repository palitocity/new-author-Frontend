import { AlertTriangle } from "lucide-react";
import type { ProtectionLevel } from "../../types/user";

export default function PermissionBanner({
  protectionLevel,
}: {
  protectionLevel: ProtectionLevel;
}) {
  if (protectionLevel === "Public" || protectionLevel === "Paid") return null;

  const message =
    protectionLevel === "Sacred / Restricted"
      ? "Access is granted only through approved custodians."
      : "This knowledge collection requires additional permissions.";

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Protected Knowledge</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
