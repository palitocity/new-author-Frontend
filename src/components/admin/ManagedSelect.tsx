import { useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { Loader2, Plus, Settings2, X } from "lucide-react";

type ManagedSelectProps = {
  name: string;
  label: string;
  icon?: ReactNode;
  required?: boolean;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onAdd: (value: string) => Promise<boolean>;
  onRemove: (value: string) => Promise<boolean>;
  /** Called with a newly added option so the form can select it. */
  onAdded?: (value: string) => void;
  selectClassName?: string;
};

/**
 * A select whose options an admin can add to and remove from in place.
 * Removing an option doesn't change stories that already use it; a value
 * no longer in the list still shows (marked "removed") so it isn't lost.
 */
export default function ManagedSelect({
  name,
  label,
  icon,
  required,
  value,
  options,
  placeholder,
  onChange,
  onAdd,
  onRemove,
  onAdded,
  selectClassName = "w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition",
}: ManagedSelectProps) {
  const [managing, setManaging] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const selectId = `${name}-select`;
  const valueMissing = Boolean(value) && !options.includes(value);

  const handleAdd = async () => {
    const newValue = draft.replace(/\s+/g, " ").trim();
    if (!newValue) return;

    setBusy("__add__");
    const added = await onAdd(newValue);
    setBusy(null);

    if (added) {
      setDraft("");
      onAdded?.(newValue);
    }
  };

  const handleRemove = async (option: string) => {
    const confirmed = window.confirm(
      `Remove "${option}" from the ${label} list?\n\nStories that already use it keep it.`,
    );
    if (!confirmed) return;

    setBusy(option);
    await onRemove(option);
    setBusy(null);
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter adds the option instead of submitting the story form.
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label
          htmlFor={selectId}
          className="flex items-center gap-2 text-sm font-semibold text-stone-700"
        >
          {icon}
          {label}
          {required && " *"}
        </label>
        <button
          type="button"
          onClick={() => setManaging((open) => !open)}
          aria-expanded={managing}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-50"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {managing ? "Done" : "Manage"}
        </button>
      </div>

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClassName}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {valueMissing && <option value={value}>{value} (removed)</option>}
      </select>

      {managing && (
        <div className="mt-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
          {options.length === 0 ? (
            <p className="text-sm text-stone-500">No options yet. Add one below.</p>
          ) : (
            <ul className="max-h-52 space-y-1 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option}
                  className="flex items-center justify-between gap-2 rounded-md bg-white px-3 py-1.5 text-sm text-stone-800"
                >
                  <span className="min-w-0 truncate">{option}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(option)}
                    disabled={busy !== null}
                    aria-label={`Remove ${option}`}
                    className="shrink-0 rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    {busy === option ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleDraftKeyDown}
              maxLength={120}
              placeholder={`New ${label.toLowerCase()}`}
              aria-label={`New ${label.toLowerCase()}`}
              className="min-w-0 flex-1 rounded-md border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-orange-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={busy !== null || !draft.trim()}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {busy === "__add__" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
