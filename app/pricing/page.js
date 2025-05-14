"use client";

import { useEffect, useState } from "react";
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
import {
  CheckCircleRounded as CheckIcon,
  AutoAwesome as SparkleIcon,
  Star as StarIcon,
  Storefront as StoreIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useUser } from "@stackframe/stack";

import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";

import { getSqlUserId } from "@/lib/sqlUserId";

/* ────────────────────────────────────────────────────────────── */
/* PricingCard component                                          */
function PricingCard({ tier, user, busyPlan, currentPlan, onSubscribe }) {
  const isCurrent = currentPlan === tier.plan;
  const isBusy    = busyPlan === tier.plan;

  /* button config */
  const buttonProps = user
    ? {
        disabled: isCurrent || isBusy,
        onClick : () => onSubscribe(tier.plan),
      }
    : {
        component: Link,
        href     : tier.link,
      };

  /* button label */
  const buttonLabel = user
    ? isCurrent
      ? `You’re on ${tier.title}`
      : isBusy
      ? "Processing…"
      : `Subscribe to ${tier.title}`
    : tier.buttonText;

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100%",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
        ...(tier.title === "Plus" && {
          borderTop: "4px solid",
          borderColor: "primary.main",
          boxShadow: 3,
        }),
      }}
    >
      <CardContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>{tier.icon}</Box>

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
            <Chip
              icon={<SparkleIcon />}
              label={tier.subheader}
              color="primary"
              sx={{ fontWeight: "bold" }}
            />
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

        {tier.description.map((line, i) => (
          <Box
            key={i}
            sx={{ py: 1, display: "flex", gap: 1.5, alignItems: "center" }}
          >
            <CheckIcon sx={{ width: 20, color: "primary.main" }} />
            <Typography variant="subtitle2" component="span">
              {line}
            </Typography>
          </Box>
        ))}
      </CardContent>

      <CardActions sx={{ mt: "auto" }}>
        <Button
          fullWidth
          variant={tier.buttonVariant}
          color={tier.buttonColor}
          sx={{ py: 1.2, fontWeight: "bold", borderRadius: 2 }}
          {...buttonProps}
        >
          {buttonLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
/* ────────────────────────────────────────────────────────────── */

export default function Pricing() {
  const user = useUser();               // StackFrame user (may be null)
  const sqlUserId = getSqlUserId();     // our MySQL user_id in localStorage
  const [busyPlan, setBusyPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null); // 'free' | 'plus' | 'business'
  const [toast, setToast] = useState("");

  /* ── fetch current plan on mount ─────────────────────────── */
  useEffect(() => {
    if (!sqlUserId) return;

    fetch("/api/profile", { headers: { "x-user-id": sqlUserId } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.plan?.name) {
          setCurrentPlan(data.plan.name.toLowerCase());
        } else {
          setCurrentPlan("free");
        }
      })
      .catch((err) => console.error("profile fetch failed:", err));
  }, [sqlUserId]);

  /* ── subscribe handler ───────────────────────────────────── */
  const handleSubscribe = async (plan) => {
    setBusyPlan(plan);
    try {
      const res = await fetch(`/api/subscribe/${plan}`, {
        method: "POST",
        headers: { "x-user-id": sqlUserId || "" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Subscription failed");

      setCurrentPlan(plan);
      setToast(`✅ You are now subscribed to ${plan.charAt(0).toUpperCase()+plan.slice(1)}`);
    } catch (err) {
      setToast("❌ " + err.message);
    } finally {
      setBusyPlan(null);
    }
  };

  /* ── pricing tiers definition ────────────────────────────── */
  const tiers = [
    {
      title: "Free",
      plan: "free",
      price: "0",
      description: [
        "Free Account Setup",
        "1 mile radius from your location",
        "Upload 15 pictures a month",
        "12 ratings a month",
        "Limited Ads",
      ],
      buttonText: "Sign up for free",
      buttonVariant: "outlined",
      buttonColor: "primary",
      link: "/sign-up",
      icon: <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Plus",
      plan: "plus",
      subheader: "Recommended",
      price: "4",
      description: [
        "10 mile radius view",
        "Upload 30 pictures a month",
        "30 ratings a month",
        "Promotions from Delis",
        "No Ads",
      ],
      buttonText: "Start now",
      buttonVariant: "contained",
      buttonColor: "secondary",
      link: "/sign-up",
      icon: <StarIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Business",
      plan: "business",
      price: "8",
      description: [
        "Entire view of NYC",
        "Promotions from Delis",
        "Add & remove deli listings (upon approval)",
        "Prioritized comments and ratings",
        "No Ads",
      ],
      buttonText: "Contact us",
      buttonVariant: "outlined",
      buttonColor: "primary",
      link: "/contact",
      icon: <StoreIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
  ];

  /* ── UI ──────────────────────────────────────────────────── */
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
        }}
      >
        <Box sx={{ width: { sm: "100%", md: "60%" }, textAlign: "center" }}>
          <Typography component="h2" variant="h4" gutterBottom>
            Pricing
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Choose the plan that fits your sandwich‑finding needs.
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ alignItems: "stretch", justifyContent: "center", width: "100%" }}
        >
          {tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={4} key={tier.title}>
              <PricingCard
                tier={tier}
                user={user}
                busyPlan={busyPlan}
                currentPlan={currentPlan}
                onSubscribe={handleSubscribe}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
      />

      <Footer />
    </AppTheme>
  );
}
