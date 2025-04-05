"use client";

import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function Contact() {
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
        <Box
          sx={{
            background: "transparent",
            maxWidth: "1000px",
            width: "100%",
            color: "white",
            paddingTop: "70px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontFamily: "Kanit, sans-serif",
              fontWeight: "900",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              textAlign: "center",
            }}
          >
            Contact Us:
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontFamily: "Kanit, sans-serif",
              fontWeight: "900",
              textTransform: "uppercase",
              textAlign: "center",
              paddingTop: "20px",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              maxWidth: "800px",
              display: "block",
              mx: "auto",
              mb: "20px",
              paddingBottom: "10px",
            }}
          >
            We would love to hear from you! Please fill out the form below with
            any inquiries or suggestions you may have.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiFilledInput-input": {
                    color: "#111",
                  },
                  "& .MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                  opacity: 1,
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="filled"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiFilledInput-input": {
                    color: "#111",
                  },
                  "& .MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                  opacity: 1,
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email Address"
            variant="filled"
            sx={{
              backgroundColor: "white",
              mt: 2,
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiFilledInput-input": {
                color: "#111",
              },
              "& .MuiInputBase-root": {
                backgroundColor: "white",
              },
              opacity: 1,
            }}
            required
            type="email"
          />

          <TextField
            fullWidth
            label="Message goes here"
            variant="filled"
            multiline
            rows={6}
            sx={{
              backgroundColor: "white",
              mt: 2,
              borderRadius: 1,
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiFilledInput-input": {
                color: "#111",
              },
              "& .MuiInputBase-root": {
                backgroundColor: "white",
              },
              opacity: 1,
            }}
            required
          />

          <Button
            variant="outlined"
            color="primary"
            sx={{
              fontFamily: "Kanit, sans-serif",
              fontWeight: 900,
              color: "white",
              mt: 3,
              border: "1px solid primary",
              transition: "0.4s ease-in-out",
              "&:hover": {
                border: "1px solid rgba(145, 83, 209, 1)",
              },
            }}
          >
            Send Message
          </Button>
        </Box>
      </Box>
      <Footer />
    </AppTheme>
  );
}
