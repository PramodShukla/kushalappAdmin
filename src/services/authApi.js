import api from "./apiClient";

/* ======================================================
   Category APIs
====================================================== */

export const adminLogin = (data) => api.post("/admin/login", data);
