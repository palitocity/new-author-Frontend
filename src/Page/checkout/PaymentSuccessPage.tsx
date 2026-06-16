import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const { productId } = useParams();

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <div className="max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
        <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
        <p className="mt-2 text-sm text-stone-600">
          Library access has been granted for this product.
        </p>
        <Link
          to={`/checkout/${productId}/confirmation`}
          className="mt-6 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
        >
          View Confirmation
        </Link>
      </div>
    </main>
  );
}
