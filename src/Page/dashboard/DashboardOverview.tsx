/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Activity,
  BookMarked,
  Compass,
  Library,
  NotebookPen,
} from "lucide-react";

import ContinueReadingCard from "../../components/library/ContinueReadingCard";
import ProgressCard from "../../components/library/ProgressCard";

import axios from "../../config/axiosconfiq";

type DashboardOverviewData = {
  stats?: {
    continuityLibrary?: number;
    reflectionNotes?: number;
    bookmarks?: number;
    learningPathways?: number;
  };
  continueReading?: Array<{ _id: string; product: any }>;
  readingProgress?: Array<{ _id: string; product: any; percentage: number }>;
  insights?: {
    recentActivity?: string;
    recommendations?: string;
    preservedMaterials?: string;
  };
};

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState<DashboardOverviewData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const getOverview = async () => {
    try {
      const res = await axios.get("/dashboard/overview");

      setDashboard(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const continueReading = dashboard?.continueReading || [];
  const readingProgress = dashboard?.readingProgress || [];
  const insights = dashboard?.insights || {};

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Reader Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-stone-950 sm:text-3xl">
          Learning continuity at a glance
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Continue Reading, Reflection Notes, bookmarks, preserved materials,
          and learning pathways.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "My Continuity Library",
            value: stats.continuityLibrary || 0,
            icon: Library,
          },
          {
            label: "Reflection Notes",
            value: stats.reflectionNotes || 0,
            icon: NotebookPen,
          },
          {
            label: "Bookmarks",
            value: stats.bookmarks || 0,
            icon: BookMarked,
          },
          {
            label: "Learning Pathways",
            value: stats.learningPathways || 0,
            icon: Compass,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-500">{label}</p>
              <Icon className="h-5 w-5 text-amber-700" />
            </div>

            <p className="mt-4 text-2xl font-bold text-stone-950">{value}</p>
          </div>
        ))}
      </div>

      {/* Continue Reading & Progress */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-700" />
            <h2 className="text-lg font-bold">Continue Reading</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {continueReading.map((item) => (
              <ContinueReadingCard key={item._id} product={item.product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Reading Progress</h2>

          <div className="space-y-3">
            {readingProgress.map((item) => (
              <ProgressCard
                key={item._id}
                product={{
                  ...item.product,
                  progress: item.percentage,
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Insights */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          ["Recent Activity", insights.recentActivity],
          ["Recommendations", insights.recommendations],
          ["Preserved Materials", insights.preservedMaterials],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-stone-950">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
