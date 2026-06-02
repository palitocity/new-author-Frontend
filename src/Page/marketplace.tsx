/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoryCard } from "../components/Storycard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Sparkles, TrendingUp, Eye } from "lucide-react";

import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

export default function Marketplace() {
  const [stories, setStories] = useState<any[]>([]);
  const [filteredStories, setFilteredStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");

  const navigate = useNavigate();

  // GET STORIES
  const getStories = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/book");
      const fetchedStories = res.data.data || [];

      const storedViews = JSON.parse(
        localStorage.getItem("marketplace_story_views") || "{}",
      );

      const storiesWithViews = fetchedStories.map((story: any) => ({
        ...story,
        views: storedViews[story._id] || 0,
      }));

      setStories(storiesWithViews);
      setFilteredStories(storiesWithViews);
    } catch (error: any) {
      toast.error(error.message || "Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  useEffect(() => {
    let filtered = stories;

    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterType === "free") {
      filtered = filtered.filter((story) => story.price === 0);
    } else if (filterType === "paid") {
      filtered = filtered.filter((story) => story.price > 0);
    }

    setFilteredStories(filtered);
  }, [searchQuery, filterType, stories]);

  const handleStoryClick = (story: any) => {
    if (story.price > 0) {
      navigate(`/order/${story._id}`);
    } else {
      navigate(`/dashboard/story/${story._id}`);
    }
  };

  const stats = {
    total: stories.length,
    free: stories.filter((s) => s.price === 0).length,
    paid: stories.filter((s) => s.price > 0).length,
  };

  return (
    <section className="min-h-screen bg-stone-950 text-white">
      {/* TOP BAR */}
      <div className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-xl">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Marketplace
              <span className="text-orange-500">.</span>
            </h1>
            <p className="text-sm text-stone-400">
              Browse and manage your stories
            </p>
          </div>

          <div className="flex items-center gap-2 text-orange-500">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Story Hub</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-sm">Total</span>
              <BookOpen className="text-orange-500 w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-sm">Free</span>
              <Sparkles className="text-orange-500 w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold mt-2">{stats.free}</h2>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-sm">Paid</span>
              <TrendingUp className="text-orange-500 w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold mt-2">{stats.paid}</h2>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-950 border border-stone-800 focus:border-orange-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            {["all", "free", "paid"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                  filterType === type
                    ? "bg-orange-600 text-white"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-stone-700 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* GRID */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story._id}
                className="relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-orange-500 transition"
              >
                {/* VIEWS */}
                <div className="absolute top-3 right-3 z-10 bg-black/60 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Eye className="w-3 h-3 text-orange-500" />
                  {story.views || 0}
                </div>

                <StoryCard
                  image={story.coverImage}
                  title={story.title}
                  summary={story.summary}
                  price={story.price}
                  views={story.views}
                  isFree={story.price === 0}
                  onAction={() => handleStoryClick(story)}
                />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredStories.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            No stories found
          </div>
        )}
      </div>
    </section>
  );
}
