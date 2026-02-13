import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { createProvider } from "../../services/providerapi";

const AddProvider = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    name: "",
    intro: "",
    labelText: "",
    email: "",
    phone: "",
    whatsapp: "",
    gender: "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    adharNo: "",
    panNo: "",
    experience: "",
    description: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  // ---------------- LOADING ----------------
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- IMAGE ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG/JPG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name required";
    if (!form.phone) err.phone = "Phone required";
    if (!form.email) err.email = "Email required";
    if (!form.gender) err.gender = "Gender required";
    if (!form.city) err.city = "City required";
    if (!form.state) err.state = "State required";
    if (!form.pincode) err.pincode = "Pincode required";
    if (!form.experience) err.experience = "Experience required";

    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    if (form.phone && form.phone.replace(/\D/g, "").length < 10)
      err.phone = "Invalid phone";

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
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (profileFile) formData.append("profilePic", profileFile);

      await createProvider(formData);

      setOpenSaveModal(false);
      toast.success("Provider added successfully");
      navigate("/providers");
    } catch (error) {
      setOpenSaveModal(false);

      // Handle duplicate key (MongoDB)
      if (error?.response?.data?.message?.includes("duplicate key")) {
        const field = error.response.data.message.match(/index: (.*?) dup key/)[1];
        toast.error(`${field} already exists`);
      } else {
        toast.error(error?.response?.data?.message || "Failed to add provider");
      }
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
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Add Provider</h1>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Inputs */}
          <Input label="Name *" name="name" form={form} handleChange={handleChange} error={errors.name} />
          <Input label="Intro" name="intro" form={form} handleChange={handleChange} />
          <Input label="Label Text" name="labelText" form={form} handleChange={handleChange} />
          <Input label="Email *" name="email" form={form} handleChange={handleChange} error={errors.email} />
          <Input label="Phone *" name="phone" form={form} handleChange={handleChange} error={errors.phone} />
          <Input label="WhatsApp" name="whatsapp" form={form} handleChange={handleChange} />

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold">Gender *</label>
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
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          {/* Address */}
          <Input label="Address" name="address" form={form} handleChange={handleChange} />
          <Input label="Area" name="area" form={form} handleChange={handleChange} />
          <Input label="City *" name="city" form={form} handleChange={handleChange} error={errors.city} />
          <Input label="State *" name="state" form={form} handleChange={handleChange} error={errors.state} />
          <Input label="Pincode *" name="pincode" form={form} handleChange={handleChange} error={errors.pincode} />
          <Input label="Latitude" name="latitude" form={form} handleChange={handleChange} />
          <Input label="Longitude" name="longitude" form={form} handleChange={handleChange} />
          <Input label="Aadhar No" name="adharNo" form={form} handleChange={handleChange} />
          <Input label="PAN No" name="panNo" form={form} handleChange={handleChange} />
          <Input label="Experience (Years) *" name="experience" form={form} handleChange={handleChange} error={errors.experience} />

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border"
            />
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
                className="mt-3 w-32 h-32 object-cover rounded-full"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={() => navigate("/providers")} className="px-6 py-3 rounded-xl bg-gray-200">
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Provider
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Provider"
        message="Do you want to save this provider?"
        type="success"
      />
    </div>
  );
};

// ---------------- Reusable Input ----------------
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

export default AddProvider;
