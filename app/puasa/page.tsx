'use client';

import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import type { ImsakiyahSchedule } from '@/types';
import { getProvinces, getCities, getImsakiyahSchedule, getUserLocation, reverseGeocode } from '@/lib/api';
import { saveCitySelection, getCitySelection } from '@/lib/storage';

export default function PuasaPage() {
  const { t } = useTranslation();
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ImsakiyahSchedule[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // City selection states
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    fetchProvinces();

    // Load saved city selection
    const savedCity = getCitySelection();
    if (savedCity) {
      setSelectedProvince(savedCity.province);
      setSelectedCity(savedCity.city);
      setCurrentLocation(`${savedCity.city}, ${savedCity.province}`);
      fetchSchedule(savedCity.province, savedCity.city);
    } else {
      // Try to detect location if no saved city
      detectUserLocation();
    }
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        const data = await getCities(selectedProvince);
        setCities(data);
      };
      fetchCities();
    }
  }, [selectedProvince]);

  // Update today's index when schedule changes
  useEffect(() => {
    if (schedule.length > 0) {
      // Ramadhan 2026 starts on February 18, 2026
      const ramadhanStartDate = new Date('2026-02-18');
      const today = new Date();

      // Calculate day difference
      const dayDiff = Math.floor((today.getTime() - ramadhanStartDate.getTime()) / (1000 * 60 * 60 * 24));

      // tanggal is day number (1-30)
      const index = schedule.findIndex((s) => s.tanggal === dayDiff + 1);
      setTodayIndex(index >= 0 ? index : null);
    }
    setIsMounted(true);
    setLoading(false);
  }, [schedule]);

  const detectUserLocation = async () => {
    setDetectingLocation(true);
    setLocationError('');

    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;

      console.log('User location:', latitude, longitude);

      // Reverse geocode to get city and province
      const geocodeResult = await reverseGeocode(latitude, longitude);

      if (geocodeResult) {
        console.log('Geocode result:', geocodeResult);

        // Get list of provinces to match
        const provinceList = await getProvinces();

        // Fuzzy matching for province
        const matchedProvince = provinceList.find((prov) => {
          const provLower = prov.toLowerCase();
          const geoProvLower = geocodeResult.province.toLowerCase();
          return provLower === geoProvLower ||
                 provLower.includes(geoProvLower) ||
                 geoProvLower.includes(provLower);
        });

        if (matchedProvince) {
          // Get cities for the matched province
          const cityList = await getCities(matchedProvince);

          // Fuzzy matching for city
          const matchedCity = cityList.find((city) => {
            const cityLower = city.toLowerCase();
            const geoCityLower = geocodeResult.city.toLowerCase();
            return cityLower === geoCityLower ||
                   cityLower.includes(geoCityLower) ||
                   geoCityLower.includes(cityLower);
          });

          if (matchedCity) {
            setSelectedProvince(matchedProvince);
            setSelectedCity(matchedCity);
            setCurrentLocation(`${matchedCity}, ${matchedProvince} (Deteksi Lokasi)`);
            await fetchSchedule(matchedProvince, matchedCity);
            return;
          }
        }
      }

      // If geocoding or matching failed, default to Jakarta
      console.log('Could not match location, defaulting to Jakarta');
      setSelectedProvince('DKI Jakarta');
      setSelectedCity('Jakarta Pusat');
      setCurrentLocation('Jakarta Pusat, DKI Jakarta (Lokasi Default)');
      await fetchSchedule('DKI Jakarta', 'Jakarta Pusat');
    } catch (error) {
      console.error('Error detecting location:', error);
      setLocationError('Tidak dapat mendeteksi lokasi. Silakan pilih kota secara manual.');
      // Default to Jakarta
      setSelectedProvince('DKI Jakarta');
      setSelectedCity('Jakarta Pusat');
      setCurrentLocation('Jakarta Pusat, DKI Jakarta (Lokasi Default)');
      await fetchSchedule('DKI Jakarta', 'Jakarta Pusat');
    } finally {
      setDetectingLocation(false);
    }
  };

  const fetchSchedule = async (province: string, city: string) => {
    setLoading(true);
    const scheduleData = await getImsakiyahSchedule({ provinsi: province, kabkota: city });
    if (scheduleData.length > 0) {
      setSchedule(scheduleData);
      saveCitySelection(province, city);
    }
    setLoading(false);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedCity('');
    setCities([]);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const handleApplyCity = () => {
    if (selectedProvince && selectedCity) {
      fetchSchedule(selectedProvince, selectedCity);
      setCurrentLocation(`${selectedCity}, ${selectedProvince}`);
      setShowCitySelector(false);
    }
  };

  const formatDateSafe = (tanggal: number) => {
    // Ramadhan 2026 starts on February 18, 2026
    const ramadhanStartDate = new Date('2026-02-18');
    const dateObj = new Date(ramadhanStartDate);
    dateObj.setDate(ramadhanStartDate.getDate() + (tanggal - 1));

    return dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.puasa.title}</h1>
        <p className="text-lg text-primary/70">Ramadhan 1447 H</p>

        {/* Current Location Display */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="bg-soft border border-primary/20 rounded-lg px-4 py-2">
            <p className="text-sm text-primary/80">
              <span className="font-semibold">Lokasi:</span> {currentLocation || 'Memuat...'}
            </p>
          </div>
          <button
            onClick={() => setShowCitySelector(!showCitySelector)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            {showCitySelector ? 'Tutup' : 'Ganti Kota'}
          </button>
          {!detectingLocation && (
            <button
              onClick={detectUserLocation}
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/80 transition-colors text-sm font-medium"
              title="Deteksi lokasi otomatis"
            >
              📍 Deteksi Lokasi
            </button>
          )}
        </div>

        {detectingLocation && (
          <p className="text-sm text-primary/60 mt-2">Mendeteksi lokasi...</p>
        )}
        {locationError && (
          <p className="text-sm text-red-500 mt-2">{locationError}</p>
        )}
      </div>

      {/* City Selector */}
      {showCitySelector && (
        <div className="max-w-2xl mx-auto mb-8 bg-white border-2 border-soft/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Pilih Kota</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary/80 mb-2">
                Provinsi
              </label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full px-4 py-2 border-2 border-soft/30 rounded-lg focus:outline-none focus:border-gold bg-white"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary/80 mb-2">
                Kota/Kabupaten
              </label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedProvince || cities.length === 0}
                className="w-full px-4 py-2 border-2 border-soft/30 rounded-lg focus:outline-none focus:border-gold bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleApplyCity}
              disabled={!selectedProvince || !selectedCity}
              className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/80 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
          <p className="text-primary/70 mt-4">Memuat jadwal imsakiyah...</p>
        </div>
      )}

      {/* Today's Status (if during Ramadhan) */}
      {isMounted && !loading && todayIndex !== null && (
        <div className="mb-12 bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-8 text-center">
          <p className="text-2xl font-bold text-primary mb-2">
            Hari ke-{todayIndex + 1} Ramadhan 1447 H
          </p>
          <p className="text-primary/70">
            Mari perbanyak ibadah dan amal shaleh
          </p>
        </div>
      )}

      {/* Schedule Grid */}
      {!loading && schedule.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4">
            {schedule.map((item, index) => {
              const isToday = isMounted && todayIndex !== null && index === todayIndex;
              const formattedDate = formatDateSafe(item.tanggal);

              return (
                <div
                  key={index}
                  className={`bg-white border-2 rounded-xl p-6 ${
                    isToday ? 'border-gold bg-gold/5' : 'border-soft/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Day & Date */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          isToday ? 'bg-gold text-white' : 'bg-soft text-primary'
                        }`}>
                          {item.tanggal}
                        </div>
                        <span className="text-sm text-primary/60">{t.puasa.day}</span>
                      </div>
                      <p className="text-sm text-primary/70">{formattedDate}</p>
                    </div>

                    {/* Times */}
                    <div className="flex md:justify-end gap-8">
                      <div className="text-center">
                        <p className="text-xs text-primary/60 mb-1">{t.puasa.imsak}</p>
                        <p className="text-lg font-semibold text-primary">{item.imsak}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary/60 mb-1">{t.puasa.buka}</p>
                        <p className="text-lg font-semibold text-gold">{item.maghrib}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <div className="bg-soft border border-primary/20 rounded-xl p-8">
          <p className="text-lg italic text-primary/80">
            &quot;Puasa Ramadhan adalah penghapus dosa-dosa yang lalu, selama dosa-dosa itu dijauhi.&quot;
          </p>
          <p className="text-sm font-semibold text-primary mt-4">
            — HR. An-Nasa&apos;i
          </p>
        </div>
      </div>
    </div>
  );
}
