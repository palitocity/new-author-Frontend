/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import axios from "../config/axiosconfiq";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

type GalleryImage = {
  url: string;
  description?: string;
  createdAt?: string;
};

const PAGE_SIZE = 16;

function GalleryTile({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-stone-100"
    >
      {inView && (
        <img
          src={image.url}
          alt={image.description || "Gallery artwork"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

const PictureGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visibleImages = galleryImages.slice(0, visibleCount);
  const hasMore = visibleCount < galleryImages.length;

  const getImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/uploads");

      const flattenedImages: GalleryImage[] = res.data.data.flatMap(
        (upload: any) =>
          upload.images.map((img: any) => ({
            url: img.url,
            description: img.description,
            createdAt: upload.createdAt,
          })),
      );

      setGalleryImages(flattenedImages);
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      console.error(error);
      setError("Failed to load gallery images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < galleryImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const loadMore = () =>
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, galleryImages.length));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-amber-600" />
          <p className="font-medium text-stone-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="mx-auto max-w-md px-4 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-stone-900">
            Unable to load gallery
          </h2>
          <p className="mb-4 text-stone-600">{error}</p>
          <button
            onClick={getImages}
            className="rounded-lg bg-amber-600 px-6 py-2 text-white transition hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-stone-950 md:text-4xl">
          Gallery
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visibleImages.map((image, index) => (
            <GalleryTile
              key={image.url + index}
              image={image}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={loadMore}
              className="rounded-full border-2 border-stone-300 px-8 py-3 text-sm font-semibold text-stone-700 transition-all hover:border-stone-400 hover:bg-stone-100"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {selectedImage !== null && galleryImages[selectedImage] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-amber-400 md:top-6 md:right-6"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {selectedImage > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-amber-400 md:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {selectedImage < galleryImages.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-amber-400 md:right-8"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <img
            src={galleryImages[selectedImage].url}
            alt=""
            className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PictureGallery;
