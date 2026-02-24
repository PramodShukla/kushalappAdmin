import React, { useState, useMemo } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

/* ---------------- Status Badge ---------------- */
const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

/* ---------------- Dummy Data ---------------- */
const subscriptionPlans = [
  {
    id: "1",
    sequence: 1,
    name: "Starter Plan",
    price: "₹499",
    duration: "per month",
    trial: "7 Days",
    features: ["List up to 5 services", "Direct client communication", "Basic analytics", "Standard support"],
    status: "Active",
  },
  {
    id: "2",
    sequence: 2,
    name: "Professional Plan",
    price: "₹1,299",
    duration: "per month",
    trial: "15 Days",
    features: ["Unlimited services", "Featured listing", "Priority client requests", "Advanced analytics", "Premium support"],
    status: "Active",
  },
  {
    id: "3",
    sequence: 3,
    name: "Enterprise Plan",
    price: "₹4,999",
    duration: "per month",
    trial: "30 Days",
    features: ["Dedicated account manager", "Custom branding", "Exclusive promotions", "Detailed insights", "Premium onboarding"],
    status: "Inactive",
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState(subscriptionPlans);

  /* ================= DELETE ================= */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== deleteId));
    setOpenDelete(false);
    setDeleteId(null);
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return data.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Subscription Plans</h1>

        <button
          onClick={() => navigate("/add-subscription")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Plan Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Trial / Free Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <td className="p-4">{plan.sequence}</td>
                  <td className="p-4 font-medium">{plan.name}</td>
                  <td className="p-4 text-blue-600">{plan.price}</td>
                  <td className="p-4">{plan.trial}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${statusStyle(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/subscriptions-details/${plan.id}`)}
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>

                      <button
                        onClick={() => navigate(`/edit-subscriptions/${plan.id}`)}
                        className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center"
                      >
                        <Edit size={16} className="text-yellow-600" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(plan.id)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message="This cannot be undone"
        type="danger"
        icon={<Trash2 className="w-10 h-10 text-red-500" />}
      />
    </div>
  );
};

export default Subscriptions;