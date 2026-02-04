import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategories, deleteCategory } from "../../services/categoryApi";

/* ---------------- Status Badge ---------------- */
const statusStyle = (s) =>
  s === "Active"
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

const Categories = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ======================================================
     REAL API FETCH (✅ inside component)
  ====================================================== */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getCategories(); // axios client

      const formatted = (res?.data || res || []).map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description || "",
        providers: item.providersCount || 0,
        subcategory: item.subCategoryCount || 0,
        status: item.status || "Active",
        sequence: item.sequence || 0,
        createdAt: item.createdAt,
        image: item.icon
          ? `https://api.kushalapp.com/${item.icon}`
          : "/images/categories/default.png",
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     CALL API ON LOAD
  ====================================================== */
  useEffect(() => {
    fetchCategories();
  }, []);

  /* ======================================================
     DELETE
  ====================================================== */
  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  /* ======================================================
     FILTERS
  ====================================================== */
  const filteredUsers = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.description.toLowerCase().includes(search.toLowerCase());

      const created = new Date(u.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate) : true;

      return textMatch && fromOk && toOk;
    });
  }, [search, fromDate, toDate, data]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Categories</h1>

        <button
          onClick={() => navigate("/add-category")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
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

          {/* From */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />

          {/* To */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* TABLE HEADER */}
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Providers</th>
                <th className="p-4">SubCategory</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {/* Loading */}
              {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Data */}
              {!loading &&
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      {u.name}
                    </td>

                    <td
                      className="p-4 text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/providers?categoryId=${u.id}`)}
                    >
                      {u.providers}
                    </td>

                    <td
                      className="p-4 text-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/subcategories?categoryId=${u.id}`)
                      }
                    >
                      {u.subcategory}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusStyle(u.status)}`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-3">
                      <Eye
                        size={16}
                        className="cursor-pointer"
                        onClick={() => navigate(`/categories/view/${u.id}`)}
                      />
                      <Edit
                        size={16}
                        className="cursor-pointer"
                        onClick={() => navigate(`/categories/edit/${u.id}`)}
                      />
                      <Trash2
                        size={16}
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(u.id)}
                      />
                    </td>
                  </tr>
                ))}

              {/* Empty */}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
