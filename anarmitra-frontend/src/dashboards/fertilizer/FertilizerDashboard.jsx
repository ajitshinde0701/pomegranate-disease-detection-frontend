import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";

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

export default function FertilizerDashboard() {
  const storeId = Number(localStorage.getItem("userId"));

  const emptyProduct = {
    name: "",
    category: "Fertilizer",
    price: "",
    quantity: "",
    image: "",
    description: "",
    sellerId: storeId,
  };

  const [section, setSection] = useState("products");
  const [message, setMessage] = useState("");

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [requests, setRequests] = useState([]);

  const [selectedFarmerId, setSelectedFarmerId] =
    useState("");

  const [conversation, setConversation] = useState([]);

  const [chatText, setChatText] = useState("");

  const [billFarmerId, setBillFarmerId] = useState("");

  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const [bills, setBills] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await getProducts(storeId);
      setProducts(res.data);
    } catch {
      setMessage("Failed to load products.");
    }
  };

  const loadRequests = async () => {
    try {
      const res = await getReceiverRequests(storeId);
      setRequests(res.data);
    } catch {
      setMessage("Failed to load farmer requests.");
    }
  };

  const loadBills = async () => {
    try {
      const res = await getSellerBills(storeId);
      setBills(res.data);
    } catch {
      setMessage("Failed to load bills.");
    }
  };

  useEffect(() => {
    loadProducts();
    loadRequests();
    loadBills();
  }, []);

  const handleProductChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetProductForm = () => {
    setProductForm(emptyProduct);
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (
      !productForm.name ||
      !productForm.price ||
      !productForm.quantity
    ) {
      setMessage(
        "Product name, price and quantity are required."
      );
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity),
      sellerId: storeId,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);

        setMessage("Product updated successfully.");
      } else {
        await addProduct(payload);

        setMessage("Product added successfully.");
      }

      resetProductForm();

      loadProducts();
    } catch {
      setMessage("Product save failed.");
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setProductForm({
      name: product.name || "",
      category: product.category || "Fertilizer",
      price: product.price || "",
      quantity: product.quantity || "",
      image: product.image || "",
      description: product.description || "",
      sellerId: storeId,
    });

    setSection("products");
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);

      setMessage("Product deleted successfully.");

      loadProducts();
    } catch {
      setMessage("Product delete failed.");
    }
  };

  const changeRequestStatus = async (
    id,
    status
  ) => {
    try {
      await updateRequestStatus(id, status);

      setMessage(
        `Request ${status.toLowerCase()} successfully.`
      );

      loadRequests();
    } catch {
      setMessage("Failed to update request.");
    }
  };

  const openChat = async (farmerId) => {
    setSelectedFarmerId(farmerId);

    setSection("chat");

    try {
      const res = await getConversation(
        storeId,
        farmerId
      );

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
        senderId: storeId,
        receiverId: Number(selectedFarmerId),
        message: chatText,
      });

      setChatText("");

      openChat(Number(selectedFarmerId));
    } catch {
      setMessage("Message sending failed.");
    }
  };

  const updateBillItem = (
    index,
    field,
    value
  ) => {
    const copy = [...items];

    copy[index][field] = value;

    setItems(copy);
  };

  const addBillItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeBillItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const createFarmerBill = async () => {
    if (!billFarmerId) {
      setMessage("Enter Farmer ID.");
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

        sellerId: storeId,

        sellerType: "FERTILIZER_STORE",

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
        <h1>Fertilizer Store Dashboard</h1>

        <p>
          Manage fertilizer/pesticide products,
          farmer requests, chat, stock and billing.
        </p>
      </div>

      {message && (
        <div className="success-box">{message}</div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🛒 Products & Stock</h3>

          <p>
            Add, edit, delete and manage
            fertilizer/pesticide stock.
          </p>

          <button
            className="dashboard-btn"
            onClick={() => setSection("products")}
          >
            Manage Products
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📩 Farmer Requests</h3>

          <p>
            Accept or reject farmer service
            requests.
          </p>

          <button
            className="dashboard-btn"
            onClick={() => setSection("requests")}
          >
            View Requests
          </button>
        </div>

        <div className="dashboard-card">
          <h3>💬 Farmer Chat</h3>

          <p>Communicate with farmers directly.</p>

          <button
            className="dashboard-btn orange"
            onClick={() => setSection("chat")}
          >
            Open Chat
          </button>
        </div>

        <div className="dashboard-card">
          <h3>🧾 Billing</h3>

          <p>
            Create bills for farmers and view
            billing history.
          </p>

          <button
            className="dashboard-btn orange"
            onClick={() => setSection("billing")}
          >
            Create Bill
          </button>
        </div>
      </div>

      {section === "products" && (
        <>
          <div
            className="dashboard-card"
            style={{ marginTop: "25px" }}
          >
            <h3>
              {editingId
                ? "✏️ Update Product"
                : "➕ Add Product"}
            </h3>

            <div className="form-grid">
              <input
                className="dashboard-input"
                name="name"
                placeholder="Product Name"
                value={productForm.name}
                onChange={handleProductChange}
              />

              <select
                className="dashboard-input"
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
              >
                <option value="Fertilizer">
                  Fertilizer
                </option>

                <option value="Pesticide">
                  Pesticide
                </option>

                <option value="Organic">
                  Organic
                </option>

                <option value="Tools">Tools</option>
              </select>

              <input
                className="dashboard-input"
                name="price"
                type="number"
                placeholder="Price"
                value={productForm.price}
                onChange={handleProductChange}
              />

              <input
                className="dashboard-input"
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={productForm.quantity}
                onChange={handleProductChange}
              />

              <input
                className="dashboard-input"
                name="image"
                placeholder="Image URL"
                value={productForm.image}
                onChange={handleProductChange}
              />

              <input
                className="dashboard-input"
                name="description"
                placeholder="Description"
                value={productForm.description}
                onChange={handleProductChange}
              />
            </div>

            <button
              className="dashboard-btn"
              onClick={saveProduct}
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                className="dashboard-btn red"
                onClick={resetProductForm}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="product-grid">
            {products.length === 0 ? (
              <div className="dashboard-card">
                <h3>No Products Found</h3>

                <p>
                  Add fertilizer or pesticide
                  products.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  className="product-card"
                  key={product.id}
                >
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={product.name}
                  />

                  <div className="product-body">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p>{product.description}</p>

                    <div className="product-price">
                      ₹{product.price}
                    </div>

                    <div
                      className={
                        product.quantity > 0
                          ? "stock-ok"
                          : "stock-empty"
                      }
                    >
                      Stock: {product.quantity}
                    </div>

                    <div className="product-actions">
                      <button
                        className="dashboard-btn"
                        onClick={() =>
                          editProduct(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="dashboard-btn red"
                        onClick={() =>
                          removeProduct(product.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}