import { Search } from "lucide-react";

export default function LibrarySearch({
  onChange,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search My Continuity Library"
        className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-600"
      />
    </label>
  );
}
