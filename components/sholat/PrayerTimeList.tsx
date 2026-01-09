'use client';

import PrayerCard from './PrayerCard';
import { useTranslation } from '@/lib/i18n';

interface UmmahResponse {
  success?: boolean;
  data?: {
    prayer_times?: {
      fajr: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
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

  // Map Ummah API response to our display format
  const prayers = [
    { key: 'fajr' as const, name: t.sholat.subuh, time: times.fajr },
    { key: 'dhuhr' as const, name: t.sholat.dzuhur, time: times.dhuhr },
    { key: 'asr' as const, name: t.sholat.ashar, time: times.asr },
    { key: 'maghrib' as const, name: t.sholat.maghrib, time: times.maghrib },
    { key: 'isha' as const, name: t.sholat.isya, time: times.isha },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {prayers.map((prayer) => (
        <PrayerCard
          key={prayer.key}
          name={prayer.name}
          time={prayer.time}
        />
      ))}
    </div>
  );
}
