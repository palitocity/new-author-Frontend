/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const PictureGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  const IMAGES_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(galleryImages.length / IMAGES_PER_PAGE);

  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;

  const paginatedImages = galleryImages.slice(startIndex, endIndex);

  const getImages = async () => {
    try {
      const res = await axios.get("/uploads");

      // 🔥 FLATTEN uploads -> images
      const flattenedImages = res.data.data.flatMap((upload: any) =>
        upload.images.map((img: any) => ({
          url: img.url,
          description: img.description,
          createdAt: upload.createdAt,
        }))
      );

      setGalleryImages(flattenedImages);
    } catch (error) {
      console.error(error);
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

  const changePage = (page: number) => {
    setCurrentPage(page);
    setSelectedImage(null); // 🔥 reset lightbox on page change
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <section className="max-w-4xl mx-auto text-center mb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
          Living Archive
        </h1>

        <div className="text-stone-700 text-base md:text-lg leading-relaxed space-y-4">
          <p>
            <span className="font-medium">Gallery Introduction</span>
          </p>

          <p>
            This gallery is a living archive an intentional convergence of
            earth, spirit, and movement. Within these works, Terraë, Etherea,
            and Diaspora 77 operate not as separate collections, but as
            interoperable systems.
          </p>

          <p>
            Each form, line, and symbol is designed as a functional artifact:
            grounded in ancestral intelligence, articulated through contemporary
            craft, and oriented toward future continuity.
          </p>

          <p>
            <span className="font-medium">Terraë</span> holds the material
            memory altars, vessels, and grounded forms shaped by earth, labor,
            and inherited knowledge.
            <span className="font-medium"> Etherea</span> carries the immaterial
            line spirits, luminaries, and cosmological diagrams that translate
            breath, thought, and resonance into visible order.
          </p>

          <p>
            <span className="font-medium">Diaspora 77</span> maps movement
            routes, threads, and return paths through which culture travels,
            fractures, adapts, and remembers itself.
          </p>

          <p>
            Nothing here is decorative by accident. Each piece is coded, named,
            and indexed to preserve meaning, resist distortion, and remain
            teachable across time.
          </p>

          <p>
            This gallery does not ask to be consumed quickly. It asks to be
            entered, read, and returned to. What you see is not a conclusion,
            but a framework a shared language between past wisdom and future
            possibility.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedImages.map((image, index) => {
          const actualIndex = startIndex + index;

          return (
            <div
              key={actualIndex}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => openLightbox(actualIndex)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-4 bg-amber-50">
                <p className="text-sm text-stone-700 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-4 py-2 rounded-md text-sm ${
                currentPage === i + 1
                  ? "bg-stone-900 text-white"
                  : "border text-stone-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white"
          >
            <X size={28} />
          </button>

          {selectedImage > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {selectedImage < galleryImages.length - 1 && (
            <button onClick={goToNext} className="absolute right-4 text-white">
              <ChevronRight size={32} />
            </button>
          )}

          <div className="max-w-5xl w-full p-4">
            <img
              src={galleryImages[selectedImage].url}
              alt=""
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />

            <div className="mt-4 bg-white/10 backdrop-blur p-4 rounded-lg text-white">
              {galleryImages[selectedImage].description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictureGallery;
