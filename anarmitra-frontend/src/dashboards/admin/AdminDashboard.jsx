import { useEffect, useState } from "react";
import "../../styles/dashboard.css";

import {
  getAllUsers,
  getUserCounts,
  deleteUserById
} from "../../api/userApi";

import { uploadMarketCsv } from "../../api/marketApi";
import api from "../../api/axiosConfig";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    farmers: 0,
    merchants: 0,
    advisors: 0,
    fertilizerStores: 0,
    admins: 0
  });

  const [users, setUsers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("users");

  const [suggestion, setSuggestion] = useState({
    diseaseName: "",
    treatment: "",
    fertilizerRecommendation: "",
    pesticideRecommendation: ""
  });

  const loadAdminData = async () => {
    try {
      const countRes = await getUserCounts();
      const userRes = await getAllUsers();

      setCounts(countRes.data);
      setUsers(userRes.data);
      setMessage("Admin data loaded successfully.");
    } catch (error) {
      console.log(error);
      setMessage("Failed to load admin data. Check backend, token, and database.");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteUserById(id);
      setMessage("User deleted successfully.");
      loadAdminData();
    } catch (error) {
      console.log(error);
      setMessage("User delete failed.");
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setMessage("Please select CSV file first.");
      return;
    }

    try {
      const res = await uploadMarketCsv(csvFile);
      setMessage(res.data.message || "CSV uploaded successfully.");
      setCsvFile(null);
    } catch (error) {
      console.log(error);
      setMessage("CSV upload failed. Check CSV header and backend.");
    }
  };

  const handleSuggestionChange = (e) => {
    setSuggestion({
      ...suggestion,
      [e.target.name]: e.target.value
    });
  };

  const saveDiseaseSuggestion = async () => {
    if (!suggestion.diseaseName || !suggestion.treatment) {
      setMessage("Disease name and treatment are required.");
      return;
    }

    try {
      await api.post("/disease/suggestions", suggestion);

      setMessage("Disease suggestion added successfully.");

      setSuggestion({
        diseaseName: "",
        treatment: "",
        fertilizerRecommendation: "",
        pesticideRecommendation: ""
      });
    } catch (error) {
      console.log(error);
      setMessage("Failed to add disease suggestion.");
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, market data, disease suggestions and analytics.</p>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Farmers</span>
          <h2>{counts.farmers || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Merchants</span>
          <h2>{counts.merchants || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Advisors</span>
          <h2>{counts.advisors || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Fertilizer Stores</span>
          <h2>{counts.fertilizerStores || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Admins</span>
          <h2>{counts.admins || 0}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>👥 User Management</h3>
          <p>View, refresh and delete registered users.</p>

          <button
            className="dashboard-btn"
            onClick={() => {
              setActiveSection("users");
              loadAdminData();
            }}
          >
            Manage Users
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📊 Market Data</h3>
          <p>Upload pomegranate market CSV data into MySQL.</p>

          <button
            className="dashboard-btn orange"
            onClick={() => setActiveSection("market")}
          >
            Upload CSV
          </button>
        </div>

        <div className="dashboard-card">
          <h3>🧠 Disease Suggestions</h3>
          <p>Add treatment, fertilizer and pesticide recommendations.</p>

          <button
            className="dashboard-btn"
            onClick={() => setActiveSection("suggestions")}
          >
            Add Suggestion
          </button>
        </div>
      </div>

      {activeSection === "users" && (
        <div className="dashboard-card" style={{ marginTop: "30px" }}>
          <div className="section-title-row">
            <h3>Registered Users</h3>

            <button className="dashboard-btn" onClick={loadAdminData}>
              Refresh
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="table-delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === "market" && (
        <div className="dashboard-card" style={{ marginTop: "30px" }}>
          <h3>Upload Market CSV</h3>

          <p>
            CSV header must be:
            <br />
            <b>year,market,district,variety,minPrice,maxPrice,modalPrice,arrivals</b>
          </p>

          <input
            className="dashboard-input"
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
          />

          <button className="dashboard-btn orange" onClick={handleCsvUpload}>
            Upload CSV To Database
          </button>
        </div>
      )}

      {activeSection === "suggestions" && (
        <div className="dashboard-card" style={{ marginTop: "30px" }}>
          <h3>Add Disease Suggestion</h3>

          <input
            className="dashboard-input"
            name="diseaseName"
            placeholder="Disease Name"
            value={suggestion.diseaseName}
            onChange={handleSuggestionChange}
          />

          <textarea
            className="dashboard-input"
            name="treatment"
            placeholder="Treatment"
            value={suggestion.treatment}
            onChange={handleSuggestionChange}
          />

          <textarea
            className="dashboard-input"
            name="fertilizerRecommendation"
            placeholder="Fertilizer Recommendation"
            value={suggestion.fertilizerRecommendation}
            onChange={handleSuggestionChange}
          />

          <textarea
            className="dashboard-input"
            name="pesticideRecommendation"
            placeholder="Pesticide Recommendation"
            value={suggestion.pesticideRecommendation}
            onChange={handleSuggestionChange}
          />

          <button className="dashboard-btn" onClick={saveDiseaseSuggestion}>
            Save Disease Suggestion
          </button>
        </div>
      )}
    </div>
  );
}