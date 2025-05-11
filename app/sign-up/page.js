"use client";

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

export default function SignUpPage() {
  const app = useStackApp();
  const router = useRouter();

  // Form state
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");

  // Form values
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  // Validation function
  const validateInputs = () => {
    let isValid = true;

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password validation
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Name validation
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

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      // 1) Sign up with Stack Auth (disable default redirect)
      const result = await app.signUpWithCredential(
        { email, password, attributes: { name } },
        { redirect: false }
      );

      if (result.status === "error") {
        setFormError(
          result.error.message || "Signup failed. Please try again."
        );
        return;
      }

      // 2) Register in MySQL
      console.log("[CLIENT] calling /api/register-user with", {
        username: email,
        email,
        password_hash: result.user.passwordHash,
        display_name: name,
      });

      const mysqlResponse = await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          email,
          password_hash: result.user.passwordHash,
          display_name: name,
        }),
      });

      const mysqlData = await mysqlResponse.json();
      if (!mysqlData.success) {
        setFormError(mysqlData.error || "Database registration failed");
        return;
      }

      // 3) Navigate only after both succeed
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setFormError(err.message || "An unexpected error occurred");
    }
  };

  // OAuth signup handler
  const handleOAuthSignup = async (provider) => {
    try {
      const result = await app.signInWithOAuth(provider);
      if (result.status === "error") {
        throw new Error(result.error?.message || "OAuth signup failed");
      }

      console.log(
        `[CLIENT] OAuth ${provider}, sending to /api/register-user:`,
        {
          username: result.user.email,
          email: result.user.email,
          display_name:
            result.user.displayName || result.user.email.split("@")[0],
          auth_provider: provider,
        }
      );

      const resp = await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: result.user.email,
          email: result.user.email,
          display_name:
            result.user.displayName || result.user.email.split("@")[0],
          auth_provider: provider,
        }),
      });

      const data = await resp.json();
      if (!data.success) {
        throw new Error(data.error || "Database registration failed");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(`${provider} signup failed:`, err);
      setFormError(`Failed to sign up with ${provider}. Please try again.`);
    }
  };

  return (
    <>
      <AppAppBar />
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: "center",
          height: "100vh",
          minHeight: "100%",
          position: "relative",
          background:
            "radial-gradient(circle at center, #03162B, #03172C, #051220)",
          color: "#fff",
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
            fontFamily: "Kanit, sans-serif",
          },
        }}
      >
        <Stack
          direction="column"
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 8 },
            p: 2,
            mx: "auto",
            width: "100%",
            maxWidth: 480,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              p: 4,
              boxShadow:
                "hsla(220, 30%, 5%, 0.2) 0px 5px 15px, hsla(220, 25%, 10%, 0.2) 0px 15px 35px -5px",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              Sign Up
            </Typography>

            {formError && (
              <Typography color="error" fontWeight="bold" textAlign="center">
                {formError}
              </Typography>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <Button type="submit" fullWidth variant="contained">
                Sign up
              </Button>
            </Box>

            <Divider>
              <Typography sx={{ color: "text.secondary" }}>or</Typography>
            </Divider>

            <Stack gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleOAuthSignup("google")}
                startIcon={<GoogleIcon />}
              >
                Sign up with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleOAuthSignup("microsoft")}
                startIcon={<MicrosoftIcon />}
              >
                Sign up with Microsoft
              </Button>

              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  variant="body2"
                  sx={{ alignSelf: "center", color: "red", fontWeight: "bold" }}
                >
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
