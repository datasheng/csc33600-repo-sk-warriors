"use client";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sitemark from "./SitemarkIcon";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import Avatar from "@mui/material/Avatar";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const user = useUser();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignOut = async () => {
    await user?.signOut();
    window.location.href = "/";
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link href="/">
                <Button variant="text" color="info" size="small">
                  Home
                </Button>
              </Link>

              <Link href="/about-us">
                <Button variant="text" color="info" size="small">
                  About Us
                </Button>
              </Link>

              <Link href="/chatbot">
                <Button variant="text" color="info" size="small">
                  ChronicleAI
                </Button>
              </Link>

              <Link href="https://mintlify.com/" target="_blank">
                <Button variant="text" color="info" size="small">
                  Documentation
                </Button>
              </Link>

              <Link href="/pricing">
                <Button variant="text" color="info" size="small">
                  Pricing
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{ minWidth: 0 }}
                >
                  Contact
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <Link href="/profile" passHref>
                  <Avatar
                    sx={{ width: 32, height: 32, cursor: "pointer" }}
                    src={user.photoUrl || undefined}
                    alt={user.displayName || "User"}
                  />
                </Link>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Link
                  href="/about-us"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <MenuItem>About Us</MenuItem>
                </Link>

                <Link
                  href="/chatbot"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <MenuItem>ChronicleAI</MenuItem>
                </Link>

                <Link
                  href="/pricing"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <MenuItem>Pricing</MenuItem>
                </Link>

                <Link
                  href="/contact"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <MenuItem>Contact</MenuItem>
                </Link>

                <Divider sx={{ my: 3 }} />

                {user ? (
                  <>
                    <MenuItem sx={{ gap: 2 }}>
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={user.photoUrl || undefined}
                        alt={user.displayName || "User"}
                      />
                      <Box>{user.displayName || "My Account"}</Box>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="error"
                        variant="outlined"
                        fullWidth
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <Link href="/sign-up">
                      <MenuItem>
                        <Button color="primary" variant="contained" fullWidth>
                          Sign up
                        </Button>
                      </MenuItem>
                    </Link>
                  </>
                )}
                <Link href="/sign-in">
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth>
                      Sign in
                    </Button>
                  </MenuItem>
                </Link>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
