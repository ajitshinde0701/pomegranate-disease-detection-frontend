import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";

import { getConversation, sendMessage } from "../../api/chatApi";
import advisorApi from "../../api/advisorApi";

function FarmerChat() {

  const senderId = Number(localStorage.getItem("userId"));

  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  const [conversation, setConversation] = useState([]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAdvisors();
  }, []);

  const loadAdvisors = async () => {
    try {

      const res = await advisorApi.get("/api/advisors");

      setAdvisors(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const loadConversation = async (advisorId) => {

    setSelectedAdvisor(advisorId);

    try {

      const res = await getConversation(
        senderId,
        advisorId
      );

      setConversation(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {

    if (!message || !selectedAdvisor) return;

    await sendMessage({
      senderId,
      receiverId: selectedAdvisor,
      message
    });

    setMessage("");

    loadConversation(selectedAdvisor);
  };

  return (
    <Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
      >
        Advisor Chat
      </Typography>

      <Stack direction="row" spacing={2}>

        <Paper
          sx={{
            width: 300,
            p: 2
          }}
        >
          <Typography variant="h6">
            Advisors
          </Typography>

          <List>

            {advisors.map((advisor) => (

              <ListItem
                key={advisor.id}
                disablePadding
              >
                <ListItemButton
                  onClick={() =>
                    loadConversation(advisor.id)
                  }
                >
                  <ListItemText
                    primary={advisor.name}
                    secondary={advisor.specialization}
                  />
                </ListItemButton>
              </ListItem>

            ))}

          </List>
        </Paper>

        <Paper
          sx={{
            flex: 1,
            p: 2
          }}
        >

          <Typography
            variant="h6"
            mb={2}
          >
            Conversation
          </Typography>

          <Box
            sx={{
              height: 350,
              overflowY: "auto",
              mb: 2
            }}
          >

            {conversation.map((chat) => (

              <Box
                key={chat.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    chat.senderId === senderId
                      ? "flex-end"
                      : "flex-start",
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background:
                      chat.senderId === senderId
                        ? "#2e7d32"
                        : "#e0e0e0",
                    color:
                      chat.senderId === senderId
                        ? "#fff"
                        : "#000"
                  }}
                >
                  {chat.message}
                </Box>
              </Box>

            ))}

          </Box>

          <Stack
            direction="row"
            spacing={1}
          >

            <TextField
              fullWidth
              label="Type Message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <Button
              variant="contained"
              onClick={handleSend}
            >
              Send
            </Button>

          </Stack>

        </Paper>

      </Stack>

    </Box>
  );
}

export default FarmerChat;