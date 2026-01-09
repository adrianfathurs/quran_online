'use client';

import Link from 'next/link';
import type { Surah, QuranProgress } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface SurahListProps {
  surahs: Surah[];
  isLoading: boolean;
  currentProgress: QuranProgress | null;
}

export default function SurahList({ surahs, isLoading, currentProgress }: SurahListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
        <p className="mt-4 text-primary/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {surahs.map((surah) => {
        const isLastRead = currentProgress?.surah === surah.nomor;

        return (
          <Link
            key={surah.nomor}
            href={`/quran/${surah.nomor}`}
            className="bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all hover:border-gold/30 relative"
          >
            {isLastRead && (
              <div className="absolute top-3 right-3 text-gold text-xl" title={t.quran.lastRead}>
                ⭐
              </div>
            )}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-soft rounded-full flex items-center justify-center text-primary font-bold">
                {surah.nomor}
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">{surah.namaLatin}</h3>
                <p className="text-sm text-primary/60">{surah.arti}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-primary/70">
              <span>{surah.type}</span>
              <span>{surah.jumlahAyat} {t.quran.verses}</span>
            </div>
            <p className="text-xl text-gold text-right mt-2" dir="rtl">
              {surah.nama}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
