import React from "react";
import { ArrowLeft, Edit, Mail, User, Shield, Calendar } from "lucide-react";
import BackButton from "../../Buttons/Backbutton";
const UserDetails = () => {
  const user = {
    name: "Shristi Singh",
    email: "shristi@email.com",
    role: "Admin",
    status: "Active",
    joined: "2025-12-10",
    lastLogin: "2026-02-02",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  };

  const statusStyle =
    user.status === "Active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
       <BackButton />

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-blue-600 hover:bg-blue-700 text-white transition">
          <Edit size={16} />
          Edit User
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          {/* AVATAR */}
          <img
            src={user.avatar}
            alt=""
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/30"
          />

          {/* BASIC INFO */}
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              <Mail size={16} />
              {user.email}
            </p>

            <div className="flex gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {user.role}
              </span>

              <span className={`px-3 py-1 text-sm rounded-full ${statusStyle}`}>
                {user.status}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ACCOUNT INFO */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Account Information
          </h2>

          <DetailRow icon={User} label="Full Name" value={user.name} />
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={Shield} label="Role" value={user.role} />
        </div>

        {/* META INFO */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Activity
          </h2>

          <DetailRow icon={Calendar} label="Joined Date" value={user.joined} />
          <DetailRow icon={Calendar} label="Last Login" value={user.lastLogin} />
          <DetailRow icon={Shield} label="Status" value={user.status} />
        </div>

      </div>

    </div>
  );
};

/* reusable row */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <Icon size={16} />
      {label}
    </div>
    <div className="font-medium text-gray-900 dark:text-white">
      {value}
    </div>
  </div>
);

export default UserDetails;
