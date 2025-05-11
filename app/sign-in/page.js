"use client";

import { useSearchParams } from "next/navigation"; 
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Content from "./components/Content";
"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Content from "./components/Content";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import { SignIn, useUser, useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInSide() {
  const user = useUser();
  const router = useRouter();
  const app = useStackApp();

  // Double-layer redirect protection
  useEffect(() => {
    if (user) {
      router.push("/map");
    }
  }, [user]);

  return (
    <>
      <AppAppBar></AppAppBar>
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
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: "auto",
          }}
        >
          <Content />
          <SignIn
            automaticRedirect={false}
            afterSignIn={() => {
              app.redirect("/map");
              router.push("/map");
            }}
            firstTab="password"
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          />
        </Stack>
      </Stack>
      <Footer></Footer>
    </>
  );
}
