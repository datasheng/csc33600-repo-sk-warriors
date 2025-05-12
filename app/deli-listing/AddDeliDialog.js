"use client";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack
} from "@mui/material";
import { useState } from "react";

export default function AddDeliDialog({ open, onClose, onAdded }) {
  const [form, setForm] = useState({
    name: "", address: "", borough: "", zip_code: "",
    latitude: "", longitude: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/delis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { deli_id } = await res.json();
      onAdded({ ...form, deli_id });   
      onClose();
    } catch (err) {
      console.error("Insert failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#0d0d0d", color: "white" }}>
        Add a Deli / Bodega
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#121212", color: "white" }}>
        <Stack spacing={2} mt={1}>
          <TextField label="Name"   name="name"   onChange={handleChange} fullWidth />
          <TextField label="Address" name="address" onChange={handleChange} fullWidth />
          <TextField label="Borough" name="borough" onChange={handleChange} fullWidth />
          <TextField label="Zip Code" name="zip_code" onChange={handleChange} fullWidth />
          <TextField label="Latitude"  name="latitude"  onChange={handleChange} fullWidth />
          <TextField label="Longitude" name="longitude" onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "#121212" }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
