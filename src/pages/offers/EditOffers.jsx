import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getOffer, updateOffer } from "../../services/offersapi";

const BASE_URL = "https://api.kushalapp.com";

const EditOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    title: "",
    intro: "",
    description: "",
    sequence: "",
    offerMode: "",
    offerType: "",
    offerDisplayType: "Horizontal",
    discount: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------------- FETCH OFFER ----------------
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await getOffer(id);
        const data = res.data;

        console.log("Offer Data:", data);

        setForm({
          title: data.title || "",
          intro: data.intro || "",
          description: data.description || "",
          sequence:
            data.sequence !== undefined && data.sequence !== null
              ? String(data.sequence)
              : "",
          offerMode: data.offerMode || "",
          offerType: data.offerType || "",
          offerDisplayType: data.offerDisplayType || "Horizontal",
          discount:
            data.discount !== undefined && data.discount !== null
              ? String(data.discount)
              : "",
        });

        // Image preview fix
        if (data.offerImage) {
          setImagePreview(
            data.offerImage.startsWith("http")
              ? data.offerImage
              : `${BASE_URL}${data.offerImage}`
          );
        } else {
          setImagePreview(null);
        }
      } catch (err) {
        toast.error("Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  // ---------------- CLEAN UP ----------------
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- IMAGE HANDLER ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, JPEG, WEBP allowed");
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
    if (!form.sequence) err.sequence = "Sequence is required";
    if (!form.offerMode) err.offerMode = "Offer Mode is required";
    if (!form.offerType) err.offerType = "Offer Type is required";

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
      formData.append("title", form.title);
      formData.append("intro", form.intro);
      formData.append("description", form.description);
      formData.append("sequence", Number(form.sequence));
      formData.append("offerMode", form.offerMode);
      formData.append("offerType", form.offerType);
      formData.append("offerDisplayType", form.offerDisplayType);
      formData.append("discount", Number(form.discount));

      // Send image only if new selected
      if (imageFile) {
        formData.append("offerImage", imageFile);
      }

      await updateOffer(id, formData);

      setOpenSaveModal(false);
      toast.success("Offer updated successfully");

      setTimeout(() => {
        navigate("/offers");
      }, 1000);
    } catch (error) {
      setOpenSaveModal(false);
      toast.error(
        error?.response?.data?.message || "Failed to update offer"
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
          {[...Array(8)].map((_, i) => (
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
        <h1 className="text-3xl font-bold dark:text-white">Edit Offer</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update offer details
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
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
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
            <label className="text-sm font-semibold">Description</label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
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
            disabled={submitting}
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

export default EditOffer;
