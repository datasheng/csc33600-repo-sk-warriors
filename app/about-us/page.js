"use client";

import { Box, Typography, Container, Paper, Grid } from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";
import ExploreIcon from '@mui/icons-material/Explore';
import CompareIcon from '@mui/icons-material/Compare';
import UpdateIcon from '@mui/icons-material/Update';

export default function AboutUs() {
  return (
    <AppTheme>
      <AppAppBar />
      <Box
        id="about-section"
        sx={(theme) => ({
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "flex-start" },
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
          pt: { xs: "120px", sm: "120px" },
        })}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                color: "#FFFFFF",     
                letterSpacing: "-0.5px",
                mb: 2,
                paddingTop: "30px"
              }}
            >
              About Us
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                letterSpacing: "1px",
                mb: 2
              }}
            >
              Learn more about the origins of Smart Finder and how it came to be!
            </Typography>
          </Box>

          {/* Welcome Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4, md: 5 }, 
              mb: 6, 
              borderRadius: 4,
              backgroundColor: "rgba(13, 26, 38, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#fff",
                mb: 3,
                fontWeight: 500,
                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem" },
              }}
            >
              Welcome to <span style={{ fontWeight: 700, color: "#6266b3" }}>Smart Finder</span> — your go-to platform for discovering delis across New York City and comparing sandwich prices with ease.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                textAlign: "left",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
              }}
            >
              We created Smart Finder with one mission in mind: to{" "}
              <span style={{ fontWeight: 700, color: "#fff" }}>
                make it simple and transparent for New Yorkers to find quality
                deli food without overpaying
              </span>
              . Whether you&apos;re craving a classic bacon egg and cheese or a
              stacked pastrami on rye, Smart Finder helps you locate nearby delis,
              view their menus, and compare prices—all in one place.
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: "left",
                mt: 2,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
              }}
            >
              In a city where delis are on almost every block, finding the best spot at the
              right price can still feel like a challenge. Smart Finder was born
              out of frustration and curiosity: &apos;Why is this sandwich $4 here but
              $7 a few blocks away?&apos; We realized there wasn&apos;t a clear way to view
              and compare deli offerings in real-time—so we decided to build one.
            </Typography>
          </Paper>

          {/* What You Can Do Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 4,
                color: "#fff",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              What You Can Do
            </Typography>

            <Grid container spacing={3}>
              {/* Feature 1 */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "rgba(13, 26, 38, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <ExploreIcon sx={{ color: "#660708", fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                      Explore Local Delis
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    Discover hidden gems and fan favorites throughout NYC.
                  </Typography>
                </Paper>
              </Grid>

              {/* Feature 2 */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "rgba(13, 26, 38, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CompareIcon sx={{ color: "#660708", fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                      Compare Prices
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    Check the cost of your go-to sandwiches across multiple delis.
                  </Typography>
                </Paper>
              </Grid>

              {/* Feature 3 */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "rgba(13, 26, 38, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <UpdateIcon sx={{ color: "#660708", fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                      Stay Updated
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    See recently added or updated deli listings and menu changes.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Closing Statement */}
          <Paper
            elevation={2}
            sx={{
              p: 4,
              backgroundColor: "rgba(13, 26, 38, 0.8)",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.05)",
              mb: 6
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#fff",
                fontWeight: 500,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
                lineHeight: 1.7
              }}
            >
              Whether you&apos;re a student on a budget, a deli enthusiast, or
              just looking for your next lunch spot, Smart Finder is designed to
              save you time, money, and effort.
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
