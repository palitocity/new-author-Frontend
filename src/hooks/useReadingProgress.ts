import { useEffect, useMemo, useState } from "react";
import { continuityProducts } from "../data/mockContinuity";

export type ReadingProgress = {
  productId: string;
  currentChapter: number;
  currentPage: number;
  percentage: number;
  completed: boolean;
  lastOpened: string;
};

const STORAGE_KEY = "continuity_reading_progress";

const initialProgress = continuityProducts.reduce<Record<string, ReadingProgress>>(
  (items, product) => {
    items[product.id] = {
      productId: product.id,
      currentChapter: product.currentChapter,
      currentPage: product.currentPage,
      percentage: product.progress,
      completed: product.progress >= 100,
      lastOpened: product.lastOpened,
    };
    return items;
  },
  {},
);

const readStoredProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialProgress, ...JSON.parse(stored) } : initialProgress;
  } catch {
    return initialProgress;
  }
};

export function useReadingProgress(productId?: string) {
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>(
    readStoredProgress,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
  }, [progressMap]);

  const progress = productId ? progressMap[productId] : undefined;

  const updateProgress = (id: string, patch: Partial<ReadingProgress>) => {
    setProgressMap((current) => {
      const previous = current[id] || initialProgress[id];
      const next = {
        ...previous,
        ...patch,
        productId: id,
        completed: (patch.percentage ?? previous?.percentage ?? 0) >= 100,
        lastOpened: "just now",
      };
      return { ...current, [id]: next };
    });
  };

  const recentlyOpened = useMemo(
    () =>
      continuityProducts
        .map((product) => ({
          product,
          progress: progressMap[product.id] || initialProgress[product.id],
        }))
        .slice(0, 3),
    [progressMap],
  );

  return { progress, progressMap, recentlyOpened, updateProgress };
}
