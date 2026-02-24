import React, { useState, useEffect } from "react";
import { Save, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

const EditSubscriber = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "",
    expiry: "",
    status: "Active",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- FETCH SUBSCRIBER ----------------
  useEffect(() => {
    // Dummy data for now
    const dummyData = {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      plan: "Premium",
      expiry: "2026-03-12",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    };

    setForm({
      name: dummyData.name,
      email: dummyData.email,
      plan: dummyData.plan,
      expiry: dummyData.expiry,
      status: dummyData.status,
    });
    setAvatarPreview(dummyData.avatar);
    setLoading(false);
  }, [id]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- IMAGE HANDLER ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, JPEG allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.email) err.email = "Email is required";
    if (!form.plan) err.plan = "Plan is required";
    if (!form.expiry) err.expiry = "Expiry is required";
    if (!form.status) err.status = "Status is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- SAVE ----------------
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);
    try {
      // For now, just log instead of API
      const payload = { ...form, avatar: avatarFile };
      console.log("Payload to save:", payload);

      toast.success("Subscriber updated successfully");
      setOpenSaveModal(false);
      setTimeout(() => navigate("/subscribers"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      setOpenSaveModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- SKELETON ----------------
  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Edit Subscriber</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update subscriber details
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-sm font-semibold">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Plan */}
          <div>
            <label className="text-sm font-semibold">
              Plan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.plan && <p className="text-red-500 text-sm">{errors.plan}</p>}
          </div>

          {/* Expiry */}
          <div>
            <label className="text-sm font-semibold">
              Expiry <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
          </div>

          {/* ---------------- Avatar LAST ---------------- */}
          <div>
            <label className="text-sm font-semibold">Avatar</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Avatar
              <input type="file" hidden onChange={handleImage} />
            </label>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="avatar"
                className="mt-3 w-24 h-24 rounded-full object-cover shadow"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/subscribers")}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Subscriber
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update Subscriber"
        message="Do you want to update this subscriber?"
        type="success"
      />
    </div>
  );
};

export default EditSubscriber;