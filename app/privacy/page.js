"use client";

import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function Privacy() {
  return (
    <AppTheme>
      <AppAppBar />
      <Box>
        <Typography>Privacy Policy section goes in here.</Typography>
      </Box>
      <Footer />
    </AppTheme>
  );
}