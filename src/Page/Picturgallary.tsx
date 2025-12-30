/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const PictureGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

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

  const goToPrevious = () =>
    selectedImage !== null &&
    selectedImage > 0 &&
    setSelectedImage(selectedImage - 1);

  const goToNext = () =>
    selectedImage !== null &&
    selectedImage < galleryImages.length - 1 &&
    setSelectedImage(selectedImage + 1);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
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
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
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
