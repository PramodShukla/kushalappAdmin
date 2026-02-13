import api from "./apiClient";

/* ======================================================
   User APIs (File Upload Supported)
====================================================== */

/* Get All */
export const getUsers = () => api.get("/users");

/* Get One */
export const getUserById = (id) => api.get(`/users/${id}`);

/* Create User (supports image) */
export const createUser = (data) => {
  const isFormData = data instanceof FormData;

  return api.post("/users", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
};

/* Update User (image optional) */
export const updateUser = (id, data) => {
  const isFormData = data instanceof FormData;

  return api.put(`/users/${id}`, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
};

/* Delete */
export const deleteUser = (id) => api.delete(`/users/${id}`);
