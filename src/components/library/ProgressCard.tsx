import { Clock3 } from "lucide-react";
import type { ContinuityProduct } from "../../data/mockContinuity";
import ProgressRing from "./ProgressRing";

export default function ProgressCard({ product }: { product: ContinuityProduct }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <ProgressRing value={product.progress} />
        <div className="min-w-0">
          <p className="truncate font-bold text-stone-950">{product.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
            <Clock3 className="h-3.5 w-3.5" />
            {product.lastOpened}
          </p>
        </div>
      </div>
    </div>
  );
}
