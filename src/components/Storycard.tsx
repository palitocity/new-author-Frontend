const StoryCard = ({
  image = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
  title = "Tales from the Savanna",
  summary = "An intimate collection of stories passed down through generations, capturing the essence of life on the African plains.",
  price = "$56.67",
}) => {
  return (
    <div className="bg-stone-50 border-2 border-stone-300/60 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 bg-amber-600 text-sm font-bold text-amber-50 rounded-full shadow-lg">
            {price}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-4">{summary}</p>

        <div className="flex justify-between items-center pt-4 border-t-2 border-stone-200">
          <div className="flex items-center gap-2 text-amber-700 font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Story Collection</span>
          </div>

          <a
            href={`/marketplace/${title.toLowerCase().replace(/\s+/g, "-")}`}
            className="px-4 py-2 bg-amber-600 text-amber-50 text-sm font-semibold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
