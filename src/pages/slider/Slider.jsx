import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

/* -------- STATUS BADGE -------- */
const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

/* -------- SKELETON -------- */
const SkeletonRow = () => (
  <tr>
    {[...Array(7)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const Slider = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* -------- MOCK DATA (replace with API later) -------- */
  const [data, setData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: 1,
          title: "Festival Offer",
          image: "https://via.placeholder.com/120x60",
          displayType: "Horizontal",
          sequence: 1,
          status: "Active",
          createdAt: "2026-02-01",
        },
        {
          id: 2,
          title: "Winter Sale",
          image: "https://via.placeholder.com/120x60",
          displayType: "Vertical",
          sequence: 2,
          status: "Inactive",
          createdAt: "2026-02-03",
        },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  /* -------- FILTER -------- */
  const filtered = useMemo(() => {
    return data.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* -------- DELETE -------- */
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setData((prev) => prev.filter((x) => x.id !== deleteId));
    setOpenDelete(false);
  };

  /* -------- UI -------- */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">
          Sliders
        </h1>

        <button
          onClick={() => navigate("/add-slider")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add Slider
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slider..."
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
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Display Type</th>
                <th className="p-4">Created</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-4">{s.sequence}</td>

                    <td className="p-4">
                      <img
                        src={s.image}
                        alt=""
                        className="w-28 h-14 object-cover rounded-lg"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/120x60")
                        }
                      />
                    </td>

                    <td className="p-4 font-medium">{s.title}</td>

                    <td className="p-4">{s.displayType}</td>

                    <td className="p-4">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        <button className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center">
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center">
                          <Edit size={16} className="text-yellow-600" />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(s.id)}
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
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No sliders found
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
        title="Delete Slider"
        message="This cannot be undone"
        type="danger"
      />

    </div>
  );
};

export default Slider;
