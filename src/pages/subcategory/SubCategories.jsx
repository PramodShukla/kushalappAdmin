import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getSubCategories,
  deleteSubCategory,
} from "../../services/subcategoryapi";

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

  /* ================= FETCH ================= */
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await getSubCategories();

      console.log("API RAW:", res);

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
        categoryName: safe(item.category?.name),

        // keep 0 — don't convert to "-"
        providers: item.providerCount === 0 ? 0 : safe(item.providerCount),

        status: item.isActive ?? true,
        createdAt: item.createdAt || null,

        image: item.banner
          ? `https://api.kushalapp.com${item.banner}`
          : "/images/categories/default.png",
      }));

      console.log("FORMATTED:", formatted);
      setData(formatted);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  /* ================= DELETE ================= */
  const handleDeleteClick = async (id) => {
    await deleteSubCategory(id);
    fetchSubCategories();
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.categoryName || "").toLowerCase().includes(search.toLowerCase());

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
                    className="p-4 text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/providers?subcategoryId=${u.id}`)}
                  >
                    {u.providers}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusStyle(u.status)}`}
                    >
                      {u.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 flex gap-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/subcategory-details/${u.id}`)}
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>

                      <button
                        onClick={() => navigate(`/edit-subcategory/${u.id}`)}
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
                    </div>
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
    </div>
  );
};

export default SubCategories;