import api from "./axiosConfig";

export const uploadMarketCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/market/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getMarketData = (filters = {}) => {
  return api.get("/market", { params: filters });
};

export const predictMarketPrice = (filters = {}) => {
  return api.get("/market/predict", { params: filters });
};