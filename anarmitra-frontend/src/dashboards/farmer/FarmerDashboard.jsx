import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";

import {
  getAdvisors,
  getFertilizerStores,
  getMerchants,
  getUserCounts
} from "../../api/userApi";

import { getMarketData, predictMarketPrice } from "../../api/marketApi";
import { detectDisease } from "../../api/diseaseApi";
import { getFarmerBills, downloadBill } from "../../api/billApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";

export default function FarmerDashboard() {
  const farmerId = Number(localStorage.getItem("userId"));

  const [counts, setCounts] = useState({});
  const [merchants, setMerchants] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [stores, setStores] = useState([]);

  const [marketData, setMarketData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    year: "",
    market: "",
    district: "",
    variety: ""
  });

  const [leafFile, setLeafFile] = useState(null);
  const [leafPreview, setLeafPreview] = useState("");
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  const [bills, setBills] = useState([]);

  const loadAll = async () => {
    try {
      const [countRes, merchantRes, advisorRes, storeRes] = await Promise.all([
        getUserCounts(),
        getMerchants(),
        getAdvisors(),
        getFertilizerStores()
      ]);

      setCounts(countRes.data);
      setMerchants(merchantRes.data);
      setAdvisors(advisorRes.data);
      setStores(storeRes.data);
    } catch {
      setMessage("Backend not connected or token expired.");
    }
  };

  const loadFarmerBills = async () => {
    try {
      const res = await getFarmerBills(farmerId);
      setBills(res.data);
    } catch {
      setMessage("Failed to load bills.");
    }
  };

  const cleanFilters = () => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });
    return params;
  };

  const loadMarket = async () => {
    try {
      const res = await getMarketData(cleanFilters());
      setMarketData(res.data);

      if (res.data.length === 0) {
        setMessage("No market data found. Admin must upload CSV first.");
      } else {
        setMessage("Market analysis loaded successfully.");
      }
    } catch {
      setMessage("Market data not available. Admin must upload CSV first.");
    }
  };

  const getPrediction = async () => {
    try {
      const res = await predictMarketPrice(cleanFilters());
      setPrediction(Number(res.data.predictedPrice));
      setMessage("Prediction generated successfully.");
    } catch {
      setMessage("Prediction failed. Market data not available.");
    }
  };

  useEffect(() => {
    loadAll();
    loadMarket();
    loadFarmerBills();
  }, []);

  const bestMarket = useMemo(() => {
    if (!marketData.length) return null;
    return [...marketData].sort((a, b) => b.modalPrice - a.modalPrice)[0];
  }, [marketData]);

  const lowestMarket = useMemo(() => {
    if (!marketData.length) return null;
    return [...marketData].sort((a, b) => a.modalPrice - b.modalPrice)[0];
  }, [marketData]);

  const averagePrice = useMemo(() => {
    if (!marketData.length) return 0;
    const total = marketData.reduce(
      (sum, item) => sum + Number(item.modalPrice),
      0
    );
    return total / marketData.length;
  }, [marketData]);

  const totalArrivals = useMemo(() => {
    return marketData.reduce(
      (sum, item) => sum + Number(item.arrivals || 0),
      0
    );
  }, [marketData]);

  const predictionGraphData = useMemo(() => {
    if (!marketData.length) return [];

    const sorted = [...marketData].sort(
      (a, b) => Number(a.year) - Number(b.year)
    );

    const baseData = sorted.map((item) => ({
      name: `${item.market}-${item.year}`,
      actualPrice: Number(item.modalPrice),
      predictedPrice: null
    }));

    if (prediction) {
      baseData.push({
        name: "Next Prediction",
        actualPrice: null,
        predictedPrice: prediction
      });
    }

    return baseData;
  }, [marketData, prediction]);

  const insightText = useMemo(() => {
    if (!marketData.length) {
      return "No market data available. Ask admin to upload market CSV.";
    }

    let text = `Best selling market is ${bestMarket.market} with modal price ₹${bestMarket.modalPrice}. `;

    if (prediction && prediction > averagePrice) {
      text +=
        "Prediction is higher than current average price, so farmer may wait if storage is available.";
    } else if (prediction && prediction < averagePrice) {
      text +=
        "Prediction is lower than current average price, so farmer may consider selling soon.";
    } else {
      text += "Compare nearby markets before selling.";
    }

    return text;
  }, [marketData, bestMarket, prediction, averagePrice]);

  const handleLeafChange = (e) => {
    const file = e.target.files[0];
    setLeafFile(file);
    setDiseaseResult(null);

    if (file) {
      setLeafPreview(URL.createObjectURL(file));
    }
  };

  const runDiseaseDetection = async () => {
    if (!leafFile) {
      setMessage("Please select pomegranate leaf image first.");
      return;
    }

    try {
      setDiseaseLoading(true);
      const res = await detectDisease(farmerId, leafFile);
      
      
      setDiseaseResult(res);
      setMessage("Disease detection completed successfully.");
    } catch {
      setMessage(
        "Disease detection failed. Check FastAPI ML server and trained model."
      );
    } finally {
      setDiseaseLoading(false);
    }
  };

  const renderUsers = (title, data) => (
    <div className="dashboard-card">
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="service-grid">
          {data.map((user) => (
            <div className="service-card" key={user.id}>
              <h4>{user.fullName}</h4>
              <p>
                <b>Role:</b> {user.role}
              </p>
              <p>
                <b>User ID:</b> {user.id}
              </p>
              <p>
                <b>Phone:</b> {user.phone}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Address:</b> {user.address}
              </p>

              <a className="contact-btn" href={`tel:${user.phone}`}>
                Call
              </a>

              <a
                className="contact-btn whatsapp"
                href={`https://wa.me/91${user.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <h1>Farmer Dashboard</h1>
        {/* <p>
          Advanced market analytics, disease detection, bill download and service
          contact.
        </p> */}
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Registered Merchants</span>
          <h2>{counts.merchants || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Registered Advisors</span>
          <h2>{counts.advisors || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Fertilizer Stores</span>
          <h2>{counts.fertilizerStores || 0}</h2>
        </div>

        <div className="stat-card">
          <span>Total Arrivals</span>
          <h2>{totalArrivals}</h2>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>📊 Smart Pomegranate Market Analytics</h3>
        {/* <p>
          Farmer can view market data uploaded by admin, apply filters and
          understand the best selling decision.
        </p> */}

        <div className="form-grid">
          <input
            className="dashboard-input"
            placeholder="Year e.g. 2026"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />

          <input
            className="dashboard-input"
            placeholder="Market e.g. Pune"
            value={filters.market}
            onChange={(e) =>
              setFilters({ ...filters, market: e.target.value })
            }
          />

          <input
            className="dashboard-input"
            placeholder="District e.g. Pune"
            value={filters.district}
            onChange={(e) =>
              setFilters({ ...filters, district: e.target.value })
            }
          />

          <input
            className="dashboard-input"
            placeholder="Variety e.g. Bhagwa"
            value={filters.variety}
            onChange={(e) =>
              setFilters({ ...filters, variety: e.target.value })
            }
          />
        </div>

        <button className="dashboard-btn" onClick={loadMarket}>
          Load Analysis
        </button>

        <button className="dashboard-btn orange" onClick={getPrediction}>
          Predict Price
        </button>
      </div>

      <div className="analytics-grid">
        <div className="insight-card best">
          <span>Best Market</span>
          <h2>{bestMarket ? bestMarket.market : "-"}</h2>
          <p>
            {bestMarket ? `₹${bestMarket.modalPrice} modal price` : "No data"}
          </p>
        </div>

        <div className="insight-card low">
          <span>Lowest Market</span>
          <h2>{lowestMarket ? lowestMarket.market : "-"}</h2>
          <p>
            {lowestMarket
              ? `₹${lowestMarket.modalPrice} modal price`
              : "No data"}
          </p>
        </div>

        <div className="insight-card avg">
          <span>Average Price</span>
          <h2>₹{averagePrice.toFixed(0)}</h2>
          <p>Based on filtered data</p>
        </div>

        <div className="insight-card predict">
          <span>Predicted Price</span>
          <h2>{prediction ? `₹${prediction.toFixed(0)}` : "-"}</h2>
          <p>ML/backend prediction</p>
        </div>
      </div>

      <div className="dashboard-card recommendation-card">
        <h3>🤖 Smart Farmer Suggestion</h3>
        <p>{insightText}</p>
      </div>

      <div className="charts-grid">
        <div className="dashboard-card">
          <h3>📈 Modal Price Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="modalPrice"
                stroke="#2e7d32"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>📦 Market Arrivals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="arrivals" fill="#f57c00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>💰 Min vs Max Price</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="minPrice" fill="#42a5f5" />
              <Bar dataKey="maxPrice" fill="#ef5350" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>🔮 Prediction Graph</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictionGraphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="actualPrice"
                stroke="#2e7d32"
                fill="#c8e6c9"
              />
              <Area
                type="monotone"
                dataKey="predictedPrice"
                stroke="#b71c1c"
                fill="#ffcdd2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-card disease-card">
        <h3>🧠 AI Pomegranate Disease Detection</h3>
        {/* <p>
          Upload pomegranate leaf image. The image will be sent to FastAPI ML
          model and suggestions will be shown after detection.
        </p> */}

        <input
          className="dashboard-input"
          type="file"
          accept="image/*"
          onChange={handleLeafChange}
        />

        {leafPreview && (
          <img className="preview-img" src={leafPreview} alt="Leaf Preview" />
        )}

<button
  className="dashboard-btn"
  onClick={runDiseaseDetection}
>
  Detect Disease
</button>





{diseaseResult && (

  <div className="disease-wrapper">

    {/* ================= RESULT HEADER ================= */}

    <div className="disease-result-card">

      <div className="result-header">

        <h2>🍎 AI Disease Detection Result</h2>

        <div
          className={
            diseaseResult.status === "Healthy"
              ? "status-badge healthy"
              : "status-badge diseased"
          }
        >
          {diseaseResult.status}
        </div>

      </div>

      <div className="result-top-grid">

        <div className="result-box">
          <span>Disease</span>

          <h3>
            {diseaseResult.disease || "Unknown"}
          </h3>
        </div>

        <div className="result-box">
          <span>Confidence</span>

          <h3>
            {diseaseResult.confidence || 0}%
          </h3>
        </div>

        <div className="result-box">
          <span>Severity</span>

          <h3>
            {diseaseResult.severity || "N/A"}
          </h3>
        </div>

      </div>

    </div>

    {/* ================= SYMPTOMS ================= */}

    <div className="suggestion-card">
      <h2>🩺 Symptoms</h2>

      <p>
        {diseaseResult.symptoms || "No symptoms available"}
      </p>
    </div>

    {/* ================= TREATMENT ================= */}

    <div className="suggestion-card">
      <h2>💊 Treatment</h2>

      <p>
        {diseaseResult.treatment || "No treatment available"}
      </p>
    </div>

    {/* ================= SPRAY ================= */}

    <div className="suggestion-card">
      <h2>🌿 Recommended Spray</h2>

      <p>
        {diseaseResult.spray || "No spray recommendation"}
      </p>
    </div>

    {/* ================= FERTILIZER ================= */}

    <div className="suggestion-card">
      <h2>🧪 Fertilizer Recommendation</h2>

      <p>
        {diseaseResult.fertilizer || "No fertilizer recommendation"}
      </p>
    </div>

    {/* ================= ORGANIC SOLUTION ================= */}

    <div className="suggestion-card">
      <h2>🍃 Organic Solution</h2>

      <p>
        {diseaseResult.organic_solution || "No organic solution"}
      </p>
    </div>

    {/* ================= PREVENTION ================= */}

    <div className="suggestion-card">
      <h2>🛡 Prevention Tips</h2>

      <p>
        {diseaseResult.prevention || "No prevention tips"}
      </p>
    </div>

    {/* ================= WATERING ================= */}

    <div className="suggestion-card">
      <h2>💧 Watering Advice</h2>

      <p>
        {diseaseResult.watering_advice || "No watering advice"}
      </p>
    </div>

    {/* ================= CHEMICAL PESTICIDES ================= */}

    <div className="suggestion-card">
      <h2>☣ Chemical Pesticides</h2>

      <div className="tag-grid">

        {diseaseResult.chemical_pesticides &&
        diseaseResult.chemical_pesticides.length > 0 ? (

          diseaseResult.chemical_pesticides.map(
            (item, index) => (

              <div
                className="tag-item chemical"
                key={index}
              >
                {item}
              </div>
            )
          )

        ) : (

          <p>No chemical pesticides available</p>

        )}

      </div>
    </div>

    {/* ================= ORGANIC PESTICIDES ================= */}

    <div className="suggestion-card">
      <h2>🌱 Organic Pesticides</h2>

      <div className="tag-grid">

        {diseaseResult.organic_pesticides &&
        diseaseResult.organic_pesticides.length > 0 ? (

          diseaseResult.organic_pesticides.map(
            (item, index) => (

              <div
                className="tag-item organic"
                key={index}
              >
                {item}
              </div>
            )
          )

        ) : (

          <p>No organic pesticides available</p>

        )}

      </div>
    </div>

    {/* ================= CHEMICAL FERTILIZERS ================= */}

    <div className="suggestion-card">
      <h2>🧪 Chemical Fertilizers</h2>

      <div className="tag-grid">

        {diseaseResult.chemical_fertilizers &&
        diseaseResult.chemical_fertilizers.length > 0 ? (

          diseaseResult.chemical_fertilizers.map(
            (item, index) => (

              <div
                className="tag-item fertilizer"
                key={index}
              >
                {item}
              </div>
            )
          )

        ) : (

          <p>No chemical fertilizers available</p>

        )}

      </div>
    </div>

    {/* ================= ORGANIC FERTILIZERS ================= */}

    {/* ================= ORGANIC FERTILIZERS ================= */}

<div className="suggestion-card">
  <h2>🍀 Organic Fertilizers</h2>

  <div className="tag-grid">

    {diseaseResult.organic_fertilizers &&
    diseaseResult.organic_fertilizers.length > 0 ? (

      diseaseResult.organic_fertilizers.map(
        (item, index) => (

          <div
            className="tag-item organic-fertilizer"
            key={index}
          >
            {item}
          </div>
        )
      )

    ) : (

      <p>No organic fertilizers available</p>

    )}

  </div>
</div>

{/* ================= FARMER ADVICE ================= */}

<div className="suggestion-card">
  <h2>👨‍🌾 Farmer Advice</h2>

  <div className="tag-grid">

    {diseaseResult.farmer_advice &&
    diseaseResult.farmer_advice.length > 0 ? (

      diseaseResult.farmer_advice.map(
        (item, index) => (

          <div
            className="tag-item organic"
            key={index}
          >
            {item}
          </div>
        )
      )

    ) : (       

      <p>No farmer advice available</p>

    )}

  </div>
</div>

  </div>
  

)}


      </div>

      <div className="dashboard-card">
        <div className="section-title-row">
          <h3>🧾 My Bills</h3>
          <button className="dashboard-btn" onClick={loadFarmerBills}>
            Refresh Bills
          </button>
        </div>

        {bills.length === 0 ? (
          <p>No bills received.</p>
        ) : (
          bills.map((bill) => (
            <div className="bill-card" key={bill.id}>
              <h4>Bill #{bill.id}</h4>
              <p>
                <b>Seller ID:</b> {bill.sellerId}
              </p>
              <p>
                <b>Seller Type:</b> {bill.sellerType}
              </p>
              <p>
                <b>Total Amount:</b> ₹{bill.totalAmount}
              </p>

              {bill.items?.map((item) => (
                <p key={item.id}>
                  {item.itemName} | Qty: {item.quantity} | Price: ₹
                  {item.price} | Total: ₹{item.total}
                </p>
              ))}

              <button
                className="dashboard-btn orange"
                onClick={() => downloadBill(bill.id)}
              >
                Download PDF
              </button>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-card">
        <h3>📋 Market Data Table</h3>

        <div className="market-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Market</th>
                <th>District</th>
                <th>Variety</th>
                <th>Min Price</th>
                <th>Max Price</th>
                <th>Modal Price</th>
                <th>Arrivals</th>
              </tr>
            </thead>

            <tbody>
              {marketData.length === 0 ? (
                <tr>
                  
                  <td colSpan="8">No market data available.</td>
                </tr>
              ) : (
                marketData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.year}</td>
                    <td>{item.market}</td>
                    <td>{item.district}</td>
                    <td>{item.variety}</td>
                    <td>₹{item.minPrice}</td>
                    <td>₹{item.maxPrice}</td>
                    <td>₹{item.modalPrice}</td>
                    <td>{item.arrivals}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {renderUsers("Registered Merchants", merchants)}
      {renderUsers("Registered Advisors", advisors)}
      {renderUsers("Registered Fertilizer Stores", stores)}
    </div>
  );
}