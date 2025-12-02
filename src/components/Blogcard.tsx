// BlogCard Component
function BlogCard({
  image = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  title = "The Ancient Trails of East Africa",
  excerpt = "Journey through centuries of history as we explore the rich cultural heritage and untold stories that have shaped the landscapes we know today.",
  author = "Sarah Johnson",
  date = "Nov 27, 2024",
  category = "Heritage",
  readTime = "8 min read",
}) {
  return (
    <article className="group bg-amber-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-2 border-amber-200/50 hover:border-amber-400/60 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
        />
        <div className="absolute inset-0 bg-linear-to-t from-amber-900/70 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-amber-600 text-xs font-semibold text-amber-50 rounded-full shadow-lg tracking-wide">
            {category}
          </span>
        </div>

        {/* Read Time */}
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 bg-stone-800/80 backdrop-blur-sm text-xs font-medium text-amber-100 rounded-full flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
          {title}
        </h2>

        <p className="text-stone-600 text-sm leading-relaxed flex-1 mb-5 line-clamp-3">
          {excerpt}
        </p>

        {/* Author Section */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-50 font-semibold text-sm shadow-md">
              {author.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-stone-800">
                {author}
              </span>
              <span className="text-xs text-stone-500">{date}</span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-600 transition-all duration-300 group-hover:scale-110">
            <svg
              className="w-4 h-4 text-amber-700 group-hover:text-amber-50 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
