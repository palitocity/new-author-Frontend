import { useState } from "react";
import { Bookmark, Check, BookOpen, Clock } from "lucide-react";

type StoryCardProps = {
  _id: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  category: string;
  price?: number;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
};

export default function StoryCard({
 _id,
  image,
  title,
  excerpt,
  author,
  createdAt,
  category,
  price = 0,
  onBookmark,
  isBookmarked,
}: StoryCardProps) {
  const [added, setAdded] = useState(false);

 const handleBookmark = () => {
  if (isBookmarked) return;

  onBookmark(_id);
  setAdded(true);

  setTimeout(() => {
    setAdded(false);
  }, 2000);
};

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-stone-800 mb-2 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
          {title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-stone-400 mb-5 mt-auto">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {author}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {createdAt}
          </span>
        </div>

        {/* Footer: Price + Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-stone-800 font-bold text-base">
            {price === 0 ? (
              <span className="text-emerald-600 font-semibold text-sm">Free</span>
            ) : (
              `$${price.toFixed(2)}`
            )}
          </span>

       <button
  onClick={handleBookmark}
  disabled={isBookmarked}
  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
    ${
      isBookmarked
        ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-default"
        : "bg-stone-900 text-white hover:bg-amber-600 active:scale-95"
    }`}
>
  {isBookmarked ? (
    <>
      <Bookmark size={14} fill="currentColor" />
      Saved
    </>
  ) : added ? (
    <>
      <Check size={14} />
      Saved!
    </>
  ) : (
    <>
      <Bookmark size={14} />
      Add to Bookmarks
    </>
  )}
</button>
        </div>
      </div>
    </div>
  );
}