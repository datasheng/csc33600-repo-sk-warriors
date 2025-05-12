"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";

export default function AddPricePage() {
  const { deli_id } = useParams();
  const [form, setForm] = useState({ sandwich_name: "", price: "" });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const handle = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deli_id: parseInt(deli_id),
          sandwich_name: form.sandwich_name.trim(),
          price: parseFloat(form.price),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setToast("✅ Price submitted!");
      setForm({ sandwich_name: "", price: "" });
    } catch (e) {
      setToast("❌ " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box maxWidth={480} mx="auto" mt={4} p={3} bgcolor="#1f2937" borderRadius={2}>
      <Typography variant="h4" mb={2}>Add Sandwich Price</Typography>

      <TextField
        fullWidth
        sx={{ mb: 2 }}
        label="Sandwich Name"
        value={form.sandwich_name}
        onChange={handle("sandwich_name")}
      />

      <TextField
        fullWidth
        sx={{ mb: 3 }}
        label="Price (USD)"
        type="number"
        inputProps={{ min: 0, step: "0.01" }}
        value={form.price}
        onChange={handle("price")}
      />

      <Button fullWidth variant="contained" disabled={busy} onClick={submit}>
        {busy ? "Submitting…" : "Submit Price"}
      </Button>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
