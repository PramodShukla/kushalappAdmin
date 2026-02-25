import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { getProvider } from "../../services/providerapi";

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  /* ---------------- FETCH PROVIDER ---------------- */
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await getProvider(id);
        const data = res?.data?.data || res?.data;

        // Map category info and images properly
        const providerData = {
          ...data,
          category: data.category
            ? {
                id: data.category._id,
                description: data.category.description || "-",
                icon: data.category.icon || "/images/default-category.png",
                banner: data.category.banner || "/images/default-banner.png",
              }
            : null,
          profilePic: data.profilePic || null,
        };

        setProvider(providerData);
      } catch (error) {
        toast.error("Failed to load provider details");
        navigate("/providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 w-56 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-300 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex gap-6 border-b mb-6 pb-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) return null;

  const status = provider?.isActive ? "Active" : "Inactive";

  /* ---------------- CONST DATA ---------------- */
  const subscriptions = provider.subscriptions || [
    { id: 1, plan: "Basic Plan", price: 499, startDate: "2026-01-01", endDate: "2026-02-01", status: "Expired" },
    { id: 2, plan: "Premium Plan", price: 999, startDate: "2026-02-05", endDate: "2026-03-05", status: "Active" },
  ];

  const analytics = provider.analytics || {
    totalBookings: 120,
    totalEarnings: 45000,
    completedJobs: 110,
    rating: 4.5,
  };

  const reviews = provider.reviews || [
    { id: 1, user: "Rahul", rating: 5, comment: "Excellent service!" },
    { id: 2, user: "Sneha", rating: 4, comment: "Very professional." },
  ];

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Provider Details</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate("/providers")} className="px-4 py-2 rounded-xl bg-gray-200 flex items-center gap-2">
            <ArrowLeft size={18} />
            Back
          </button>
          <button onClick={() => navigate(`/edit-provider/${id}`)} className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow">
            <Edit size={18} />
            Edit
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-6">

        {/* CATEGORY BANNER */}
        {provider.category?.banner && (
          <div className="mb-6">
            <img
              src={provider.category.banner}
              alt={provider.category.description}
              className="w-full h-40 object-cover rounded-2xl shadow-sm"
            />
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {["profile", "subscriptions", "analytics", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= PROFILE TAB ================= */}
        {activeTab === "profile" && (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT SIDE DETAILS */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">

              {/* Provider Info */}
              {[
                { label: "Name", value: provider?.name },
                { label: "Email", value: provider?.email },
                { label: "Phone", value: provider?.phone },
                { label: "WhatsApp", value: provider?.whatsapp },
                { label: "Gender", value: provider?.gender },
                { label: "Experience (Years)", value: provider?.experience },
                { label: "Address", value: provider?.address ? `${provider.address.area || ""}, ${provider.address.city || ""}, ${provider.address.state || ""} - ${provider.address.pincode || ""}` : "-" },
                { label: "Aadhar No", value: provider?.adharNo },
                { label: "PAN No", value: provider?.panNo },
              ].map((field, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500">{field.label}</p>
                  <p className="font-semibold">{field.value || "-"}</p>
                </div>
              ))}

              {/* STATUS */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* CATEGORY ICON + Description */}
              {provider.category && (
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                  <img
                    src={provider.category.icon}
                    alt={provider.category.description}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold">{provider.category.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE PROFILE IMAGE */}
            <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-3">Profile Picture</p>
              {provider.profilePic ? (
                <img
                  src={provider.profilePic}
                  alt="profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mx-auto">
                  {provider?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= OTHER TABS ================= */}
        {activeTab === "subscriptions" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Plan</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{sub.plan}</td>
                    <td className="p-3">₹{sub.price}</td>
                    <td className="p-3">{sub.startDate}</td>
                    <td className="p-3">{sub.endDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          sub.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <p>Total Bookings</p>
              <h2 className="text-2xl font-bold">{analytics.totalBookings}</h2>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <p>Total Earnings</p>
              <h2 className="text-2xl font-bold">₹{analytics.totalEarnings}</h2>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl">
              <p>Completed Jobs</p>
              <h2 className="text-2xl font-bold">{analytics.completedJobs}</h2>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <p>Rating</p>
              <h2 className="text-2xl font-bold">{analytics.rating} ⭐</h2>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">{review.user}</p>
                  <p>{review.rating} ⭐</p>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 

export default ProviderDetail;