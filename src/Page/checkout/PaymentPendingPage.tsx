import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentPendingPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(`/checkout/${productId}/success`);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [navigate, productId]);

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-amber-700" />
        <h1 className="mt-4 text-2xl font-bold">Payment Processing</h1>
        <p className="mt-2 text-sm text-stone-600">Mock payment is being verified.</p>
      </div>
    </main>
  );
}
