"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@stackframe/stack";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  Person,
  StarRate,
  Favorite,
  ThumbUp,
  Badge,
  CalendarMonth,
} from "@mui/icons-material";
import Link from "next/link";

export default function ProfileDetails() {
  const user = useUser();
  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(user?.photoUrl || null);
  const [userDetails, setUserDetails] = useState({
    name: user?.displayName || "Unnamed User",
    email: user?.primaryEmail || "",
    membershipStatus: "Free", // kenny g will link this to the db
  });

  // also this
  useEffect(() => {
    if (!user) return;

    const fetchUserMetrics = async () => {
      try {
        const res = await fetch(`/api/user-stats?uid=${user.id}`);
        const data = await res.json();

        setUserDetails((prev) => ({
          ...prev,
          reviewsMade: data.reviewsMade,
          favoriteSpots: data.favoriteSpots,
        }));
      } catch (err) {
        console.error("Failed to fetch user metrics:", err);
      }
    };

    fetchUserMetrics();
  }, [user]);

  const getMembershipColor = (status) => {
    switch (status.toLowerCase()) {
      case "free":
        return "default";
      case "plus":
        return "primary";
      case "business":
        return "secondary";
      default:
        return "default";
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data?.url) {
        setProfilePhoto(data.url);
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profilePhoto || "/default-avatar.jpg"}
                alt={userDetails.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              <Typography variant="h5" gutterBottom>
                {userDetails.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {userDetails.email}
              </Typography>
              <Chip
                label={`${userDetails.membershipStatus} Membership`}
                color={getMembershipColor(userDetails.membershipStatus)}
                icon={<Badge />}
                sx={{ mt: 1 }}
              />
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Edit Profile Photo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Person sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  Member since {userDetails.dateJoined}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarMonth sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  Account type: {userDetails.membershipStatus}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Activity Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StarRate sx={{ mr: 1 }} color="warning" />
                <Typography variant="h6">Reviews</Typography>
              </Box>
              <Typography variant="h3" sx={{ textAlign: "center", my: 2 }}>
                {userDetails.reviewsMade}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sandwich spots you&apos;ve reviewed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Favorite sx={{ mr: 1 }} color="error" />
                <Typography variant="h6">Favorites</Typography>
              </Box>
              <Typography variant="h3" sx={{ textAlign: "center", my: 2 }}>
                {userDetails.favoriteSpots}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sandwich spots you&apos;ve favorited
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Link href="/pricing" passHref>
          <Button variant="contained" sx={{ mr: 2 }}>
            Upgrade Membership
          </Button>
        </Link>

        <Link href="#" passHref>
          <Button variant="outlined">Download My Data</Button>
        </Link>
      </Box>
    </Box>
  );
}
