import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

const EditSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    name: "",
    price: "",
    trial: "",
    status: "Active",
  });

  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------- FETCH SUBSCRIPTION ----------------
  useEffect(() => {
    // Dummy subscription data
    const dummyData = {
      name: "Professional Plan",
      price: "₹1,299",
      trial: "15 Days",
      status: "Active",
    };

    setForm(dummyData);
  }, [id]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Plan Name is required";
    if (!form.price) err.price = "Price is required";
    if (!form.trial) err.trial = "Trial / Free Period is required";
    if (!form.status) err.status = "Status is required";

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
      const payload = { ...form };
      console.log("Payload to save:", payload);

      toast.success("Subscription updated successfully");
      setOpenSaveModal(false);
      setTimeout(() => navigate("/subscriptions"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      setOpenSaveModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Edit Subscription</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Update subscription plan details
          </p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Name */}
          <div>
            <label className="text-sm font-semibold">Plan Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-semibold">Price <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Trial / Free Period */}
          <div>
            <label className="text-sm font-semibold">Trial / Free Period <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="trial"
              value={form.trial}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.trial && <p className="text-red-500 text-sm">{errors.trial}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold">Status <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/subscriptions")}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={() => setOpenSaveModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow flex items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Update Subscription
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Update Subscription"
        message="Do you want to update this subscription plan?"
        type="success"
      />
    </div>
  );
};

export default EditSubscription;