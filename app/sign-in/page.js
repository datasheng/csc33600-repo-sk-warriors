'use client'

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import SignInCard from './components/SignInCard';
import Content from './components/Content';
import AppAppBar from '../home-page/components/AppAppBar';
import Footer from '../home-page/components/Footer';
import { SignIn } from '@stackframe/stack';

export default function SignInSide() {
  return (
    <>
      <AppAppBar></AppAppBar>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: 'center',
          height: '100vh',
          minHeight: '100%',
          position: 'relative',
          background: "radial-gradient(circle at center, #03162B, #03172C, #051220)",
          color: "#fff",
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            fontFamily: "Kanit, sans-serif"
          },
        }}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
          }}
        >
          <Content />
          <SignIn></SignIn>
        </Stack>
      </Stack>
      <Footer></Footer>
    </>
  );
}
