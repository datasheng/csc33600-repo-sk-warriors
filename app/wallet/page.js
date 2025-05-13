"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Paper,
  Skeleton,
} from "@mui/material";


const fetcher = (url) =>
  fetch(url, { headers: { "x-user-id": "1" } }).then((r) => r.json());
const authHeader = { "x-user-id": "1" }; 


export default function WalletPage() {
  
  const { data, mutate, isLoading } = useSWR("/api/wallet", fetcher);
  const balance = data?.balance ?? 0;


  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const handleDeposit = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setToast("❌ Enter a positive amount");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/wallet/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ amount: value }),
    });
    const json = await res.json();
    setBusy(false);

    if (!res.ok) {
      setToast("❌ " + json.error);
      return;
    }

    
    mutate({ balance: json.balance }, false); 
    mutate();                                
    setAmount("");
    setToast("✅ Deposit successful");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 480, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Wallet
      </Typography>

      {/* Balance card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: "center" }}>
        {isLoading ? (
          <Skeleton variant="text" width={120} height={40} />
        ) : (
          <>
            <Typography variant="subtitle2">Current Balance</Typography>
            <Typography variant="h5">
              ${balance.toFixed(2)}
            </Typography>
          </>
        )}
      </Paper>

      {/* Deposit form */}
      <TextField
        label="Deposit Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        fullWidth
        disabled={busy}
        onClick={handleDeposit}
      >
        {busy ? "Processing…" : "Deposit"}
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
