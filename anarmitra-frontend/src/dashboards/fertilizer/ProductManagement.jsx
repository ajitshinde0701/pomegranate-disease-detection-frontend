import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../../api/productApi";

function ProductManagement() {
  const sellerId = Number(localStorage.getItem("userId"));

  const emptyForm = {
    name: "",
    category: "Fertilizer",
    price: "",
    quantity: "",
    image: "",
    description: "",
    sellerId
  };

  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const res = await getProducts(sellerId);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      sellerId
    };

    if (editingId) {
      await updateProduct(editingId, payload);
      setMessage("Product updated successfully.");
    } else {
      await addProduct(payload);
      setMessage("Product added successfully.");
    }

    resetForm();
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      description: product.description,
      sellerId
    });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setMessage("Product deleted successfully.");
    loadProducts();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Product and Stock Management
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {editingId ? "Update" : "Add"}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Store Product Listings
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={4} key={product.id}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardMedia
                component="img"
                height="180"
                image={
                  product.image ||
                  "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?auto=format&fit=crop&w=800&q=80"
                }
                alt={product.name}
              />

              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {product.name}
                </Typography>

                <Typography color="text.secondary">
                  Category: {product.category}
                </Typography>

                <Typography color="text.secondary">
                  Price: ₹{product.price}
                </Typography>

                <Typography color="text.secondary">
                  Stock: {product.quantity}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  {product.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <IconButton color="primary" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductManagement;