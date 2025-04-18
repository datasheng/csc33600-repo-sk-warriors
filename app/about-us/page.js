"use client";

import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function AboutUs() {
  return (
    <AppTheme>
      <AppAppBar />
      <Box
        id="contact-section"
        sx={(theme) => ({
          minHeight: { xs: "100vh", sm: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
          overflow: "auto",
          padding: {
            xs: "20px 10px 40px",
            sm: "60px 20px",
          },
          pt: { xs: "150px", sm: "100px" },
        })}
      >
        <Box>
          <Typography variant="h2"
            sx = {{
              fontWeight: 900,
              fontSize: {xs: "2rem", sm: "3rem", md: "4rem"},
              textAlign: "center"
            }}
          >About Us
          </Typography>

          <Typography variant="caption"
            sx = {{
              color: "white",
              fontWeight: 700,
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              mx: "auto",
              display: "block",
              paddingTop: "20px"
            }}
          >
            Learn more about the origins about Smart Finder and how it came to be!
          </Typography>
        </Box>
      </Box>
      <Footer />
    </AppTheme>
  );
}