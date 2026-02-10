import api from "./apiClient";

/* ======================================================
   Category APIs
====================================================== */

export const getProviders = () => api.get("/providers");

