import api from "./apiClient";

/* ======================================================
   Sub Category APIs
====================================================== */

export const getSubCategories = () => api.get("/subcategories");

export const getCategoryWiseSubCategory = () =>
  api.get("/categorywisesubcategory");

export const deleteSubCategory = (id) => api.delete(`/subcategories/${id}`);
