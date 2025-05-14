"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function SandwichesPage() {
  const { deliId } = useParams();
  const { data, error, isLoading } = useSWR(
    `/api/delis/${deliId}/sandwiches`,
    fetcher
  );

  if (isLoading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" mt={4} textAlign="center">
        Couldn’t load sandwiches — please refresh.
      </Typography>
    );

  if (!data?.sandwiches?.length)
    return (
      <Typography mt={4} textAlign="center">
        No sandwiches have been entered for this deli yet.
      </Typography>
    );

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
        Sandwiches
      </Typography>

      <List>
        {data.sandwiches.map((s) => (
          <ListItem key={s.sandwich_id} divider alignItems="flex-start">
            <ListItemText
              primary={`${s.sandwich_name} — ${Number(s.price).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}`}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Submitted by: {s.submitted_by}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    Listing type: {s.listing_type}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2">
                    Listed on: {new Date(s.submitted_at).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
