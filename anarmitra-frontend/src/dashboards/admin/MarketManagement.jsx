import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent
} from "@mui/material";

import {
  uploadMarketCsv,
  getMarketData
} from "../../api/marketApi";

import api from "../../api/axiosConfig";

function MarketManagement() {
  const [file, setFile] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [message, setMessage] = useState("");

  const [suggestion, setSuggestion] = useState({
    diseaseName: "",
    treatment: "",
    fertilizerRecommendation: "",
    pesticideRecommendation: ""
  });

  const handleCsvUpload = async () => {
    if (!file) {
      setMessage("Please select CSV file first.");
      return;
    }

    const res = await uploadMarketCsv(file);
    setMessage(res.data.message);
  };

  const loadMarketData = async () => {
    const res = await getMarketData({});
    setMarketData(res.data);
  };

  const handleSuggestionChange = (e) => {
    setSuggestion({
      ...suggestion,
      [e.target.name]: e.target.value
    });
  };

  const saveSuggestion = async () => {
    await api.post("/disease/suggestions", suggestion);

    setMessage("Disease suggestion saved successfully.");

    setSuggestion({
      diseaseName: "",
      treatment: "",
      fertilizerRecommendation: "",
      pesticideRecommendation: ""
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Market Data and Disease Suggestions
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Button variant="outlined" component="label" fullWidth>
            Select Market CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button variant="contained" fullWidth onClick={handleCsvUpload}>
            Upload CSV To MySQL
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button variant="contained" color="success" fullWidth onClick={loadMarketData}>
            Load Market Data
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {marketData.slice(0, 12).map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography fontWeight="bold">
                  {item.market} - {item.district}
                </Typography>
                <Typography>Year: {item.year}</Typography>
                <Typography>Variety: {item.variety}</Typography>
                <Typography>Min Price: ₹{item.minPrice}</Typography>
                <Typography>Max Price: ₹{item.maxPrice}</Typography>
                <Typography>Modal Price: ₹{item.modalPrice}</Typography>
                <Typography>Arrivals: {item.arrivals}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Add Disease Suggestion
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Disease Name"
              name="diseaseName"
              value={suggestion.diseaseName}
              onChange={handleSuggestionChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Treatment"
              name="treatment"
              value={suggestion.treatment}
              onChange={handleSuggestionChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fertilizer Recommendation"
              name="fertilizerRecommendation"
              value={suggestion.fertilizerRecommendation}
              onChange={handleSuggestionChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pesticide Recommendation"
              name="pesticideRecommendation"
              value={suggestion.pesticideRecommendation}
              onChange={handleSuggestionChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="success" onClick={saveSuggestion}>
              Save Disease Suggestion
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MarketManagement;