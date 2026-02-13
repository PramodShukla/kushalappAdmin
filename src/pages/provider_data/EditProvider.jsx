import React, { useState, useEffect } from "react";
import { Upload, Save, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getProvider, updateProvider } from "../../services/providerapi";

const BASE_URL = "https://api.kushalapp.com";

const EditProvider = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    gender: "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    experience: "",
    description: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* ================= FETCH PROVIDER ================= */
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        console.log("Edit Provider ID:", id);

        const res = await getProvider(id);
        const p = res?.data?.data || res?.data;

        if (!p) {
          toast.error("Provider not found");
          navigate("/providers");
          return;
        }

        setForm({
          name: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
          whatsapp: p.whatsapp || "",
          gender: p.gender || "",
          address: p.address?.line || "",
          area: p.address?.area || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          pincode: p.address?.pincode || "",
          experience: p.experience || "",
          description: p.description || "",
        });

        if (p.profilePic) {
          setProfilePreview(`${BASE_URL}${p.profilePic}`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProvider();
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

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      toast.error("Only PNG/JPG/WEBP allowed");
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

    if (!form.name) err.name = "Name required";
    if (!form.phone) err.phone = "Phone required";
    if (!form.email) err.email = "Email required";
    if (!form.gender) err.gender = "Gender required";
    if (!form.city) err.city = "City required";
    if (!form.state) err.state = "State required";
    if (!form.pincode) err.pincode = "Pincode required";

    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= UPDATE ================= */
  const handleUpdateConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // Basic fields
      Object.keys(form).forEach((key) => {
        if (
          key !== "address" &&
          key !== "area" &&
          key !== "city" &&
          key !== "state" &&
          key !== "pincode"
        ) {
          formData.append(key, form[key]);
        }
      });

      // Address object (important)
      formData.append("address[line]", form.address);
      formData.append("address[area]", form.area);
      formData.append("address[city]", form.city);
      formData.append("address[state]", form.state);
      formData.append("address[pincode]", form.pincode);

      // Image
      if (profileFile) {
        formData.append("profilePic", profileFile);
      }

      await updateProvider(id, formData);

      toast.success("Provider updated successfully");
      setOpenSaveModal(false);

      setTimeout(() => {
        navigate("/providers");
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update provider"
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
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Provider</h1>

        <button
          onClick={() => navigate("/providers")}
          className="px-4 py-2 bg-gray-200 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Name *" name="name" form={form} onChange={handleChange} error={errors.name} />
          <Input label="Email *" name="email" form={form} onChange={handleChange} error={errors.email} />
          <Input label="Phone *" name="phone" form={form} onChange={handleChange} error={errors.phone} />
          <Input label="WhatsApp" name="whatsapp" form={form} onChange={handleChange} />

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

          <Input label="City *" name="city" form={form} onChange={handleChange} error={errors.city} />
          <Input label="State *" name="state" form={form} onChange={handleChange} error={errors.state} />
          <Input label="Pincode *" name="pincode" form={form} onChange={handleChange} error={errors.pincode} />

          {/* Image */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Profile Picture</label>
            <label className="flex items-center gap-2 mt-2 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer">
              <Upload size={18} /> Change Image
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
          <button
            onClick={() => navigate("/providers")}
            className="px-6 py-3 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Provider
          </button>
        </div>
      </div>

      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleUpdateConfirm}
        title="Update Provider"
        message="Do you want to update this provider?"
        type="success"
      />
    </div>
  );
};

/* Reusable Input */
const Input = ({ label, name, form, onChange, error }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input
      name={name}
      value={form[name]}
      onChange={onChange}
      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default EditProvider;
