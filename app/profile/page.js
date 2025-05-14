"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SettingsPage from "./components/Settings";
import {
  Avatar,
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person,
  StarRate,
  Favorite,
  Badge,
  CalendarMonth,
} from "@mui/icons-material";
import AppTheme from "../shared-theme/AppTheme";

export default function ProfilePage() {
  const user = useUser();
  const app = useStackApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "account-details";

  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(user?.photoUrl || null);
  const [userDetails, setUserDetails] = useState({
    name: user?.displayName || "Unnamed User",
    email: user?.primaryEmail || "",
    membershipStatus: "Free",
  });

  useEffect(() => {
    // add back end stuff here as well
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

  if (!user) {
    app.redirectToSignIn();
    return <p>Redirecting to sign-in...</p>;
  }

  const renderMainContent = () => {
    switch (section) {
      case "account-details":
        return (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
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
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
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
                    <Typography
                      variant="h3"
                      sx={{ textAlign: "center", my: 2 }}
                    >
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
                    <Typography
                      variant="h3"
                      sx={{ textAlign: "center", my: 2 }}
                    >
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
          </>
        );

      case "settings":
        return <SettingsPage />;

      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Coming soon: {section}
          </Typography>
        );
    }
  };

  return (
    <AppTheme>
      <Box display="flex" minHeight="100vh">
        {/* Sidebar */}
        <Box
          width="250px"
          p={2}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              mb={4}
              sx={{ paddingTop: "20px" }}
            >
              <Avatar
                sx={{ width: 80, height: 80, mb: 1 }}
                src={user.photoUrl || undefined}
                alt={user.displayName || "User"}
              />
              <Typography variant="h6">
                {user.displayName ?? "Unnamed User"}
              </Typography>
              <Typography variant="body2">{user.primaryEmail}</Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Account Information
            </Typography>
            <List>
              <ListItemButton
                component={Link}
                href="/profile?section=account-details"
                selected={section === "account-details"}
              >
                <ListItemText primary="Profile Details" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                href="/profile?section=settings"
                selected={section === "settings"}
              >
                <ListItemText primary="Settings" />
              </ListItemButton>
            </List>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Sandwich Spot
            </Typography>
            <List>
              <ListItemButton
                component={Link}
                href="/profile?section=favorites"
                selected={section === "favorites"}
              >
                <ListItemText primary="Favorites" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                href="/profile?section=reviews"
                selected={section === "reviews"}
              >
                <ListItemText primary="Reviews" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                href="/profile?section=likes"
                selected={section === "likes"}
              >
                <ListItemText primary="Likes" />
              </ListItemButton>
            </List>
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              user.signOut();
              router.push("/");
            }}
          >
            Sign Out
          </Button>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={4}>
          {renderMainContent()}
        </Box>
      </Box>
    </AppTheme>
  );
}
