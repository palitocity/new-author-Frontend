import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Viewer,
  Worker,
  type PageChangeEvent,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import {
  AlertCircle,
  BookOpen,
  Headphones,
  Loader2,
  Lock,
  RefreshCw,
  Video,
} from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { buildStreamUrl, type MediaKind } from "../../utils/media";

const pdfWorkerUrl =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

export type MediaExperienceProps = {
  bookId: string;
  streamToken: string;
  media: MediaKind[];
  title: string;
  author?: string;
  narrator?: string;
  coverImage?: string;
  /** 1-based page to open the PDF at. */
  initialPage?: number;
  /** Called with 1-based page and total pages as the reader moves. */
  onPageChange?: (page: number, totalPages: number) => void;
  /** Re-fetch access (e.g. the stream token expired). */
  onRetry?: () => void;
  /** Make the PDF fill the remaining viewport height. */
  fullHeight?: boolean;
};

const mediaIcon = {
  pdf: BookOpen,
  audio: Headphones,
  video: Video,
};

const mediaLabel = {
  pdf: "Read",
  audio: "Listen",
  video: "Watch",
};

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 text-center text-red-800">
    <AlertCircle className="h-8 w-8" />
    <p className="max-w-md text-sm font-medium">{message}</p>
  </div>
);

const LoadingState = ({ label }: { label: string }) => (
  <div className="flex h-full min-h-72 items-center justify-center gap-3 bg-stone-100 text-stone-600">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const EmptyState = () => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white px-6 text-center text-stone-600">
    <BookOpen className="h-8 w-8 text-stone-400" />
    <p className="max-w-md text-sm font-medium">
      This item does not have a readable, listenable, or watchable file yet.
    </p>
  </div>
);

const blockedShortcut = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey)) return false;
  const key = event.key.toLowerCase();
  // Save, print, open file
  return key === "s" || key === "p" || key === "o";
};

/**
 * Wraps purchased/free content so it is read on the platform only:
 * no context menu ("Save as"), no drag-out, no save/print shortcuts and
 * nothing rendered when printing. A determined user can still capture
 * the screen; this removes every built-in way to take the file away.
 */
function ProtectedSurface({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (blockedShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.body.classList.add("reading-protected");
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.body.classList.remove("reading-protected");
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return (
    <div
      className="protected-surface"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}

// Strip every way to take the file out of the reader.
const transformToolbar: TransformToolbarSlot = (slot: ToolbarSlot) => ({
  ...slot,
  Download: () => <></>,
  DownloadMenuItem: () => <></>,
  Print: () => <></>,
  PrintMenuItem: () => <></>,
  Open: () => <></>,
  OpenMenuItem: () => <></>,
});

const PdfReader = ({
  url,
  streamToken,
  initialPage,
  onPageChange,
  onRetry,
  fullHeight,
}: {
  url: string;
  streamToken: string;
  initialPage?: number;
  onPageChange?: (page: number, totalPages: number) => void;
  onRetry?: () => void;
  fullHeight?: boolean;
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
      <Toolbar>{renderDefaultToolbar(transformToolbar)}</Toolbar>
    ),
    // Thumbnails and bookmarks only: the attachments tab exposes
    // downloads of files embedded in the PDF.
    sidebarTabs: (defaultTabs) => defaultTabs.slice(0, 2),
    toolbarPlugin: {
      printPlugin: { enableShortcuts: false },
      openPlugin: { enableShortcuts: false },
    },
  });

  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;

  const httpHeaders = useMemo(
    () => ({ "X-Stream-Token": streamToken }),
    [streamToken],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-stone-800 bg-stone-950 shadow-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-stone-800 p-3 text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
          <Lock className="h-3.5 w-3.5" />
          Read-only on SankofaSeek
        </span>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-800 px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-stone-700"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </button>
        )}
      </div>

      <div
        className={`${fullHeight ? "h-[calc(100vh-8.5rem)]" : "h-[75vh]"} bg-stone-200`}
      >
        <Worker workerUrl={pdfWorkerUrl}>
          <Viewer
            key={`${url}-${streamToken}`}
            fileUrl={url}
            httpHeaders={httpHeaders}
            initialPage={Math.max(0, (initialPage || 1) - 1)}
            plugins={[defaultLayoutPluginInstance]}
            onPageChange={(event: PageChangeEvent) =>
              onPageChange?.(event.currentPage + 1, event.doc.numPages)
            }
            renderError={() => (
              <ErrorState message="This reading session could not be opened. Press Reload to try again." />
            )}
            renderLoader={() => <LoadingState label="Loading..." />}
          />
        </Worker>
      </div>
    </div>
  );
};

const AudioPlayer = ({
  url,
  title,
  author,
  narrator,
  coverImage,
}: {
  url: string;
  title: string;
  author?: string;
  narrator?: string;
  coverImage?: string;
}) => (
  <div className="grid gap-6 bg-stone-950 p-5 text-white md:grid-cols-[220px_1fr] md:p-8">
    <div className="aspect-square overflow-hidden rounded-lg bg-stone-800">
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          draggable={false}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Headphones className="h-14 w-14 text-stone-500" />
        </div>
      )}
    </div>

    <div className="flex min-w-0 flex-col justify-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
        Now playing
      </p>
      <h2 className="text-2xl font-bold md:text-4xl">{title}</h2>
      {(narrator || author) && (
        <p className="mt-2 text-sm text-stone-300">
          {narrator ? `Narrated by ${narrator}` : `By ${author}`}
        </p>
      )}
      <audio
        key={url}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        preload="metadata"
        className="mt-8 w-full"
        src={url}
      />
    </div>
  </div>
);

const VideoPlayer = ({ url, coverImage }: { url: string; coverImage?: string }) => (
  <div className="bg-black">
    <video
      key={url}
      controls
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      playsInline
      preload="metadata"
      poster={coverImage}
      className="aspect-video w-full bg-black object-contain"
      src={url}
    />
  </div>
);

export default function MediaExperience({
  bookId,
  streamToken,
  media,
  title,
  author,
  narrator,
  coverImage,
  initialPage,
  onPageChange,
  onRetry,
  fullHeight,
}: MediaExperienceProps) {
  const [activeKind, setActiveKind] = useState<MediaKind | undefined>(media[0]);
  const kind = activeKind && media.includes(activeKind) ? activeKind : media[0];

  if (!kind) return <EmptyState />;

  return (
    <ProtectedSurface>
      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl">
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-100 p-2">
            {media.map((item) => {
              const Icon = mediaIcon[item];
              const active = item === kind;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveKind(item)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-stone-950 text-white"
                      : "bg-white text-stone-700 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {mediaLabel[item]}
                </button>
              );
            })}
          </div>
        )}

        {kind === "pdf" && (
          <PdfReader
            url={buildStreamUrl(bookId, "pdf")}
            streamToken={streamToken}
            initialPage={initialPage}
            onPageChange={onPageChange}
            onRetry={onRetry}
            fullHeight={fullHeight}
          />
        )}
        {kind === "audio" && (
          <AudioPlayer
            url={buildStreamUrl(bookId, "audio", streamToken)}
            title={title}
            author={author}
            narrator={narrator}
            coverImage={coverImage}
          />
        )}
        {kind === "video" && (
          <VideoPlayer
            url={buildStreamUrl(bookId, "video", streamToken)}
            coverImage={coverImage}
          />
        )}
      </section>
    </ProtectedSurface>
  );
}
