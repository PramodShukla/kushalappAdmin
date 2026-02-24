import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

const AddonsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- SAMPLE DATA ----------------
  const addon = {
    id: id,
    sequence: 1,
    name: "Advanced Analytics",
    description:
      "Detailed dashboard with real-time reports, performance insights and downloadable analytics.",
    price: "₹1,499",
    status: "Active",
    image:
      "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Addon Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View complete addon information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/addons")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={() => navigate(`/edit-addon/${addon.id}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow"
          >
            <Edit size={18} /> Edit
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-8">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT - IMAGE */}
          <div className="flex justify-center">
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl shadow-lg">
              <img
                src={addon.image}
                alt={addon.name}
                className="w-72 h-72 object-contain"
              />
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="space-y-6">

            <div>
              <p className="text-sm text-gray-500">Sequence</p>
              <p className="text-lg font-semibold dark:text-white">
                {addon.sequence}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Addon Name</p>
              <p className="text-lg font-semibold dark:text-white">
                {addon.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700 dark:text-gray-300">
                {addon.description}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-blue-600">
                {addon.price}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  addon.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {addon.status}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddonsDetails;