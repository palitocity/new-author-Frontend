import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const PictureGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
      caption: "Ancient Egyptian Pyramids",
      description:
        "The magnificent pyramids of Giza stand as testament to ancient African engineering",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800",
      caption: "Great Zimbabwe Ruins",
      description:
        "Medieval stone city that was the capital of the Kingdom of Zimbabwe",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      caption: "African Tribal Art",
      description:
        "Traditional masks and sculptures representing rich cultural heritage",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
      caption: "Timbuktu Manuscripts",
      description:
        "Ancient manuscripts from the scholarly center of West Africa",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
      caption: "Kingdom of Kush",
      description: "Nubian pyramids in Sudan, rivals to ancient Egypt",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800",
      caption: "Rock-Hewn Churches",
      description: "The ancient churches of Lalibela carved from solid rock",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
      caption: "Benin Bronzes",
      description: "Intricate bronze sculptures from the Kingdom of Benin",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      caption: "Ashanti Gold Weights",
      description: "Traditional gold weights used in the Ashanti Kingdom",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      caption: "Swahili Coast",
      description: "Historic trading cities along the East African coastline",
    },
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          SankofaSeek Gallery
        </h1>
        <p className="text-lg text-stone-600 max-w-3xl mx-auto">
          Explore the rich visual history of Africa through these stunning
          photographs and artifacts that tell the story of our ancestors
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {/* Image Container */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <ZoomIn className="w-6 h-6" />
                    <span className="font-semibold">View</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50">
                <h3 className="text-lg font-bold text-stone-800 mb-2">
                  {image.caption}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {selectedImage > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {selectedImage < galleryImages.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image and Caption Container */}
          <div className="max-w-6xl w-full mx-4">
            {/* Image */}
            <div className="relative mb-6">
              <img
                src={galleryImages[selectedImage].url}
                alt={galleryImages[selectedImage].caption}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Caption */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {galleryImages[selectedImage].caption}
              </h2>
              <p className="text-white/80">
                {galleryImages[selectedImage].description}
              </p>
              <p className="text-white/60 text-sm mt-4">
                {selectedImage + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-linear-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">
          Discover More Stories
        </h2>
        <p className="text-amber-100 mb-6 text-lg">
          Dive deeper into African history with our curated collection of
          stories, articles, and educational content
        </p>
        <button className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-stone-50 transition-all transform hover:scale-105">
          Explore Our Collection
        </button>
      </div>
    </div>
  );
};

export default PictureGallery;
