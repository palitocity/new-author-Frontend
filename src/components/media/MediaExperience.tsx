import { useEffect, useMemo, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  AlertCircle,
  BookOpen,
  Download,
  ExternalLink,
  Headphones,
  Loader2,
  RefreshCw,
  Video,
} from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import type { Book } from "../../types/book";
import type { MediaAsset } from "../../utils/media";
import { buildCloudinaryPdfUrl, getMediaAssets } from "../../utils/media";

const pdfWorkerUrl =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
type MediaExperienceProps = {
  book: Book;
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

type PdfViewerMode = "reader" | "browser" | "google";

const viewerModeLabel: Record<PdfViewerMode, string> = {
  reader: "Reader mode",
  browser: "Browser mode",
  google: "Google Docs mode",
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

const PdfActionButton = ({
  children,
  onClick,
  variant = "secondary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${
      variant === "primary"
        ? "bg-amber-300 text-stone-950 hover:bg-amber-200"
        : "bg-stone-800 text-stone-100 hover:bg-stone-700"
    }`}
  >
    {children}
  </button>
);

const EmptyState = () => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white px-6 text-center text-stone-600">
    <BookOpen className="h-8 w-8 text-stone-400" />
    <p className="max-w-md text-sm font-medium">
      This item does not have a readable, listenable, or watchable file yet.
    </p>
  </div>
);

const PdfRenderError = ({
  message,
  onFallback,
}: {
  message: string;
  onFallback: (message: string) => void;
}) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => onFallback(message), 0);

    return () => window.clearTimeout(timeout);
  }, [message, onFallback]);

  return <ErrorState message={message} />;
};

const AudioPlayer = ({ asset, book }: { asset: MediaAsset; book: Book }) => (
  <div className="grid gap-6 bg-stone-950 p-5 text-white md:grid-cols-[220px_1fr] md:p-8">
    <div className="aspect-square overflow-hidden rounded-lg bg-stone-800">
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={book.title}
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
      <h2 className="text-2xl font-bold md:text-4xl">{book.title}</h2>
      {(book.narrator || book.author) && (
        <p className="mt-2 text-sm text-stone-300">
          {book.narrator ? `Narrated by ${book.narrator}` : `By ${book.author}`}
        </p>
      )}
      <audio
        key={asset.url}
        controls
        preload="metadata"
        className="mt-8 w-full"
        src={asset.url}
      />
    </div>
  </div>
);

const VideoPlayer = ({ asset, book }: { asset: MediaAsset; book: Book }) => (
  <div className="bg-black">
    <video
      key={asset.url}
      controls
      playsInline
      preload="metadata"
      poster={book.coverImage}
      className="aspect-video w-full bg-black object-contain"
      src={asset.url}
    />
  </div>
);

const PdfReader = ({ asset }: { asset: MediaAsset }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const pdfUrl = useMemo(() => buildCloudinaryPdfUrl(asset.url), [asset.url]);

  const googleViewerUrl = useMemo(
    () =>
      pdfUrl
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            pdfUrl,
          )}`
        : "",
    [pdfUrl],
  );

  const [viewerMode, setViewerMode] = useState<PdfViewerMode>("reader");
  const [loadError, setLoadError] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(false);
  console.log("accecess", setCheckingAccess);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const openPdf = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const retryReader = () => {
    setLoadError("");
    setAccessMessage("");
    setIframeLoading(false);
    setViewerMode("reader");
    setRetryKey((c) => c + 1);
  };

  const fallbackFromReader = (message: string) => {
    setLoadError(message);
    setViewerMode("browser");
  };

  // =========================
  // CHECK ACCESS
  // =========================
  // useEffect(() => {
  //   const controller = new AbortController();

  //   const checkPdfAccess = async () => {
  //     if (!pdfUrl) return;

  //     try {
  //       setCheckingAccess(true);
  //       setAccessMessage("");

  //       const res = await fetch(pdfUrl, {
  //         method: "GET",
  //         mode: "cors",
  //         signal: controller.signal,
  //       });

  //       if (!res.ok) {
  //         setAccessMessage("Cloudinary PDF not accessible");
  //         setViewerMode("browser");
  //       }
  //     } catch {
  //       setAccessMessage("CORS issue detected. Switching to browser viewer.");
  //       setViewerMode("browser");
  //     } finally {
  //       setCheckingAccess(false);
  //     }
  //   };

  //   checkPdfAccess();

  //   return () => controller.abort();
  // }, [pdfUrl, retryKey]);

  // =========================
  // BROWSER TIMEOUT FALLBACK
  // =========================
  useEffect(() => {
    if (viewerMode !== "browser") return;

    const t1 = setTimeout(() => setIframeLoading(true), 0);

    const t2 = setTimeout(() => {
      setLoadError("Browser viewer failed. Switching to Google Docs.");
      setViewerMode("google");
      setIframeLoading(false);
    }, 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [viewerMode, pdfUrl, retryKey]);

  // =========================
  // GOOGLE LOADING STATE
  // =========================
  useEffect(() => {
    if (viewerMode === "google") {
      const t = setTimeout(() => setIframeLoading(true), 0);
      return () => clearTimeout(t);
    }
  }, [viewerMode]);

  const renderFallbackActions = (
    <div className="flex flex-wrap items-center gap-2">
      <PdfActionButton
        onClick={() => setViewerMode("browser")}
        variant="primary"
      >
        <ExternalLink className="h-4 w-4" />
        Open Browser
      </PdfActionButton>

      <PdfActionButton onClick={() => setViewerMode("google")}>
        <ExternalLink className="h-4 w-4" />
        Open Google Docs
      </PdfActionButton>

      <PdfActionButton onClick={openPdf}>
        <Download className="h-4 w-4" />
        Download
      </PdfActionButton>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-stone-800 bg-stone-950 shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-stone-800 p-3 text-white md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
            {viewerModeLabel[viewerMode]}
          </span>

          {accessMessage && (
            <span className="text-xs text-amber-100/70">{accessMessage}</span>
          )}
        </div>

        <div className="flex gap-2">
          <PdfActionButton onClick={retryReader}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </PdfActionButton>

          <PdfActionButton onClick={openPdf}>
            <ExternalLink className="h-4 w-4" />
            Open
          </PdfActionButton>
        </div>
      </div>

      {/* ERROR STATE */}
      {(loadError || accessMessage) && viewerMode !== "reader" && (
        <div className="border-b border-stone-800 bg-stone-900 p-4">
          <ErrorState message={loadError || accessMessage} />
          {renderFallbackActions}
        </div>
      )}

      {/* LOADING */}
      {checkingAccess && viewerMode === "reader" ? (
        <LoadingState label="Checking PDF access" />
      ) : viewerMode === "reader" ? (
        <div className="h-[75vh] bg-stone-200">
          <Worker workerUrl={pdfWorkerUrl}>
            <Viewer
              key={`${pdfUrl}-${retryKey}`}
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              renderError={(error) => {
                return (
                  <PdfRenderError
                    message={
                      error?.message ||
                      "PDF failed to load. Try another viewer."
                    }
                    onFallback={fallbackFromReader}
                  />
                );
              }}
              renderLoader={() => <LoadingState label="Loading PDF..." />}
            />
          </Worker>
        </div>
      ) : viewerMode === "browser" ? (
        <div className="relative h-[75vh] bg-stone-900">
          {iframeLoading && (
            <div className="absolute inset-0 z-10">
              <LoadingState label="Opening browser PDF viewer" />
            </div>
          )}
          <iframe
            key={`${pdfUrl}-browser-${retryKey}`}
            src={pdfUrl}
            className="h-full w-full border-0"
            title="PDF Viewer"
            onLoad={() => setIframeLoading(false)}
            onError={() => {
              setLoadError("Browser viewer failed. Switching to Google Docs.");
              setViewerMode("google");
            }}
          />
        </div>
      ) : (
        <div className="relative h-[75vh] bg-stone-900">
          {iframeLoading && (
            <div className="absolute inset-0 z-10">
              <LoadingState label="Opening Google PDF viewer" />
            </div>
          )}
          <iframe
            key={`${googleViewerUrl}-google-${retryKey}`}
            src={googleViewerUrl}
            className="h-full w-full border-0"
            title="Google PDF Viewer"
            onLoad={() => setIframeLoading(false)}
            onError={() =>
              setLoadError(
                "Google Docs Viewer could not load this PDF. Try opening the PDF in a new tab.",
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default function MediaExperience({ book }: MediaExperienceProps) {
  const assets = useMemo(() => getMediaAssets(book), [book]);
  const [activeAssetUrl, setActiveAssetUrl] = useState(assets[0]?.url || "");
  const activeAsset =
    assets.find((asset) => asset.url === activeAssetUrl) || assets[0];

  if (!activeAsset) return <EmptyState />;

  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl">
      {assets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-100 p-2">
          {assets.map((asset) => {
            const Icon = mediaIcon[asset.kind];
            const active = asset.url === activeAsset.url;

            return (
              <button
                key={`${asset.kind}-${asset.url}`}
                type="button"
                onClick={() => setActiveAssetUrl(asset.url)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-stone-950 text-white"
                    : "bg-white text-stone-700 hover:bg-amber-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {mediaLabel[asset.kind]}
              </button>
            );
          })}
        </div>
      )}

      {activeAsset.kind === "pdf" && <PdfReader asset={activeAsset} />}
      {activeAsset.kind === "audio" && (
        <AudioPlayer asset={activeAsset} book={book} />
      )}
      {activeAsset.kind === "video" && (
        <VideoPlayer asset={activeAsset} book={book} />
      )}
    </section>
  );
}
