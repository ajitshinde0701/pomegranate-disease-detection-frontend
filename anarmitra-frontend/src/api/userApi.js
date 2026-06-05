import api from "./axiosConfig";

export const getUserCounts = () => api.get("/users/counts");

export const getAllUsers = () => api.get("/users");

export const deleteUserById = (id) => api.delete(`/users/${id}`);

export const getFarmers = () => api.get("/farmers");

export const getMerchants = () => api.get("/merchants");

export const getAdvisors = () => api.get("/advisors");

export const getFertilizerStores = () => api.get("/fertilizer-stores");