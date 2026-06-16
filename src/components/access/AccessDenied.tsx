import { LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccessDenied({
  title = "Access not available",
  message = "You do not currently have access to this knowledge collection.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-stone-950 text-white">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-stone-950">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
          {message}
        </p>
        <Link
          to="/dashboard/library"
          className="mt-6 inline-flex rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Return to My Continuity Library
        </Link>
      </div>
    </div>
  );
}
