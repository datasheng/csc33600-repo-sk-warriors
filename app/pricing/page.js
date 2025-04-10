"use client";

import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function Pricing() {
  return (
    <AppTheme>
      <AppAppBar />
      <Box>
        <Typography>Pricing section goes in here.</Typography>
      </Box>
      <Footer />
    </AppTheme>
  );
}