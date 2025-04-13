"use client";

import { Box, Typography, Button, Container, Card, CardContent, CardActions, Divider, Chip, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const tiers = [
  {
    title: "Free",
    price: "0",
    description: [
      "Free Account Setup",
      "1 mile view of the area",
      "Rate and review deli",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
  {
    title: "Plus",
    subheader: "Recommended",
    price: "4",
    description: ["Entire View of NYC", "No Ads", "Promos from Deli"],
    buttonText: "Start now",
    buttonVariant: "contained",
    buttonColor: "secondary",
  },
  {
    title: "Business",
    price: "8",
    description: [
      "Entire view of nyc",
      "No Ads",
      "Promotions from deli",
      "Add and remove deli listing upon approval",
      "Priotized comments",
    ],
    buttonText: "Contact us",
    buttonVariant: "outlined",
    buttonColor: "primary",
  },
];

export default function Pricing() {
  return (
    <AppTheme>
      <AppAppBar />
      <Container
        id="pricing"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        {/* Section Heading */}
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
            Come join our fast and friendly community, We have options for every need. <br />
            Choose from our 3 member options and enjoy!
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
        >
          {tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={4} key={tier.title}>
              <Card
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  ...(tier.title === "Pro" && {
                    border: "none",
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))",
                    boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                  }),
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      ...(tier.title === "Pro" ? { color: "grey.100" } : {}),
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.subheader && (
                      <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      ...(tier.title === "Pro" ? { color: "grey.50" } : {}),
                    }}
                  >
                    <Typography component="h3" variant="h2">
                      ${tier.price}
                    </Typography>
                    <Typography component="h3" variant="h6">
                      &nbsp; per month
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                  {tier.description.map((line, index) => (
                    <Box
                      key={index}
                      sx={{ py: 1, display: "flex", gap: 1.5, alignItems: "center" }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          ...(tier.title === "Pro"
                            ? { color: "primary.light" }
                            : { color: "primary.main" }),
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={tier.title === "Pro" ? { color: "grey.50" } : {}}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant} color={tier.buttonColor}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </AppTheme>
  );
}