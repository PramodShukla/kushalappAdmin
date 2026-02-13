import api from "./apiClient";

/* =========================================
   Providers APIs (File Upload Supported)
========================================= */

/* Get All Providers */
export const getProviders = () => api.get("/providers");

/* Get One Provider by ID */
export const getProvider = async (id) => {
  try {
    // Primary API
    return await api.get(`/providers/details/${id}`);
  } catch (error) {
    // Fallback: fetch all and find
    const res = await api.get("/providers");

    const list = Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data)
      ? res.data
      : [];

    const item = list.find((p) => p._id === id);

    return { data: item };
  }
};

/* Create Provider (File Upload Supported) */
export const createProvider = (data) => {
  // 'data' should be FormData
  return api.post("/providers/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* Update Provider (File Upload Optional) */
export const updateProvider = (id, data) => {
  // If data is FormData → upload file
  // If normal JSON object → update as JSON
  const isFormData = data instanceof FormData;

  return api.put(`/providers/${id}`, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
};

/* Delete Provider */
export const deleteProvider = (id) => api.delete(`/providers/${id}`);
