"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { useUser } from "@stackframe/stack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

export default function HomePage(props) {
  const user = useUser();
  const [plan, setPlan] = React.useState("free");
  const [ad, setAd] = React.useState(null);
  const [showAd, setShowAd] = React.useState(false);

  React.useEffect(() => {
    const fetchUserPlanAndAd = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch("/api/user/plan", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();
        setPlan(data.plan || "free");

        if ((data.plan || "free") === "free") {
          const adRes = await fetch("/api/adget");

          if (!adRes.ok) {
            console.error("Ad fetch failed:", adRes.statusText);
            return;
          }

          const text = await adRes.text();
          if (!text) {
            console.warn("No ad response body");
            return;
          }

          let ads;
          try {
            ads = JSON.parse(text);
          } catch (err) {
            console.error("Failed to parse ads JSON:", err);
            return;
          }

          if (ads.length > 0) {
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setAd(randomAd);
            setShowAd(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user plan or ad:", err);
      }
    };

    fetchUserPlanAndAd();
  }, [user]);

  const handleClose = () => setShowAd(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Features />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>

      {/* ✅ Ad Popup for Free Users */}
      <Dialog open={showAd} onClose={handleClose}>
        <DialogTitle>Sponsored Ad</DialogTitle>
        {ad && (
          <DialogContent dividers>
            <Typography gutterBottom>{ad.title}</Typography>
            <img
              src={ad.image_url}
              alt={ad.title}
              style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
}
