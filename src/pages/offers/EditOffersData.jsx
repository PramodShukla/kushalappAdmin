import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

const EditOffersData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    discount: "",
    status: "Active",
    offerMode: "",
    offerType: "",
    offerDisplayType: "Horizontal",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------------- STATIC DATA ----------------
  useEffect(() => {
    const data = {
      id: id,
      title: "Festival Offer",
      discount: 25,
      status: "Active",
      offerMode: "Online",
      offerType: "Percentage",
      offerDisplayType: "Horizontal",
      offerImage:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    };

    setForm({
      title: data.title,
      discount: String(data.discount),
      status: data.status,
      offerMode: data.offerMode,
      offerType: data.offerType,
      offerDisplayType: data.offerDisplayType,
    });

    setImagePreview(data.offerImage);
  }, [id]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- IMAGE HANDLER ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------------- SAVE ----------------
  const handleSaveConfirm = () => {
    setSubmitting(true);

    setTimeout(() => {
      console.log("Updated Data:", {
        ...form,
        image: imageFile || imagePreview,
      });

      setSubmitting(false);
      setOpenSaveModal(false);
      navigate("/offers");
    }, 1000);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Edit Offer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update offer details
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <label className="text-sm font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="text-sm font-semibold">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Offer Mode */}
          <div>
            <label className="text-sm font-semibold">Offer Mode</label>
            <input
              name="offerMode"
              value={form.offerMode}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
          </div>

          {/* Offer Type */}
          <div>
            <label className="text-sm font-semibold">Offer Type</label>
            <input
              name="offerType"
              value={form.offerType}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
          </div>

          {/* Offer Display Type */}
          <div>
            <label className="text-sm font-semibold">Offer Display Type</label>
            <input
              name="offerDisplayType"
              value={form.offerDisplayType}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Offer Image</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Image
              <input hidden type="file" onChange={handleImage} />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="offer"
                className="mt-3 w-48 h-28 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/offers")}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Offer
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update Offer"
        message="Do you want to update this offer?"
        type="success"
      />
    </div>
  );
};

export default EditOffersData;