import React, { useState, useRef } from "react";
import { Eye, EyeOff, Save, Upload } from "lucide-react";

export default function ProfilePage() {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "Shrii",
    email: "shrii@email.com",
    mobile: "9876543210",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImg, setProfileImg] = useState(
    "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600"
  );

  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  // ---------------- form change ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- toggle password ----------------
  const toggleShow = (field) => {
    setShow((s) => ({ ...s, [field]: !s[field] }));
  };

  // ---------------- image select ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  // button click → open file picker
  const openFilePicker = () => {
    fileRef.current.click();
  };

  // ---------------- save profile ----------------
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Profile Save:", form);
    alert("Profile updated (demo)");
  };

  // ---------------- change password ----------------
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password changed (demo)");
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 p-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Profile
        </h1>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 grid md:grid-cols-3 gap-8">

          {/* ---------------- Left — Image ---------------- */}
          <div className="flex flex-col items-center gap-4">

            <div className="relative group">
              <img
                src={profileImg}
                alt="profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />

              {/* hover overlay */}
              <div
                onClick={openFilePicker}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
              >
                <Upload className="text-white" />
              </div>
            </div>

            {/* hidden input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              onClick={openFilePicker}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm shadow"
            >
              Upload New Image
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              JPG / PNG — click image or button
            </p>
          </div>

          {/* ---------------- Right — Profile Form ---------------- */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-5">

              <Field label="Name">
                <input name="name" value={form.name} onChange={handleChange} className={inputStyle}/>
              </Field>

              <Field label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputStyle}/>
              </Field>

              <Field label="Mobile">
                <input name="mobile" value={form.mobile} onChange={handleChange} className={inputStyle}/>
              </Field>

              {/* password */}
              <div className="relative">
                <label className={labelStyle}>Current Password</label>
                <input
                  name="password"
                  type={show.password ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={inputStyle + " pr-10"}
                />
                <EyeBtn onClick={() => toggleShow("password")} show={show.password}/>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow">
                  <Save size={16} /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ---------------- Change Password Card ---------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="grid md:grid-cols-3 gap-5">

            <PasswordField
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              show={show.newPassword}
              toggle={() => toggleShow("newPassword")}
              onChange={handleChange}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              show={show.confirmPassword}
              toggle={() => toggleShow("confirmPassword")}
              onChange={handleChange}
            />

            <div className="flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- small reusable helpers ---------- */

const labelStyle =
  "text-sm font-medium text-gray-700 dark:text-gray-300";

const inputStyle =
  "mt-1 w-full border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

const Field = ({ label, children }) => (
  <div>
    <label className={labelStyle}>{label}</label>
    {children}
  </div>
);

const EyeBtn = ({ onClick, show }) => (
  <button type="button" onClick={onClick} className="absolute right-3 top-9 text-gray-500">
    {show ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);

const PasswordField = ({ label, name, value, show, toggle, onChange }) => (
  <div className="relative">
    <label className={labelStyle}>{label}</label>
    <input
      name={name}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      className={inputStyle + " pr-10"}
    />
    <EyeBtn onClick={toggle} show={show}/>
  </div>
);
