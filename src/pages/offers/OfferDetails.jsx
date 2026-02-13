import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { getOffer } from "../../services/offersapi";

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH OFFER ----------------
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await getOffer(id);
        setOffer(res.data);
      } catch (error) {
        toast.error("Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  // ---------------- SKELETON ----------------
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 divide-y">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) return null;

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Offer Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View offer information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/offers")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => navigate(`/edit-offer/${id}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow cursor-pointer"
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

            {/* Title */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Title</div>
              <div className="col-span-2 dark:text-white">{offer.title || "-"}</div>
            </div>

            {/* Sequence */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Sequence</div>
              <div className="col-span-2 dark:text-white">{offer.sequence || "-"}</div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Status</div>
              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    offer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {offer.status || "Active"}
                </span>
              </div>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Discount</div>
              <div className="col-span-2 dark:text-white">{offer.discount || 0}%</div>
            </div>

            {/* Offer Mode */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Offer Mode</div>
              <div className="col-span-2 dark:text-white">{offer.offerMode || "-"}</div>
            </div>

            {/* Offer Type */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Offer Type</div>
              <div className="col-span-2 dark:text-white">{offer.offerType || "-"}</div>
            </div>

            {/* Display Type */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Display Type</div>
              <div className="col-span-2 dark:text-white">{offer.offerDisplayType || "-"}</div>
            </div>

            {/* Intro */}
            <div className="grid grid-cols-3 gap-4 p-4 items-start">
              <div className="text-sm font-semibold text-gray-500">Intro</div>
              <div className="col-span-2 dark:text-white whitespace-pre-line">{offer.intro || "-"}</div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-3 gap-4 p-4 items-start">
              <div className="text-sm font-semibold text-gray-500">Description</div>
              <div className="col-span-2 dark:text-white whitespace-pre-line">{offer.description || "-"}</div>
            </div>

          </div>

          {/* RIGHT: Image */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-3">Offer Image</p>
              {offer.banner ? (
                <img
                  src={offer.banner}
                  alt="offer"
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <p className="text-gray-400 text-sm">No image</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OfferDetail;
