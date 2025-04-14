"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import AppAppBar from "../home-page/components/AppAppBar";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapPage() {
  const router = useRouter();
  const userState = useUser();
  const user = userState?.user;
  const isLoading = userState?.isLoading;

  const [userLocation, setUserLocation] = useState(null);
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

  if (loadError) return <p>Failed to load map.</p>;
  if (isLoading || !isLoaded || userLocation === null)
    return <p>Loading map</p>;
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
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#111",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation}
          zoom={16}
          mapTypeId="roadmap"
          onLoad={(map) => (mapRef.current = map)}
        >
          <Marker
            position={userLocation}
            icon={{
              url: glowingDotSVG,
              scaledSize: new window.google.maps.Size(64, 64),
              anchor: new window.google.maps.Point(32, 32),
            }}
          />
        </GoogleMap>
      </div>
    </>
  );
}
