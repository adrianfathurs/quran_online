'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import Card from '@/components/ui/Card';
import { formatDate, getHijriDate } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      href: '/sholat',
      icon: '🕌',
      title: t.home.prayerTimes,
      description: 'Cek jadwal sholat hari ini untuk kota Anda',
    },
    {
      href: '/quran',
      icon: '📖',
      title: t.home.quranReading,
      description: 'Baca Al-Qur\'an dengan penanda progres bacaan',
    },
    {
      href: '/puasa',
      icon: '🌙',
      title: t.home.fastingSchedule,
      description: 'Jadwal puasa Ramadhan 1447 H / 2026',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          {t.home.title}
        </h1>
        <p className="text-lg text-primary/70 mb-6">{t.home.subtitle}</p>
        <div className="inline-block bg-soft px-6 py-3 rounded-xl">
          <p className="text-sm text-primary/60">{getHijriDate()}</p>
          {isMounted && (
            <>
              <p className="text-lg font-semibold text-primary" suppressHydrationWarning>
                {formatDate(currentTime)}
              </p>
              <p className="text-2xl font-bold text-gold" suppressHydrationWarning>
                {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </>
          )}
          {!isMounted && (
            <>
              <p className="text-lg font-semibold text-primary">
                Loading...
              </p>
              <p className="text-2xl font-bold text-gold">
                --:--:--
              </p>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  {feature.title}
                </h2>
                <p className="text-sm text-primary/70">{feature.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <Card variant="gold">
          <blockquote className="text-lg italic text-primary/80">
            &quot;Sebaik-baik kalian adalah yang belajar Al-Qur&apos;an dan mengajarkannya.&quot;
          </blockquote>
          <p className="text-sm font-semibold text-primary mt-4">
            — HR. Bukhari
          </p>
        </Card>
      </div>
    </div>
  );
}
