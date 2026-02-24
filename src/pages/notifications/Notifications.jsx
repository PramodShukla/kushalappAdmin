import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

const dummyNotifications = [
  {
    id: 1,
    sequence: 1,
    title: "New Subscriber Added",
    description: "Rahul Sharma has just subscribed to the Professional Plan.",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    sequence: 2,
    title: "Subscription Expiring Soon",
    description: "Priya Verma's Basic Plan will expire in 3 days.",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    sequence: 3,
    title: "New Feature Released",
    description: "Introducing Analytics Dashboard for better insights.",
    img: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
];

const Notifications = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(dummyNotifications);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== deleteId));
    setOpenDelete(false);
    setDeleteId(null);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage all your notifications here
          </p>
        </div>

        <button
          onClick={() => navigate("/add-notification")}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow"
        >
          + Add Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Sequence</th>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((notif) => (
                <tr
                  key={notif.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="p-4">{notif.sequence}</td>

                  <td className="p-4">
                    <img
                      src={notif.img}
                      alt={notif.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>

                  <td className="p-4 font-medium dark:text-white">
                    {notif.title}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {notif.description}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      {/* View */}
                      <button
                        onClick={() =>
                          navigate(`/notifications-details/${notif.id}`)
                        }
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/edit-notification/${notif.id}`)
                        }
                        className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition"
                      >
                        <Edit size={16} className="text-yellow-600" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(notif.id)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        message="This action cannot be undone"
        type="danger"
        icon={<Trash2 className="w-10 h-10 text-red-500" />}
      />
    </div>
  );
};

export default Notifications;