'use client';

import { useEffect, useState } from 'react';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

export default function KiblatPage() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Calculate Qibla direction using the spherical law of cosines
  const calculateQibla = (lat: number, lon: number) => {
    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (KAABA_LAT * Math.PI) / 180;
    const λ1 = (lon * Math.PI) / 180;
    const λ2 = (KAABA_LON * Math.PI) / 180;
    const Δλ = λ2 - λ1;

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;

    // Normalize to 0-360
    qibla = (qibla + 360) % 360;

    return qibla;
  };

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          const qibla = calculateQibla(latitude, longitude);
          setQiblaDirection(qibla);
          setIsLoading(false);
        },
        (err) => {
          setError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
          setIsLoading(false);
          console.error(err);
        }
      );
    } else {
      setError('Browser tidak mendukung geolocation.');
      setIsLoading(false);
    }
  }, []);

  // Request device orientation permission and handle orientation
  useEffect(() => {
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          'requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            setPermissionGranted(true);
          } else {
            setError('Izin orientasi perangkat ditolak.');
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setPermissionGranted(true);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading = event.alpha;

      if ('webkitCompassHeading' in event && (event as any).webkitCompassHeading) {
        // iOS
        heading = 360 - (event as any).webkitCompassHeading;
      }

      if (heading !== null && heading !== undefined) {
        setCurrentHeading(heading);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  const calculateRotation = () => {
    if (qiblaDirection === null) return 0;
    return qiblaDirection - currentHeading;
  };

  const getArrowPosition = () => {
    if (qiblaDirection === null) return 0;
    return (qiblaDirection - currentHeading + 360) % 360;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F3D2E] mb-2">
            🧭 Kompas Kiblat
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Temukan arah Ka'bah dari lokasi Anda
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#0F3D2E] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat lokasi...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center">
            <p className="text-red-700 text-lg mb-4">❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#0F3D2E] text-white px-6 py-3 rounded-xl hover:bg-[#0a2b20] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            {/* Location Info */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">📍 Latitude</p>
                  <p className="text-lg font-semibold text-[#0F3D2E]">
                    {userLocation?.lat.toFixed(4)}°
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">📍 Longitude</p>
                  <p className="text-lg font-semibold text-[#0F3D2E]">
                    {userLocation?.lon.toFixed(4)}°
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">🕋 Arah Kiblat</p>
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      {qiblaDirection?.toFixed(1)}°
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      dari arah Utara
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">📱 Arah HP</p>
                    <p className="text-2xl font-bold text-[#0F3D2E]">
                      {currentHeading.toFixed(1)}°
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      dari arah Utara
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compass */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <div className="relative w-72 h-72 mx-auto">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-8 border-[#E6F4EA] rounded-full"></div>

                {/* Direction Labels */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${-currentHeading}deg)` }}
                >
                  <div className="absolute top-2 text-sm font-bold text-[#0F3D2E]">U</div>
                  <div className="absolute bottom-2 text-sm font-bold text-[#0F3D2E]">S</div>
                  <div className="absolute left-2 text-sm font-bold text-[#0F3D2E]">B</div>
                  <div className="absolute right-2 text-sm font-bold text-[#0F3D2E]">T</div>
                </div>

                {/* Compass Rose */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: `rotate(${-currentHeading}deg)` }}
                  viewBox="0 0 100 100"
                >
                  {/* Star pattern */}
                  <g fill="none" stroke="#0F3D2E" strokeWidth="0.5">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                      <line
                        key={angle}
                        x1="50"
                        y1="50"
                        x2={50 + 40 * Math.cos((angle - 90) * Math.PI / 180)}
                        y2={50 + 40 * Math.sin((angle - 90) * Math.PI / 180)}
                        opacity="0.3"
                      />
                    ))}
                  </g>

                  {/* Concentric circles */}
                  <circle cx="50" cy="50" r="15" fill="none" stroke="#0F3D2E" strokeWidth="0.5" opacity="0.2" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#0F3D2E" strokeWidth="0.5" opacity="0.2" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#0F3D2E" strokeWidth="0.5" opacity="0.2" />
                </svg>

                {/* Kaaba Direction Arrow */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${getArrowPosition()}deg)` }}
                >
                  <div className="relative w-32 h-4">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="flex items-center">
                        {/* Arrow pointing to Kaaba */}
                        <div className="relative">
                          <svg
                            width="60"
                            height="40"
                            viewBox="0 0 60 40"
                            className="drop-shadow-lg"
                          >
                            <path
                              d="M 30 0 L 60 40 L 30 30 L 0 40 Z"
                              fill="#D4AF37"
                              stroke="#0F3D2E"
                              strokeWidth="1"
                            />
                            {/* Kaaba icon */}
                            <rect
                              x="22"
                              y="8"
                              width="16"
                              height="16"
                              fill="#0F3D2E"
                              rx="1"
                            />
                            <text
                              x="30"
                              y="20"
                              textAnchor="middle"
                              fill="#D4AF37"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              ک
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Point */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#0F3D2E] rounded-full border-4 border-[#D4AF37]"></div>
                </div>
              </div>

              {/* Instruction */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  📱 Putar HP Anda sampai panas emas menunjuk ke Ka'bah
                </p>
                {qiblaDirection !== null && (
                  <div className="bg-gradient-to-r from-amber-100 to-green-100 rounded-xl p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-[#0F3D2E]">Info:</span> Arah Kiblat dari lokasi Anda adalah{' '}
                      <span className="font-bold text-[#D4AF37]">{qiblaDirection.toFixed(1)}°</span> dari arah Utara
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-3xl p-6 border-2 border-[#E6F4EA]">
              <h3 className="font-bold text-[#0F3D2E] mb-3 text-center">💡 Tips Penggunaan</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Gunakan di tempat terbuka dengan sinyal GPS yang kuat</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Away dari pengaruh magnetik (komputer, logam, dll)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Kalibrasi kompas dengan menggerakkan HP membentuk angka 8</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Pastikan rotasi layar tidak terkunci</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
