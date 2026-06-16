import { ClockAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function SessionExpiredPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <div className="max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <ClockAlert className="mx-auto h-10 w-10 text-amber-700" />
        <h1 className="mt-4 text-2xl font-bold">Session expired</h1>
        <p className="mt-2 text-sm text-stone-600">
          Please sign in again to continue your learning session.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
