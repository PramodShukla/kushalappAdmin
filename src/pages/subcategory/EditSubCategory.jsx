import React, { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  getSubCategory,
  updateSubCategory,
} from "../../services/subcategoryapi";

const BASE_URL = "https://api.kushalapp.com";

const EditSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState("");

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* ================= FETCH DETAILS ================= */
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getSubCategory(id);
      const data = res?.data?.data || res?.data;

      if (!data) {
        toast.error("SubCategory not found");
        navigate("/sub-categories");
        return;
      }

      setName(data.name || "");
      setIntro(data.intro || "");
      setDescription(data.description || "");
      setSequence(data.sequence || "");

      // Handle image URLs
      const bannerUrl = data.banner
        ? data.banner.startsWith("http")
          ? data.banner
          : `${BASE_URL}${data.banner}`
        : null;

      const iconUrl = data.icon
        ? data.icon.startsWith("http")
          ? data.icon
          : `${BASE_URL}${data.icon}`
        : null;

      setBannerPreview(bannerUrl);
      setIconPreview(iconUrl);
    } catch (error) {
      toast.error("Failed to load subcategory");
    } finally {
      setTimeout(() => setLoading(false), 400); // smooth skeleton
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  /* ================= IMAGE HANDLER ================= */
  const validateImage = (file) => {
    if (!file) return false;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG/JPG allowed");
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max size 2MB");
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

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!name || !intro || !sequence) {
      toast.error("Name, Intro and Sequence are required");
      return false;
    }
    return true;
  };

  /* ================= UPDATE ================= */
  const handleSaveConfirm = async () => {
    if (!validate()) {
      setOpenSaveModal(false);
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("intro", intro);
      formData.append("description", description);
      formData.append("sequence", Number(sequence));

      if (bannerFile) formData.append("banner", bannerFile);
      if (iconFile) formData.append("icon", iconFile);

      await updateSubCategory(id, formData);

      toast.success("SubCategory updated successfully");

      setTimeout(() => {
        navigate("/sub-categories");
      }, 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update SubCategory"
      );
    } finally {
      setSubmitting(false);
      setOpenSaveModal(false);
    }
  };

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div>
          <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            ))}

            <div className="md:col-span-2">
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-24 w-full bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Edit SubCategory</h1>
        <p className="text-sm text-gray-500">Update subcategory details</p>
      </div>

      {/* FORM */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* Sequence */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sequence *</label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* Intro */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Intro *</label>
            <input
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-medium mb-2 block">Banner</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} /> Upload banner
              <input hidden type="file" onChange={handleBanner} />
            </label>
            {bannerPreview && (
              <img
                src={bannerPreview}
                className="mt-3 w-40 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm font-medium mb-2 block">Icon</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} /> Upload icon
              <input hidden type="file" onChange={handleIcon} />
            </label>
            {iconPreview && (
              <img
                src={iconPreview}
                className="mt-3 w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => navigate("/sub-categories")}
            className="px-5 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update SubCategory"
        message="Are you sure you want to update this subcategory?"
        type="success"
        icon={<Save className="w-10 h-10 text-green-500" />}
      />
    </div>
  );
};

export default EditSubCategory;