/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axiosconfiq";

type Story = {
  _id: string;
  title: string;
  subtitle: string;
  author: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  historicalPeriod: string;
  location: string;
  ageRating: string;
  coverImage: string;
  price: number;
  createdAt: string;
};

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const StorybyId = () => {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  const getStoryById = async () => {
    try {
      const res = await axios.get(`/book/${id}`);
      setStory(res.data.data);
    } catch (error: any) {
      console.error(
        "Failed to fetch story",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getStoryById();
  }, [id]);

  if (loading) return <p>Loading story...</p>;
  if (!story) return <p>Story not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={story.coverImage}
        alt={story.title}
        className="w-full h-96 object-cover rounded-xl mb-6"
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <span className="text-lg font-semibold text-amber-600">
          {formatPrice(story.price)}
        </span>
      </div>

      <p className="text-stone-500 mb-2">{story.subtitle}</p>

      <div className="text-sm text-stone-600 mb-6">
        By <span className="font-medium">{story.author}</span> •{" "}
        {story.category}
      </div>

      <p className="text-base leading-relaxed mb-6">{story.summary}</p>

      <article className="prose max-w-none">{story.content}</article>

      <div className="mt-8 flex gap-3">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm bg-stone-200 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StorybyId;
