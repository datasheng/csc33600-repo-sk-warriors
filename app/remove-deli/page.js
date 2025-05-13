"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function RemoveDeli() {
  const router = useRouter();
  const userState = useUser();
  const user = userState?.user;
  const isLoading = userState?.isLoading;

  const [delis, setDelis] = useState([]);
  const [selectedDeli, setSelectedDeli] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fetchingDelis, setFetchingDelis] = useState(true);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // This is fallback test data in case the API fails
  const testDelis = [
    { deli_id: 1, name: "Test Deli 1" },
    { deli_id: 2, name: "Test Deli 2" },
    { deli_id: 3, name: "Test Deli 3" },
  ];

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/sign-in");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    async function fetchDelis() {
      try {
        setFetchingDelis(true);
        setFetchStatus("fetching");

        // Try fetching from our API
        const res = await fetch("/api/remove-deli");
        console.log("Fetch response status:", res.status);

        if (!res.ok) {
          throw new Error(`Error fetching delis: ${res.status}`);
        }

        const data = await res.json();
        console.log("Raw API response:", data);

        if (Array.isArray(data) && data.length > 0) {
          // Process the data to ensure consistent property naming
          const processedData = data.map((deli) => ({
            deli_id:
              deli.deli_id ||
              deli.id ||
              Math.random().toString(36).substr(2, 9),
            name: deli.name || deli.store_name || "Unnamed Deli",
          }));

          setDelis(processedData);
          setFetchStatus("success");

          // Show success notification
          setNotification({
            open: true,
            message: `Successfully loaded ${processedData.length} delis`,
            severity: "success",
          });
        } else {
          console.warn(
            "API returned empty or non-array data, using test delis"
          );
          setDelis(testDelis);
          setFetchStatus("fallback");

          // Show warning notification
          setNotification({
            open: true,
            message: "No delis found in API. Using test data instead.",
            severity: "warning",
          });
        }
      } catch (error) {
        console.error("Failed to fetch deli data:", error);
        setError("Failed to load delis. Using test data.");
        setDelis(testDelis); // Fallback to test data
        setFetchStatus("error");

        // Show error notification
        setNotification({
          open: true,
          message: "Error loading delis. Using test data instead.",
          severity: "error",
        });
      } finally {
        setFetchingDelis(false);
      }
    }

    if (user) {
      fetchDelis();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDeli || !reason) {
      setError("Please select a deli and provide a reason.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/remove-deli", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliId: selectedDeli,
          userId: user.id,
          reason: reason,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to submit removal request"
        );
      }

      setSuccess(true);
      setSelectedDeli("");
      setReason("");

      // Show success notification
      setNotification({
        open: true,
        message: "Your removal request has been submitted successfully!",
        severity: "success",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/map");
      }, 3000);
    } catch (error) {
      console.error("Error submitting removal request:", error);
      setError(error.message || "An error occurred. Please try again.");

      // Show error notification
      setNotification({
        open: true,
        message: error.message || "Failed to submit removal request",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoading && user === null) {
    return null;
  }

  return (
    <AppTheme>
      <AppAppBar />
      <Container
        maxWidth="md"
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
          ...theme.applyStyles?.("dark", {
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
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Report a Deli for Removal
          </Typography>

          <Typography variant="body1" paragraph>
            If you believe a deli listing should be removed from our platform,
            please fill out this form. Our team will review your request and
            take appropriate action.
          </Typography>

          {fetchStatus === "error" && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Using test data. Real deli data could not be loaded.
            </Alert>
          )}

          {fetchStatus === "fallback" && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Using sample data. API returned empty results.
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Your removal request has been submitted successfully! You will be
              redirected shortly.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="deli-select-label" sx={{ color: "white" }}>
                Select Deli
              </InputLabel>
              <Select
                labelId="deli-select-label"
                id="deli-select"
                value={selectedDeli}
                label="Select Deli"
                onChange={(e) => {
                  console.log("Selected value:", e.target.value);
                  setSelectedDeli(e.target.value);
                }}
                disabled={fetchingDelis || isSubmitting}
                sx={{
                  color: "white",
                  paddingY: 3,
                  ".MuiSelect-icon": {
                    color: "white",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {fetchingDelis ? (
                  <MenuItem value="">
                    <em>Loading delis...</em>
                  </MenuItem>
                ) : delis && delis.length > 0 ? (
                  delis.map((deli) => (
                    <MenuItem key={deli.deli_id} value={deli.deli_id}>
                      {deli.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>No delis available</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Message goes here"
              variant="filled"
              multiline
              rows={6}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              sx={{
                mb: 3,
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiFilledInput-input": {
                  color: "#fff",
                },
                "& .MuiFilledInput-root": {
                  backgroundColor: "#0C1017",
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={() => router.push("/map")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting || !selectedDeli || !reason}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Submit Request"
                )}
              </Button>
            </Box>
          </Box>

          {/* Debug information section */}
          {process.env.NODE_ENV !== "production" && (
            <Box sx={{ mt: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Debug Info:
              </Typography>
              <Typography variant="body2">
                Fetch Status: {fetchStatus}
              </Typography>
              <Typography variant="body2">
                Delis Count: {delis ? delis.length : 0}
              </Typography>
              <Typography variant="body2">
                Selected Deli ID: {selectedDeli || "None"}
              </Typography>
              <Typography variant="body2">
                First few delis:{" "}
                {delis
                  .slice(0, 3)
                  .map((d) => d.name)
                  .join(", ")}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <Footer/>
    </AppTheme>
  );
}
