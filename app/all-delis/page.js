"use client";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AllDelis() {
  const [delis, setDelis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDelis = async () => {
      try {
        const res = await fetch("/api/delis/all");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setDelis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDelis();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">❌ {error}</Typography>;

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h4" gutterBottom>All Delis</Typography>
      {delis.map((deli, i) => (
        <Paper key={i} sx={{ mb: 3, p: 2, backgroundColor: "#0f172a" }}>
          <Typography variant="h6">{deli.name}</Typography>
          <Typography variant="body2">📍 {deli.address}</Typography>
          {deli.phone && <Typography variant="body2">📞 {deli.phone}</Typography>}

          {/* Button group: Add + View */}
          <Stack direction="row" spacing={1} mt={2}>
            <Button
              variant="outlined"
              onClick={() => router.push(`/add-price/${deli.deli_id}`)}
            >
              Add Sandwich
            </Button>

            <Link href={`/deli-listing/${deli.deli_id}/sandwiches`} passHref>
              <Button variant="contained" component="a">
                View Sandwiches
              </Button>
            </Link>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
