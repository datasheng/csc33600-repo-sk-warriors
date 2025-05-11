"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const libraries = ["places"];

export default function MapPage() {
  const router = useRouter();
  const userState = useUser();
  const user = userState?.user;
  const isLoading = userState?.isLoading;

  const [userLocation, setUserLocation] = useState(null);
  const [delis, setDelis] = useState([]);
  const [selectedDeli, setSelectedDeli] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/sign-in");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  useEffect(() => {
    async function fetchDelis() {
      try {
        const res = await fetch(
          "https://data.cityofnewyork.us/resource/ud4g-9x9z.json"
        );
        const data = await res.json();
        setDelis(data);
      } catch (error) {
        console.error("Failed to fetch deli data:", error);
      }
    }
    fetchDelis();
  }, []);

  const handleSignOut = async () => {
    try {
      await userState.signOut(); // stackframe sign-out
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const actions = [
    { icon: <HomeIcon />, name: "Home", onClick: () => router.push("/") },
    { icon: <InfoIcon />, name: "About", onClick: () => router.push("/about") },
    {
      icon: <AttachMoneyIcon />,
      name: "Pricing",
      onClick: () => router.push("/pricing"),
    },
    {
      icon: <ContactMailIcon />,
      name: "Contact",
      onClick: () => router.push("/contact"),
    },
    {
      icon: <LoginIcon />,
      name: "Sign In",
      onClick: () => router.push("/sign-in"),
    },
    {
      icon: <LogoutIcon color="error" />,
      name: "Sign Out",
      onClick: handleSignOut,
    },
  ];

  if (loadError) return <p>Failed to load map.</p>;
  if (isLoading || !isLoaded || userLocation === null)
    return <p>Loading map...</p>;
  if (!isLoading && user === null) return null;

  const glowingDotSVG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4285F4" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#4285F4" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#glow)" />
        <circle cx="32" cy="32" r="10" fill="#4285F4" stroke="white" stroke-width="2" />
      </svg>
    `);

  return (
    <>
      {/* Sidebar */}
      {selectedDeli && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "450px",
            height: "100vh",
            bgcolor: "#f9f9f9",
            p: 2,
            overflow: "auto",
            zIndex: 1300,
            boxShadow: 3,
            color: "#111",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#111" }}>
            {selectedDeli.store_name || "Unnamed Deli"}
          </Typography>
          {selectedDeli.street_address && (
            <Typography variant="body1" sx={{ color: "#111" }}>
              <strong>Address:</strong> {selectedDeli.street_address}
            </Typography>
          )}
          {selectedDeli.borough && (
            <Typography variant="body1" sx={{ color: "#111" }}>
              <strong>Borough:</strong> {selectedDeli.borough}
            </Typography>
          )}
          {selectedDeli.zip_code && (
            <Typography variant="body1" sx={{ color: "#111" }}>
              <strong>Zip Code:</strong> {selectedDeli.zip_code}
            </Typography>
          )}
          <Box mt={2} mb={2}>
            <img
              src="/placeholder-image.jpg"
              alt="Deli"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#111" }}>
            <strong>Special Deals:</strong> Coming soon!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setSelectedDeli(null)}
          >
            Close
          </Button>
        </Box>
      )}

      {/* Map */}
      <Box sx={{ height: "100vh", width: "100vw" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={userLocation}
          zoom={15}
          mapTypeId="roadmap"
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* User marker */}
          <Marker
            position={userLocation}
            icon={{
              url: glowingDotSVG,
              scaledSize: new window.google.maps.Size(64, 64),
              anchor: new window.google.maps.Point(32, 32),
            }}
          />

          {delis.map((deli, index) => {
            if (!deli.latitude || !deli.longitude) return null;

            return (
              <Marker
                key={index}
                position={{
                  lat: parseFloat(deli.latitude),
                  lng: parseFloat(deli.longitude),
                }}
                title={deli.store_name}
                onClick={() => setSelectedDeli(deli)}
              />
            );
          })}
        </GoogleMap>
      </Box>

      {/*this is the new appbar, its basically using mui speed dial component.*/}
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1400 }}>
        <SpeedDial
          ariaLabel="Site Navigation"
          icon={<SpeedDialIcon />}
          direction="left"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  );
}
