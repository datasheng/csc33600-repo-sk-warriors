"use client";

import { useState } from "react";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !email || !message) {
      setStatus("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("An error occurred. Please try again later.");
    }
  };

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
          component="form"
          onSubmit={handleSubmit}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="filled"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="filled"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
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
          />

          <TextField
            fullWidth
            label="Message goes here"
            variant="filled"
            multiline
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
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
          />

          <Button
            variant="outlined"
            color="primary"
            type="submit"
            sx={{
              fontWeight: 900,
              color: "white",
              mt: 3,
              border: "1px solid primary",
              transition: "0.4s ease-in-out",
              "&:hover": {
                border: "1px solid rgb(50, 18, 189)",
              },
            }}
          >
            Send Message
          </Button>

          {status && (
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: "center", color: "white" }}
            >
              {status}
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </AppTheme>
  );
}