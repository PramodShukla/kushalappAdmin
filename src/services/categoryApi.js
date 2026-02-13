import api from "./apiClient";

/* ======================================================
   Category APIs
====================================================== */

export const getCategories = () => api.get("/categories");

export const getCategory = (id) => api.get(`/categories/${id}`);

export const createCategory = (data) => {
  return api.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCategory = (id) => api.delete(`/categories/${id}`);
