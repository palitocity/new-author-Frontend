/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  BookOpen,
  Image,
  Upload,
  X,
  Eye,
  Save,
  Calendar,
  Tag,
  User,
  Clock,
  Mic,
  Video,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

const StoryUpload = () => {
  const [storyData, setStoryData] = useState({
    title: "",
    subtitle: "",
    author: "",
    narrator: "",
    category: "",
    tags: "",
    summary: "",
    storyText: "",
    historicalPeriod: "",
    location: "",
    readingTime: "",
    ageRating: "",
    status: "draft",
    price: 0,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [storyImages, setStoryImages] = useState<File[]>([]);

  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    "Folklore & Legends",
    "Historical Fiction",
    "Oral Traditions",
    "Biography & Memoirs",
    "Cultural Tales",
    "War & Resistance",
    "Family Stories",
    "Mythology",
  ];

  const historicalPeriods = [
    "Ancient Times (Before 500 CE)",
    "Medieval Period (500-1500 CE)",
    "Early Modern (1500-1800)",
    "Colonial Era (1800-1960)",
    "Independence Era (1960-1990)",
    "Contemporary (1990-Present)",
  ];

  const ageRatings = ["All Ages", "8+", "12+", "16+", "18+"];

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file); // directly store the File object
    }
  };

  const handleStoryImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setStoryImages((prev) => [...prev, ...files]); // store as File[]
  };

  const removeStoryImage = (index: number) => {
    setStoryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setStoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status: string) => {
    const toastLoading = toast.loading("Submitting Story...");
    try {
      const formData = new FormData();
      formData.append("title", storyData.title);
      formData.append("subtitle", storyData.subtitle);
      formData.append("summary", storyData.summary);
      formData.append("content", storyData.storyText);
      formData.append("author", storyData.author);
      formData.append("narrator", storyData.narrator);
      formData.append("category", storyData.category);
      formData.append("tags", storyData.tags);
      formData.append("historicalPeriod", storyData.historicalPeriod);
      formData.append("location", storyData.location);
      formData.append("readingTime", storyData.readingTime);
      formData.append("ageRating", storyData.ageRating);
      formData.append("status", status);
      formData.append("price", storyData.price.toString());

      if (coverImage) formData.append("coverImage", coverImage); // File object
      if (audioFile) formData.append("audioFile", audioFile);
      if (videoFile) formData.append("videoFile", videoFile);

      const token = localStorage.getItem("token");

      const res = await axios.post("/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Story submitted successfully!");
      console.log("Response:", res.data);

      // Optional: reset form
      setStoryData({
        title: "",
        subtitle: "",
        author: "",
        narrator: "",
        category: "",
        tags: "",
        summary: "",
        storyText: "",
        historicalPeriod: "",
        location: "",
        readingTime: "",
        ageRating: "",
        status: "draft",
        price: 0,
      });
      setCoverImage(null);
      setAudioFile(null);
      setVideoFile(null);
      setStoryImages([]);
    } catch (error: any) {
      console.error("Error submitting story:", error);
      toast.error(error.response?.data?.message || "Failed to submit story");
    } finally {
      toast.dismiss(toastLoading);
    }
  };

  const StoryPreview = ({ story, image, onClose }: any) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white max-w-3xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="text-red-500 mb-4">
          Close Preview
        </button>

        {image && (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          By {story.author} • {story.category}
        </p>

        <p className="italic mb-4">{story.excerpt}</p>

        <div className="whitespace-pre-wrap leading-7">{story.content}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Upload New Story
        </h1>
        <p className="text-stone-600">
          Share captivating historical narratives and cultural tales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={storyData.title}
              onChange={handleInputChange}
              placeholder="Enter a captivating title for your story"
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
            />
          </div>
          {/* Subtitle */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              name="subtitle"
              value={storyData.subtitle}
              onChange={handleInputChange}
              placeholder="A short line that captures the story essence"
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              Cover Image *
            </label>
            {!coverImage ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-600 hover:bg-amber-50 transition group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-stone-400 group-hover:text-amber-600 mb-3" />
                  <p className="mb-2 text-sm text-stone-600 font-medium">
                    <span className="text-amber-600">Click to upload</span>{" "}
                    cover image
                  </p>
                  <p className="text-xs text-stone-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                />
              </label>
            ) : (
              <div className="relative">
                {coverImage && (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <button
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Story Text */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Story Content *
            </label>
            <textarea
              name="storyText"
              value={storyData.storyText}
              onChange={handleInputChange}
              placeholder="Write your story here. Transport readers through time and culture..."
              rows={16}
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
            />
            <div className="mt-2 flex items-center justify-between text-sm text-stone-500">
              <span>{storyData.storyText.length} characters</span>
              <span>Recommended: 1500-5000 characters</span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Story Summary *
            </label>
            <textarea
              name="summary"
              value={storyData.summary}
              onChange={handleInputChange}
              placeholder="Write a brief summary that will entice readers..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
            />
          </div>

          {/* Story Images Gallery */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              Story Images (Optional)
            </label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {storyImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Story ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeStoryImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-600 hover:bg-amber-50 transition">
              <Image className="w-5 h-5 text-stone-400 mr-2" />
              <span className="text-sm text-stone-600">
                Add images to your story
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleStoryImagesUpload}
              />
            </label>
          </div>

          {/* Audio Narration */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-3  items-center gap-2">
              <Mic className="w-4 h-4" />
              Audio Narration (Optional)
            </label>
            {!audioFile ? (
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-orange-600 hover:bg-orange-50 transition">
                <div className="text-center">
                  <Mic className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-600">
                    Upload audio narration
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    MP3, WAV up to 50MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-stone-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-stone-700 font-medium">
                    {audioFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setAudioFile(null)}
                  className="p-2 hover:bg-stone-200 rounded-full transition"
                >
                  <X className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            )}
          </div>

          {/* Video Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-3  items-center gap-2">
              <Video className="w-4 h-4" />
              Video Content (Optional)
            </label>
            {!videoFile ? (
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-orange-600 hover:bg-orange-50 transition">
                <div className="text-center">
                  <Video className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-600">Upload related video</p>
                  <p className="text-xs text-stone-500 mt-1">
                    MP4, MOV up to 100MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-stone-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-stone-700 font-medium">
                    {videoFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setVideoFile(null)}
                  className="p-2 hover:bg-stone-200 rounded-full transition"
                >
                  <X className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Save className="w-5 h-5 text-amber-600" />
              Publish Options
            </h3>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={storyData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
              >
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleSubmit("draft")}
                className="w-full px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition font-medium"
              >
                Save as Draft
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="w-full px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition font-medium flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Story
              </button>
              <button
                onClick={() => handleSubmit("published")}
                className="w-full px-4 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium"
              >
                Publish Story
              </button>
            </div>
          </div>

          {/* Story Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              Story Details
            </h3>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Price (₦)
              </label>
              <input
                type="number"
                name="price"
                value={storyData.price}
                onChange={handleInputChange}
                placeholder="0 means free"
                min={0}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
              <p className="text-xs text-stone-500 mt-1">
                Set 0 to allow free download
              </p>
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className=" text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={storyData.author}
                onChange={handleInputChange}
                placeholder="Story author"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
            </div>

            {/* Narrator */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Narrator (if different)
              </label>
              <input
                type="text"
                name="narrator"
                value={storyData.narrator}
                onChange={handleInputChange}
                placeholder="Voice narrator"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={storyData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              >
                <option value="">Select category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Historical Period */}
            <div className="mb-4">
              <label className=" text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Historical Period
              </label>
              <select
                name="historicalPeriod"
                value={storyData.historicalPeriod}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              >
                <option value="">Select period</option>
                {historicalPeriods.map((period, idx) => (
                  <option key={idx} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Location/Region
              </label>
              <input
                type="text"
                name="location"
                value={storyData.location}
                onChange={handleInputChange}
                placeholder="e.g., West Africa, Egypt"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
            </div>

            {/* Reading Time */}
            <div className="mb-4">
              <label className=" text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reading Time
              </label>
              <input
                type="text"
                name="readingTime"
                value={storyData.readingTime}
                onChange={handleInputChange}
                placeholder="e.g., 10 minutes"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
            </div>

            {/* Age Rating */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Age Rating
              </label>
              <select
                name="ageRating"
                value={storyData.ageRating}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              >
                <option value="">Select age rating</option>
                {ageRatings.map((rating, idx) => (
                  <option key={idx} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className=" text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={storyData.tags}
                onChange={handleInputChange}
                placeholder="folklore, legend, tradition"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
              <p className="text-xs text-stone-500 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-linear-to-br from-orange-100 to-amber-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-3">
              Storytelling Tips
            </h3>
            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Begin with a captivating opening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Include vivid cultural details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Preserve authentic narratives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Credit original storytellers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showPreview && (
        <StoryPreview
          story={storyData}
          image={coverImage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default StoryUpload;
