import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { getCategory } from "../../services/categoryApi";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH CATEGORY ----------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategory(id);
        const data = res.data;

        console.log("Category Data:", data);

        setCategory(data);
      } catch (error) {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ---------------- HELPER: FULL IMAGE URL ----------------
  const getImageUrl = (url) => {
    // Simply return URL if it exists, else null
    return url || null;
  };

  // ---------------- SKELETON ----------------
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-300 rounded-xl"></div>
            <div className="h-24 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) return null;

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Category Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View category information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/categories")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => navigate(`/edit-category/${id}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow"
          >
            <Edit size={18} />
            Edit
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: Details */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-800 rounded-2xl space-y-4 divide-y">

            {/* Name */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Name</div>
              <div className="col-span-2 dark:text-white">
                {category.name || "-"}
              </div>
            </div>

            {/* Sequence */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Sequence</div>
              <div className="col-span-2 dark:text-white">
                {category.sequence ?? "-"}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Status</div>
              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (category.status || "Active").toLowerCase() === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.status || "Active"}
                </span>
              </div>
            </div>

            {/* Intro */}
            <div className="grid grid-cols-3 gap-4 p-4 items-start">
              <div className="text-sm font-semibold text-gray-500">Intro</div>
              <div className="col-span-2 dark:text-white whitespace-pre-line">
                {category.intro || "-"}
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-3 gap-4 p-4 items-start">
              <div className="text-sm font-semibold text-gray-500">
                Description
              </div>
              <div className="col-span-2 dark:text-white whitespace-pre-line">
                {category.description || "-"}
              </div>
            </div>

          </div>

          {/* RIGHT: Images */}
          <div className="space-y-6">

            {/* Banner */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-3">
                Banner Image
              </p>
              {getImageUrl(category.banner) ? (
                <img
                  src={getImageUrl(category.banner)}
                  alt="banner"
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <p className="text-gray-400 text-sm">No banner</p>
              )}
            </div>

            {/* Icon */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-sm font-semibold text-gray-500 mb-3">
                Icon Image
              </p>
              {getImageUrl(category.icon) ? (
                <img
                  src={getImageUrl(category.icon)}
                  alt="icon"
                  className="w-24 h-24 object-cover rounded-xl mx-auto"
                />
              ) : (
                <p className="text-gray-400 text-sm">No icon</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;