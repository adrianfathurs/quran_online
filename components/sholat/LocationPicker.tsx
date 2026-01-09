'use client';

import { useState, useEffect } from 'react';
import { MAJOR_CITIES, saveLocation, getSavedLocation } from '@/lib/api';
import type { Location } from '@/types';

interface LocationPickerProps {
  onLocationChange: (location: Location) => void;
  currentLocation: Location;
}

export default function LocationPicker({ onLocationChange, currentLocation }: LocationPickerProps) {
  const [showMap, setShowMap] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    // Load saved location on mount
    const saved = getSavedLocation();
    if (saved) {
      onLocationChange(saved);
    }
  }, []);

  const handleCitySelect = (city: Location) => {
    onLocationChange(city);
    saveLocation(city);
    setShowMap(false);
  };

  const handleGetCurrentLocation = async () => {
    setUseCurrentLocation(true);
    try {
      const position = await (await import('@/lib/api')).getUserLocation();
      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        name: 'Lokasi Saya',
      };
      onLocationChange(location);
      saveLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
    } finally {
      setUseCurrentLocation(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Options */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGetCurrentLocation}
          disabled={useCurrentLocation}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors min-h-[48px] flex items-center gap-2 disabled:opacity-50"
        >
          {useCurrentLocation ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Mendeteksi...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>Lokasi Saya</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors min-h-[48px] flex items-center gap-2"
        >
          <span>🗺️</span>
          <span>{showMap ? 'Tutup Peta' : 'Pilih dari Peta'}</span>
        </button>
      </div>

      {/* City Quick Select */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Atau pilih kota besar:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MAJOR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className={`px-3 py-2 text-sm rounded-lg border-2 transition-colors min-h-[44px] ${
                currentLocation.name === city.name
                  ? 'border-gold bg-gold/10 text-primary font-semibold'
                  : 'border-primary/20 bg-white text-primary hover:border-gold/50'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Map Clicker */}
      {showMap && (
        <div className="bg-soft rounded-xl p-6 border-2 border-primary/20">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Pilih Lokasi di Peta Indonesia
          </h3>

          {/* Simplified Indonesia Map Clicker */}
          <div className="relative bg-white rounded-lg p-4 border-2 border-primary/10">
            <svg
              viewBox="0 0 200 300"
              className="w-full h-auto cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Convert to approximate Indonesia coordinates
                const lat = 6 + (1 - y) * 20 - 10; // Indonesia: -10 to 5
                const lng = 95 + x * 30; // Indonesia: 95 to 125

                const location: Location = {
                  lat: Math.round(lat * 100) / 100,
                  lng: Math.round(lng * 100) / 100,
                  name: `Lat: ${Math.round(lat * 100) / 100}, Lng: ${Math.round(lng * 100) / 100}`,
                };

                onLocationChange(location);
                saveLocation(location);
              }}
            >
              {/* Simplified Indonesia shape */}
              <path
                d="M 60 20 L 80 10 L 120 15 L 140 30 L 150 50 L 145 80 L 130 100 L 110 120 L 100 150 L 90 160 L 70 140 L 50 120 L 40 90 L 45 60 L 50 40 Z"
                fill="#E6F4EA"
                stroke="#0F3D2E"
                strokeWidth="2"
                className="hover:fill-gold/20 transition-colors"
              />

              {/* Current location marker */}
              {currentLocation && (
                <circle
                  cx={((currentLocation.lng - 95) / 30) * 200}
                  cy={(1 - (currentLocation.lat + 10) / 20) * 300}
                  r="5"
                  fill="#D4AF37"
                  stroke="#0F3D2E"
                  strokeWidth="2"
                />
              )}
            </svg>

            <p className="text-xs text-primary/60 mt-2 text-center">
              Klik pada peta untuk memilih lokasi
            </p>
          </div>

          {/* Current Selection */}
          {currentLocation && (
            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-gold/30">
              <p className="text-sm text-primary/70">Lokasi yang dipilih:</p>
              <p className="text-lg font-semibold text-primary">
                {currentLocation.name || `${currentLocation.lat}, ${currentLocation.lng}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
