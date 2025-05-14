// File: app/admin/dashboard/page.jsx
"use client";

import useSWR from "swr";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Snackbar,
} from "@mui/material";
import { useState } from "react";

const fetcher = (url) =>
  fetch(url, { headers: { "x-user-id": "1" } }).then((r) => r.json()); // replace with real auth

export default function AdminDashboard() {
  const { data: ads, mutate, isLoading } = useSWR(
    "/api/admin/ads/pending",
    fetcher
  );
  const [toast, setToast] = useState("");

  const handleAction = async (adId, action) => {
    const res = await fetch(`/api/admin/ads/${adId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "1", // replace with real admin ID
      },
      body: JSON.stringify({ action }),
    });

    const result = await res.json();
    if (res.ok) {
      setToast(`✅ Ad ${action}d`);
      mutate();
    } else {
      setToast(`❌ ${result.error}`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {isLoading ? (
        <Typography>Loading ads...</Typography>
      ) : ads?.length === 0 ? (
        <Typography>No ads pending approval.</Typography>
      ) : (
        <Grid container spacing={2}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.ad_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={ad.image_url}
                  alt={ad.title}
                />
                <CardContent>
                  <Typography variant="h6">{ad.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID: {ad.user_id}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => handleAction(ad.ad_id, "approve")}
                    color="primary"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(ad.ad_id, "disapprove")}
                    color="error"
                  >
                    Disapprove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
