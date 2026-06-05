import api from "./axiosConfig";

export const createFarmerRequest = (data) => api.post("/requests", data);

export const getReceiverRequests = (receiverId) =>
  api.get(`/requests/receiver/${receiverId}`);

export const getFarmerRequests = (farmerId) =>
  api.get(`/requests/farmer/${farmerId}`);

export const updateRequestStatus = (id, status) =>
  api.put(`/requests/${id}/status`, null, {
    params: { status }
  });