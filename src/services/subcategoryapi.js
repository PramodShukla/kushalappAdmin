import api from "./apiClient";

/* ======================================================
   Sub Category APIs
====================================================== */

// Get all
export const getSubCategories = () => api.get("/subcategories");

// Get single
export const getSubCategory = async (id) => {
  const res = await api.get("/subcategories");

  const list = Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];

  const item = list.find((sub) => sub._id === id);

  return { data: item };
};

// Delete
export const deleteSubCategory = (id) =>
  api.delete(`/subcategories/${id}`);

// ================= FILE UPLOAD SUPPORT =================

// Create (supports image/file)
export const createSubCategory = (data) => {
  return api.post("/subcategories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update (supports image/file)
export const updateSubCategory = (id, data) => {
  return api.put(`/subcategories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
