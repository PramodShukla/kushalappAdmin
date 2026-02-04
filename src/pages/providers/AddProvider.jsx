import React, { useState } from "react";
import { Upload } from "lucide-react";

const AddUser = () => {
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className=" p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New User
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create and register a new user account
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none"
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>User</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Profile Image
            </label>

           <label
  className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
             bg-gray-50 dark:bg-slate-800
             border border-dashed border-gray-300 dark:border-slate-600
             hover:bg-gray-100 dark:hover:bg-slate-700 transition"
>
  <Upload size={18} className="text-gray-700 dark:text-white" />

  <span className="text-sm text-gray-700 dark:text-gray-300">
    Upload image
  </span>

  <input
    type="file"
    hidden
    onChange={handleImage}
  />
</label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-20 h-20 rounded-full object-cover ring-2 ring-blue-500"
              />
            )}
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">

          <button className="px-5 py-2 rounded-lg
                             bg-gray-200 dark:bg-slate-700
                             text-gray-700 dark:text-white
                             hover:opacity-80">
            Cancel
          </button>

          <button className="px-5 py-2 rounded-lg
                             bg-blue-600 hover:bg-blue-700
                             text-white font-medium">
            Save User
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddUser;
