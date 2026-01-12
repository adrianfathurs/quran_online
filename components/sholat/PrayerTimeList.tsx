'use client';

import PrayerCard from './PrayerCard';
import { useTranslation } from '@/lib/i18n';

interface UmmahResponse {
  success?: boolean;
  data?: {
    date?: string;
    calculation_method?: string;
    madhab?: string;
    prayer_times?: {
      fajr: string;
      sunrise?: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    };
    current_status?: {
      current_prayer: string;
      next_prayer: string;
      time_until_next?: string;
      minutes_until_next?: number;
    };
  };
}

interface PrayerTimeListProps {
  prayerTimes: UmmahResponse | null;
  isLoading: boolean;
}

export default function PrayerTimeList({ prayerTimes, isLoading }: PrayerTimeListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
        <p className="mt-4 text-primary/70">Loading prayer times...</p>
      </div>
    );
  }

  if (!prayerTimes || !prayerTimes.data?.prayer_times) {
    return (
      <div className="text-center py-12">
        <p className="text-primary/70">Failed to load prayer times</p>
        <p className="text-sm text-primary/50 mt-2">Please try selecting a different location or method</p>
      </div>
    );
  }

  const times = prayerTimes.data.prayer_times;
  const currentStatus = prayerTimes.data.current_status;
  const method = prayerTimes.data.calculation_method;
  const madhab = prayerTimes.data.madhab;

  // Map Ummah API response to our display format
  const prayers: Array<{ key: string; name: string; time: string }> = [
    { key: 'fajr', name: t.sholat.subuh, time: times.fajr },
  ];

  // Add sunrise if available
  if (times.sunrise) {
    prayers.push({ key: 'sunrise', name: 'Terbit', time: times.sunrise });
  }

  // Add remaining prayers
  prayers.push(
    { key: 'dhuhr', name: t.sholat.dzuhur, time: times.dhuhr },
    { key: 'asr', name: t.sholat.ashar, time: times.asr },
    { key: 'maghrib', name: t.sholat.maghrib, time: times.maghrib },
    { key: 'isha', name: t.sholat.isya, time: times.isha },
  );

  return (
    <div>
      {/* Current Status */}
      {currentStatus && (
        <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-6 mb-8 text-center">
          <p className="text-sm text-primary/60 mb-2">
            {method && `Metode: ${method}`}
            {method && madhab && ' • '}
            {madhab && `Madhab: ${madhab}`}
          </p>
          <h3 className="text-xl font-bold text-primary mb-2">
            Waktu sholat saat ini: {currentStatus.current_prayer}
          </h3>
          <p className="text-lg text-gold font-semibold">
            Sholat berikutnya: {currentStatus.next_prayer}
            {currentStatus.minutes_until_next !== undefined && (
              <span className="text-primary/80 text-base ml-2">
                ({currentStatus.minutes_until_next} menit lagi)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Prayer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer.key}
            name={prayer.name}
            time={prayer.time}
          />
        ))}
      </div>
    </div>
  );
}
