import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getUsers, deleteUser } from "../../services/userapi";

const BASE_URL = "https://api.kushalapp.com";

/* ---------- Safe Value Helper ---------- */
const safe = (v) => (v === undefined || v === null || v === "" ? "-" : v);

/* ---------------- Skeleton Row ---------------- */
const SkeletonRow = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </td>
    ))}
  </tr>
);

const Users = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();

      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      const formatted = list.map((u) => ({
        id: u._id,
        name: safe(u.name),
        email: safe(u.email),
        phone: safe(u.phone),
        role: safe(u.role),
        status: u.isPhoneVerified ?? false,
        createdAt: u.createdAt || null,
        image: u.profilePic
          ? `${BASE_URL}${u.profilePic}`
          : "/images/default-user.png",
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE ================= */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setOpenDeleteModal(false);
      setDeleteId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase());

      if (!u.createdAt) return textMatch;

      const created = new Date(u.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate) : true;

      return textMatch && fromOk && toOk;
    });
  }, [search, fromDate, toDate, data]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Users</h1>

        <button
          onClick={() => navigate("/add-user")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
            />
          </div>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {!loading &&
              filteredData.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  {/* USER IMAGE + NAME */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.target.src = "/images/default-user.png";
                        }}
                      />
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">
                          {u.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.role}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        u.status
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {u.status ? "Verified" : "Not Verified"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/user-details/${u.id}`)}
                      className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                    >
                      <Eye size={16} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() => navigate(`/edit-user/${u.id}`)}
                      className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center"
                    >
                      <Edit size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(u.id)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        type="danger"
      />
    </div>
  );
};

export default Users;
