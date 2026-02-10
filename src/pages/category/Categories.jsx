import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategories, deleteCategory } from "../../services/categoryApi";
import ConfirmModal from "../../components/common/ConfirmModal";

/* ---------------- CONFIG ---------------- */
const BASE_URL = "https://api.kushalapp.com";

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

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getCategories();
      console.log("CATEGORY API RAW:", res.data);

      // ✅ your API returns array directly — keep this
      const list = Array.isArray(res?.data) ? res.data : [];

      const formatted = list.map((item, index) => {
        // ✅ SAFE IMAGE BUILDER
        let imgUrl = "https://via.placeholder.com/80";

        if (item.icon) {
          if (item.icon.startsWith("http")) {
            imgUrl = item.icon; // already full URL
          } else {
            imgUrl = `${BASE_URL}${item.icon}`; // relative path
          }
        }

        console.log("ICON:", item.icon);
        console.log("FINAL IMG:", imgUrl);

        return {
          id: item._id || item.id,
          sequence: index + 1,
          name: item.name || "-",
          description: item.description || "",
          providers: item.providerCount ?? 0,
          subcategory: item.subCategoryCount ?? 0,
          status: item.status || "Active",
          image: imgUrl,
          createdAt: item.createdAt || null,
        };
      });

      setData(formatted);
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= DELETE ================= */

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteId);
      setOpenDelete(false);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return data.filter((u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Categories</h1>

        <button
          onClick={() => navigate("/add-category")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
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
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Sequence</th>
                <th className="p-4">Title</th>
                <th className="p-4">Providers</th>
                <th className="p-4">SubCategory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="p-4">{u.sequence}</td>

                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-10 h-10 rounded-lg object-cover bg-amber-100 p-2"
                        onError={(e) => {
                          console.log("IMAGE FAILED:", u.image);
                          e.target.src = "https://via.placeholder.com/80";
                        }}
                      />
                      {u.name}
                    </td>

                    <td className="p-4 text-blue-600">{u.providers}</td>
                    <td className="p-4 text-blue-600">{u.subcategory}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/category-details/${u.id}`)
                          }
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/edit-category/${u.id}`)
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
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No categories found
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
        title="Delete Category"
        message="This cannot be undone"
        type="danger"
        icon={<Trash2 className="w-10 h-10 text-red-500" />}
      />
    </div>
  );
};

export default Categories;
