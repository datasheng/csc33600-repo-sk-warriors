"use client";

import useSWR from "swr";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PublicAdsPage() {
  // ✅ changed to fetch from adget
  const { data: ads, error } = useSWR("/api/adget", fetcher);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sponsored Ads
      </Typography>

      {!ads ? (
        <Typography>Loading ads…</Typography>
      ) : (
        <Grid container spacing={2}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.ad_id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{ad.title}</Typography>
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    style={{ width: "100%", marginTop: 8 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    href={ad.link_url || "#"}
                    target="_blank"
                    rel="noopener"
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
