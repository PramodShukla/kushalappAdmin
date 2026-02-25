import api from "./apiClient";

export const getOffers = () => api.get("/offers");

export const getOffer = (id) => api.get(`/offers/${offerId}`);

export const createOffer = (data) =>
  api.post("/offers", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateOffer = (id, data) =>
  api.put(`/offers/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteOffer = (id) => api.delete(`/offers/${id}`);

export const addOfferItem = (offerId, itemId, type) =>
  api.put(`/offers/add-item/${offerId}`, {
    ids: [itemId],           // <-- must be array
    type: type.toLowerCase(), // lowercase as API expects
  });

export const removeOfferItem = (offerId, itemId, type) =>
  api.put(`/offers/remove-item`, {
    offerId,
    itemId,
    type,
  });

export const getOfferItems = (id) => api.get(`/offers/items/${id}`);
