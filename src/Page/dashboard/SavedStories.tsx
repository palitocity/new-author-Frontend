import { BookmarkX, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useRemoveSavedStoryMutation,
  useSavedStoriesQuery,
} from "../../services/api";

export default function SavedStories() {
  const { data = [], isLoading } = useSavedStoriesQuery();
  const [removeSavedStory] = useRemoveSavedStoryMutation();

  const removeStory = async (storyId: string) => {
    try {
      await removeSavedStory(storyId).unwrap();
      toast.success("Story removed");
    } catch {
      toast.error("Unable to remove saved story");
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Saved Stories</h1>
        <p className="mt-1 text-sm text-stone-500">
          Bookmarked stories you want to revisit.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-stone-500">Loading saved stories...</p>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
          <BookOpen className="mx-auto h-10 w-10 text-amber-700" />
          <h2 className="mt-3 text-lg font-bold">No saved stories yet</h2>
          <p className="mt-1 text-sm text-stone-500">
            Save stories from their detail pages and they will collect here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((story) => (
            <article
              key={story.id}
              className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="aspect-4/3 bg-stone-200 dark:bg-stone-800">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {story.category}
                </p>
                <h2 className="mt-2 text-lg font-bold">{story.title}</h2>
                <p className="mt-1 text-xs text-stone-500">
                  Saved {new Date(story.dateSaved).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/story/${story.storyId}`}
                    className="flex-1 rounded-md bg-amber-700 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Continue Reading
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeStory(story.storyId)}
                    className="rounded-md border border-stone-300 px-3 text-stone-600 dark:border-stone-700 dark:text-stone-300"
                    aria-label="Remove saved story"
                  >
                    <BookmarkX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
