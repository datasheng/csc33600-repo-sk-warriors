"use client";

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppAppBar from '../home-page/components/AppAppBar';
import Footer from '../home-page/components/Footer';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { useStackApp } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  console.log('Rendering SignUpPage');

  const app = useStackApp();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.trim().length === 0) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const registerInMySQL = async (userData) => {
    console.log('MESSAGE 1: registerInMySQL:', userData);
    const response = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MySQL registration failed: ${text}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Database registration failed');
    }
    console.log('MESSAGE2: registration successful:', data);
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('MESSAGE3: handleSubmit completed');

    if (!validateInputs()) return;

    setIsLoading(true);
    setFormError('');
    try {
      console.log('MESSAGE4: signing up with stackauth:', { email, name });
      const result = await app.signUpWithCredential(
        { email, password, attributes: { name } },
        { redirect: false }
      );
      if (result.status === 'error') {
        throw new Error(result.error?.message || 'Stack Auth signup failed');
      }
      console.log('MESSAGE5: stackauth worked');

      await registerInMySQL({
        username: email,
        email,
        password_hash: password,
        display_name: name,
        auth_provider: 'email',
      });

      router.push('/profile');
    } catch (err) {
      console.error('signup error:', err);
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  //oauth signup, like google, github, microsoft. thats what we have right now
  const handleOAuthSignup = async (provider) => {
    setIsLoading(true);
    setFormError('');
    try {
      console.log(`signing up with ${provider}`);
      const result = await app.signInWithOAuth(provider, { redirect: false });
      if (result.status === 'error') {
        throw new Error(result.error?.message || `${provider} OAuth failed`);
      }
      console.log(`${provider} OAuth successful:`, result.user.email);

      await registerInMySQL({
        username: result.user.email,
        email: result.user.email,
        display_name: result.user.displayName || result.user.email.split('@')[0],
        auth_provider: provider.toLowerCase(),
      });

      router.push('/profile');
    } catch (err) {
      console.error(`${provider} signup failed:`, err);
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
          justifyContent: 'center',
          height: '100vh',
          position: 'relative',
          background: 'radial-gradient(circle at center, #03162B, #03172C, #051220)',
          color: '#fff',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
          },
        }}
      >
        <Stack
          direction="column"
          sx={{
            gap: { xs: 6, sm: 8 },
            p: 2,
            mx: 'auto',
            width: '100%',
            maxWidth: 480,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              p: 4,
              boxShadow: 'hsla(220, 30%, 5%, 0.2) 0px 5px 15px, hsla(220, 25%, 10%, 0.2) 0px 15px 35px -5px',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign Up
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {formError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  id="name"
                  name="name"
                  placeholder="Jon Snow"
                  required
                  fullWidth
                  error={nameError}
                  helperText={nameErrorMessage}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  fullWidth
                  error={emailError}
                  helperText={emailErrorMessage}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  required
                  fullWidth
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </FormControl>

              <FormControlLabel
                control={<Checkbox disabled={isLoading} />}
                label="I want to receive updates via email."
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign up'}
              </Button>
            </Box>

            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>

            <Stack gap={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleOAuthSignup('google')}
                disabled={isLoading}
              >
                Sign up with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleOAuthSignup('microsoft')}
                disabled={isLoading}
              >
                Sign up with Microsoft
              </Button>

              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link href="/sign-in" variant="body2" sx={{ fontWeight: 'bold' }}>
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