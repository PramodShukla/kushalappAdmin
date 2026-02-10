import React, { useState, useEffect } from "react";
import { Upload, Save } from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";

const AddSlider = () => {
  /* -------- STATE -------- */
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [displayType, setDisplayType] = useState("");
  const [sequence, setSequence] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* -------- LOADING -------- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  /* -------- IMAGE -------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      alert("Only PNG/JPG/WEBP allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max size 2MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* -------- SAVE -------- */
  const handleSaveConfirm = () => {
    if (!title || !intro || !displayType || !sequence) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("intro", intro);
    formData.append("description", description);
    formData.append("displayType", displayType);
    formData.append("sequence", sequence);
    if (imageFile) formData.append("image", imageFile);

    console.log("Slider FormData:", [...formData.entries()]);

    setOpenSaveModal(false);
    alert("Slider added successfully!");
  };

  /* -------- SKELETON -------- */
  const Skeleton = () => (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 w-1/3 bg-gray-300 rounded" />
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-300 rounded" />
        ))}
      </div>
    </div>
  );

  if (loading) return <Skeleton />;

  /* -------- UI -------- */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white">
          Add Slider
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create and register a new slider
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800"
              placeholder="Enter slider title"
            />
          </div>

          {/* SEQUENCE */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sequence
            </label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800"
              placeholder="Order number"
            />
          </div>

          {/* DISPLAY TYPE */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Display Type
            </label>
            <select
              value={displayType}
              onChange={(e) => setDisplayType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800"
            >
              <option value="">Select display type</option>
              <option value="Horizontal">Horizontal</option>
              <option value="Vertical">Vertical</option>
            </select>
          </div>

          {/* INTRO */}
          <div >
            <label className="text-sm font-medium mb-2 block">
              Intro
            </label>
            <input
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800"
              placeholder="Short intro"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800"
              placeholder="Full description"
            />
          </div>

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">
              Slider Image
            </label>

            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} />
              Upload image
              <input hidden type="file" onChange={handleImage} />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-3 w-40 h-24 object-cover rounded-lg"
              />
            )}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={() => setOpenSaveModal(true)}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Slider
          </button>

        </div>

      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Slider"
        message="Do you want to save this slider?"
        type="success"
        icon={<Save className="w-10 h-10 text-green-500" />}
      />

    </div>
  );
};

export default AddSlider;
