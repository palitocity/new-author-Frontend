import { BookOpen } from "lucide-react";

export default function ReaderSidebar({
  chapters,
  currentChapter,
  setChapter,
}: {
  chapters: string[];
  currentChapter: number;
  setChapter: (chapter: number) => void;
}) {
  return (
    <aside className="border-r border-stone-200 bg-white p-4">
      <p className="mb-4 flex items-center gap-2 text-sm font-bold text-stone-950">
        <BookOpen className="h-4 w-4 text-amber-700" />
        Chapter Navigation
      </p>
      <nav className="space-y-2">
        {chapters.map((chapter, index) => {
          const active = currentChapter === index + 1;

          return (
            <button
              key={chapter}
              type="button"
              onClick={() => setChapter(index + 1)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${
                active
                  ? "bg-stone-950 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {index + 1}. {chapter}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
