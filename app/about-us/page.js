"use client";

import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function AboutUs() {
  return (
    <AppTheme>
      <AppAppBar />
      <Box>
        <Typography>About us section goes in here.</Typography>
      </Box>
      <Footer />
    </AppTheme>
  );
}