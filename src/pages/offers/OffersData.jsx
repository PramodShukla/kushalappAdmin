import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

import { getProviders } from "../../services/providerapi";
import { getCategories } from "../../services/categoryApi";
import { getSubCategories } from "../../services/subcategoryapi";
import {
  getOfferItems,
  addOfferItem,
  removeOfferItem,
} from "../../services/offersapi";

/* ================= SAFE HELPER ================= */
const safe = (v) =>
  typeof v === "string"
    ? v.trim() || "-"
    : v === undefined || v === null
    ? "-"
    : v;

/* ================= FORMAT PROVIDER ================= */
const formatProvider = (p) => ({
  _id: p._id,
  name: safe(p.name),
  phone: safe(p.phone),
  gender: safe(p.gender),
  rating: safe(p.rating),
  city: safe(p.address?.city),
  planType: p.isFeatured ? "Featured" : "Standard",
  profilePic: p.profilePic
    ? p.profilePic.startsWith("http")
      ? p.profilePic
      : `https://api.kushalapp.com${p.profilePic}`
    : "/images/default-profile.png",
  category: p.category
    ? {
        description: safe(p.category.description),
        icon: p.category.icon
          ? p.category.icon.startsWith("http")
            ? p.category.icon
            : `https://api.kushalapp.com${p.category.icon}`
          : "/images/default-category.png",
      }
    : null,
});

/* ================= TABLE SKELETON ================= */
const TableSkeleton = ({ type }) => {
  const isProvider = type?.toLowerCase() === "provider";
  const cols = isProvider ? 9 : 4;

  return (
    <>
      {[...Array(5)].map((_, row) => (
        <tr key={row}>
          {[...Array(cols)].map((_, col) => (
            <td key={col} className="p-4">
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const OfferData = () => {
  const location = useLocation();
  const { offerTitle, offerType, offerId } = location.state || {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);

  /* ================= FETCH AVAILABLE ================= */
  useEffect(() => {
    const fetchAvailable = async () => {
      if (!offerType) return;

      try {
        setLoading(true);
        let res;

        if (offerType.toLowerCase() === "provider") {
          res = await getProviders();
        } else if (offerType.toLowerCase() === "category") {
          res = await getCategories();
        } else if (offerType.toLowerCase() === "subcategory") {
          res = await getSubCategories();
        }

        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        if (offerType.toLowerCase() === "provider") {
          setAvailableItems(list.map(formatProvider));
        } else {
          setAvailableItems(list);
        }
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailable();
  }, [offerType]);

  /* ================= FETCH SELECTED ================= */
  useEffect(() => {
    const fetchOfferItems = async () => {
      if (!offerId) return;

      try {
        setMainLoading(true);
        const res = await getOfferItems(offerId);
        const items = res?.items || [];

        if (offerType?.toLowerCase() === "provider") {
          setSelectedItems(items.map(formatProvider));
        } else {
          setSelectedItems(items);
        }
      } catch {
        toast.error("Failed to load offer items");
      } finally {
        setMainLoading(false);
      }
    };

    fetchOfferItems();
  }, [offerId, offerType]);

  /* ================= HELPERS ================= */
  const isItemSelected = (id) =>
    selectedItems.some((item) => item._id === id);

  const handleAddItem = async (item) => {
    try {
      await addOfferItem(offerId, item._id, offerType);
      setSelectedItems((prev) => [...prev, item]);
      toast.success("Item added successfully");
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeOfferItem(offerId, itemId, offerType);
      setSelectedItems((prev) =>
        prev.filter((item) => item._id !== itemId)
      );
      toast.success("Item removed successfully");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const isProvider = offerType?.toLowerCase() === "provider";

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold capitalize text-gray-800">
            {offerTitle || "Offer Data"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage items inside this offer
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
          bg-gradient-to-r from-blue-600 to-indigo-600 
          text-white shadow-md hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* ================= MAIN TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-gray-600 text-sm uppercase">
                <th className="p-4">#</th>
                <th className="p-4">Item</th>

                {isProvider && (
                  <>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Gender</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Category</th>
                  </>
                )}

                {!isProvider && <th className="p-4">Intro</th>}

                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {mainLoading ? (
                <TableSkeleton type={offerType} />
              ) : selectedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={isProvider ? 9 : 4}
                    className="p-10 text-center text-gray-400"
                  >
                    No items added yet 🚀
                  </td>
                </tr>
              ) : (
                selectedItems.map((item, idx) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{idx + 1}</td>

                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.profilePic || "/images/default-profile.png"}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {item.name}
                    </td>

                    {isProvider && (
                      <>
                        <td className="p-4">{item.phone}</td>
                        <td className="p-4">{item.gender}</td>
                        <td className="p-4">{item.city}</td>
                        <td className="p-4">{item.planType}</td>
                        <td className="p-4">{item.rating}</td>
                        <td className="p-4 flex items-center gap-2">
                          {item.category && (
                            <>
                              <img
                                src={item.category.icon}
                                alt={item.category.description}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span>{item.category.description}</span>
                            </>
                          )}
                        </td>
                      </>
                    )}

                    {!isProvider && (
                      <td className="p-4">{item.intro || "-"}</td>
                    )}

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="px-4 py-2 text-sm rounded-xl 
                        bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-lg font-semibold">Add {offerType}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto mt-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading items...
                </div>
              ) : (
                <table className="w-full text-left">
                  <tbody>
                    {availableItems.map((item, idx) => {
                      const selected = isItemSelected(item._id);
                      return (
                        <tr key={item._id} className="border-t">
                          <td className="p-4">{idx + 1}</td>
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={
                                item.profilePic ||
                                "/images/default-profile.png"
                              }
                              alt={item.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {item.name}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleAddItem(item)}
                              disabled={selected}
                              className={`px-4 py-2 rounded-xl ${
                                selected
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {selected ? "Added ✓" : "Add"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferData;