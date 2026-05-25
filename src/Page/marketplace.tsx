/* eslint-disable react-hooks/exhaustive-deps */
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

  // ─────────────────────────────────────────────
  // GET STORIES
  // ─────────────────────────────────────────────
  const getStories = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/book");

      const fetchedStories = res.data.data || [];

      // GET LOCAL STORAGE VIEWS
      const storedViews = JSON.parse(
        localStorage.getItem("marketplace_story_views") || "{}",
      );

      // ADD VIEWS TO STORIES
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

  // ─────────────────────────────────────────────
  // INITIAL LOAD
  // ─────────────────────────────────────────────
  useEffect(() => {
    getStories();
  }, []);

  // ─────────────────────────────────────────────
  // FILTER STORIES
  // ─────────────────────────────────────────────
  useEffect(() => {
    let filtered = stories;

    // SEARCH FILTER
    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // TYPE FILTER
    if (filterType === "free") {
      filtered = filtered.filter((story) => story.price === 0);
    } else if (filterType === "paid") {
      filtered = filtered.filter((story) => story.price > 0);
    }

    setFilteredStories(filtered);
  }, [searchQuery, filterType, stories]);

  // ─────────────────────────────────────────────
  // MARKETPLACE IMPRESSION TRACKING
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stories.length > 0) {
      trackMarketplaceViews();
    }
  }, [stories]);

  const trackMarketplaceViews = () => {
    const STORAGE_KEY = "marketplace_story_views";

    const SESSION_KEY = "marketplace_session_viewed";

    // PREVENT REFRESH SPAM
    const alreadyViewed = sessionStorage.getItem(SESSION_KEY) === "true";

    if (alreadyViewed) return;

    const existingViews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    const updatedViews = {
      ...existingViews,
    };

    // INCREMENT EACH STORY VIEW
    stories.forEach((story) => {
      updatedViews[story._id] = (updatedViews[story._id] || 0) + 1;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedViews));

    sessionStorage.setItem(SESSION_KEY, "true");

    // UPDATE UI
    const updatedStories = stories.map((story) => ({
      ...story,
      views: updatedViews[story._id] || 0,
    }));

    setStories(updatedStories);
    setFilteredStories(updatedStories);
  };

  // ─────────────────────────────────────────────
  // HANDLE STORY CLICK
  // ─────────────────────────────────────────────
  const handleStoryClick = (story: any) => {
    const STORAGE_KEY = "marketplace_story_views";

    const existingViews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    // INCREMENT ONLY CLICKED STORY
    existingViews[story._id] = (existingViews[story._id] || 0) + 1;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingViews));

    // UPDATE UI
    const updatedStories = stories.map((s) =>
      s._id === story._id
        ? {
            ...s,
            views: existingViews[story._id],
          }
        : s,
    );

    setStories(updatedStories);
    setFilteredStories(updatedStories);

    // NAVIGATE
    if (story.price > 0) {
      navigate(`/order/${story._id}`);
    } else {
      navigate(`/story/${story._id}`);
    }
  };

  // ─────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────
  const stats = {
    total: stories.length,
    free: stories.filter((s) => s.price === 0).length,
    paid: stories.filter((s) => s.price > 0).length,
  };

  return (
    <section className="relative bg-linear-to-br from-amber-50 via-stone-50 to-orange-50/30 min-h-screen">
      {/* TOP LINE */}
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-600 via-orange-500 to-amber-600"></div>

      <div className="container mx-auto px-6 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold rounded-full tracking-wider shadow-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              MARKETPLACE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-4 tracking-tight">
            Story Marketplace
          </h1>

          <div className="w-32 h-1.5 bg-linear-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6 rounded-full"></div>

          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Discover ancestral wisdom, cultural treasures, and transformative
            narratives
          </p>
        </div>

        {/* STATS */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200 text-center">
              <div className="w-12 h-12 bg-linear-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-amber-700" />
              </div>

              <p className="text-3xl font-bold text-stone-900 mb-1">
                {stats.total}
              </p>

              <p className="text-sm text-stone-600 font-medium">
                Total Stories
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-200 text-center">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-emerald-700" />
              </div>

              <p className="text-3xl font-bold text-stone-900 mb-1">
                {stats.free}
              </p>

              <p className="text-sm text-stone-600 font-medium">Free Stories</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 text-center">
              <div className="w-12 h-12 bg-linear-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-700" />
              </div>

              <p className="text-3xl font-bold text-stone-900 mb-1">
                {stats.paid}
              </p>

              <p className="text-sm text-stone-600 font-medium">
                Premium Stories
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* SEARCH */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />

                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* FILTERS */}
              <div className="flex gap-3">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    filterType === "all"
                      ? "bg-orange-600 text-white"
                      : "bg-stone-100"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setFilterType("free")}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    filterType === "free"
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100"
                  }`}
                >
                  Free
                </button>

                <button
                  onClick={() => setFilterType("paid")}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    filterType === "paid"
                      ? "bg-amber-600 text-white"
                      : "bg-stone-100"
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredStories.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-stone-800 mb-2">
              No stories found
            </h3>
          </div>
        )}

        {/* STORIES */}
        {!loading && filteredStories.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredStories.map((story) => (
              <div className="relative">
                {/* VIEW COUNTER */}
                <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                  <Eye className="w-4 h-4 text-orange-400" />

                  <span className="text-sm font-semibold">
                    {story.views || 0}
                  </span>
                </div>

                <StoryCard
                  key={story._id}
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
      </div>
    </section>
  );
}
