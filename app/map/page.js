"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import AppAppBar from "../home-page/components/AppAppBar";
import { Box, Button, Typography } from "@mui/material";

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
          setUserLocation({ lat: 40.7128, lng: -74.006 }); // fallback NYC
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  useEffect(() => {
    async function fetchDelis() {
      try {
        const res = await fetch("https://data.cityofnewyork.us/resource/ud4g-9x9z.json");
        const data = await res.json();
        setDelis(data);
      } catch (error) {
        console.error("Failed to fetch deli data:", error);
      }
    }
    fetchDelis();
  }, []);

  if (loadError) return <p>Failed to load map.</p>;
  if (isLoading || !isLoaded || userLocation === null) return <p>Loading map...</p>;
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
      <AppAppBar />
      <Box display="flex" width="100vw" height="100vh">
        {/* Conditional sidebar */}
        {selectedDeli && (
          <Box
            width="450px"
            bgcolor="#f9f9f9"
            p={2}
            overflow="auto"
            sx={{ color: "#111" }}
          >
            <Typography variant="h5" gutterBottom>
              {selectedDeli.store_name || "Unnamed Deli"}
            </Typography>
            {selectedDeli.street_address && (
              <Typography variant="body1">
                <strong>Address:</strong> {selectedDeli.street_address}
              </Typography>
            )}
            {selectedDeli.borough && (
              <Typography variant="body1">
                <strong>Borough:</strong> {selectedDeli.borough}
              </Typography>
            )}
            {selectedDeli.zip_code && (
              <Typography variant="body1">
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
            <Typography variant="body2">
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

        {/* Map always fills the rest */}
        <Box flex={1}>
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

            {/* Deli markers */}
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
      </Box>
    </>
  );
}