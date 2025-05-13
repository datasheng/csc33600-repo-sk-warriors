"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Grid,
  Snackbar,
} from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tiers = [
  {
    title: "Free",
    price: "0",
    description: [
      "Free Account Setup",
      "1 mile radius from users location",
      "Upload 15 pictures a month",
      "12 ratings a month",
      "Limited Ads",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
    buttonColor: "primary",
    plan: "free",
  },
  {
    title: "Plus",
    subheader: "Recommended",
    price: "4",
    description: [
      "10 mile radius view of from users location",
      "Upload 30 pictures a month",
      "30 ratings a month",
      "Promotions from Deli's",
      "No Ads",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
    buttonColor: "secondary",
    plan: "plus",
  },
  {
    title: "Business",
    price: "8",
    description: [
      "Entire view of NYC",
      "Promotions from Deli's",
      "Add and remove deli listing upon approval",
      "Prioritized comments and ratings",
      "No Ads",
    ],
    buttonText: "Upgrade",
    buttonVariant: "outlined",
    buttonColor: "primary",
    plan: "business",
  },
];

export default function Pricing() {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [busyPlan, setBusyPlan] = useState(null);

  const handleSubscribe = async (plan) => {
    setBusyPlan(plan);
    try {
      const res = await fetch(`/api/subscribe/${plan}`, {
        method: "POST",
        headers: { "x-user-id": "1" }, // Replace with real auth header in production
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast(`✅ ${data.message}`);
    } catch (err) {
      setToast("❌ " + err.message);
    } finally {
      setBusyPlan(null);
    }
  };

  return (
    <AppTheme>
      <AppAppBar />
      <Container
        id="pricing"
        sx={{
          pt: { xs: 17, sm: 25 },
          pb: { xs: 8, sm: 16 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom sx={{ color: "text.primary" }}>
            Pricing
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Come join our fast and friendly community, We have options for every
            need. <br />
            Choose from our 3 member options and enjoy!
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
        >
          {tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={4} key={tier.title}>
              <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 4 }}>
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.subheader && (
                      <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    <Typography component="h3" variant="h2">
                      ${tier.price}
                    </Typography>
                    <Typography component="h3" variant="h6">
                      &nbsp; per month
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                  {tier.description.map((line, index) => (
                    <Box key={index} sx={{ py: 1, display: "flex", gap: 1.5, alignItems: "center" }}>
                      <CheckCircleRoundedIcon sx={{ width: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" component="span">
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color={tier.buttonColor}
                    onClick={() => handleSubscribe(tier.plan)}
                    disabled={busyPlan === tier.plan}
                  >
                    {busyPlan === tier.plan ? "Subscribing..." : tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Snackbar
          open={!!toast}
          autoHideDuration={4000}
          onClose={() => setToast("")}
          message={toast}
        />
      </Container>
      <Footer />
    </AppTheme>
  );
}
