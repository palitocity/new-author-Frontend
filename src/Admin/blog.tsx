/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  FileText,
  Upload,
  X,
  Save,
  Calendar,
  Tag,
  User,
  AlignLeft,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const BlogUpload = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    author: "",
    category: "",
    tags: "",
    excerpt: "",
    content: "",
    publishDate: "",
    status: "draft",
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  console.log(showPreview);

  const token = localStorage.getItem("token");

  const categories = [
    "Ancient Civilizations",
    "Colonial Era",
    "Independence Movements",
    "Cultural Heritage",
    "Pan-Africanism",
    "Trade & Economics",
    "Art & Literature",
    "Leaders & Heroes",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const initialBlogState = {
    title: "",
    author: "",
    category: "",
    tags: "",
    excerpt: "",
    content: "",
    publishDate: "",
    status: "draft",
  };

  const handleSubmit = async (status: "draft" | "published" | "scheduled") => {
    const toastloadingId = toast.loading("Please wait...");
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", blogData.title);
      formData.append("author", blogData.author);
      formData.append("category", blogData.category);
      formData.append("excerpt", blogData.excerpt);
      formData.append("content", blogData.content);
      formData.append("status", status);

      if (blogData.publishDate) {
        formData.append("publishDate", blogData.publishDate);
      }

      // convert tags string → array on backend
      formData.append("tags", blogData.tags);

      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      const res = await axios.post("/blog", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Blog created successfully!");
      setBlogData(initialBlogState);
      setFeaturedImage(null);
      setShowPreview(false);
      console.log("Blog created:", res.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        const apiError = error.response?.data?.error;
        const fallback = error.message || "An unexpected error occurred";

        const errorMsg =
          `${apiMessage || ""}${apiError ? " - " + apiError : ""}`.trim() ||
          fallback;

        toast.error(errorMsg);
      }
    } finally {
      toast.dismiss(toastloadingId);
      setLoading(false);
    }
  };

  const BlogPreview = ({ blog, image, onClose }: any) => (
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

        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          By {blog.author} • {blog.category}
        </p>

        <p className="italic mb-4">{blog.excerpt}</p>

        <div className="whitespace-pre-wrap leading-7">{blog.content}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Create New Blog Post
        </h1>
        <p className="text-stone-600">
          Share historical knowledge with your community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleInputChange}
              placeholder="Enter an engaging title for your blog post"
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
            />
          </div>

          {/* Featured Image Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-3">
              Featured Image *
            </label>
            {!featuredImage ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-600 hover:bg-amber-50 transition group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-stone-400 group-hover:text-amber-600 mb-3" />
                  <p className="mb-2 text-sm text-stone-600 font-medium">
                    <span className="text-amber-600">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-stone-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative">
                {featuredImage && (
                  <img
                    src={URL.createObjectURL(featuredImage)}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <button
                  onClick={() => setFeaturedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Blog Content *
            </label>
            <textarea
              name="content"
              value={blogData.content}
              onChange={handleInputChange}
              placeholder="Write your blog content here. Share historical insights, stories, and knowledge..."
              rows={12}
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
            />
            <div className="mt-2 flex items-center justify-between text-sm text-stone-500">
              <span>{blogData.content.length} characters</span>
              <span>Recommended: 800-2000 characters</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Excerpt (Summary)
            </label>
            <textarea
              name="excerpt"
              value={blogData.excerpt}
              onChange={handleInputChange}
              placeholder="Write a brief summary that will appear in blog listings..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
            />
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
                value={blogData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Publish Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2  items-center gap-2">
                <Calendar className="w-4 h-4" />
                Publish Date
              </label>
              <input
                type="datetime-local"
                name="publishDate"
                value={blogData.publishDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                disabled={loading}
                className="w-full px-4 py-2 bg-stone-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save as Draft"}
              </button>

              <button
                onClick={() => setShowPreview(true)}
                className="w-full px-4 py-2 border-2 border-amber-600 text-amber-600"
              >
                Preview
              </button>

              <button
                disabled={loading}
                onClick={() => handleSubmit("published")}
                className="w-full px-4 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium"
              >
                {loading ? "Publishing..." : "Publish Now"}
              </button>
            </div>
          </div>

          {/* Blog Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Blog Details
            </h3>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2 items-center gap-2">
                <User className="w-4 h-4" />
                Author
              </label>
              <input
                type="text"
                name="author"
                value={blogData.author}
                onChange={handleInputChange}
                placeholder="Author name"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2 items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                Category
              </label>
              <select
                name="category"
                value={blogData.category}
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2  items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={blogData.tags}
                onChange={handleInputChange}
                placeholder="history, africa, culture (comma separated)"
                className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
              />
              <p className="text-xs text-stone-500 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-linear-to-br from-amber-100 to-orange-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-3">
              Writing Tips
            </h3>
            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Use engaging headlines that capture attention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Include relevant historical images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Cite your sources for credibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Break content into digestible sections</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showPreview && (
        <BlogPreview
          blog={blogData}
          image={featuredImage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default BlogUpload;
