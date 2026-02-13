import React, { useState, useEffect } from "react";
import { Upload, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import { createUser } from "../../services/userapi";

const AddUser = () => {
  const navigate = useNavigate();

  // -------- FORM STATE --------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    role: "user",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // -------- IMAGE HANDLER --------
  const validateImage = (file) => {
    if (!file) return false;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG, JPG, JPEG allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return false;
    }

    return true;
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (!validateImage(file)) return;

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // -------- INPUT HANDLER --------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // -------- VALIDATION --------
  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name required";
    if (!form.email) err.email = "Email required";
    if (!form.phone) err.phone = "Phone required";
    if (!form.gender) err.gender = "Gender required";

    // Email format
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    // Phone length
    if (form.phone && form.phone.length < 10)
      err.phone = "Invalid phone";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------- SAVE HANDLER --------
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (profileFile) formData.append("profilePic", profileFile);

      await createUser(formData);

      toast.success("User added successfully");
      setOpenSaveModal(false);

      setTimeout(() => navigate("/users"), 800);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add user");
      setOpenSaveModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Add User</h1>
        <p className="text-sm text-gray-500">Create a new user</p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* PROFILE IMAGE */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer">
              <Upload size={18} /> Upload Image
              <input hidden type="file" onChange={handleProfile} />
            </label>
            {profilePreview && (
              <img
                src={profilePreview}
                alt="profile"
                className="mt-3 w-32 h-32 object-cover rounded-full"
              />
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => navigate("/users")}
            className="px-5 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => setOpenSaveModal(true)}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save User
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save User"
        message="Do you want to save this user?"
        type="success"
        icon={<Save className="w-10 h-10 text-green-500" />}
      />
    </div>
  );
};

export default AddUser;
