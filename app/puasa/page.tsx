'use client';

import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import type { PuasaSchedule } from '@/types';

// Ramadhan 2026 (1447 H) - Estimated dates
// Ramadhan 2026 is expected to start around February 18, 2026
function generateRamadhan2026Schedule(): PuasaSchedule[] {
  const schedule: PuasaSchedule[] = [];
  const startDate = new Date('2026-02-18');
  const imsakBase = new Date('2026-02-18T04:35:00');
  const bukaBase = new Date('2026-02-18T18:12:00');

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Adjust times slightly for each day (approximate)
    const imsakDate = new Date(imsakBase);
    imsakDate.setDate(imsakBase.getDate() + i);
    imsakDate.setSeconds(imsakDate.getSeconds() + (i * 45)); // Add ~45s per day

    const bukaDate = new Date(bukaBase);
    bukaDate.setDate(bukaBase.getDate() + i);
    bukaDate.setSeconds(bukaDate.getSeconds() - (i * 30)); // Subtract ~30s per day

    schedule.push({
      date: date.toISOString().split('T')[0],
      day: i + 1,
      imsak: imsakDate.toTimeString().slice(0, 5),
      buka: bukaDate.toTimeString().slice(0, 5),
    });
  }

  return schedule;
}

export default function PuasaPage() {
  const { t } = useTranslation();
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const [schedule] = useState<PuasaSchedule[]>(generateRamadhan2026Schedule());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const today = new Date().toISOString().split('T')[0];
    const index = schedule.findIndex((s) => s.date === today);
    setTodayIndex(index >= 0 ? index : null);
  }, [schedule]);

  const formatDateSafe = (dateString: string) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.puasa.title}</h1>
        <p className="text-lg text-primary/70">18 Februari 2026 - 20 Maret 2026</p>
      </div>

      {/* Today's Status (if during Ramadhan) */}
      {isMounted && todayIndex !== null && (
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
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-4">
          {schedule.map((item) => {
            const isToday = isMounted && todayIndex !== null && item.day === todayIndex + 1;
            const formattedDate = formatDateSafe(item.date);

            return (
              <div
                key={item.day}
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
                        {item.day}
                      </div>
                      <span className="text-sm text-primary/60">{t.puasa.day}</span>
                    </div>
                    <p className="text-sm text-primary/70" suppressHydrationWarning>{formattedDate}</p>
                  </div>

                  {/* Times */}
                  <div className="flex md:justify-end gap-8">
                    <div className="text-center">
                      <p className="text-xs text-primary/60 mb-1">{t.puasa.imsak}</p>
                      <p className="text-lg font-semibold text-primary">{item.imsak}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-primary/60 mb-1">{t.puasa.buka}</p>
                      <p className="text-lg font-semibold text-gold">{item.buka}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
