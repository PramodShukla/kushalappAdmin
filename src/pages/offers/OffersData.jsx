import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";

const OffersData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const dummyData = {
      id: id,
      title: "Festival Offer",
      discount: "25%",
      status: "Active",
      offerDisplayType: "Banner",
      offerType: "Percentage",
      offerMode: "Online",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    };

    setOffer(dummyData);
  }, [id]);

  const confirmDelete = () => {
    console.log("Deleting offer id:", offer.id);

    // Add your API delete logic here

    setOpenDeleteModal(false);
    navigate("/offers"); // redirect after delete
  };

  if (!offer) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading offer details...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">
          Offer Details
        </h1>

        <button
          onClick={() => navigate("/add-offers-data")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Add Offer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800 text-left">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Offer Display Type</th>
              <th className="p-4">Offer Type</th>
              <th className="p-4">Offer Mode</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
              
              {/* Image */}
              <td className="p-4">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-20 h-14 object-cover rounded-lg border dark:border-slate-700"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150x100?text=No+Image")
                  }
                />
              </td>

              <td className="p-4 font-medium">{offer.title}</td>
              <td className="p-4">{offer.discount}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    offer.status === "Active"
                      ? "bg-green-100 text-green-600 dark:bg-green-900"
                      : "bg-red-100 text-red-600 dark:bg-red-900"
                  }`}
                >
                  {offer.status}
                </span>
              </td>

              <td className="p-4">{offer.offerDisplayType}</td>
              <td className="p-4">{offer.offerType}</td>
              <td className="p-4">{offer.offerMode}</td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  
                  {/* Edit */}
                  <button
                    onClick={() =>
                      navigate(`/edit-offers-data/${offer.id}`)
                    }
                    className="cursor-pointer w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 flex items-center justify-center"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setOpenDeleteModal(true)}
                    className="cursor-pointer w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 flex items-center justify-center"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
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

export default OffersData;