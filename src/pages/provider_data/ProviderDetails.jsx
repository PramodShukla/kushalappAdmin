import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { getProvider } from "../../services/providerapi";

const BASE_URL = "https://api.kushalapp.com";

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await getProvider(id);
        const data = res?.data?.data || res?.data;
        setProvider(data);
      } catch (error) {
        toast.error("Failed to load provider details");
        navigate("/providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id, navigate]);

  /* ---------------- SKELETON ---------------- */
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(10)].map((_, i) => (
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

  if (!provider) return null;

  const status = provider.isActive ? "Active" : "Inactive";
  const profilePicUrl = provider.profilePic
    ? `${BASE_URL}${provider.profilePic}`
    : null;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Provider Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View provider information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/providers")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() => navigate(`/edit-provider/${id}`)}
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
            {[
              { label: "Name", value: provider.name },
              { label: "Email", value: provider.email },
              { label: "Phone", value: provider.phone },
              { label: "WhatsApp", value: provider.whatsapp },
              { label: "Gender", value: provider.gender },
              { label: "Experience (Years)", value: provider.experience },
              { label: "Address", value: provider.address },
              { label: "Area", value: provider.area },
              { label: "City", value: provider.city },
              { label: "State", value: provider.state },
              { label: "Pincode", value: provider.pincode },
              { label: "Aadhar No", value: provider.adharNo },
              { label: "PAN No", value: provider.panNo },
              { label: "Description", value: provider.description },
            ].map((field, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4 items-start">
                <div className="text-sm font-semibold text-gray-500">
                  {field.label}
                </div>
                <div className="col-span-2 dark:text-white whitespace-pre-line">
                  {field.value || "-"}
                </div>
              </div>
            ))}

            {/* Status */}
            <div className="grid grid-cols-3 gap-4 p-4 items-center">
              <div className="text-sm font-semibold text-gray-500">Status</div>
              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Profile Pic */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-sm font-semibold text-gray-500 mb-3">
                Profile Picture
              </p>
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              ) : (
                <p className="text-gray-400 text-sm">No profile picture</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
