import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getCategory, updateCategory } from "../../services/categoryApi";

const BASE_URL = "https://api.kushalapp.com"; // Change if needed

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    name: "",
    intro: "",
    description: "",
    sequence: "",
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------------- FETCH CATEGORY ----------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategory(id);

      const data = res.data.data || res.data;

        console.log("Category Data:", data);

        setForm({
          name: data.name || "",
          intro: data.intro || "",
          description: data.description || "",
          sequence:
          data.sequence !== undefined && data.sequence !== null
            ? String(data.sequence)
            : "",
        });

        // Banner preview
        if (data.banner) {
          setBannerPreview(
            data.banner.startsWith("http")
              ? data.banner
              : `${BASE_URL}${data.banner}`
          );
        }

        // Icon preview
        if (data.icon) {
          setIconPreview(
            data.icon.startsWith("http")
              ? data.icon
              : `${BASE_URL}${data.icon}`
          );
        }
      } catch (err) {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ---------------- CLEAN PREVIEW ----------------
  useEffect(() => {
    return () => {
      if (bannerPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
      if (iconPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [bannerPreview, iconPreview]);

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- IMAGE HANDLER ----------------
  const handleImage = (e, type) => {
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

    const previewUrl = URL.createObjectURL(file);

    if (type === "banner") {
      setBannerFile(file);
      setBannerPreview(previewUrl);
    } else {
      setIconFile(file);
      setIconPreview(previewUrl);
    }
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name is required";
    if (!form.intro) err.intro = "Intro is required";
    if (!form.description) err.description = "Description is required";
    if (!form.sequence) err.sequence = "Sequence is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- UPDATE ----------------
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("intro", form.intro);
      formData.append("description", form.description);
      formData.append("sequence", Number(form.sequence));

      // Only send file if user selected new one
      if (bannerFile) formData.append("banner", bannerFile);
      if (iconFile) formData.append("icon", iconFile);

      await updateCategory(id, formData);

      setOpenSaveModal(false);
      toast.success("Category updated successfully");

      setTimeout(() => {
        navigate("/categories");
      }, 1000);
    } catch (error) {
      setOpenSaveModal(false);
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Edit Category
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update category details
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
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Sequence */}
          <div>
            <label className="text-sm font-semibold">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sequence"
              value={form.sequence}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.sequence && (
              <p className="text-red-500 text-sm">{errors.sequence}</p>
            )}
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
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-semibold">Banner Image</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Banner
              <input
                hidden
                type="file"
                onChange={(e) => handleImage(e, "banner")}
              />
            </label>
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="banner"
                className="mt-3 w-48 h-28 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm font-semibold">Icon Image</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Icon
              <input
                hidden
                type="file"
                onChange={(e) => handleImage(e, "icon")}
              />
            </label>
            {iconPreview && (
              <img
                src={iconPreview}
                alt="icon"
                className="mt-3 w-20 h-20 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/categories")}
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
            Update Category
          </button>
        </div>
      </div>

      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update Category"
        message="Do you want to update this category?"
        type="success"
      />
    </div>
  );
};

export default EditCategory;
