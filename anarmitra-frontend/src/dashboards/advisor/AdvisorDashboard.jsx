import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import "../../styles/dashboard.css";

import {
  getReceiverRequests,
  updateRequestStatus
} from "../../api/requestApi";

import { getConversation } from "../../api/chatApi";
import api from "../../api/axiosConfig";

export default function AdvisorDashboard() {
  const advisorId = Number(localStorage.getItem("userId"));

  const stompClientRef = useRef(null);
  const typingTimerRef = useRef(null);

  const [section, setSection] = useState("requests");
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [unread, setUnread] = useState({});

  const [advice, setAdvice] = useState({
    title: "",
    description: ""
  });

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Advisor WebSocket connected");

        client.subscribe(`/topic/chat/${advisorId}`, (msg) => {
          const received = JSON.parse(msg.body);

          setConversation((prev) => {
            const exists = prev.some((m) => m.id === received.id);
            if (exists) return prev;
            return [...prev, received];
          });

          if (received.senderId !== Number(selectedFarmerId)) {
            setUnread((prev) => ({
              ...prev,
              [received.senderId]: (prev[received.senderId] || 0) + 1
            }));
          }
        });

        client.subscribe("/topic/online", (msg) => {
          setOnlineUsers(JSON.parse(msg.body));
        });

        client.subscribe(`/topic/typing/${advisorId}`, (msg) => {
          const senderId = JSON.parse(msg.body);
          setTypingUser(senderId);

          setTimeout(() => {
            setTypingUser(null);
          }, 2000);
        });

        client.publish({
          destination: "/app/user.online",
          body: JSON.stringify(advisorId)
        });
      },

      onStompError: (frame) => {
        console.log("STOMP error:", frame);
        setMessage("WebSocket error. Check backend.");
      }
    });

    client.activate();
    stompClientRef.current = client;
  };

  const loadRequests = async () => {
    try {
      const res = await getReceiverRequests(advisorId);
      setRequests(res.data);
    } catch (error) {
      console.log(error);
      setMessage("Failed to load farmer requests.");
    }
  };

  useEffect(() => {
    loadRequests();
    connectWebSocket();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: "/app/user.offline",
          body: JSON.stringify(advisorId)
        });
      }

      stompClientRef.current?.deactivate();
    };
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      setMessage(`Request ${status.toLowerCase()} successfully.`);
      loadRequests();
    } catch {
      setMessage("Failed to update request status.");
    }
  };

  const openChat = async (farmerId) => {
    if (!farmerId) {
      setMessage("Enter or select farmer ID.");
      return;
    }

    setSelectedFarmerId(String(farmerId));
    setSection("chat");

    setUnread((prev) => ({
      ...prev,
      [farmerId]: 0
    }));

    try {
      const res = await getConversation(advisorId, farmerId);
      setConversation(res.data);
    } catch {
      setMessage("Failed to load conversation.");
    }
  };

  const sendTyping = () => {
    if (!selectedFarmerId || !stompClientRef.current?.connected) return;

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      stompClientRef.current.publish({
        destination: "/app/user.typing",
        body: JSON.stringify({
          senderId: advisorId,
          receiverId: Number(selectedFarmerId),
          message: ""
        })
      });
    }, 300);
  };

  const sendRealtimeMessage = () => {
    if (!selectedFarmerId || !chatMessage.trim()) {
      setMessage("Select farmer and type message.");
      return;
    }

    if (!stompClientRef.current?.connected) {
      setMessage("WebSocket not connected.");
      return;
    }

    const payload = {
      senderId: advisorId,
      receiverId: Number(selectedFarmerId),
      message: chatMessage
    };

    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(payload)
    });

    setChatMessage("");
  };

  const saveAdvice = async () => {
    if (!advice.title || !advice.description) {
      setMessage("Enter advice title and description.");
      return;
    }

    try {
      await api.post("/advice", advice);
      setMessage("Advice saved successfully.");
      setAdvice({ title: "", description: "" });
    } catch {
      setMessage("Failed to save advice. Make sure /api/advice backend exists.");
    }
  };

  const isSelectedFarmerOnline = onlineUsers.includes(Number(selectedFarmerId));

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <h1>Advisor Dashboard</h1>
        <p>Accept farmer requests, give advice and chat in real-time.</p>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>✅ Farmer Requests</h3>
          <p>Accept or reject farmer guidance requests.</p>
          <button className="dashboard-btn" onClick={() => setSection("requests")}>
            Manage Requests
          </button>
        </div>

        <div className="dashboard-card">
          <h3>🌿 Crop Guidance</h3>
          <p>Give disease, fertilizer and farming suggestions.</p>
          <button className="dashboard-btn" onClick={() => setSection("advice")}>
            Give Advice
          </button>
        </div>

        <div className="dashboard-card">
          <h3>💬 Advanced Chat</h3>
          <p>Real-time chat with online status, typing and unread count.</p>
          <button className="dashboard-btn orange" onClick={() => setSection("chat")}>
            Open Chat
          </button>
        </div>
      </div>

      {section === "requests" && (
        <div className="dashboard-card" style={{ marginTop: "25px" }}>
          <h3>Farmer Requests</h3>

          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            requests.map((req) => (
              <div className="request-item" key={req.id}>
                <p><b>Farmer ID:</b> {req.farmerId}</p>
                <p><b>Subject:</b> {req.subject || "Farmer Request"}</p>
                <p><b>Message:</b> {req.message}</p>
                <p><b>Status:</b> {req.status}</p>

                {unread[req.farmerId] > 0 && (
                  <span className="badge">{unread[req.farmerId]}</span>
                )}

                <div style={{ marginTop: "12px" }}>
                  <button
                    className="dashboard-btn"
                    onClick={() => handleStatus(req.id, "ACCEPTED")}
                  >
                    Accept
                  </button>

                  <button
                    className="dashboard-btn red"
                    onClick={() => handleStatus(req.id, "REJECTED")}
                  >
                    Reject
                  </button>

                  <button
                    className="dashboard-btn orange"
                    onClick={() => openChat(req.farmerId)}
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {section === "advice" && (
        <div className="dashboard-card" style={{ marginTop: "25px" }}>
          <h3>Add Crop Advice</h3>

          <input
            className="dashboard-input"
            name="title"
            placeholder="Advice Title"
            value={advice.title}
            onChange={(e) =>
              setAdvice({ ...advice, [e.target.name]: e.target.value })
            }
          />

          <textarea
            className="dashboard-input"
            name="description"
            placeholder="Advice Description"
            value={advice.description}
            onChange={(e) =>
              setAdvice({ ...advice, [e.target.name]: e.target.value })
            }
          />

          <button className="dashboard-btn" onClick={saveAdvice}>
            Save Advice
          </button>
        </div>
      )}

      {section === "chat" && (
        <div className="dashboard-card" style={{ marginTop: "25px" }}>
          <h3>Advanced Real-time Chat</h3>

          <input
            className="dashboard-input"
            type="number"
            placeholder="Enter Farmer ID"
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
          />

          <button
            className="dashboard-btn"
            onClick={() => openChat(Number(selectedFarmerId))}
          >
            Load Conversation
          </button>

          {selectedFarmerId && (
            <p className="chat-status">
              {isSelectedFarmerOnline ? "🟢 Online" : "⚫ Offline"}
            </p>
          )}

          {typingUser === Number(selectedFarmerId) && (
            <p className="typing-text">Farmer is typing...</p>
          )}

          <div className="chat-window">
            {conversation.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              conversation.map((chat, index) => (
                <div
                  key={chat.id || index}
                  className={
                    chat.senderId === advisorId
                      ? "chat-bubble mine"
                      : "chat-bubble other"
                  }
                >
                  <p>{chat.message}</p>
                  <small>
                    {chat.sentAt
                      ? new Date(chat.sentAt).toLocaleTimeString()
                      : "Sending..."}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="chat-input-row">
            <input
              className="dashboard-input"
              placeholder="Type message..."
              value={chatMessage}
              onChange={(e) => {
                setChatMessage(e.target.value);
                sendTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendRealtimeMessage();
              }}
            />

            <button className="dashboard-btn orange" onClick={sendRealtimeMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}