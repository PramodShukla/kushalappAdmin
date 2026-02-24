import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const EditNotifications = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- SAMPLE EXISTING DATA ----------------
  const [form, setForm] = useState({
    sequence: 1,
    title: "Big Sale is Live 🎉",
    description:
      "Get up to 50% off on premium subscriptions. Limited time offer!",
    image:
      "https://via.placeholder.com/300x200.png?text=Notification+Image",
    status: "Active",
  });

  const [preview, setPreview] = useState(form.image);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ---------------- HANDLE IMAGE ----------------
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
    console.log("Updated Notification:", form);
    navigate("/notifications");
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Edit Notification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Update notification details
          </p>
        </div>

        <button
          onClick={() => navigate("/notifications")}
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
        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE - FORM FIELDS */}
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
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
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
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>
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

          {/* RIGHT SIDE - IMAGE */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 bg-gray-50 dark:bg-slate-800">
            
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-xl shadow mb-4"
            />

            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
              Change Image
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
            <Save size={18} /> Update Notification
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotifications;