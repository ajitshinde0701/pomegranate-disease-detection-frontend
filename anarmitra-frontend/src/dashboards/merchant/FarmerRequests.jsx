import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import {
  getReceiverRequests,
  updateRequestStatus
} from "../../api/requestApi";

import {
  getConversation,
  sendMessage
} from "../../api/chatApi";

function FarmerRequests() {
  const merchantId = Number(localStorage.getItem("userId"));

  const [requests, setRequests] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");

  const loadRequests = async () => {
    const res = await getReceiverRequests(merchantId);
    setRequests(res.data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const changeStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    setInfo(`Request ${status.toLowerCase()} successfully.`);
    loadRequests();
  };

  const openChat = async (farmerId) => {
    setSelectedFarmerId(farmerId);
    const res = await getConversation(merchantId, farmerId);
    setConversation(res.data);
  };

  const handleSend = async () => {
    if (!selectedFarmerId || !message) {
      setInfo("Select farmer and type message first.");
      return;
    }

    await sendMessage({
      senderId: merchantId,
      receiverId: Number(selectedFarmerId),
      message
    });

    setMessage("");
    openChat(Number(selectedFarmerId));
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Farmer Requests
      </Typography>

      {info && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {info}
        </Alert>
      )}

      {requests.length === 0 && (
        <Alert severity="warning">No farmer requests found.</Alert>
      )}

      <Stack spacing={2}>
        {requests.map((req) => (
          <Card key={req.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight="bold">
                Farmer ID: {req.farmerId}
              </Typography>

              <Typography>Subject: {req.subject}</Typography>
              <Typography color="text.secondary">{req.message}</Typography>
              <Typography sx={{ mt: 1 }}>Status: {req.status}</Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => changeStatus(req.id, "ACCEPTED")}
                >
                  Accept
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => changeStatus(req.id, "REJECTED")}
                >
                  Reject
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openChat(req.farmerId)}
                >
                  Chat
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight="bold">
        Chat With Farmer
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Selected Farmer ID: {selectedFarmerId || "None"}
      </Typography>

      <Paper
        sx={{
          p: 2,
          height: 220,
          overflowY: "auto",
          background: "#f9fbf7",
          mb: 2
        }}
      >
        {conversation.map((chat) => (
          <Box
            key={chat.id}
            sx={{
              display: "flex",
              justifyContent:
                chat.senderId === merchantId ? "flex-end" : "flex-start",
              mb: 1
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                background:
                  chat.senderId === merchantId ? "#2e7d32" : "#eeeeee",
                color: chat.senderId === merchantId ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 3
              }}
            >
              {chat.message}
            </Box>
          </Box>
        ))}
      </Paper>

      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}

export default FarmerRequests;