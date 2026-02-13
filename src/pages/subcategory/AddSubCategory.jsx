import React, { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import { createSubCategory } from "../../services/subcategoryapi";
import { getCategories } from "../../services/categoryApi";

const AddSubCategory = () => {
  const navigate = useNavigate();

  // -------- FORM STATE --------
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState("");

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // -------- LOAD CATEGORIES --------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : res.data;
        setCategories(list || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // -------- IMAGE VALIDATION --------
  const validateImage = (file) => {
    if (!file) return false;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG, JPG or JPEG allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
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

  // -------- VALIDATION --------
  const validate = () => {
    let err = {};

    if (!category) err.category = "Category is required";
    if (!name) err.name = "Name is required";
    if (!intro) err.intro = "Intro is required";
    if (!description) err.description = "Description is required";
    if (!sequence) err.sequence = "Sequence is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------- SAVE --------
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("intro", intro);
      formData.append("description", description);
      formData.append("sequence", Number(sequence));

      if (bannerFile) formData.append("banner", bannerFile);
      if (iconFile) formData.append("icon", iconFile);

      await createSubCategory(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenSaveModal(false);

      toast.success("SubCategory added successfully");

      setTimeout(() => {
        navigate("/sub-categories");
      }, 800);
    } catch (error) {
      setOpenSaveModal(false);

      console.error("Create error:", error.response);

      toast.error(
        error?.response?.data?.message ||
        "Failed to create SubCategory"
      );
    } finally {
      setSubmitting(false);
    }
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

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors({ ...errors, category: "" });
              }}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* SEQUENCE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sequence <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={sequence}
              onChange={(e) => {
                setSequence(e.target.value);
                setErrors({ ...errors, sequence: "" });
              }}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.sequence && (
              <p className="text-red-500 text-sm">{errors.sequence}</p>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* INTRO */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Intro <span className="text-red-500">*</span>
            </label>
            <input
              value={intro}
              onChange={(e) => {
                setIntro(e.target.value);
                setErrors({ ...errors, intro: "" });
              }}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.intro && (
              <p className="text-red-500 text-sm">{errors.intro}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* BANNER */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Banner Image
            </label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} /> Upload banner
              <input hidden type="file" onChange={handleBanner} />
            </label>
            {bannerPreview && (
              <img
                src={bannerPreview}
                className="mt-3 w-40 h-24 rounded-lg object-cover"
                alt="banner"
              />
            )}
          </div>

          {/* ICON */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Icon Image
            </label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} /> Upload icon
              <input hidden type="file" onChange={handleIcon} />
            </label>
            {iconPreview && (
              <img
                src={iconPreview}
                className="mt-3 w-20 h-20 rounded-lg object-cover"
                alt="icon"
              />
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => navigate("/sub-categories")}
            className="px-5 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => setOpenSaveModal(true)}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
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
