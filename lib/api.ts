import type { PrayerScheduleResponse, Surah, SurahDetail, Location } from '@/types';

// Major Indonesian Cities for quick selection
export const MAJOR_CITIES: Location[] = [
  { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
  { lat: -7.2575, lng: 112.7521, name: 'Surabaya' },
  { lat: -6.9175, lng: 107.6191, name: 'Bandung' },
  { lat: 3.5952, lng: 98.6722, name: 'Medan' },
  { lat: -6.9667, lng: 110.4167, name: 'Semarang' },
  { lat: -5.1477, lng: 119.4328, name: 'Makassar' },
  { lat: -7.7956, lng: 110.3695, name: 'Yogyakarta' },
  { lat: -7.9797, lng: 112.6304, name: 'Malang' },
  { lat: -2.9761, lng: 104.7754, name: 'Palembang' },
  { lat: -8.6705, lng: 115.2126, name: 'Denpasar' },
  { lat: -0.9471, lng: 100.4172, name: 'Padang' },
  { lat: 0.5071, lng: 101.4479, name: 'Pekanbaru' },
];

// Prayer Times API - Using Aladhan API (supports CORS)
export async function getPrayerTimes(
  lat: number,
  lng: number,
  madhab: 'Shafi' | 'Hanafi' = 'Shafi',
  method = 'MuslimWorldLeague'
): Promise<PrayerScheduleResponse> {
  // Method name to ID mapping for Aladhan API
  const methodMap: Record<string, number> = {
    'MuslimWorldLeague': 3,
    'Egyptian': 5,
    'Karachi': 1,
    'UmmAlQura': 4,
    'Dubai': 8,
    'MoonsightingCommittee': 9,
    'NorthAmerica': 2,
    'Kuwait': 10,
    'Qatar': 11,
    'Singapore': 15,
  };

  const methodId = methodMap[method] ?? 3;
  const madhabId = madhab === 'Shafi' ? 1 : 2;

  // Build Aladhan API URL
  const apiUrl = new URL('https://api.aladhan.com/v1/timings');
  apiUrl.searchParams.append('latitude', lat.toString());
  apiUrl.searchParams.append('longitude', lng.toString());
  apiUrl.searchParams.append('method', methodId.toString());
  apiUrl.searchParams.append('madhab', madhabId.toString());

  try {
    console.log(`[Client] Fetching prayer times from Aladhan API: ${apiUrl.toString()}`);

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error(`[Client] Aladhan API error: ${response.status} ${response.statusText}`);
      return {};
    }

    const aladhanResponse = await response.json();
    console.log('[Client] Aladhan API response received:', aladhanResponse);

    if (aladhanResponse.code !== 200 || !aladhanResponse.data) {
      return {};
    }

    const timings = aladhanResponse.data.timings;

    // Convert Aladhan format to our format
    return {
      success: true,
      data: {
        date: aladhanResponse.data.date?.readable,
        location: {
          latitude: aladhanResponse.data.meta?.latitude ?? lat,
          longitude: aladhanResponse.data.meta?.longitude ?? lng,
        },
        calculation_method: aladhanResponse.data.meta?.method?.name ?? method,
        madhab: madhab,
        prayer_times: {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        },
      },
    };
  } catch (error) {
    console.error('[Client] Error fetching prayer times:', error);
    return {};
  }
}

// Get user's current location using browser geolocation
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  });
}

// Save user location preference to localStorage
export function saveLocation(location: Location): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user-location', JSON.stringify(location));
  }
}

// Get saved location from localStorage
export function getSavedLocation(): Location | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('user-location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Quran API - Using EQuran.id
export async function getAllSurahs(): Promise<Surah[]> {
  const url = 'https://equran.id/api/v2/surat';

  try {
    console.log('Fetching surah list from EQuran.id');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch surah list');
    }

    const json = await response.json();
    console.log('Surah list response:', json);

    if (!json || !json.data) {
      console.error('Invalid API response structure');
      return [];
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching surah list:', error);
    return [];
  }
}

export async function getSurahDetail(surahNumber: number): Promise<SurahDetail | null> {
  const url = `https://equran.id/api/v2/surat/${surahNumber}`;

  try {
    console.log(`Fetching surah ${surahNumber} from EQuran.id`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`Failed to fetch surah detail: ${response.status}`);
    }

    const json = await response.json();
    console.log('Surah detail response:', json);

    if (!json || !json.data) {
      console.error('Invalid API response structure:', json);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching surah detail:', error);
    return null;
  }
}

// Format date for display
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('id-ID', options);
}

// Get current Hijri date (simplified calculation)
export function getHijriDate(): string {
  // This is a simplified calculation
  // For accurate Hijri dates, consider using a library like 'hijri-date'
  const now = new Date();
  const islamicDate = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return islamicDate;
}
