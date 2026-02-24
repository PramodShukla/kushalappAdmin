import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

const AddSubscriptions = () => {

  const [form, setForm] = useState({
    name: "",
    price: "",
    trialPeriod: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Plan name is required";
    if (!form.price) err.price = "Price is required";
    if (!form.trialPeriod) err.trialPeriod = "Trial period is required";
    if (!form.status) err.status = "Status is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- SAVE ---------------- */
  const handleSaveConfirm = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      setOpenSaveModal(false);
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Subscription plan added successfully");
      setOpenSaveModal(false);

      setForm({
        name: "",
        price: "",
        trialPeriod: "",
        status: "Active",
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Add Subscription Plan
        </h1>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* Plan Name */}
          <div>
            <label className="text-sm font-semibold">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-semibold">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Trial Period */}
          <div>
            <label className="text-sm font-semibold">
              Trial / Free Period <span className="text-red-500">*</span>
            </label>
            <input
              name="trialPeriod"
              placeholder="e.g. 7 days"
              value={form.trialPeriod}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border"
            />
            {errors.trialPeriod && (
              <p className="text-red-500 text-sm">{errors.trialPeriod}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold">
              Status <span className="text-red-500">*</span>
            </label>
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
            onClick={() => window.history.back()}
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
            Save Plan
          </button>
        </div>
      </div>

      <ConfirmModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Save Subscription Plan"
        message="Do you want to save this subscription plan?"
        type="success"
      />
    </div>
  );
};

export default AddSubscriptions;