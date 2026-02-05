import { Sparkles } from "lucide-react";

interface StoryCardProps {
  image: string;
  title: string;
  summary: string;
  price: number;
  isFree: boolean;
  onAction: () => void;
}

export function StoryCard({
  image,
  title,
  summary,
  price,
  isFree,
  onAction,
}: StoryCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-stone-200 hover:border-amber-300 hover:-translate-y-2">
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {isFree && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              FREE
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-stone-600 mb-5 line-clamp-3 leading-relaxed">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500 font-medium mb-1">
              Price
            </span>
            <p className="text-2xl font-bold text-amber-600">
              {isFree ? "Free" : `₦${price.toLocaleString()}`}
            </p>
          </div>

          <button
            onClick={onAction}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105
              ${
                isFree
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                  : "bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
              }`}
          >
            {isFree ? "Read Free" : "Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}
