import api from "./axiosConfig";

export const createBill = (data) => api.post("/bills", data);

export const getFarmerBills = (farmerId) =>
  api.get(`/bills/farmer/${farmerId}`);

export const getSellerBills = (sellerId) =>
  api.get(`/bills/seller/${sellerId}`);

export const downloadBill = async (billId) => {
  const response = await api.get(`/bills/${billId}/download`, {
    responseType: "blob"
  });

  const blob = new Blob([response.data], {
    type: "application/pdf"
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `bill_${billId}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};