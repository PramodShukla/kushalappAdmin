import api from "./apiClient";


/* ======================================================
   User APIs
====================================================== */

export const getUsers = () => api.get("/users");

