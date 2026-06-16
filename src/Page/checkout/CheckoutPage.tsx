import { CreditCard } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProtectionBadge from "../../components/access/ProtectionBadge";
import { continuityProducts } from "../../data/mockContinuity";

export default function CheckoutPage() {
  const { productId } = useParams();
  const product = continuityProducts.find((item) => item.id === productId) || continuityProducts[0];

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">{product.title}</h1>
          <p className="mt-2 text-stone-600">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ProtectionBadge level={product.protectionLevel} />
            <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
              {product.productType}
            </span>
          </div>
          <div className="mt-8 rounded-lg border border-stone-200 p-4">
            <h2 className="font-bold">Payment details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="rounded-md border border-stone-300 px-3 py-2.5 text-sm" placeholder="Name on card" />
              <input className="rounded-md border border-stone-300 px-3 py-2.5 text-sm" placeholder="Card number" />
              <input className="rounded-md border border-stone-300 px-3 py-2.5 text-sm" placeholder="MM / YY" />
              <input className="rounded-md border border-stone-300 px-3 py-2.5 text-sm" placeholder="CVC" />
            </div>
          </div>
        </section>
        <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <img src={product.coverImage} alt={product.title} className="h-48 w-full rounded-lg object-cover" />
          <div className="mt-5 flex justify-between text-sm">
            <span className="text-stone-500">Subtotal</span>
            <span className="font-bold">NGN {product.price.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-stone-200 pt-3">
            <span className="font-bold">Total</span>
            <span className="font-bold">NGN {product.price.toLocaleString()}</span>
          </div>
          <Link
            to={`/checkout/${product.id}/pending`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-3 text-sm font-semibold text-white"
          >
            <CreditCard className="h-4 w-4" />
            Complete Payment
          </Link>
        </aside>
      </div>
    </main>
  );
}
