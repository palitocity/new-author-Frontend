/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import StoryCard from "../components/Storycard";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/book");
      setStories(res.data.data || []);
    } catch (error: any) {
      toast.error(
        "Failed to load stories",
        error.message || "An error occurred",
      );
    } finally {
      setLoading(false);
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
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full" />
      </div>

      {loading && <p className="text-center">Loading stories...</p>}

      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            image={story.coverImage}
            title={story.title}
            summary={story.summary}
            price={story.price}
            isFree={story.price === 0}
            onAction={() => {
              if (story.price > 0) {
                navigate(`/order/${story._id}`);
              } else {
                navigate(`/story/${story._id}`);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
