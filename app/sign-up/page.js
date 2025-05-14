"use client";

import * as React from "react";
import {
  CssBaseline,
  Stack,
  Box,
  Card,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { saveSqlUserId } from "@/lib/sqlUserId";

export default function SignUpPage() {
  const app = useStackApp();
  const router = useRouter();

  // ------------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------------
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const [emailError, setEmailError]   = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [nameError, setNameError]     = React.useState(false);

  const [emailErrorMessage, setEmailErrorMessage]     = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameErrorMessage, setNameErrorMessage]       = React.useState("");

  const [formError, setFormError]     = React.useState("");
  const [isLoading, setIsLoading]     = React.useState(false);

  // ------------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------------
  const validateInputs = () => {
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name || name.trim().length === 0) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      valid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return valid;
  };

  const registerInMySQL = async (userData) => {
    const res = await fetch("/api/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`MySQL registration failed: ${await res.text()}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Database registration failed");

    if (data.user_id) saveSqlUserId(data.user_id);

    return data;
  };

  // ------------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setFormError("");

    try {
      const result = await app.signUpWithCredential(
        { email, password, attributes: { name } },
        { redirect: false }
      );
      if (result.status === "error") {
        throw new Error(result.error?.message || "Stack Auth signup failed");
      }

      await registerInMySQL({
        username: email,
        email,
        password_hash: password,
        display_name: name,
        auth_provider: "email",
      });

      router.push("/profile");
    } catch (err) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider) => {
    setIsLoading(true);
    setFormError("");

    try {
      const result = await app.signInWithOAuth(provider, { redirect: false });
      if (result.status === "error") {
        throw new Error(result.error?.message || `${provider} OAuth failed`);
      }

      const displayName =
        result.user.displayName || result.user.email.split("@")[0];

      await registerInMySQL({
        username: result.user.email,
        email: result.user.email,
        display_name: displayName,
        auth_provider: provider.toLowerCase(),
      });

      router.push("/profile");
    } catch (err) {
      setFormError(`Failed to sign up with ${provider}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------------------
  return (
    <>
      <AppAppBar />
      <CssBaseline enableColorScheme />

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: { xs: 2, sm: 3 },
          position: "relative",
          background:
            "radial-gradient(circle at center, #03162B, #03172C, #051220)",
          color: "#fff",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            mx: "auto",
            mb: { xs: 4, sm: 6 },
            mt: { xs: 4, sm: 6 },
            pt: "50px",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2.5, sm: 3 },
              p: { xs: 3, sm: 4 },
              boxShadow:
                "hsla(220, 30%, 5%, 0.2) 0px 5px 15px, hsla(220, 25%, 10%, 0.2) 0px 15px 35px -5px",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontSize: "clamp(1.75rem, 5vw, 2.15rem)", mb: 1 }}
            >
              Sign Up
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ width: "100%", mb: 1 }}>
                {formError}
              </Alert>
            )}

            {/* FORM */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"  // <-- turn off autocomplete on entire form
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 2.5 },
                width: "100%",
              }}
            >
              {/* Full Name */}
              <FormControl sx={{ width: "100%" }}>
                <FormLabel htmlFor="name" sx={{ mb: 0.5 }}>
                  Full name
                </FormLabel>
                <TextField
                  id="name"
                  name="fullName"      // uncommon name attribute
                  placeholder="Jon Snow"
                  required
                  fullWidth
                  autoComplete="off"   // <-- stops browser “suggested names”
                  error={nameError}
                  helperText={nameErrorMessage}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": { height: "56px" },
                  }}
                />
              </FormControl>

              {/* Email */}
              <FormControl sx={{ width: "100%" }}>
                <FormLabel htmlFor="email" sx={{ mb: 0.5 }}>
                  Email
                </FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  fullWidth
                  autoComplete="email"
                  error={emailError}
                  helperText={emailErrorMessage}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": { height: "56px" },
                  }}
                />
              </FormControl>

              {/* Password */}
              <FormControl sx={{ width: "100%" }}>
                <FormLabel htmlFor="password" sx={{ mb: 0.5 }}>
                  Password
                </FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  required
                  fullWidth
                  autoComplete="new-password"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": { height: "56px" },
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={<Checkbox disabled={isLoading} />}
                label="I want to receive updates via email."
                sx={{ mt: 0.5 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ height: "48px", mt: 1 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Sign up"}
              </Button>
            </Box>

            {/* OAuth and footer */}
            <Divider sx={{ my: { xs: 1, sm: 2 } }}>
              <Typography sx={{ color: "text.secondary" }}>or</Typography>
            </Divider>

            <Stack gap={2} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleOAuthSignup("google")}
                disabled={isLoading}
                sx={{ height: "48px" }}
              >
                Sign up with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleOAuthSignup("microsoft")}
                disabled={isLoading}
                sx={{ height: "48px" }}
              >
                Sign up with Microsoft
              </Button>

              <Typography sx={{ textAlign: "center", mt: 1 }}>
                Already have an account?{" "}
                <Link href="/sign-in" variant="body2" sx={{ fontWeight: "bold" }}>
                  Sign in here
                </Link>
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
