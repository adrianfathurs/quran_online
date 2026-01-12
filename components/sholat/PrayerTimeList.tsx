'use client';

import { useState, useEffect, useRef } from 'react';
import PrayerCard from './PrayerCard';
import { useTranslation } from '@/lib/i18n';
import {
  getNotificationPermission,
  requestNotificationPermission,
  showPrayerTimeNotification,
  getSecondsUntilTime,
  timeToMinutes,
  getCurrentTimeInMinutes,
} from '@/lib/notifications';

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
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);
  const notificationSentRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check notification permission on mount
  useEffect(() => {
    const { permission, canRequest } = getNotificationPermission();
    setNotificationEnabled(permission === 'granted');

    // Auto-request permission if not set
    if (canRequest) {
      // Show a prompt after 2 seconds
      const timer = setTimeout(() => {
        requestNotificationPermission().then((granted) => {
          setNotificationEnabled(granted);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Calculate next prayer and setup notification timer
  useEffect(() => {
    if (!prayerTimes?.data?.prayer_times || !notificationEnabled) {
      return;
    }

    const times = prayerTimes.data.prayer_times;

    // Clean up previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset notification tracking for new data
    notificationSentRef.current = new Set();

    const calculateNextPrayer = () => {
      const prayers = [
        { key: 'fajr', name: t.sholat.subuh, time: times.fajr },
        { key: 'dhuhr', name: t.sholat.dzuhur, time: times.dhuhr },
        { key: 'asr', name: t.sholat.ashar, time: times.asr },
        { key: 'maghrib', name: t.sholat.maghrib, time: times.maghrib },
        { key: 'isha', name: t.sholat.isya, time: times.isha },
      ];

      const currentMinutes = getCurrentTimeInMinutes();
      let nextPrayerFound: { name: string; time: string; minutesLeft: number } | null = null;

      // Find next prayer
      for (const prayer of prayers) {
        const prayerMinutes = timeToMinutes(prayer.time);

        if (prayerMinutes > currentMinutes) {
          const minutesLeft = prayerMinutes - currentMinutes;
          nextPrayerFound = { name: prayer.name, time: prayer.time, minutesLeft };
          break;
        }
      }

      // If no prayer found (all prayers have passed), next prayer is Fajr tomorrow
      if (!nextPrayerFound && prayers.length > 0) {
        const fajrTomorrow = prayers[0];
        const fajrMinutes = timeToMinutes(fajrTomorrow.time);
        const minutesUntilMidnight = (24 * 60) - currentMinutes;
        nextPrayerFound = {
          name: fajrTomorrow.name,
          time: fajrTomorrow.time,
          minutesLeft: minutesUntilMidnight + fajrMinutes,
        };
      }

      setNextPrayer(nextPrayerFound);

      // Check if it's time for prayer (within 1 minute)
      if (nextPrayerFound) {
        const { name, time } = nextPrayerFound;
        const notificationKey = `${name}-${time}`;

        // Only send notification once per prayer time
        if (nextPrayerFound.minutesLeft === 0 && !notificationSentRef.current.has(notificationKey)) {
          showPrayerTimeNotification(name, time);
          notificationSentRef.current.add(notificationKey);
        }
      }
    };

    // Initial calculation
    calculateNextPrayer();

    // Check every 30 seconds
    intervalRef.current = setInterval(() => {
      calculateNextPrayer();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prayerTimes, notificationEnabled, t]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
  };

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
      {/* Notification Permission Banner */}
      {!notificationEnabled && (
        <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <p className="font-semibold text-primary">Aktifkan Notifikasi Sholat</p>
              <p className="text-sm text-primary/70">Dapatkan pengingat saat waktu sholat tiba</p>
            </div>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 bg-gold text-primary rounded-lg font-semibold hover:bg-gold/90 transition-colors min-h-[44px]"
          >
            Aktifkan
          </button>
        </div>
      )}

      {/* Notification Enabled Badge */}
      {notificationEnabled && nextPrayer && (
        <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🔔</span>
            <p className="font-semibold text-primary">Notifikasi Aktif</p>
          </div>
          <p className="text-lg text-primary">
            Sholat berikutnya: <span className="font-bold text-gold">{nextPrayer.name}</span>
            <span className="text-primary/70 text-base ml-2">
              ({nextPrayer.time} - {nextPrayer.minutesLeft > 0 ? `${nextPrayer.minutesLeft} menit lagi` : 'Sekarang!'})
            </span>
          </p>
        </div>
      )}

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
