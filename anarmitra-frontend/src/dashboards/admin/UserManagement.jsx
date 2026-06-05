import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import { getAllUsers, getUserCounts } from "../../api/userApi";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});

  const loadData = async () => {
    const countRes = await getUserCounts();
    const userRes = await getAllUsers();

    setCounts(countRes.data);
    setUsers(userRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        User Management
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Chip label={`Farmers: ${counts.farmers || 0}`} color="success" />
        <Chip label={`Merchants: ${counts.merchants || 0}`} color="primary" />
        <Chip label={`Advisors: ${counts.advisors || 0}`} color="warning" />
        <Chip
          label={`Fertilizer Stores: ${counts.fertilizerStores || 0}`}
          color="secondary"
        />
        <Chip label={`Admins: ${counts.admins || 0}`} color="error" />
      </Stack>

      <Paper sx={{ overflowX: "auto", borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#e8f5e9" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default UserManagement;