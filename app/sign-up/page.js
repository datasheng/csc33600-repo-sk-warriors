"use client";

console.log("[CLIENT] Rendering SignUpPage");
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export default function SignUpPage() {
  const app = useStackApp();
  const router = useRouter();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const registerInMySQL = async (userData) => {
    console.log("[CLIENT] Registering user in MySQL:", userData);
    const response = await fetch("/api/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MySQL registration failed: ${errorText}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Database registration failed");
    }
    console.log("[CLIENT] MySQL registration successful");
    return data;
  };

  const handleSubmit = async (event) => {
    console.log("[CLIENT] handleSubmit invoked");
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setFormError("");

    try {
      console.log("[CLIENT] Signing up with Stack Auth:", { email, name });
      const result = await app.signUpWithCredential(
        { email, password, attributes: { name } },
        { redirect: false }
      );
      if (result.status === "error") {
        throw new Error(result.error?.message || "Stack Auth signup failed");
      }

      console.log("[CLIENT] Stack Auth signup successful:", result.user.id);

      await registerInMySQL({
        username: email,
        email,
        password_hash: result.user.passwordHash,
        display_name: name,
        auth_provider: "email",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("[CLIENT] Signup error:", err);
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider) => {
    setIsLoading(true);
    setFormError("");
    try {
      console.log(`[CLIENT] Starting OAuth signup with ${provider}`);
      const result = await app.signInWithOAuth(provider, { redirect: false });
      if (result.status === "error") {
        throw new Error(result.error?.message || `${provider} OAuth failed`);
      }
      console.log(`[CLIENT] ${provider} OAuth successful:`, result.user.email);
      await registerInMySQL({
        username: result.user.email,
        email: result.user.email,
        display_name:
          result.user.displayName ||
          result.user.email.split("@")[0],
        auth_provider: provider.toLowerCase(),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(`[CLIENT] ${provider} signup failed:`, err);
      setFormError(`Failed to sign up with ${provider}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppAppBar />
      <CssBaseline enableColorScheme />
      <Stack
        component="main"
        direction="column"
        sx={{
          justifyContent: "center",
          height: "100vh",
          background:
            "radial-gradient(circle at center, #03162B, #03172C, #051220)",
          color: "#fff",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210,100%,97%),hsl(0,0%,100%))",
          },
        }}
      >
        <Stack
          direction="column"
          sx={{ maxWidth: 480, mx: "auto", p: 2, gap: { xs: 6, sm: 8 } }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography component="h1" variant="h4">
              Sign Up
            </Typography>

            {formError && (
              <Alert severity="error" fullWidth>
                {formError}
              </Alert>
            )}

            {/* ← HERE: Box is now a real <form> */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  id="name"
                  name="name"
                  required
                  fullWidth
                  placeholder="Jon Snow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={nameError}
                  helperText={nameErrorMessage}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  helperText={emailErrorMessage}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  required
                  fullWidth
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="I want to receive updates via email."
                disabled={isLoading}
              />

              <Button
                type="submit"                  // ← submit button
                fullWidth
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Sign up"}
              </Button>
            </Box>

            <Divider>or</Divider>

            <Stack gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOAuthSignup("google")}
                startIcon={<GoogleIcon />}
                disabled={isLoading}
              >
                Sign up with Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOAuthSignup("microsoft")}
                startIcon={<MicrosoftIcon />}
                disabled={isLoading}
              >
                Sign up with Microsoft
              </Button>

              <Typography align="center">
                Already have an account?{" "}
                <Link href="/sign-in" variant="body2">
                  Sign in here
                </Link>
              </Typography>
            </Stack>
          </Card>
        </Stack>
      </Stack>
      <Footer />
    </>
  );
}
