import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import {
  getAdvisors,
  getFertilizerStores,
  getMerchants,
  getUserCounts
} from "../../api/userApi";

import { createFarmerRequest } from "../../api/requestApi";

function ServiceLists() {
  const farmerId = Number(localStorage.getItem("userId"));

  const [counts, setCounts] = useState({});
  const [merchants, setMerchants] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const countRes = await getUserCounts();
    const merchantRes = await getMerchants();
    const advisorRes = await getAdvisors();
    const storeRes = await getFertilizerStores();

    setCounts(countRes.data);
    setMerchants(merchantRes.data);
    setAdvisors(advisorRes.data);
    setStores(storeRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendRequest = async (receiverId, receiverRole) => {
    await createFarmerRequest({
      farmerId,
      receiverId,
      receiverRole,
      subject: "Farmer Service Request",
      message: "I need your help for pomegranate farming service."
    });

    setMessage("Request sent successfully.");
  };

  const renderUsers = (title, users, role) => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} md={4} key={user.id}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {user.fullName}
                </Typography>

                <Typography color="text.secondary">
                  Email: {user.email}
                </Typography>

                <Typography color="text.secondary">
                  Phone: {user.phone}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Address: {user.address}
                </Typography>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => sendRequest(user.id, role)}
                  sx={{ background: "#2e7d32" }}
                >
                  Send Request
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Farmer Services
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Chip label={`Merchants: ${counts.merchants || 0}`} color="success" />
        <Chip label={`Advisors: ${counts.advisors || 0}`} color="primary" />
        <Chip
          label={`Fertilizer Stores: ${counts.fertilizerStores || 0}`}
          color="warning"
        />
      </Stack>

      {renderUsers("Registered Merchants", merchants, "MERCHANT")}
      {renderUsers("Registered Advisors", advisors, "ADVISOR")}
      {renderUsers("Registered Fertilizer Stores", stores, "FERTILIZER_STORE")}
    </Box>
  );
}

export default ServiceLists;