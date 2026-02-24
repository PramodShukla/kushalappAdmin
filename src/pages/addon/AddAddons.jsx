import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const AddAddons = () => {
  const navigate = useNavigate();

  // ---------------- FORM STATE ----------------
  const [form, setForm] = useState({
    sequence: "",
    name: "",
    description: "",
    price: "",
    status: "Active",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ---------------- HANDLE IMAGE CHANGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setForm({ ...form, image: file });
    }
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Addon:", form);
    navigate("/addons");
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Add New Addon
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create a new addon feature
          </p>
        </div>

        <button
          onClick={() => navigate("/addons")}
          className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-8"
      >
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE - FORM */}
          <div className="space-y-5">

            {/* Sequence */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Sequence
              </label>
              <input
                type="number"
                name="sequence"
                value={form.sequence}
                onChange={handleChange}
                placeholder="Enter display order"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Addon Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter addon name"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter addon description"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* RIGHT SIDE - IMAGE UPLOAD */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 bg-gray-50 dark:bg-slate-800">

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-56 object-contain rounded-xl shadow mb-4"
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-gray-400">
                Image Preview
              </div>
            )}

            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

          </div>

        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-green-600 text-white flex items-center gap-2 shadow hover:bg-green-700 transition"
          >
            <Save size={18} /> Save Addon
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddons;