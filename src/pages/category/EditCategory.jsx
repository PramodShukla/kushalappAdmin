import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { getCategory, updateCategory } from "../../services/categoryApi";

const EditCategory = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [providers, setProviders] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategory(id);
        const data = response.data; 

        setTitle(data.title || "");
        setProviders(data.providers || "");
        setSubCategory(data.subCategory || "");
        setStatus(data.status || "Active");
        setPreview(data.image || null);
      } catch (err) {
        console.error("Failed to fetch category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Only PNG, JPG, JPEG allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  // Handle save
  const handleSave = async () => {
    if (!title || !providers || !subCategory) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("providers", providers);
    formData.append("subCategory", subCategory);
    formData.append("status", status);
    if (imageFile) formData.append("image", imageFile);

    try {
      await updateCategory(id, formData);
      alert("Category updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update category.");
    }
  };

  // Skeleton while loading
  if (loading) {
    return (
      <div className="p-8 mt-35 mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-28 md:col-span-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Category
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update your category details
        </p>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl p-6  mx-auto">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50/70 dark:bg-slate-800/70 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
            />
          </div>

          {/* Providers */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Providers
            </label>
            <input
              type="text"
              value={providers}
              onChange={(e) => setProviders(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50/70 dark:bg-slate-800/70 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
            />
          </div>

          {/* SubCategory */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              SubCategory
            </label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50/70 dark:bg-slate-800/70 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50/70 dark:bg-slate-800/70 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Category Image
            </label>

            <label className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer bg-gray-50/50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:bg-gray-100/70 dark:hover:bg-slate-700/70 transition">
              <Upload size={20} className="text-gray-700 dark:text-white" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Upload image
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                hidden
                onChange={handleImage}
              />
            </label>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: PNG, JPG, JPEG. Max size: 2MB.
            </p>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 w-28 h-28 rounded-2xl object-cover ring-2 ring-blue-400"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-gray-200/70 dark:bg-slate-700/70 text-gray-700 dark:text-white hover:bg-gray-300/70 dark:hover:bg-slate-600/70 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Update Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
