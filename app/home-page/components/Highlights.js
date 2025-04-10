import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import BookmarkIcon from '@mui/icons-material/Bookmark';


const items = [
  {
    icon: <MapIcon />,
    title: "Live Map of Sandwich Spots",
    description:
      "Instantly view nearby bodegas and sandwich shops on an interactive, real-time map.",
  },
  {
    icon: <StarIcon />,
    title: "User-Generated Reviews",
    description:
      "See what locals are saying with reviews and star ratings for each spot.",
  },
  {
    icon: <LocalOfferIcon />,
    title: "Daily Deals & Specials",
    description:
      "Discover exclusive in-store deals and lunch specials at your neighborhood bodegas.",
  },
  {
    icon: <PhotoLibraryIcon />,
    title: "Photos from the Community",
    description:
      "Scroll through real sandwich photos uploaded by hungry New Yorkers.",
  },
  {
    icon: <BookmarkIcon />,
    title: "Save Your Favorites",
    description:
      "Bookmark your go-to spots to come back to later.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Reliable Support",
    description:
      "Count on a responsive customer support, offering assistance anytime.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore what sets our product apart — adaptability, durability,
            intuitive design, and forward-thinking innovation. Enjoy dependable
            customer support and precision-crafted quality in every detail.{" "}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "grey.800",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
