import React, { useState, useMemo, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProviders } from "../../services/providerapi";

/* ---------------- Skeleton Row ---------------- */
const SkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, i) => (
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
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH PROVIDERS ================= */
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await getProviders();

      console.log("RAW API:", res.data); // keep for debug

      const list = Array.isArray(res?.data) ? res.data : [];

      const allProviders = list.map((p, index) => ({
        id: safe(p._id),

        // ✅ sequence generated locally
        sequence: index + 1,

        // ✅ correct field mapping
        name: safe(p.name),
        phone: safe(p.phone),
        rating: safe(p.rating),

        // ✅ nested safe access
        city: safe(p.address?.city),
        gender: safe(p.gender),

        // ✅ backend doesn’t send plan — derive safely
        planType: p.isFeatured ? "Featured" : "Standard",

        profilePic: p.profilePic
          ? `https://api.kushalapp.com${p.profilePic}`
          : "/images/default-profile.png",
      }));

      setProviders(allProviders);
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  /* ================= FILTER ================= */
  const filteredProviders = useMemo(() => {
    return providers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, providers]);

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <h1 className="text-2xl font-bold dark:text-white">
        Providers List
      </h1>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
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
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Gender</th>
                <th className="p-4">City</th>
                <th className="p-4">Plan Type</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filteredProviders.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
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

                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/providers/view/${p.id}`)}
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && filteredProviders.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No providers found
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

export default ProvidersList;
