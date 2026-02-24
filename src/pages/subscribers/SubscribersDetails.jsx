import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

const SubscriberDetail = () => {
  const navigate = useNavigate();

  // ---------------- SAMPLE SUBSCRIBER ----------------
  const subscriber = {
    sequence: 1,
    name: "John Doe",
    email: "john@example.com",
    plan: "Premium",
    expiry: "2026-05-31",
    status: "Active",
    avatar:
      "https://randomuser.me/api/portraits/men/75.jpg", // sample image
  };

  // ---------------- FIELD CONSTANT ----------------
  const fields = [
    {
      label: "Sequence",
      value: (s) => s.sequence ?? "-",
    },
    {
      label: "Name",
      value: (s) => s.name || "-",
    },
    {
      label: "Email",
      value: (s) => s.email || "-",
    },
    {
      label: "Plan",
      value: (s) => s.plan || "-",
    },
    {
      label: "Expiry",
      value: (s) =>
        s.expiry ? new Date(s.expiry).toLocaleDateString() : "-",
    },
    {
      label: "Status",
      value: (s) => s.status || "Active",
      isStatus: true,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Subscriber Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View subscriber information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/subscribers")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={() => navigate(`/edit-subscribers/1`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow"
          >
            <Edit size={18} /> Edit
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: Details */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-800 rounded-2xl space-y-4 divide-y">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-4 p-4 items-center"
              >
                <div className="text-sm font-semibold text-gray-500">
                  {field.label}
                </div>

                <div className="col-span-2 dark:text-white">
                  {field.isStatus ? (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        field.value(subscriber).toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {field.value(subscriber)}
                    </span>
                  ) : (
                    field.value(subscriber)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Subscriber Image */}
          <div className="flex justify-center items-center">
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center">
             
              <img
                src={subscriber.avatar}
                alt={subscriber.name}
                className="w-40 h-40 object-cover rounded-full mx-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriberDetail;