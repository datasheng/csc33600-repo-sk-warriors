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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              textAlign: "center",
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontWeight: 700,
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              mx: "auto",
              display: "block",
              paddingTop: "10px",
            }}
          >
            Learn more about the origins about Smart Finder and how it came to
            be!
          </Typography>
        </Box>

        <Box sx={{ paddingTop: "60px" }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mx: "auto",
              maxWidth: "1000px",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
            }}
          >
            Welcome to <span style={{ fontWeight: 900 }}>Smart Finder</span> —
            your go-to platform for discovering delis across New York City and
            comparing sandwich prices with ease.
            <br></br>
            <br></br>
            We created Smart Finder with one mission in mind: to{" "}
            <span style={{ fontWeight: 900 }}>
              make it simple and transparent for New Yorkers to find quality
              deli food without overpaying
            </span>
            . Whether you&apos;re craving a classic bacon egg and cheese or a
            stacked pastrami on rye, Smart Finder helps you locate nearby delis,
            view their menus, and compare prices—all in one place. In a city
            where delis are on almost every block, finding the best spot at the
            right price can still feel like a challenge. Smart Finder was born
            out of frustration and curiosity: “Why is this sandwich $4 here but
            $7 a few blocks away?” We realized there wasn’t a clear way to view
            and compare deli offerings in real-time—so we decided to build one.
            <br></br>
            <br></br>
            <br></br>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mx: "auto",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
            }}
          >
            <span style={{ fontWeight: 900 }}>What You Can Do</span> <br></br>
            <span style={{ fontWeight: 900 }}>• Explore Local Delis:</span>{" "}
            Discover hidden gems and fan favorites throughout NYC.
            <br></br>
            <span style={{ fontWeight: 900 }}>
              • Compare Sandwich Prices:
            </span>{" "}
            Check the cost of your go-to sandwiches across multiple delis.
            <br></br>
            <span style={{ fontWeight: 900 }}>• Stay Updated:</span> See
            recently added or updated deli listings and menu changes.
            <br></br>
            <br></br>
            <br></br>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mx: "auto",
              maxWidth: "1000px",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
            }}
          >
            Whether you&apos;re a student on a budget, a deli enthusiast, or
            just looking for your next lunch spot, Smart Finder is designed to
            save you time, money, and effort.
          </Typography>
        </Box>
      </Box>
      <Footer />
    </AppTheme>
  );
}
