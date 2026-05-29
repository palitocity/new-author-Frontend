/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  Loader2,
  MapPin,
  Shield,
  Tag,
  UserRound,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import type { Book } from "../types/book";
import { formatPrice, getMediaAssets } from "../utils/media";

const MediaExperience = lazy(
  () => import("../components/media/MediaExperience"),
);

const DetailPill = ({
  icon: Icon,
  label,
}: {
  icon: typeof BookOpen;
  label: string;
}) => (
  <span className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
    <Icon className="h-4 w-4 text-amber-700" />
    {label}
  </span>
);

const StorybyId = () => {
  const { id } = useParams();
  const [story, setStory] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !story) return;

    const STORAGE_KEY = "marketplace_story_views";

    // GET EXISTING VIEWS
    const existingViews = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    // INCREMENT CURRENT STORY
    existingViews[id] = (existingViews[id] || 0) + 1;

    // SAVE UPDATED VIEWS
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingViews));

    // UPDATE STORY UI
    setStory((prev) =>
      prev
        ? {
            ...prev,
            views: existingViews[id],
          }
        : prev,
    );
  }, [id, story?._id]);

  useEffect(() => {
    const getStoryById = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`/book/${id}`);
        setStory(res.data.data);
      } catch (fetchError: any) {
        setError(
          fetchError?.response?.data?.message ||
            "Unable to load this media item.",
        );
      } finally {
        setLoading(false);
      }
    };

    getStoryById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
        <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-5 py-4 text-stone-700 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
          <span className="text-sm font-semibold">Loading your media</span>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-stone-100 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-700">
            {error || "Story not found."}
          </p>
          <Link
            to="/marketplace"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const mediaAssets = getMediaAssets(story);
  const price = story.price || 0;
  const tags = story.tags || [];

  return (
    <main className="min-h-screen bg-stone-100">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr] lg:px-6">
          <div className="overflow-hidden rounded-lg bg-stone-200 shadow-lg">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="h-full min-h-80 w-full object-cover"
              />
            ) : (
              <div className="flex aspect-3/4 items-center justify-center">
                <BookOpen className="h-14 w-14 text-stone-400" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <Link
              to="/marketplace"
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Marketplace
            </Link>

            <div className="mb-3 flex flex-wrap items-center gap-3">
              {story.category && (
                <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
                  {story.category}
                </span>
              )}
              <span
                className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                  price === 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-950 text-white"
                }`}
              >
                {price === 0 ? "Free access" : formatPrice(price)}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-950 md:text-5xl">
              {story.title}
            </h1>
            {story.subtitle && (
              <p className="mt-3 max-w-3xl text-lg text-stone-600">
                {story.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {story.author && (
                <DetailPill icon={UserRound} label={story.author} />
              )}
              {story.readingTime && (
                <DetailPill icon={Clock} label={story.readingTime} />
              )}
              {typeof story.views === "number" && (
                <DetailPill icon={Eye} label={`${story.views || 0} views`} />
              )}
              {story.location && (
                <DetailPill icon={MapPin} label={story.location} />
              )}
              {story.historicalPeriod && (
                <DetailPill
                  icon={CalendarDays}
                  label={story.historicalPeriod}
                />
              )}
              {story.ageRating && (
                <DetailPill icon={Shield} label={story.ageRating} />
              )}
            </div>

            {story.summary && (
              <p className="mt-6 max-w-4xl text-base leading-8 text-stone-700">
                {story.summary}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-950">Media player</h2>
            <p className="mt-1 text-sm text-stone-500">
              {mediaAssets.length > 0
                ? "Read, listen, or watch without leaving the app."
                : "No media file has been attached to this item yet."}
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex min-h-72 items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white text-stone-600">
              <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
              <span className="text-sm font-semibold">Preparing player</span>
            </div>
          }
        >
          <MediaExperience book={story} />
        </Suspense>

        {story.content && (
          <article className="mt-8 rounded-lg border border-stone-200 bg-white p-6 text-stone-700 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-stone-950">Notes</h2>
            <div className="prose max-w-none">{story.content}</div>
          </article>
        )}

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm"
              >
                <Tag className="h-4 w-4 text-amber-700" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default StorybyId;
