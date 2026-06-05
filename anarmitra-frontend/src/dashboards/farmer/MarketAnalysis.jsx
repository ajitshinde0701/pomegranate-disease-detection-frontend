import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from "@mui/material";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

import {
  getMarketData,
  predictMarketPrice,
  uploadMarketCsv
} from "../../api/marketApi";

function MarketAnalysis() {
  const [file, setFile] = useState(null);

  const [filters, setFilters] = useState({
    year: "",
    market: "",
    district: "",
    variety: ""
  });

  const [marketData, setMarketData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [message, setMessage] = useState("");

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const cleanFilters = () => {
    const params = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") {
        params[key] = filters[key];
      }
    });

    return params;
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select CSV file first.");
      return;
    }

    const res = await uploadMarketCsv(file);
    setMessage(res.data.message);
  };

  const loadMarketData = async () => {
    const res = await getMarketData(cleanFilters());
    setMarketData(res.data);
  };

  const handlePrediction = async () => {
    const res = await predictMarketPrice(cleanFilters());
    setPrediction(res.data.predictedPrice);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Real Pomegranate Market Analysis
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Upload CSV market data, filter it and visualize price trends.
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Button variant="outlined" component="label" fullWidth>
            Select CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button variant="contained" fullWidth onClick={handleUpload}>
            Upload CSV
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button variant="contained" color="success" fullWidth onClick={loadMarketData}>
            Load Data
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button variant="contained" color="warning" fullWidth onClick={handlePrediction}>
            Predict Price
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Market"
            name="market"
            value={filters.market}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="District"
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Variety"
            name="variety"
            value={filters.variety}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      {prediction !== null && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Predicted modal price: ₹{Number(prediction).toFixed(2)}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            Modal Price Bar Chart
          </Typography>

          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="market" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="modalPrice" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            Year-wise Price Trend
          </Typography>

          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="modalPrice" stroke="#c62828" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MarketAnalysis;