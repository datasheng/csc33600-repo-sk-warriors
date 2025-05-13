"use client";
import { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

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
          <Typography variant="h4" mb={2} sx={{ textAlign: "center" }}>
            Add a Deli
          </Typography>

          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Deli Name*"
            value={form.name}
            onChange={handle("name")}
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
            sx={{ mb: 2 }}
            label="Full Address*"
            value={form.address}
            onChange={handle("address")}
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
            label="Phone"
            value={form.phone}
            onChange={handle("phone")}
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
            {busy ? "Adding…" : "Add Deli"}
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
