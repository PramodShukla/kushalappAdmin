import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getUserById, updateUser } from "../../services/userapi";

const BASE_URL = "https://api.kushalapp.com";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    wpNumber: "",
    gender: "",
    role: "user",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        const data = res?.data?.data || res?.data;

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          wpNumber: data.wpNumber || "",
          gender: data.gender || "",
          role: data.role || "user",
        });

        // Handle profile image URL
        if (data.profilePic) {
          setProfilePreview(
            data.profilePic.startsWith("http")
              ? data.profilePic
              : `${BASE_URL}${data.profilePic}`
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      toast.error("Only PNG, JPG, JPEG, WEBP allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let err = {};

    if (!form.phone) err.phone = "Phone is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= UPDATE ================= */
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fix validation errors");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (profileFile) {
        formData.append("profilePic", profileFile);
      }

      await updateUser(id, formData);

      toast.success("User updated successfully");
      setOpenSaveModal(false);

      // Update preview with BASE_URL in case server returns relative path
      if (profileFile) {
        setProfilePreview(URL.createObjectURL(profileFile));
      }

      setTimeout(() => navigate("/users"), 800);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update user"
      );
      setOpenSaveModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= LOADING ================= */
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

  /* ================= UI ================= */
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Edit User</h1>

        <button
          onClick={() => navigate("/users")}
          className="px-4 py-2 rounded-xl bg-gray-200 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}
          <Input label="Name" name="name" form={form} handleChange={handleChange} />

          {/* Email */}
          <Input label="Email" name="email" form={form} handleChange={handleChange} error={errors.email} />

          {/* Phone */}
          <Input label="Phone *" name="phone" form={form} handleChange={handleChange} error={errors.phone} />

          {/* WhatsApp */}
          <Input label="WhatsApp Number" name="wpNumber" form={form} handleChange={handleChange} />

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-semibold">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Profile Image */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Profile Picture</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Upload Image
              <input hidden type="file" onChange={handleImage} />
            </label>

            {profilePreview && (
              <img
                src={profilePreview}
                alt="preview"
                className="mt-3 w-28 h-28 object-cover rounded-full"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/users")}
            className="px-6 py-3 rounded-xl bg-gray-200"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update User"
        message="Do you want to update this user?"
        type="success"
      />
    </div>
  );
};

/* ================= INPUT COMPONENT ================= */
const Input = ({ label, name, form, handleChange, error }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input
      name={name}
      value={form[name]}
      onChange={handleChange}
      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default EditUser;