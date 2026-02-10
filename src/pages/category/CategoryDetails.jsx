import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategory, deleteCategory } from "../../services/categoryApi";
import { Edit, Trash2, ArrowLeft } from "lucide-react";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategory(id);
        setCategory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        alert("Category deleted successfully!");
        navigate("/categories");
      } catch (err) {
        console.error(err);
        alert("Failed to delete category.");
      }
    }
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="p-8 mt-25 l mx-auto animate-pulse flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-56 h-56 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 space-y-4 py-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return <p className="p-8 text-center text-red-500">Category not found!</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      {/* HEADER */}
      <div className="mb-6 flex justify-between gap-3 flex-col">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-2">
          Category Details
        </h1>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row gap-8 p-8">
        {/* LEFT: IMAGE */}
        <div className="flex-shrink-0 flex justify-center md:justify-start items-start">
          {category.image ? (
            <img
              src={category.image}
              alt={category.title}
              className="w-56 h-56 rounded-2xl object-cover ring-2 ring-blue-400"
            />
          ) : (
            <div className="w-56 h-56 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Title */}
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Title</span>
              <p className="text-gray-900 dark:text-white text-lg font-semibold">{category.title}</p>
            </div>

            {/* Providers */}
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Providers</span>
              <p className="text-gray-900 dark:text-white">{category.providers}</p>
            </div>

            {/* SubCategory */}
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 font-medium">SubCategory</span>
              <p className="text-gray-900 dark:text-white">{category.subCategory}</p>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
              <span
                className={`mt-1 px-3 py-1 rounded-full font-semibold w-fit ${
                  category.status === "Active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {category.status}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-6 md:mt-auto">
            <button
              onClick={() => navigate(`/edit-category/${id}`)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
