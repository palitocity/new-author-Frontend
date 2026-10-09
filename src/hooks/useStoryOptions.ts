import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../config/axiosconfiq";

export type StoryOptionField = "category" | "historicalPeriod" | "ageRating";
export type StoryOptions = Record<StoryOptionField, string[]>;

// Used until the saved lists load, or if they can't be loaded, so the
// story form always has choices.
const FALLBACK_OPTIONS: StoryOptions = {
  category: [
    "Folklore & Legends",
    "Historical Fiction",
    "Oral Traditions",
    "Biography & Memoirs",
    "Cultural Tales",
    "War & Resistance",
    "Family Stories",
    "Mythology",
  ],
  historicalPeriod: [
    "Ancient Times (Before 500 CE)",
    "Medieval Period (500-1500 CE)",
    "Early Modern (1500-1800)",
    "Colonial Era (1800-1960)",
    "Independence Era (1960-1990)",
    "Contemporary (1990-Present)",
  ],
  ageRating: ["All Ages", "8+", "12+", "16+", "18+"],
};

type ApiError = { response?: { data?: { error?: string; message?: string } } };

const errorMessage = (error: unknown, fallback: string) => {
  const data = (error as ApiError).response?.data;
  return data?.error || data?.message || fallback;
};

/**
 * Admin-managed choices for the story form's select fields.
 */
export function useStoryOptions() {
  const [options, setOptions] = useState<StoryOptions>(FALLBACK_OPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    axios
      .get("/admin/story-options")
      .then((res) => {
        if (!cancelled && res.data?.data) setOptions(res.data.data);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Couldn't load saved lists; showing the default options.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addOption = useCallback(
    async (field: StoryOptionField, value: string) => {
      try {
        const res = await axios.post(`/admin/story-options/${field}`, { value });
        setOptions(res.data.data);
        toast.success(`Added "${value.trim()}"`);
        return true;
      } catch (error) {
        toast.error(errorMessage(error, "Unable to add option"));
        return false;
      }
    },
    [],
  );

  const removeOption = useCallback(
    async (field: StoryOptionField, value: string) => {
      try {
        const res = await axios.delete(`/admin/story-options/${field}`, {
          data: { value },
        });
        setOptions(res.data.data);
        toast.success(`Removed "${value}"`);
        return true;
      } catch (error) {
        toast.error(errorMessage(error, "Unable to remove option"));
        return false;
      }
    },
    [],
  );

  return { options, loading, addOption, removeOption };
}
