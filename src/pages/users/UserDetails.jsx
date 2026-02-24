import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getUserById } from "../../services/userapi";

const BASE_URL = "https://api.kushalapp.com";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        const data = res?.data?.data || res?.data;

        // Ensure profilePic URL uses BASE_URL if relative
        if (data?.profilePic && !data.profilePic.startsWith("http")) {
          data.profilePic = `${BASE_URL}${data.profilePic}`;
        }

        setUser(data);
      } catch (error) {
        toast.error("Failed to load user details");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleDeleteClick = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Delete user:", userId);
      toast.success("User deleted (mock)");
      navigate("/users");
    }
  };

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 space-y-4">
            <div className="w-36 h-36 bg-gray-300 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const profilePicUrl = user.profilePic || "/images/default-user.png";

  const subscriptionStatus = user.subscription?.isActive
    ? "Active"
    : "Inactive";

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
        <button
          onClick={() => navigate("/users")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center gap-2 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-10 border-b mb-8">
        {["profile", "subscription", "analytics", "review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center space-y-6">

            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                onError={(e) => (e.target.src = "/images/default-user.png")}
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-md">
                {user.name?.charAt(0)}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <StatusBadge
                text={user.profileCompleted ? "Completed" : "Incomplete"}
                type={user.profileCompleted ? "success" : "danger"}
              />
              <StatusBadge
                text={subscriptionStatus}
                type={subscriptionStatus === "Active" ? "info" : "neutral"}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4 border-t w-full justify-center">
              <button
                onClick={() => navigate(`/edit-user/${user._id || id}`)}
                className="w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition"
              >
                <Edit size={18} className="text-yellow-600" />
              </button>
              <button
                onClick={() => handleDeleteClick(user._id || id)}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold mb-6">Profile Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Phone" value={user.phone} />
              <Info label="WhatsApp Number" value={user.wpNumber} />
              <Info label="DOB" value={user.dob ? new Date(user.dob).toLocaleDateString() : "-"} />
              <Info label="Gender" value={user.gender} />
              <Info label="Role" value={user.role} />
              <Info label="Subscription Plan" value={user.subscription?.plan || "FREE"} />
              <Info label="Subscription Status" value={subscriptionStatus} />
              <Info label="Favorites" value={user.favorites?.length || "-"} />
              <Info label="Created At" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"} />
            </div>
          </div>
        </div>
      )}

      {/* Other tabs remain the same */}
      {/* ... subscription, analytics, review tabs ... */}

    </div>
  );
};

/* ================= COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
    <p className="text-xs uppercase text-gray-500 tracking-wide">{label}</p>
    <p className="text-sm font-semibold mt-1">{value || "-"}</p>
  </div>
);

const StatusBadge = ({ text, type }) => {
  const styles = {
    success: "bg-green-100 text-green-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
    neutral: "bg-gray-200 text-gray-600",
  };

  return (
    <span className={`px-4 py-1 text-xs font-semibold rounded-full ${styles[type]}`}>
      {text}
    </span>
  );
};

export default UserDetails;