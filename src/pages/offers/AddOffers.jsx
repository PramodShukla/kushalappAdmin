import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { createOffer } from "../../services/offersapi";

const AddOffer = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    title: "",
    intro: "",
    description: "",
    sequence: "",
    offerMode: "",
    offerType: "",
    displayType: "Horizontal",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------------- LOADING ----------------
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ---------------- CLEANUP PREVIEW ----------------
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ---------------- INPUT ----------------
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};
    if (!form.title) err.title = "Title is required";
    if (!form.intro) err.intro = "Intro is required";
    if (!form.description) err.description = "Description is required";
    if (!form.sequence) err.sequence = "Sequence is required";
    if (!form.offerMode) err.offerMode = "Offer Mode is required";
    if (!form.offerType) err.offerType = "Offer Type is required";

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
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("intro", form.intro);
      formData.append("description", form.description);
      formData.append("sequence", Number(form.sequence));
      formData.append("offerMode", form.offerMode);
      formData.append("offerType", form.offerType);
      formData.append("offerDisplayType", form.displayType);

      if (imageFile) formData.append("offerImage", imageFile);

      await createOffer(formData);

      setOpenSaveModal(false);

      toast.success("Your offer has been saved successfully");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/offers");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create offer");
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Add Offer</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Create new offer details
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Sequence */}
          <div>
            <label className="text-sm font-semibold">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="sequence"
              value={form.sequence}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.sequence && <p className="text-red-500 text-sm">{errors.sequence}</p>}
          </div>

          {/* Intro */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">
              Intro <span className="text-red-500">*</span>
            </label>
            <input
              name="intro"
              value={form.intro}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.intro && <p className="text-red-500 text-sm">{errors.intro}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Offer Mode */}
          <div>
            <label className="text-sm font-semibold">
              Offer Mode <span className="text-red-500">*</span>
            </label>
            <select
              name="offerMode"
              value={form.offerMode}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option value="">Select Mode</option>
              <option value="ShowData">ShowData</option>
            </select>
            {errors.offerMode && <p className="text-red-500 text-sm">{errors.offerMode}</p>}
          </div>

          {/* Offer Type */}
          <div>
            <label className="text-sm font-semibold">
              Offer Type <span className="text-red-500">*</span>
            </label>
            <select
              name="offerType"
              value={form.offerType}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option value="">Select Type</option>
              <option value="PROVIDER">Provider</option>
              <option value="CATEGORY">Category</option>
              <option value="SUBCATEGORY">Subcategory</option>
            </select>
            {errors.offerType && <p className="text-red-500 text-sm">{errors.offerType}</p>}
          </div>

          {/* Display Type */}
          <div>
            <label className="text-sm font-semibold">Display Type</label>
            <select
              name="displayType"
              value={form.displayType}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option value="Horizontal">Horizontal</option>
              <option value="Vertical">Vertical</option>
            </select>
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Offer Image</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Image
              <input hidden type="file" onChange={handleImage} />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
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
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Offer
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Offer"
        message="Do you want to save this offer?"
        type="success"
      />
    </div>
  );
};

export default AddOffer;
