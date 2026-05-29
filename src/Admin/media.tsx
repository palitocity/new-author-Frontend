// src/pages/MediaPage.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "../config/axiosconfiq";
import {
  Trash2,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Music2,
  Loader2,
  X,
  Eye,
} from "lucide-react";

type UploadedBy = {
  _id: string;
  fullname: string;
  email: string;
};

type MediaItem = {
  _id: string;
  title: string;
  description: string;
  originalName: string;
  fileType: "pdf" | "image" | "video" | "audio";
  mimeType: string;
  url: string;
  viewUrl: string;
  publicId: string;
  fileSize: number;
  uploadedBy?: UploadedBy;
  createdAt: string;
};

// pass your admin token here
const token = localStorage.getItem("token");

const MediaPage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedType, setSelectedType] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // FETCH ALL MEDIA
  // =========================
  const fetchMedia = async () => {
    try {
      setLoading(true);

      const endpoint = selectedType ? `/media?type=${selectedType}` : "/media";

      const response = await axios.get(endpoint);

      console.log("MEDIA RESPONSE:", response.data);

      setMedia(response.data.data || []);
    } catch (error: any) {
      console.error("FETCH MEDIA ERROR:", error);

      alert(error?.response?.data?.message || "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedType]);

  // =========================
  // UPLOAD MEDIA
  // =========================
  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        alert("Please select a file");
        return;
      }

      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("title", title);
      formData.append("description", description);

      await axios.post(`/media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDescription("");
      setSelectedFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      fetchMedia();

      alert("Upload successful");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // DELETE MEDIA
  // =========================
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this media?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/media/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedia((prev) => prev.filter((item) => item._id !== id));

      alert("Deleted successfully");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  // =========================
  // FILE SIZE FORMATTER
  // =========================
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // =========================
  // FILE ICON
  // =========================
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="size-5 text-red-500" />;

      case "image":
        return <ImageIcon className="size-5 text-blue-500" />;

      case "video":
        return <Video className="size-5 text-purple-500" />;

      case "audio":
        return <Music2 className="size-5 text-green-500" />;

      default:
        return <FileText className="size-5" />;
    }
  };

  const filteredCount = useMemo(() => media.length, [media]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-zinc-400 mt-1">
            Upload and manage PDFs, images, videos, and audio files.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3">
          <p className="text-sm text-zinc-400">Total Media</p>
          <h2 className="text-2xl font-bold">{filteredCount}</h2>
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Upload Media</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Title</label>

            <input
              type="text"
              placeholder="Media title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <input
              type="text"
              placeholder="Media description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-zinc-400">
            Select File
          </label>

          <input
            ref={fileRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setSelectedFile(file);
              }
            }}
            className="block w-full rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-4 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium file:text-black"
          />
        </div>

        {selectedFile && (
          <div className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-medium">{selectedFile.name}</p>

            <p className="mt-1 text-sm text-zinc-400">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="size-5" />
              Upload Media
            </>
          )}
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-wrap gap-3">
        {["", "pdf", "image", "video", "audio"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              selectedType === type
                ? "bg-white text-black"
                : "bg-zinc-900 text-white border border-zinc-700"
            }`}
          >
            {type === "" ? "All" : type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MEDIA GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-zinc-400">No media found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
            >
              {/* PREVIEW */}
              <div className="relative h-64 bg-zinc-950">
                {item.fileType === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : item.fileType === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : item.fileType === "audio" ? (
                  <div className="flex h-full items-center justify-center">
                    <audio controls src={item.url} />
                  </div>
                ) : (
                  <iframe
                    src={item.viewUrl}
                    title={item.title}
                    className="h-full w-full bg-white"
                  />
                )}
              </div>

              {/* BODY */}
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  {getFileIcon(item.fileType)}

                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs uppercase">
                    {item.fileType}
                  </span>
                </div>

                <h2 className="line-clamp-1 text-lg font-bold">
                  {item.title || item.originalName}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  {item.description || "No description"}
                </p>

                <div className="mt-4 space-y-1 text-sm text-zinc-500">
                  <p>Size: {formatFileSize(item.fileSize)}</p>

                  <p>
                    Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setPreviewMedia(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-4 py-3 transition hover:bg-zinc-800"
                  >
                    <Eye className="size-4" />
                    Preview
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center justify-center rounded-2xl bg-red-500 px-4 py-3 transition hover:opacity-90"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5">
          <div className="relative w-full max-w-5xl rounded-3xl bg-zinc-900 p-5">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute right-5 top-5 rounded-full bg-zinc-800 p-2"
            >
              <X className="size-5" />
            </button>

            <div className="h-[80vh] overflow-hidden rounded-2xl bg-black">
              {previewMedia.fileType === "image" ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="h-full w-full object-contain"
                />
              ) : previewMedia.fileType === "video" ? (
                <video
                  src={previewMedia.url}
                  controls
                  className="h-full w-full"
                />
              ) : previewMedia.fileType === "audio" ? (
                <div className="flex h-full items-center justify-center">
                  <audio controls src={previewMedia.url} />
                </div>
              ) : (
                <iframe
                  src={previewMedia.viewUrl}
                  title={previewMedia.title}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
