"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import {Paper, Typography, Box, Grid, Divider, Card, CardContent, Chip, Avatar, Button, LinearProgress, Stack} from "@mui/material";
import { Person, StarRate, Favorite, ThumbUp, Badge, CalendarMonth} from "@mui/icons-material";

export default function ProfileDetails() {
  const user = useUser();
  const [userDetails, setUserDetails] = useState({
    name: user?.displayName || "Unnamed User",
    email: user?.primaryEmail || "",
    membershipStatus: "Free", // kenny g will link this to the db
    dateJoined: "January 2024", // also this 
    reviewsMade: 14, // also this
    favoriteSpots: 7, // also this
    likes: 32, // also this
    profileCompletion: 70 // also this
  });

  // also this
  useEffect(() => {
// add back end stuff here as well
  }, [user]);

  const getMembershipColor = (status) => {
    switch (status.toLowerCase()) {
      case 'free':
        return 'default';
      case 'plus':
        return 'primary';
      case 'business':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user?.photoUrl || undefined}
                alt={userDetails.name}
                sx={{ width: 120, height: 120, mb: 2 }}
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
              <Button variant="outlined" sx={{ mt: 2 }}>
                Edit Profile Photo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Complete your profile</Typography>
                <Typography variant="body2">{userDetails.profileCompletion}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={userDetails.profileCompletion} 
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>

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

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
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
              <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                {userDetails.reviewsMade}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sandwich spots you've reviewed
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
              <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                {userDetails.favoriteSpots}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sandwich spots you've favorited
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ThumbUp sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Likes</Typography>
              </Box>
              <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
                {userDetails.likes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Content you've liked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" sx={{ mr: 2 }}>
          Upgrade Membership
        </Button>
        <Button variant="outlined">
          Download My Data
        </Button>
      </Box>
    </Box>
  );
}