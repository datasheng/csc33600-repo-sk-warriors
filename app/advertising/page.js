"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Skeleton,
  Link as MUILink,
} from "@mui/material";

const fetcher = (url) => fetch(url).then((r) => r.json());
const demoUserId = "1"; 


export default function AdsDashboard() {
 
  const { data: myAds, mutate } = useSWR(
    `/api/ads?owner=${demoUserId}`,
    fetcher
  );


  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const publishAd = async () => {
    if (!file || !title.trim()) {
      setToast("❌ Image and message required");
      return;
    }
    setBusy(true);

    
    const formData = new FormData();
    formData.append("image", file);
    const uploadRes = await fetch("/api/ads/upload", {
      method: "POST",
      body: formData,
    });
    if (!uploadRes.ok) {
      setBusy(false);
      return setToast("❌ Image upload failed");
    }
    const { url } = await uploadRes.json();

    
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": demoUserId, 
      },
      body: JSON.stringify({
        title,
        image_url: url,
        link_url: "",        
        end_date: "",         
      }),
    });

    const data = await res.json();
    setBusy(false);
    setToast(res.ok ? "✅ Ad published" : "❌ " + data.error);
    if (res.ok) {
      setFile(null);
      setPreview("");
      setTitle("");
      mutate();            
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Advertisements
      </Typography>

      {/* New ad form */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" component="label" fullWidth>
            {file ? "Change image" : "Choose image"}
            <input type="file" accept="image/*" hidden onChange={onFileChange} />
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Message / Caption"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>

        {preview && (
          <Grid item xs={12}>
            <img
              src={preview}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            disabled={busy}
            onClick={publishAd}
          >
            {busy ? "Publishing…" : "Publish Ad"}
          </Button>
        </Grid>
      </Grid>

      {/* Existing ads list */}
      <Typography variant="h6" gutterBottom>
        Active Ads
      </Typography>

      {!myAds ? (
        <Skeleton variant="rectangular" height={120} />
      ) : (
        <Grid container spacing={2}>
          {myAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.ad_id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{ad.title}</Typography>
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    style={{ width: "100%", marginTop: 8 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    href={ad.link_url || "#"}
                    target="_blank"
                    rel="noopener"
                  >
                    Visit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
