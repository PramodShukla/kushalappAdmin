import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  getSubCategories,
  deleteSubCategory,
} from "../../services/subcategoryapi";
import { getCategories } from "../../services/categoryApi"; // for category filter

const BASE_URL = "https://api.kushalapp.com";

/* ---------- Safe Value Helper ---------- */
const safe = (v) => (v === undefined || v === null || v === "" ? "-" : v);

/* ---------------- Status Badge ---------------- */
const statusStyle = (active) =>
  active
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

/* ---------------- Skeleton Row ---------------- */
const SkeletonRow = () => (
  <tr>
    {[...Array(6)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </td>
    ))}
  </tr>
);

const SubCategories = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // new filter

  const [categories, setCategories] = useState([]); // list of categories

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  /* ================= FETCH SUBCATEGORIES ================= */
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await getSubCategories();

      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];

      const formatted = list.map((item, index) => ({
        id: safe(item._id),
        name: safe(item.name),
        sequence: item.sequence ?? index + 1,
        description: safe(item.description),
        categoryId: item.category?._id || "",
        categoryName: safe(item.category?.name),
        providers: item.providerCount === 0 ? 0 : safe(item.providerCount),
        status: item.isActive ?? true,
        createdAt: item.createdAt || null,
        image: item.banner
          ? item.banner.startsWith("http")
            ? item.banner
            : `${BASE_URL}${item.banner}`
          : "/images/categories/default.png",
      }));

      setData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      toast.error("Failed to load subcategories");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setCategories(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  /* ================= DELETE ================= */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSubCategory(deleteId);
      toast.success("SubCategory deleted successfully");
      fetchSubCategories();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to delete SubCategory"
      );
    } finally {
      setOpenDeleteModal(false);
      setDeleteId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.categoryName || "").toLowerCase().includes(search.toLowerCase());

      const categoryMatch = categoryFilter ? u.categoryId === categoryFilter : true;

      if (!u.createdAt) return textMatch && categoryMatch;

      const created = new Date(u.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate) : true;

      return textMatch && fromOk && toOk && categoryMatch;
    });
  }, [search, fromDate, toDate, data, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">SubCategories</h1>

        <button
          onClick={() => navigate("/add-subcategory")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <Plus size={16} /> Add Sub-Category
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="grid md:grid-cols-4 gap-4">
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

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
              <th className="p-4">Sequence</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Providers</th>
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
                  <td className="p-4">{u.sequence}</td>

                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={u.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    {u.name}
                  </td>

                  <td className="p-4">{u.categoryName}</td>

                  <td
                    className="p-4 text-blue-600 "
                  >
                    {u.providers}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                        u.status
                      )}`}
                    >
                      {u.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/subcategory-details/${u.id}`)
                      }
                      className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                    >
                      <Eye size={16} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/edit-subcategory/${u.id}`)
                      }
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
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete SubCategory"
        message="Are you sure you want to delete this subcategory?"
        type="danger"
      />
    </div>
  );
};

export default SubCategories;