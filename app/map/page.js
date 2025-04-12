'use client';

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 40.7128,
  lng: -74.0060,
};

export default function MapPage() {
  const router = useRouter();
  const userState = useUser();
  const user = userState?.user;
  const isLoading = userState?.isLoading;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/sign-in');
    }
  }, [isLoading, user, router]);

  if (loadError) return <p>Failed to load map.</p>;
  if (isLoading || !isLoaded) return <p>Loading map...</p>;
  if (!isLoading && user === null) return null;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        mapTypeId="roadmap"
      />
    </div>
  );
}
