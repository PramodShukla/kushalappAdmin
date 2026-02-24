import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

const NotificationsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------------- SAMPLE NOTIFICATION ----------------
  const notification = {
    id,
    sequence: 1,
    title: "New Subscriber Added",
    description:
      "Rahul Sharma has just subscribed to the Professional Plan.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "Active",
  };

  // ---------------- FIELD CONSTANT ----------------
  const fields = [
    {
      label: "Sequence",
      value: (n) => n.sequence || "-",
    },
    {
      label: "Title",
      value: (n) => n.title || "-",
    },
    {
      label: "Description",
      value: (n) => n.description || "-",
    },
    {
      label: "Status",
      value: (n) => n.status || "Active",
      isStatus: true,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Notification Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View notification information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/notifications")}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={() => navigate(`/edit-notification/${id}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow"
          >
            <Edit size={18} /> Edit
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border rounded-3xl shadow-xl p-6 flex gap-9">

        {/* Image Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Image
          </h3>
          <img
            src={notification.image}
            alt={notification.title}
            className="w-40 h-40 rounded-2xl object-cover shadow-md"
          />
        </div>

        {/* Details Section */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl  divide-y">
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
                      field.value(notification).toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {field.value(notification)}
                  </span>
                ) : (
                  field.value(notification)
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NotificationsDetails;