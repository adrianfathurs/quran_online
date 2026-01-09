'use client';

import { saveProgress } from '@/lib/storage';
import type { Ayah, QuranProgress } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface AyahItemProps {
  surahNumber: number;
  surahName: string;
  ayah: Ayah;
  currentProgress: QuranProgress | null;
}

export default function AyahItem({ surahNumber, surahName, ayah, currentProgress }: AyahItemProps) {
  const { t } = useTranslation();
  const [isLastRead, setIsLastRead] = useState(false);

  useEffect(() => {
    if (currentProgress && currentProgress.surah === surahNumber && currentProgress.ayah === ayah.nomorAyat) {
      setIsLastRead(true);
    }
  }, [currentProgress, surahNumber, ayah?.nomorAyat]);

  const handleMarkAsRead = () => {
    if (ayah?.nomorAyat) {
      saveProgress(surahNumber, ayah.nomorAyat, surahName);
      setIsLastRead(true);
    }
  };

  if (!ayah) {
    return null;
  }

  return (
    <div className={`bg-white border-2 rounded-xl p-6 mb-4 ${isLastRead ? 'border-gold/50 bg-gold/5' : 'border-soft/30'}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {ayah.nomorAyat || '?'}
        </div>
        <button
          onClick={handleMarkAsRead}
          className={`flex-shrink-0 text-2xl transition-transform hover:scale-125 ${isLastRead ? 'text-gold' : 'text-primary/30'}`}
          title={t.quran.markRead}
        >
          {isLastRead ? '⭐' : '☆'}
        </button>
      </div>

      {/* Arabic Text */}
      {ayah.teksArab && (
        <p className="text-right text-2xl md:text-3xl text-primary mb-4 leading-loose" dir="rtl">
          {ayah.teksArab}
        </p>
      )}

      {/* Latin Transliteration */}
      {ayah.teksLatin && (
        <p className="text-sm text-primary/60 italic mb-3">
          {ayah.teksLatin}
        </p>
      )}

      {/* Indonesian Translation */}
      {ayah.teksIndonesia && (
        <p className="text-base text-primary/80">
          {ayah.teksIndonesia}
        </p>
      )}
    </div>
  );
}
