import api from "./apiClient";

export const getOffers = () => api.get("/offers");

export const getOffer = (id) => api.get(`/offers/${id}`);

export const createOffer = (data) =>
  api.post("/offers", data, { headers: { "Content-Type": "multipart/form-data" } });

export const updateOffer = (id, data) =>
  api.put(`/offers/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteOffer = (id) => api.delete(`/offers/${id}`);
