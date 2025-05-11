"use client";

import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { Paper, Typography, Box, Grid, TextField, Button, Divider, FormControl, FormControlLabel, Switch, Alert, Snackbar, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, InputLabel} from "@mui/material";
import { ExpandMore, LockOutlined, NotificationsActive, VisibilityOutlined, Language } from "@mui/icons-material";

export default function SettingsPage() {
  const user = useUser();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.primaryEmail || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newReviews: true,
    specialOffers: false,
    accountActivity: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    shareActivity: true,
    allowTagging: true
  });
  
  const [language, setLanguage] = useState("english");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked, value } = e.target;
    setPrivacy((prev) => ({
      ...prev,
      [name]: name === "profileVisibility" ? value : checked
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Connect to the db kenny g
    setSnackbar({
      open: true,
      message: "Profile updated successfully!",
      severity: "success"
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "New passwords don't match!",
        severity: "error"
      });
      return;
    }
    
    // connect to the db
    setSnackbar({
      open: true,
      message: "Password updated successfully!",
      severity: "success"
    });
    
    // connect to db
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }));
  };

  const handleSavePreferences = () => {
    // connect to the db
    setSnackbar({
      open: true,
      message: "Preferences saved successfully!",
      severity: "success"
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Profile Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <form onSubmit={handleUpdateProfile}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Display Name"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                      >
                        Update Profile
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <LockOutlined sx={{ mr: 1 }} />
                <Typography variant="h6">Change Password</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <form onSubmit={handlePasswordChange}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="password"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="password"
                        required
                        helperText="Password must be at least 8 characters"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="password"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                      >
                        Change Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Notification Preferences */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <NotificationsActive sx={{ mr: 1 }} />
                <Typography variant="h6">Notification Preferences</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={handleNotificationChange}
                        name="emailNotifications"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newReviews}
                        onChange={handleNotificationChange}
                        name="newReviews"
                        color="primary"
                      />
                    }
                    label="New Reviews on Your Favorite Places"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.specialOffers}
                        onChange={handleNotificationChange}
                        name="specialOffers"
                        color="primary"
                      />
                    }
                    label="Special Offers and Promotions"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.accountActivity}
                        onChange={handleNotificationChange}
                        name="accountActivity"
                        color="primary"
                      />
                    }
                    label="Account Activity and Security"
                  />
                </FormControl>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <VisibilityOutlined sx={{ mr: 1 }} />
                <Typography variant="h6">Privacy Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="profile-visibility-label">Profile Visibility</InputLabel>
                      <Select
                        labelId="profile-visibility-label"
                        id="profile-visibility"
                        value={privacy.profileVisibility}
                        name="profileVisibility"
                        label="Profile Visibility"
                        onChange={handlePrivacyChange}
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="friends">Friends Only</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacy.shareActivity}
                          onChange={handlePrivacyChange}
                          name="shareActivity"
                          color="primary"
                        />
                      }
                      label="Share my activity with others"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacy.allowTagging}
                          onChange={handlePrivacyChange}
                          name="allowTagging"
                          color="primary"
                        />
                      }
                      label="Allow others to tag me in posts"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Language Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Language sx={{ mr: 1 }} />
                <Typography variant="h6">Language Settings</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="language-label">Language</InputLabel>
                  <Select
                    labelId="language-label"
                    id="language"
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                    <MenuItem value="german">German</MenuItem>
                    <MenuItem value="chinese">Chinese</MenuItem>
                    <MenuItem value="japanese">Japanese</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Delete Account */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" color="error">Delete Account</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 3 }}>
                <Typography variant="body1" paragraph>
                  Warning: Deleting your account will permanently remove all your data, including reviews, favorites, and likes. This action cannot be undone.
                </Typography>
                <Button variant="contained" color="error">
                  Delete My Account
                </Button>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Save Preferences Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleSavePreferences}
            >
              Save All Preferences
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}