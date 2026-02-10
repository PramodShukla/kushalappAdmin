import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOffers } from "../../services/offersapi"; 

const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

const SkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </td>
    ))}
  </tr>
);

const Offers = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------------- Fetch Offers ----------------
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await getOffers(); // API call
      const formatted = (res?.data || res || []).map((item) => ({
        id: item._id,

        title: item.title,
        sequence: item.sequence,
        description: item.description || "",
        discount: item.discount || 0,
        status: item.status || "Active",
        createdAt: item.createdAt,
        offerDisplayType: item.offerDisplayType || "-", 
        offerType: item.offerType || "-",             
        offerMode: item.offerMode || "-",      
        image: item.banner
          ? `https://api.kushalapp.com/${item.banner}`
          : "/images/offers/default.png",
      }));
      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ---------------- Delete Offer ----------------
   const handleDelete = async (id) => {
    await deleteOffer(id);
    fetchOffers();
  };

  // ---------------- Filters ----------------
  const filteredOffers = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        u.title.toLowerCase().includes(search.toLowerCase()) ||
        u.description.toLowerCase().includes(search.toLowerCase());

      const created = new Date(u.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate) : true;

      return textMatch && fromOk && toOk;
    });
  }, [search, fromDate, toDate, data]);

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Offers</h1>
        <button
          onClick={() => navigate("/add-offer")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <Plus size={16} /> Add Offer
        </button>
      </div>

      {/* ---------------- Filter Bar ---------------- */}
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

      {/* ---------------- Table ---------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Sequence</th>
                <th className="p-4">Title</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Offer Display Type</th>
                <th className="p-4">Offer Type</th>
                <th className="p-4">Offer Mode</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filteredOffers.map((u) => (
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
                      {u.title}
                    </td>
                    <td className="p-4">{u.discount}%</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">{u.offerDisplayType}</td>
                    <td className="p-4">{u.offerType}</td>
                    <td className="p-4">{u.offerMode}</td>
                    <td className="p-4 flex gap-3">
                      
                        <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/offers/view/${u.id}`)
                          }
                          className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 flex items-center justify-center"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/offers/edit/${u.id}`)
                          }
                          className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 flex items-center justify-center"
                        >
                          <Edit size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 flex items-center justify-center"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filteredOffers.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No offers found
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

export default Offers;
