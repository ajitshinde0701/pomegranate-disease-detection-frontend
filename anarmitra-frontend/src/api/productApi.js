import api from "./axiosConfig";

export const addProduct = (data) => api.post("/products", data);

export const getProducts = (sellerId) =>
  api.get("/products", {
    params: sellerId ? { sellerId } : {}
  });

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);