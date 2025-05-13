"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import AppAppBar from "@/app/home-page/components/AppAppBar";
import Footer from "@/app/home-page/components/Footer";
import AppTheme from "@/app/shared-theme/AppTheme";

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
    <AppTheme>
      <AppAppBar />

      <Box
        id="contact-section"
        sx={(theme) => ({
          minHeight: { xs: "100vh", sm: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles?.("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
          overflow: "auto",
          padding: {
            xs: "20px 10px 40px",
            sm: "60px 20px",
          },
          pt: { xs: "150px", sm: "100px" },
        })}
      >
        <Box
          maxWidth={550}
          width="100%"
          p={3}
          bgcolor="background.paper"
          sx={{
            borderRadius: "20px",
            minHeight: 400,
          }}
        >
          <Typography
            variant="h4"
            mb={2}
            mt={5}
            sx={{ textAlign: "center", color: "text.primary" }}
          >
            Add Sandwich Price
          </Typography>

          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Sandwich Name"
            value={form.sandwich_name}
            onChange={handle("sandwich_name")}
            InputProps={{
              sx: {
                paddingY: 3,
              },
            }}
            InputLabelProps={{
              sx: { color: "white" },
            }}
          />

          <TextField
            fullWidth
            sx={{ mb: 3 }}
            label="Price (USD)"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={form.price}
            onChange={handle("price")}
            InputProps={{
              sx: {
                paddingY: 3,
              },
            }}
            InputLabelProps={{
              sx: { color: "white" },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            disabled={busy}
            onClick={submit}
          >
            {busy ? "Submitting…" : "Submit Price"}
          </Button>

          <Snackbar
            open={!!toast}
            autoHideDuration={4000}
            onClose={() => setToast("")}
            message={toast}
          />
        </Box>
      </Box>

      <Footer />
    </AppTheme>
  );
}
