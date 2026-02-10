import api from "./apiClient";

/* ======================================================
   Category APIs
====================================================== */

export const getSliders = () => api.get("/sliders");
