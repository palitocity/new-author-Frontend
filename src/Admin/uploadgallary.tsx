/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  Trash2,
  Eye,
  Plus,
  Save,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

const UploadGallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [description, setdescription] = useState<string[]>(["", "", ""]);
  const [viewImage, setViewImage] = useState<any>(null);
  const [deleteImage, setDeleteImage] = useState<any>(null);

  const token = localStorage.getItem("token");

  // Fetch all images
  const getAllImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data.data || []);
      toast.success("Images loaded successfully");
    } catch (error: any) {
      console.error(
        "Error fetching images:",
        error.response?.data || error.message
      );
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length < 2 || files.length > 3) {
      toast.error("Please select 2-3 images");
      return;
    }

    setSelectedImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Initialize description array
    setdescription(Array(files.length).fill(""));
  };

  // Handle description change
  const handleDescriptionChange = (index: number, value: string) => {
    const newdescription = [...description];
    newdescription[index] = value;
    setdescription(newdescription);
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newdescription = description.filter((_, i) => i !== index);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    setdescription(newdescription);
  };

  // Upload images
  const uploadImages = async () => {
    if (selectedImages.length < 2 || selectedImages.length > 3) {
      toast.error("Please select 2-3 images");
      return;
    }

    // Check if all description are filled
    const hasEmptyDescription = description.some(
      (desc, index) => index < selectedImages.length && !desc.trim()
    );

    if (hasEmptyDescription) {
      toast.error("Please add description for all images");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("description0", JSON.stringify(description));

    try {
      await axios.post("/uploads", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Images uploaded successfully");

      // Reset form
      setSelectedImages([]);
      setImagePreviews([]);
      setdescription(["", "", ""]);

      // Refresh images
      getAllImages();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const confirmDeleteImage = async () => {
    try {
      await axios.delete(`/uploads/${deleteImage._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Image deleted successfully");
      setImages(images.filter((img) => img._id !== deleteImage._id));
      setDeleteImage(null);
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Gallery Management
        </h1>
        <p className="text-stone-600">Upload and manage gallery images</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Total Images</p>
            <ImageIcon className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">{images.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Selected</p>
            <Plus className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {selectedImages.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Status</p>
            <Upload className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-lg font-bold text-stone-800">
            {uploading ? "Uploading..." : "Ready"}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-amber-600" />
          Upload New Images (2-3 images)
        </h2>

        {selectedImages.length === 0 ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-600 hover:bg-amber-50 transition group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-stone-400 group-hover:text-amber-600 mb-3" />
              <p className="mb-2 text-sm text-stone-600 font-medium">
                <span className="text-amber-600">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-stone-500">
                Select 2-3 images (PNG, JPG up to 10MB each)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          <div className="space-y-6">
            {/* Image Previews with description */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeSelectedImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={description[index]}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      placeholder="Enter image description..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedImages([]);
                  setImagePreviews([]);
                  setdescription(["", "", ""]);
                }}
                className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={uploadImages}
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-orange-600" />
          Gallery Images
        </h2>

        {loading && <p className="text-stone-600">Loading images...</p>}

        {!loading && images.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600">No images uploaded yet</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image.url || image.imageUrl}
                    alt={image.description}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => setViewImage(image)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition"
                    >
                      <Eye className="w-5 h-5 text-amber-600" />
                    </button>
                    <button
                      onClick={() => setDeleteImage(image)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-stone-50">
                  <p className="text-sm text-stone-700 line-clamp-2">
                    {image.description || "No description"}
                  </p>
                  <p className="text-xs text-stone-500 mt-2">
                    {new Date(
                      image.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Image Modal */}
      {viewImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="relative mb-4">
              <button
                onClick={() => setViewImage(null)}
                className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={viewImage.url || viewImage.imageUrl}
                alt={viewImage.description}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">Description</h3>
              <p className="text-white/80">{viewImage.description}</p>
              <p className="text-white/60 text-sm mt-4">
                Uploaded on{" "}
                {new Date(
                  viewImage.createdAt || Date.now()
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Delete Image?
              </h3>
              <p className="text-stone-600">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteImage(null)}
                className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteImage}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadGallery;
