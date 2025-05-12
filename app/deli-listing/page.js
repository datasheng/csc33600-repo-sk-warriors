"use client";
import { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar"; 

export default function AddDeliPage() {
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const handle = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/delis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setToast("✅ Deli added!");
      setForm({ name: "", address: "", phone: "" });
    } catch (e) {
      setToast("❌ " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* ✅ Navigation Bar */}
      <AppAppBar />

      {/* Form Layout */}
      <Box maxWidth={480} mx="auto" mt={12} p={3} bgcolor="#1f2937" borderRadius={2}>
        <Typography variant="h4" mb={2}>
          Add a Deli
        </Typography>

        <TextField
          fullWidth
          sx={{ mb: 2 }}
          label="Deli Name * *"
          value={form.name}
          onChange={handle("name")}
        />
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          label="Full Address * *"
          value={form.address}
          onChange={handle("address")}
        />
        <TextField
          fullWidth
          sx={{ mb: 3 }}
          label="Phone"
          value={form.phone}
          onChange={handle("phone")}
        />

        <Button fullWidth variant="contained" disabled={busy} onClick={submit}>
          {busy ? "Adding…" : "Add Deli"}
        </Button>

        <Snackbar
          open={!!toast}
          autoHideDuration={4000}
          onClose={() => setToast("")}
          message={toast}
        />
      </Box>
    </>
  );
}
