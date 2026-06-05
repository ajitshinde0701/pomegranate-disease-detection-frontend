import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import {
  createBill,
  getSellerBills
} from "../../api/billApi";

function Billing() {
  const sellerId = Number(localStorage.getItem("userId"));

  const [farmerId, setFarmerId] = useState("");
  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      price: 0
    }
  ]);

  const [bills, setBills] = useState([]);
  const [message, setMessage] = useState("");

  const loadBills = async () => {
    const res = await getSellerBills(sellerId);
    setBills(res.data);
  };

  useEffect(() => {
    loadBills();
  }, []);

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
        price: 0
      }
    ]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateBill = async () => {
    if (!farmerId) {
      setMessage("Enter Farmer ID.");
      return;
    }

    await createBill({
      farmerId: Number(farmerId),
      sellerId,
      sellerType: "MERCHANT",
      items: items.map((item) => ({
        itemName: item.itemName,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    });

    setMessage("Bill created and sent to farmer.");
    setFarmerId("");
    setItems([{ itemName: "", quantity: 1, price: 0 }]);
    loadBills();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create Farmer Bill
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Farmer ID"
        value={farmerId}
        onChange={(e) => setFarmerId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Stack spacing={2}>
        {items.map((item, index) => (
          <Grid container spacing={1} key={index}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Item Name"
                value={item.itemName}
                onChange={(e) => updateItem(index, "itemName", e.target.value)}
              />
            </Grid>

            <Grid item xs={5} md={2}>
              <TextField
                fullWidth
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />
            </Grid>

            <Grid item xs={5} md={3}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
              />
            </Grid>

            <Grid item xs={2} md={2}>
              <IconButton color="error" onClick={() => removeItemRow(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={addItemRow}>
          Add Item
        </Button>

        <Button variant="contained" onClick={handleCreateBill}>
          Send Bill
        </Button>
      </Stack>

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Billing History
      </Typography>

      <Stack spacing={2}>
        {bills.map((bill) => (
          <Card key={bill.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight="bold">
                Bill #{bill.id} | Farmer ID: {bill.farmerId}
              </Typography>

              <Typography>Total: ₹{bill.totalAmount}</Typography>
              <Typography color="text.secondary">
                Seller Type: {bill.sellerType}
              </Typography>

              {bill.items?.map((item) => (
                <Typography key={item.id} color="text.secondary">
                  {item.itemName} - Qty: {item.quantity} - ₹{item.price} - Total:
                  ₹{item.total}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Billing;