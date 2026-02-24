import React, { useState, useMemo, useEffect } from "react";
import { Search, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getProviders, deleteProvider } from "../../services/providerapi";
import ConfirmModal from "../../components/common/ConfirmModal";

/* ---------------- Skeleton Row ---------------- */
const SkeletonRow = () => (
  <tr>
    {[...Array(10)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </td>
    ))}
  </tr>
);

/* ---------------- Safe Value Helper ---------------- */
const safe = (v) =>
  typeof v === "string"
    ? v.trim() || "-"
    : v === undefined || v === null
    ? "-"
    : v;

const ProvidersList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= GET CATEGORY FROM URL ================= */
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const categoryName = queryParams.get("name");

  /* ================= FETCH PROVIDERS ================= */
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await getProviders();
      const list = res?.data?.data || res?.data || [];

      const allProviders = list.map((p, index) => ({
        id: p._id,
        sequence: index + 1,
        name: safe(p.name),
        phone: safe(p.phone),
        rating: safe(p.rating),
        city: safe(p.address?.city),
        gender: safe(p.gender),
        planType: p.isFeatured ? "Featured" : "Standard",
        category: p.category
          ? {
              id: p.category._id,
              description: safe(p.category.description),
              icon: p.category.icon
                ? p.category.icon.startsWith("http")
                  ? p.category.icon
                  : `https://api.kushalapp.com${p.category.icon}`
                : "/images/default-category.png",
              banner: p.category.banner
                ? p.category.banner.startsWith("http")
                  ? p.category.banner
                  : `https://api.kushalapp.com${p.category.banner}`
                : "/images/default-banner.png",
            }
          : null,
        profilePic: p.profilePic
          ? p.profilePic.startsWith("http")
            ? p.profilePic
            : `https://api.kushalapp.com${p.profilePic}`
          : "/images/default-profile.png",
        createdAt: p.createdAt ? new Date(p.createdAt) : null,
      }));

      setProviders(allProviders);
    } catch (err) {
      console.error("Error fetching providers:", err);
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  /* ================= DELETE ================= */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProvider(deleteId);
      toast.success("Provider deleted successfully");
      setOpenDelete(false);
      setDeleteId(null);
      fetchProviders();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err?.response?.data?.message || "Failed to delete provider");
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesCategory = categoryId
        ? p.category?.id === categoryId
        : true;

      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFrom = dateFrom
        ? p.createdAt >= new Date(dateFrom)
        : true;

      const matchesTo = dateTo
        ? p.createdAt <= new Date(dateTo)
        : true;

      return matchesCategory && matchesSearch && matchesFrom && matchesTo;
    });
  }, [search, dateFrom, dateTo, providers, categoryId]);

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Providers List
          </h1>

          {categoryName && (
            <p className="text-sm text-gray-500">
              Filtered by Category:{" "}
              <span className="font-medium">{categoryName}</span>
            </p>
          )}
        </div>

        <button
          onClick={() => navigate("/add-provider")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Provider
        </button>
      </div>

      {/* SEARCH + DATE FILTERS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Seq</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Gender</th>
                <th className="p-4">City</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filteredProviders.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-4">{p.sequence}</td>

                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.profilePic}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {p.name}
                    </td>

                    <td className="p-4">{p.phone}</td>
                    <td className="p-4">{p.gender}</td>
                    <td className="p-4">{p.city}</td>
                    <td className="p-4">{p.planType}</td>
                    <td className="p-4">{p.rating}</td>

                    <td className="p-4 flex items-center gap-2">
                      {p.category && (
                        <>
                          <img
                            src={p.category.icon}
                            alt={p.category.description}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{p.category.description}</span>
                        </>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/provider-details/${p.id}`)
                          }
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/edit-provider/${p.id}`)
                          }
                          className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center"
                        >
                          <Edit size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(p.id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filteredProviders.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    No providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Delete Provider"
        message="This action cannot be undone"
        type="danger"
        icon={<Trash2 className="w-10 h-10 text-red-500" />}
      />
    </div>
  );
};

export default ProvidersList;