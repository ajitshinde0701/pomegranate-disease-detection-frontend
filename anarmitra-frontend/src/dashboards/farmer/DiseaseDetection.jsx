import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";

import { detectDisease } from "../../api/diseaseApi";

function DiseaseDetection() {

  const farmerId = Number(localStorage.getItem("userId"));

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ================= FILE HANDLE =================

  const handleFile = (e) => {

    const selectedFile = e.target.files[0];

    setFile(selectedFile);

    setResult(null);

    setError("");

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ================= DISEASE DETECT =================

  const handleDetect = async () => {

    if (!file) {
      setError("Please upload pomegranate leaf image.");
      return;
    }

    try {

      const res = await detectDisease(farmerId, file);

      console.log("FULL API RESPONSE =", res.data);

      // ================= SAFE DATA MAPPING =================

      const mappedResult = {

        diseaseName:
          res.data.disease ||
          res.data.diseaseName ||
          "Unknown Disease",

        confidence:
          res.data.confidence
            ? Number(res.data.confidence).toFixed(2)
            : 0,

        symptoms:
          res.data.symptoms ||
          "Leaf spots and discoloration detected.",

        treatment:
          res.data.treatment ||
          "Apply fungicide spray regularly.",

        fertilizerRecommendation:
          res.data.fertilizer ||
          "Use balanced NPK fertilizer.",

        pesticideRecommendation:
          res.data.chemical_pesticides?.join(", ") ||
          "Copper Oxychloride Spray",

        prevention:
          res.data.prevention ||
          "Maintain orchard hygiene and remove infected leaves.",

        organicSolution:
          res.data.organic_solution ||
          "Neem oil spray every 7 days.",

        farmerAdvice:
          res.data.farmer_advice || [
            "Monitor plants regularly",
            "Avoid excess watering",
            "Remove infected leaves immediately",
            "Use proper fungicide dosage"
          ],

        organicFertilizers:
          res.data.organic_fertilizers || [
            "Compost",
            "Cow Manure",
            "Vermicompost"
          ],

        organicPesticides:
          res.data.organic_pesticides || [
            "Neem Oil",
            "Garlic Extract"
          ]
      };

      console.log("MAPPED RESULT =", mappedResult);

      setResult(mappedResult);

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Disease detection failed. Check FastAPI ML server."
      );
    }
  };

  return (

    <Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        AI Disease Detection
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Upload pomegranate leaf image for AI disease analysis.
      </Typography>

      {/* ================= ERROR ================= */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      )}

      {/* ================= FILE BUTTON ================= */}

      <Button
        variant="outlined"
        component="label"
        fullWidth
      >
        Select Leaf Image

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </Button>

      {/* ================= IMAGE PREVIEW ================= */}

      {preview && (

        <Box
          component="img"
          src={preview}
          alt="Leaf Preview"
          sx={{
            width: "100%",
            height: 260,
            objectFit: "cover",
            borderRadius: 3,
            mt: 2
          }}
        />
      )}

      {/* ================= DETECT BUTTON ================= */}

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          background: "#2e7d32"
        }}
        onClick={handleDetect}
      >
        Detect Disease
      </Button>

      {/* ================= RESULT ================= */}

      {result && (

        <Card
          sx={{
            mt: 3,
            borderRadius: 3
          }}
        >

          <CardContent>

            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
            >
              🍎 Disease Detection Result
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Disease:</b> {result.diseaseName}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Confidence:</b> {result.confidence}%
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Symptoms:</b> {result.symptoms}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Treatment:</b> {result.treatment}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Fertilizer:</b> {result.fertilizerRecommendation}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Pesticide:</b> {result.pesticideRecommendation}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Prevention:</b> {result.prevention}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <b>Organic Solution:</b> {result.organicSolution}
            </Typography>

            {/* ================= FARMER ADVICE ================= */}

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: "bold"
              }}
            >
              👨‍🌾 Farmer Advice
            </Typography>

            {result.farmerAdvice.map((item, index) => (
              <Typography
                key={index}
                sx={{ mt: 1 }}
              >
                • {item}
              </Typography>
            ))}

            {/* ================= ORGANIC FERTILIZERS ================= */}

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: "bold"
              }}
            >
              🍀 Organic Fertilizers
            </Typography>

            {result.organicFertilizers.map((item, index) => (
              <Typography
                key={index}
                sx={{ mt: 1 }}
              >
                • {item}
              </Typography>
            ))}

            {/* ================= ORGANIC PESTICIDES ================= */}

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: "bold"
              }}
            >
              🌱 Organic Pesticides
            </Typography>

            {result.organicPesticides.map((item, index) => (
              <Typography
                key={index}
                sx={{ mt: 1 }}
              >
                • {item}
              </Typography>
            ))}

          </CardContent>

        </Card>
      )}

    </Box>
  );
}

export default DiseaseDetection;