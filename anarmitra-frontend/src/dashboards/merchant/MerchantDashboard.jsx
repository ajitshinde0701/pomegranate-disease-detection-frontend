import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

import {
  getReceiverRequests,
  updateRequestStatus,
} from "../../api/requestApi";

import {
  getConversation,
  sendMessage,
} from "../../api/chatApi";

import {
  createBill,
  getSellerBills,
} from "../../api/billApi";

export default function MerchantDashboard() {
  const merchantId = Number(localStorage.getItem("userId"));

  const [section, setSection] = useState("requests");
  const [message, setMessage] = useState("");

  const [requests, setRequests] = useState([]);

  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [conversation, setConversation] = useState([]);
  const [chatText, setChatText] = useState("");

  const [bills, setBills] = useState([]);
  const [billFarmerId, setBillFarmerId] = useState("");

  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const loadRequests = async () => {
    try {
      const res = await getReceiverRequests(merchantId);
      setRequests(res.data);
    } catch (error) {
      setMessage("Failed to load farmer requests.");
    }
  };

  const loadBills = async () => {
    try {
      const res = await getSellerBills(merchantId);
      setBills(res.data);
    } catch (error) {
      setMessage("Failed to load billing history.");
    }
  };

  useEffect(() => {
    loadRequests();
    loadBills();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status);

      setMessage(`Request ${status.toLowerCase()} successfully.`);

      loadRequests();
    } catch {
      setMessage("Failed to update request status.");
    }
  };

  const openChat = async (farmerId) => {
    setSelectedFarmerId(farmerId);
    setSection("chat");

    try {
      const res = await getConversation(merchantId, farmerId);
      setConversation(res.data);
    } catch {
      setMessage("Failed to load conversation.");
    }
  };

  const sendChatMessage = async () => {
    if (!selectedFarmerId || !chatText.trim()) {
      setMessage("Select farmer and type message.");
      return;
    }

    try {
      await sendMessage({
        senderId: merchantId,
        receiverId: Number(selectedFarmerId),
        message: chatText,
      });

      setChatText("");

      openChat(Number(selectedFarmerId));
    } catch {
      setMessage("Message sending failed.");
    }
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        itemName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const createFarmerBill = async () => {
    if (!billFarmerId) {
      setMessage("Enter Farmer ID for bill.");
      return;
    }

    const validItems = items.filter((item) =>
      item.itemName.trim()
    );

    if (validItems.length === 0) {
      setMessage("Add at least one bill item.");
      return;
    }

    try {
      await createBill({
        farmerId: Number(billFarmerId),
        sellerId: merchantId,
        sellerType: "MERCHANT",

        items: validItems.map((item) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      });

      setMessage("Bill created and sent to farmer.");

      setBillFarmerId("");

      setItems([
        {
          itemName: "",
          quantity: 1,
          price: 0,
        },
      ]);

      loadBills();
    } catch {
      setMessage("Bill creation failed.");
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <h1>Merchant Dashboard</h1>

        <p>
          Manage farmer requests, chat, product inquiry and
          billing.
        </p>
      </div>

      {message && (
        <div className="success-box">{message}</div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📩 Farmer Requests</h3>

          <p>View and respond to farmer inquiries.</p>

          <button
            className="dashboard-btn"
            onClick={() => setSection("requests")}
          >
            View Requests
          </button>
        </div>

        <div className="dashboard-card">
          <h3>💬 Farmer Chat</h3>

          <p>Communicate directly with farmers.</p>

          <button
            className="dashboard-btn"
            onClick={() => setSection("chat")}
          >
            Open Chat
          </button>
        </div>

        <div className="dashboard-card">
          <h3>🧾 Billing System</h3>

          <p>Create and send bills to farmers.</p>

          <button
            className="dashboard-btn orange"
            onClick={() => setSection("billing")}
          >
            Create Bill
          </button>
        </div>
      </div>

      {section === "requests" && (
        <div
          className="dashboard-card"
          style={{ marginTop: "25px" }}
        >
          <div className="section-title-row">
            <h3>Farmer Requests</h3>

            <button
              className="dashboard-btn"
              onClick={loadRequests}
            >
              Refresh
            </button>
          </div>

          {requests.length === 0 ? (
            <p>No farmer requests found.</p>
          ) : (
            requests.map((req) => (
              <div className="request-item" key={req.id}>
                <p>
                  <b>Request ID:</b> {req.id}
                </p>

                <p>
                  <b>Farmer ID:</b> {req.farmerId}
                </p>

                <p>
                  <b>Subject:</b>{" "}
                  {req.subject || "Farmer Request"}
                </p>

                <p>
                  <b>Message:</b> {req.message}
                </p>

                <p>
                  <b>Status:</b> {req.status}
                </p>

                <button
                  className="dashboard-btn"
                  onClick={() =>
                    changeStatus(req.id, "ACCEPTED")
                  }
                >
                  Accept
                </button>

                <button
                  className="dashboard-btn red"
                  onClick={() =>
                    changeStatus(req.id, "REJECTED")
                  }
                >
                  Reject
                </button>

                <button
                  className="dashboard-btn orange"
                  onClick={() => openChat(req.farmerId)}
                >
                  Chat
                </button>

                <button
                  className="dashboard-btn"
                  onClick={() => {
                    setBillFarmerId(req.farmerId);
                    setSection("billing");
                  }}
                >
                  Create Bill
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {section === "chat" && (
        <div
          className="dashboard-card"
          style={{ marginTop: "25px" }}
        >
          <h3>Farmer Chat</h3>

          <input
            className="dashboard-input"
            type="number"
            placeholder="Enter Farmer ID"
            value={selectedFarmerId}
            onChange={(e) =>
              setSelectedFarmerId(e.target.value)
            }
          />

          <button
            className="dashboard-btn"
            onClick={() =>
              openChat(Number(selectedFarmerId))
            }
          >
            Load Conversation
          </button>

          <div className="chat-window">
            {conversation.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              conversation.map((chat) => (
                <div
                  key={chat.id}
                  className={
                    chat.senderId === merchantId
                      ? "chat-bubble mine"
                      : "chat-bubble other"
                  }
                >
                  <p>{chat.message}</p>

                  <small>
                    {chat.sentAt
                      ? new Date(
                          chat.sentAt
                        ).toLocaleString()
                      : ""}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="chat-input-row">
            <input
              className="dashboard-input"
              placeholder="Type message..."
              value={chatText}
              onChange={(e) =>
                setChatText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendChatMessage();
                }
              }}
            />

            <button
              className="dashboard-btn orange"
              onClick={sendChatMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {section === "billing" && (
        <div
          className="dashboard-card"
          style={{ marginTop: "25px" }}
        >
          <h3>Create Farmer Bill</h3>

          <input
            className="dashboard-input"
            type="number"
            placeholder="Farmer ID"
            value={billFarmerId}
            onChange={(e) =>
              setBillFarmerId(e.target.value)
            }
          />

          {items.map((item, index) => (
            <div className="bill-item-row" key={index}>
              <input
                className="dashboard-input"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  updateItem(
                    index,
                    "itemName",
                    e.target.value
                  )
                }
              />

              <input
                className="dashboard-input"
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
              />

              <input
                className="dashboard-input"
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  updateItem(
                    index,
                    "price",
                    e.target.value
                  )
                }
              />

              <button
                className="dashboard-btn red"
                onClick={() => removeItemRow(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="dashboard-btn"
            onClick={addItemRow}
          >
            Add Item
          </button>

          <button
            className="dashboard-btn orange"
            onClick={createFarmerBill}
          >
            Send Bill
          </button>

          <div style={{ marginTop: "30px" }}>
            <h3>Billing History</h3>

            {bills.length === 0 ? (
              <p>No bills found.</p>
            ) : (
              bills.map((bill) => (
                <div className="bill-card" key={bill.id}>
                  <h4>Bill #{bill.id}</h4>

                  <p>
                    <b>Farmer ID:</b> {bill.farmerId}
                  </p>

                  <p>
                    <b>Seller Type:</b> {bill.sellerType}
                  </p>

                  <p>
                    <b>Total Amount:</b> ₹
                    {bill.totalAmount}
                  </p>

                  {bill.items?.map((item) => (
                    <p key={item.id}>
                      {item.itemName} | Qty:{" "}
                      {item.quantity} | Price: ₹
                      {item.price} | Total: ₹
                      {item.total}
                    </p>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}