'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { getPrayerTimes, formatDate, getSavedLocation } from '@/lib/api';
import LocationPicker from '@/components/sholat/LocationPicker';
import PrayerTimeList from '@/components/sholat/PrayerTimeList';
import type { Location } from '@/types';

export default function SholatPage() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location>({ lat: -6.2088, lng: 106.8456, name: 'Jakarta' });
  const [method, setMethod] = useState('MuslimWorldLeague');
  const [madhab, setMadhab] = useState<'Shafi' | 'Hanafi'>('Shafi');
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = getSavedLocation();
    if (saved) {
      setLocation(saved);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPrayerTimes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching prayer times for lat: ${location.lat}, lng: ${location.lng}`);
        const data = await getPrayerTimes(location.lat, location.lng, madhab, method);

        if (!isMounted) return;

        if (data?.data) {
          setPrayerTimes(data);
        } else {
          setError('Failed to load prayer times');
        }
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        if (isMounted) {
          setError('An error occurred while loading prayer times');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPrayerTimes();

    return () => {
      isMounted = false;
    };
  }, [location, madhab, method]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.sholat.title}</h1>
        {isMounted && (
          <p className="text-lg text-primary/70" suppressHydrationWarning>
            {formatDate(new Date())}
          </p>
        )}
      </div>

      {/* Location & Method Selection */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white border-2 border-soft/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Pilih Lokasi</h2>
          <LocationPicker
            onLocationChange={setLocation}
            currentLocation={location}
          />

          {/* Method Selection */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-primary mb-2">
              Metode Perhitungan:
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full md:w-96 px-4 py-3 rounded-xl border-2 border-primary/20 bg-white text-primary focus:border-gold focus:outline-none min-h-[48px]"
            >
              <option value="MuslimWorldLeague">Muslim World League</option>
              <option value="Egypt">Egyptian General Authority</option>
              <option value="Karachi">University of Islamic Sciences, Karachi</option>
              <option value="UmmAlQura">Umm Al-Qura University, Makkah</option>
              <option value="Dubai">Dubai (Awqafi)</option>
              <option value="MoonsightingCommittee">Moonsighting Committee</option>
              <option value="NorthAmerica">Islamic Society of North America (ISNA)</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Qatar">Qatar</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>

          {/* Madhab Selection */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-primary mb-2">
              Madhab:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setMadhab('Shafi')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors min-h-[44px] ${
                  madhab === 'Shafi'
                    ? 'border-gold bg-gold/10 text-primary font-semibold'
                    : 'border-primary/20 bg-white text-primary hover:border-gold/50'
                }`}
              >
                Syafi'i
              </button>
              <button
                onClick={() => setMadhab('Hanafi')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors min-h-[44px] ${
                  madhab === 'Hanafi'
                    ? 'border-gold bg-gold/10 text-primary font-semibold'
                    : 'border-primary/20 bg-white text-primary hover:border-gold/50'
                }`}
              >
                Hanafi
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center max-w-4xl mx-auto">
          {error}
        </div>
      )}

      <PrayerTimeList prayerTimes={prayerTimes} isLoading={isLoading} />

      {/* API Attribution */}
      <div className="mt-8 text-center text-sm text-primary/50">
        Data provided by <a href="https://ummahapi.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Ummah API</a>
      </div>
    </div>
  );
}
