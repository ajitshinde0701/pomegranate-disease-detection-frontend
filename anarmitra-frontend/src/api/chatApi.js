import api from "./axiosConfig";

export const sendMessage = (data) => api.post("/chat/send", data);

export const getConversation = (senderId, receiverId) =>
  api.get("/chat/conversation", {
    params: { senderId, receiverId }
  });