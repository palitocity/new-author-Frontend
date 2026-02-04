interface StoryCardProps {
  image: string;
  title: string;
  summary: string;
  price: number;
  isFree: boolean;
  onAction: () => void;
}

export default function StoryCard({
  image,
  title,
  summary,
  price,
  isFree,
  onAction,
}: StoryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img src={image} alt={title} className="h-48 w-full object-cover" />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-stone-800">{title}</h3>

          {isFree && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              FREE
            </span>
          )}
        </div>

        <p className="text-sm text-stone-600 mb-4 line-clamp-3">{summary}</p>

        <div className="flex items-center justify-between">
          <p className="font-bold text-amber-600">
            {isFree ? "Free" : `₦${price.toLocaleString()}`}
          </p>

          <button
            onClick={onAction}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isFree
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
          >
            {isFree ? "Read More" : "Buy Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
