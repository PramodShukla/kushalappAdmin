import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOffers, deleteOffer } from "../../services/offersapi";
import ConfirmModal from "../../components/common/ConfirmModal";

const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

const SkeletonRow = () => (
  <tr>
    {[...Array(9)].map((_, i) => (
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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ---------------- Fetch Offers ----------------
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await getOffers();
      const formatted = (res?.data || []).map((item) => ({
        id: item._id,
        title: item.title,
        sequence: item.sequence,
        description: item.description || "",
        discount: item.discount || 0,
        status: item.isActive ? "Active" : "Inactive",
        createdAt: item.createdAt,
        offerDisplayType: item.offerDisplayType || "-",
        offerType: item.offerType || "-",
        offerMode: item.offerMode || "-",
        image: item.offerImage
          ? item.offerImage
          : "/images/offers/default.png",
      }));
      setData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ---------------- Delete Offer ----------------
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteOffer(deleteId);
      toast.success("Offer deleted successfully");
      setOpenDeleteModal(false);
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer");
      setOpenDeleteModal(false);
    }
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
                 <th className="p-4">Data</th>
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
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/offers-data`)}
                        className="px-3 py-1.5 text-sm rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                      >
                        View Data
                      </button>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/offer-details/${u.id}`)}
                        className=" cursor-pointer w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 flex items-center justify-center"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>

                      <button
                        onClick={() => navigate(`/edit-offer/${u.id}`)}
                        className=" cursor-pointer w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 flex items-center justify-center"
                      >
                        <Edit size={16} className="text-yellow-600" />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(u.id);
                          setOpenDeleteModal(true);
                        }}
                        className=" cursor-pointer w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 flex items-center justify-center"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && filteredOffers.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this offer?"
        type="danger"
      />
    </div>
  );
};

export default Offers;
