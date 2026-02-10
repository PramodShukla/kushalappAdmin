import React, { useState } from "react";
import { Upload, Save } from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";

const AddSubCategory = () => {

  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState("");

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------- IMAGE VALIDATION ----------
  const validateImage = (file) => {
    if (!file) return false;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Only PNG/JPG allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max size 2MB");
      return false;
    }

    return true;
  };

  const handleBanner = (e) => {
    const file = e.target.files[0];
    if (!validateImage(file)) return;

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleIcon = (e) => {
    const file = e.target.files[0];
    if (!validateImage(file)) return;

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  // ---------- SAVE ----------
  const handleSaveConfirm = () => {
    if (!name || !intro || !sequence) {
      alert("Name, Intro and Sequence are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("intro", intro);
    formData.append("description", description);
    formData.append("sequence", sequence);
    if (bannerFile) formData.append("banner", bannerFile);
    if (iconFile) formData.append("icon", iconFile);

    console.log("Submitting:", Object.fromEntries(formData));

    // 👉 call your API here

    setOpenSaveModal(false);
    alert("SubCategory saved!");
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Add SubCategory</h1>
        <p className="text-sm text-gray-500">
          Create a new subcategory
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              placeholder="Enter name"
            />
          </div>

          {/* SEQUENCE */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sequence</label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              placeholder="Order number"
            />
          </div>

          {/* INTRO */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Intro</label>
            <input
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
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
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
              placeholder="Full description"
            />
          </div>

          {/* BANNER IMAGE */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Banner Image
            </label>

            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} />
              Upload banner
              <input hidden type="file" onChange={handleBanner} />
            </label>

            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="banner"
                className="mt-3 w-40 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          {/* ICON IMAGE */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Icon Image
            </label>

            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} />
              Upload icon
              <input hidden type="file" onChange={handleIcon} />
            </label>

            {iconPreview && (
              <img
                src={iconPreview}
                alt="icon"
                className="mt-3 w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => setOpenSaveModal(true)}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save SubCategory
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save SubCategory"
        message="Do you want to save this subcategory?"
        type="success"
        icon={<Save className="w-10 h-10 text-green-500" />}
      />
    </div>
  );
};

export default AddSubCategory;
