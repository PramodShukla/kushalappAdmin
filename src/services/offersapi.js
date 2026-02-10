import api from "./apiClient";

/* ======================================================
   Category APIs
====================================================== */

export const getOffers = () => api.get("/offers");

