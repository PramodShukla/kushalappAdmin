import React, { useState } from "react";
import { Save, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

const AddNotification = () => {
  const [form, setForm] = useState({
    sequence: "",
    image: null,
    title: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ---------------- HANDLE IMAGE ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    let err = {};
    if (!form.sequence) err.sequence = "Sequence is required";
    if (!form.image) err.image = "Image is required";
    if (!form.title) err.title = "Title is required";
    if (!form.description) err.description = "Description is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- SAVE ---------------- */
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification added successfully");
      setOpenSaveModal(false);

      setForm({
        sequence: "",
        image: null,
        title: "",
        description: "",
      });
      setPreview(null);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Add Notification
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Create a new app notification
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* Sequence */}
          <div>
            <label className="text-sm font-semibold">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              name="sequence"
              type="number"
              value={form.sequence}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.sequence && (
              <p className="text-red-500 text-sm">{errors.sequence}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-semibold">
              Image <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center justify-center mt-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-800">
              <Upload size={18} className="mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-20 rounded-lg object-cover"
              />
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Notification
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Notification"
        message="Do you want to save this notification?"
        type="success"
      />
    </div>
  );
};

export default AddNotification;