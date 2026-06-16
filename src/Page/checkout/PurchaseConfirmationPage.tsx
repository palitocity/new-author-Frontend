import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PurchaseConfirmationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/dashboard/library");
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <div className="max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Purchase confirmed</h1>
        <p className="mt-2 text-sm text-stone-600">
          Redirecting you to My Continuity Library.
        </p>
      </div>
    </main>
  );
}
