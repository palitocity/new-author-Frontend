/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Loader2,
  AlertCircle,
} from "lucide-react";

const PictureGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const IMAGES_PER_PAGE = 12;

  const totalPages = Math.ceil(galleryImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const paginatedImages = galleryImages.slice(startIndex, endIndex);

  const getImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/uploads");

      // Flatten uploads -> images
      const flattenedImages = res.data.data.flatMap((upload: any) =>
        upload.images.map((img: any) => ({
          url: img.url,
          description: img.description,
          createdAt: upload.createdAt,
        })),
      );

      setGalleryImages(flattenedImages);
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

  const openLightbox = (index: number) => {
    const actualIndex = startIndex + index;
    setSelectedImage(actualIndex);
  };

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

  const changePage = (page: number) => {
    setCurrentPage(page);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate smart pagination (show max 7 page numbers)
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (string | number)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Keyboard navigation for lightbox
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
      <div className="min-h-screen bg-linear-to-br from-stone-50 to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Loading archive...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-stone-50 to-amber-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-900 mb-2">
            Unable to Load Gallery
          </h2>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={getImages}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-amber-50/20 to-stone-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-stone-900 via-stone-800 to-amber-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-linear(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)`,
            }}
          />
        </div>

        <section className="relative max-w-5xl mx-auto text-center py-16 md:py-24 px-6">
          <div className="inline-block mb-4 px-4 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full">
            <span className="text-xs md:text-sm font-medium tracking-wider text-amber-200">
              TERRAË · ETHEREA · DIASPORA 77
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-linear-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
            Living Archive
          </h1>

          <div className="max-w-3xl mx-auto space-y-5 text-stone-300 text-base md:text-lg leading-relaxed">
            <p className="text-amber-100 font-medium">
              An intentional convergence of earth, spirit, and movement
            </p>

            <p>
              This gallery is a living archive where{" "}
              <span className="text-amber-200 font-medium">Terraë</span>,{" "}
              <span className="text-amber-200 font-medium">Etherea</span>, and{" "}
              <span className="text-amber-200 font-medium">Diaspora 77</span>{" "}
              operate not as separate collections, but as interoperable systems.
            </p>

            <p>
              Each form, line, and symbol is designed as a functional artifact:
              grounded in ancestral intelligence, articulated through
              contemporary craft, and oriented toward future continuity.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <h3 className="text-amber-200 font-semibold mb-2">Terraë</h3>
                <p className="text-sm text-stone-300">
                  Material memory—altars, vessels, and grounded forms shaped by
                  earth, labor, and inherited knowledge.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <h3 className="text-amber-200 font-semibold mb-2">Etherea</h3>
                <p className="text-sm text-stone-300">
                  Immaterial line—spirits, luminaries, and cosmological diagrams
                  that translate breath, thought, and resonance.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <h3 className="text-amber-200 font-semibold mb-2">
                  Diaspora 77
                </h3>
                <p className="text-sm text-stone-300">
                  Movement—routes, threads, and return paths through which
                  culture travels, fractures, adapts, and remembers.
                </p>
              </div>
            </div>

            <p className="text-sm italic mt-8 text-stone-400 border-t border-white/10 pt-6">
              Nothing here is decorative by accident. Each piece is coded,
              named, and indexed to preserve meaning, resist distortion, and
              remain teachable across time.
            </p>
          </div>
        </section>
      </div>

      {/* Gallery Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-stone-500">
              Showing{" "}
              <span className="font-semibold text-stone-700">
                {startIndex + 1}-{Math.min(endIndex, galleryImages.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-stone-700">
                {galleryImages.length}
              </span>{" "}
              works
            </p>
          </div>
          <div className="text-sm text-stone-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedImages.map((image, index) => (
            <div
              key={startIndex + index}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openLightbox(index)}
            >
              <div className="relative h-72 overflow-hidden bg-stone-100">
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Image Number Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  #{startIndex + index + 1}
                </div>
              </div>

              <div className="p-4 bg-linear-to-br from-amber-50 to-stone-50">
                <p className="text-sm text-stone-700 line-clamp-2 leading-relaxed">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg border-2 border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {getPaginationRange().map((page, i) =>
              page === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-stone-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => changePage(page as number)}
                  className={`min-w-11 h-11 px-4 rounded-lg text-sm font-semibold transition-all ${
                    currentPage === page
                      ? "bg-linear-to-br from-stone-800 to-stone-900 text-white shadow-lg scale-105"
                      : "border-2 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg border-2 border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 shadow-sm border border-stone-200">
              <label className="text-sm text-stone-600 font-medium">
                Jump to page:
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    changePage(page);
                  }
                }}
                className="w-16 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-sm text-stone-500">of {totalPages}</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Lightbox */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <div className="fixed inset-0 bg-black/97 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-amber-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2.5 backdrop-blur-sm z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {selectedImage > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 md:left-8 text-white hover:text-amber-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {selectedImage < galleryImages.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 md:right-8 text-white hover:text-amber-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm z-10"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Image Container */}
          <div className="max-w-7xl w-full flex flex-col items-center">
            <div className="relative w-full flex justify-center mb-4">
              <img
                src={galleryImages[selectedImage].url}
                alt={galleryImages[selectedImage].description}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Image Info */}
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 p-5 md:p-6 rounded-xl text-white">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-amber-200">
                  Work #{selectedImage + 1}
                </h3>
                <span className="text-sm text-stone-300 whitespace-nowrap">
                  {selectedImage + 1} of {galleryImages.length}
                </span>
              </div>
              <p className="text-stone-200 leading-relaxed">
                {galleryImages[selectedImage].description}
              </p>

              {/* Keyboard shortcuts hint */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded">←</kbd>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded">→</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded">Esc</kbd>
                  Close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictureGallery;
