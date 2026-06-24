import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import StoryCard from "../components/TestStorycard";


type StoryType = {
  _id: string;
  coverImage: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  category: string;
  price?: number;
};

export default function Story() {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
 const [bookmarks, setBookmarks] = useState<string[]>([]);


  const STORIES_PER_PAGE = 6;
  const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
  const paginatedStories = stories.slice(startIndex, startIndex + STORIES_PER_PAGE);

 

  useEffect(() => {
    const getAllStories = async () => {
      try {
        const res = await axios.get("/book");
     const storyData = Array.isArray(res.data?.data)
  ? res.data.data
  : [];

const freeStories = storyData.filter(
  (story: StoryType) => story.price === 0
);

setStories(freeStories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    getAllStories();
  }, []);

 const handleBookmark = (id: string) => {
  setBookmarks((prev) =>
    prev.includes(id) ? prev : [...prev, id]
  );
};

const handleRemoveBookmark = (id: string) => {
  setBookmarks((prev) => prev.filter((item) => item !== id));
};

const bookmarkedStories = stories.filter((story) =>
  bookmarks.includes(story._id)
);


  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-stone-500 text-lg animate-pulse">
        Loading Stories...
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16 relative">
      {/* Header */}
      <div className="text-center mb-12 relative">
        <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">
          Explore
        </p>
        <h1 className="text-5xl font-bold text-stone-800 mb-3">Stories</h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full" />

     
      </div>

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="text-center py-24 text-stone-400">
          <p className="text-xl font-medium">No stories found yet.</p>
          <p className="text-sm mt-2">Check back soon for new additions.</p>
        </div>
      )}

      {/* Story Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {paginatedStories.map((story) => (
        <StoryCard
  key={story._id}
  _id={story._id}
  image={story.coverImage}
  title={story.title}
  excerpt={story.excerpt}
  author={story.author}
  category={story.category}
  price={story.price}
  createdAt={
    story.createdAt
      ? new Date(story.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—"
  }
  onBookmark={handleBookmark}
  isBookmarked={bookmarks.includes(story._id)}
/>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-4 py-2 rounded-md text-sm ${
                currentPage === i + 1
                  ? "bg-stone-900 text-white"
                  : "border text-stone-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
  {bookmarks.length > 0 && (
  <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-6">
    <h2 className="mb-6 text-2xl font-bold">
      Saved Stories ({bookmarks.length})
    </h2>

    <div className="space-y-4">
      {bookmarkedStories.map((story) => (
        <div
          key={story._id}
          className="flex items-center gap-4 rounded-xl border border-stone-100 p-3"
        >
          <img
            src={story.coverImage}
            alt={story.title}
            className="h-16 w-16 rounded-lg object-cover"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{story.title}</h3>
            <p className="text-sm text-stone-500">
              {story.author}
            </p>
          </div>

          <button
            onClick={() => handleRemoveBookmark(story._id)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-stone-50"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </div>
)}
    </section>
  );
}