import type { Book } from "../types/book";

export type MediaKind = "pdf" | "audio" | "video";

export type MediaAsset = {
  kind: MediaKind;
  url: string;
  label: string;
};

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

const extensionPattern =
  /\.(pdf|mp3|wav|m4a|aac|ogg|mp4|webm|mov|m4v)(?:[?#].*)?$/i;

const stripPdfExtension = (value: string) => value.replace(/(?:\.pdf)+$/i, "");

const encodePublicId = (publicId: string) =>
  publicId
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

export const buildCloudinaryPdfUrl = (publicId: string) => {
  const trimmedPublicId = publicId.trim();

  if (!trimmedPublicId) return "";

  if (/^https?:\/\//i.test(trimmedPublicId)) {
    return normalizeCloudinaryUrl(trimmedPublicId);
  }

  if (!cloudinaryCloudName) {
    return `${stripPdfExtension(trimmedPublicId)}.pdf`;
  }

  const encodedPublicId = encodePublicId(stripPdfExtension(trimmedPublicId));

  return `https://res.cloudinary.com/${cloudinaryCloudName}/raw/upload/fl_attachment:false/${encodedPublicId}.pdf`;
};

export const normalizeCloudinaryUrl = (url: string) => {
  if (!url) return url;

  let normalizedUrl = url.trim();

  normalizedUrl = normalizedUrl.replace(
    "/image/upload/fl_attachment:false/",
    "/image/upload/",
  );

  if (
    normalizedUrl.includes("/image/upload/") &&
    normalizedUrl.toLowerCase().includes(".pdf")
  ) {
    normalizedUrl = normalizedUrl.replace("/image/upload/", "/raw/upload/");
  }

  normalizedUrl = normalizedUrl.replace(
    /\/raw\/upload\/(?:fl_attachment:false\/)?/i,
    "/raw/upload/fl_attachment:false/",
  );

  return normalizedUrl;
};

const mediaKindFromUrl = (url: string): MediaKind | null => {
  const normalizedUrl = normalizeCloudinaryUrl(url);
  const match = normalizedUrl.match(extensionPattern);
  const extension = match?.[1]?.toLowerCase();

  if (extension === "pdf") return "pdf";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(extension || "")) {
    return "audio";
  }
  if (["mp4", "webm", "mov", "m4v"].includes(extension || "")) {
    return "video";
  }

  if (normalizedUrl.includes("/video/upload/")) return "video";
  if (
    normalizedUrl.includes("/raw/upload/") &&
    normalizedUrl.toLowerCase().includes(".pdf")
  ) {
    return "pdf";
  }

  return null;
};

const addAsset = (
  assets: MediaAsset[],
  url: string | undefined,
  fallbackKind: MediaKind | null,
  label: string,
) => {
  if (!url) return;

  const normalizedUrl = normalizeCloudinaryUrl(url);
  const kind = mediaKindFromUrl(normalizedUrl) || fallbackKind;

  if (!kind) return;

  if (
    !assets.some((asset) => asset.url === normalizedUrl && asset.kind === kind)
  ) {
    assets.push({
      kind,
      url: normalizedUrl,
      label,
    });
  }
};

export const getMediaAssets = (book: Book): MediaAsset[] => {
  const assets: MediaAsset[] = [];

  addAsset(
    assets,
    book.pdfFile ? buildCloudinaryPdfUrl(book.pdfFile) : undefined,
    "pdf",
    "Read",
  );
  addAsset(assets, book.audioFile, "audio", "Listen");
  addAsset(assets, book.videoFile, "video", "Watch");
  addAsset(assets, book.mediaUrl, null, "Open");

  return assets;
};

export const getPrimaryMediaAsset = (book: Book): MediaAsset | null => {
  const assets = getMediaAssets(book);

  return (
    assets.find((asset) => asset.kind === "pdf") ||
    assets.find((asset) => asset.kind === "audio") ||
    assets.find((asset) => asset.kind === "video") ||
    null
  );
};

export const formatPrice = (price = 0) =>
  `NGN ${price.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
