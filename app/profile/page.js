"use client";

import { useUser, useStackApp } from "@stackframe/stack";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Avatar,
  Button,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import ProfileDetails from "./components/ProfileDetails";
import SettingsPage from "./components/Settings";

export default function ProfilePage() {
  const user = useUser();
  const app = useStackApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "overview";

  if (!user) {
    app.redirectToSignIn();
    return <p>Redirecting to sign-in...</p>;
  }


  const renderSectionContent = () => {
    switch (section) {
      case "account-details":
        return <ProfileDetails />;
      case "settings":
        return <SettingsPage />;

      case "favorites":
        return (
          <Typography variant="body1">
            Here's a list of all your favorites.
          </Typography>
        );
      case "reviews":
        return (
          <Typography variant="body1">
            Here's a list of all your reviews.
          </Typography>
        );
      case "likes":
        return (
          <Typography variant="body1">
            Here's a list of everything you've liked.
          </Typography>
        );
      case "overview":
      default:
        return (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={2}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Favorites</Typography>
              <Typography variant="body2">
                See your favorite sandwiches.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                component={Link}
                href="/profile?section=favorites"
              >
                Go to Favorites
              </Button>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Reviews</Typography>
              <Typography variant="body2">
                View your sandwich reviews.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                component={Link}
                href="/profile?section=reviews"
              >
                Go to Reviews
              </Button>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Likes</Typography>
              <Typography variant="body2">
                Check out what you've liked.
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                component={Link}
                href="/profile?section=likes"
              >
                Go to Likes
              </Button>
            </Paper>
          </Box>
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
          <Stack direction="row" spacing={2} mb={2}>
            {section !== "overview" && (
              <Button
                variant="outlined"
                onClick={() => router.push("/profile")}
              >
                Back to Profile Home
              </Button>
            )}
            <Button variant="outlined" component={Link} href="/">
              Website Home
            </Button>
          </Stack>

          <Typography variant="h4" gutterBottom>
            {section === "overview"
              ? "Dashboard Overview"
              : section
                  .replace("-", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
          </Typography>

          {renderSectionContent()}
        </Box>
      </Box>
    </AppTheme>
  );
}
