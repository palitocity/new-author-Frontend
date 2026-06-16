import { BookmarkPlus, Minus, NotebookPen, Plus } from "lucide-react";

export default function ReaderToolbar({
  onAddBookmark,
  onAddNote,
  onPageChange,
}: {
  onAddBookmark: () => void;
  onAddNote: () => void;
  onPageChange: (delta: number) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-stone-200 bg-white/95 p-2 shadow-xl backdrop-blur">
      <button
        type="button"
        onClick={() => onPageChange(-1)}
        className="rounded-md p-2 text-stone-700 hover:bg-stone-100"
        aria-label="Previous page"
      >
        <Minus className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(1)}
        className="rounded-md p-2 text-stone-700 hover:bg-stone-100"
        aria-label="Next page"
      >
        <Plus className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onAddBookmark}
        className="rounded-md p-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
        aria-label="Add bookmark"
      >
        <BookmarkPlus className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onAddNote}
        className="rounded-md p-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
        aria-label="Add Reflection Note"
      >
        <NotebookPen className="h-5 w-5" />
      </button>
    </div>
  );
}
