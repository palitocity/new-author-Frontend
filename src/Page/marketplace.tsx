/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import StoryCard from "../components/Storycard";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

export default function Marketplace() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all published stories
  const getStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/book"); // Adjust endpoint if needed
      setStories(res.data.data || []);
    } catch (error: any) {
      console.error(
        "Error fetching stories:",
        error.response?.data || error.message
      );
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  // Download a story (free only)
  const downloadStory = async (id: string) => {
    try {
      const res = await axios.get(`/book/${id}/download`);
      if (res.data.success) {
        const { title, content } = res.data.data;
        const blob = new Blob([content], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Download started!");
      } else {
        toast.error(res.data.message || "Cannot download this book");
      }
    } catch (error: any) {
      console.error("Download error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to download story");
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  return (
    <section className="container mx-auto px-6 py-16 bg-stone-200/30 rounded-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-3">
          Story Marketplace
        </h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      {loading && (
        <p className="text-center text-stone-600">Loading stories...</p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            image={story.coverImage}
            title={story.title}
            summary={story.summary}
            price={story.price > 0 ? `₦${story.price}` : "Free"}
            onDownload={() => downloadStory(story._id)}
          />
        ))}
      </div>
    </section>
  );
}
