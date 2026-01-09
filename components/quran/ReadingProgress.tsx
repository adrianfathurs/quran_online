'use client';

import { getProgress } from '@/lib/storage';
import { useTranslation } from '@/lib/i18n';
import type { QuranProgress } from '@/types';
import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<QuranProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  return (
    <div className="mb-8 bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-6 text-center">
      <p className="text-sm text-primary/70 mb-2">{t.quran.lastRead}</p>
      <p className="text-lg font-semibold text-primary">
        Surah {progress.surahName} - Ayat {progress.ayah}
      </p>
    </div>
  );
}
