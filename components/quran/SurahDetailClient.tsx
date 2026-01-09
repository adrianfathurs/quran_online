'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSurahDetail } from '@/lib/api';
import { getProgress } from '@/lib/storage';
import AyahItem from '@/components/quran/AyahItem';
import AudioPlayer from '@/components/quran/AudioPlayer';
import type { SurahDetail, QuranProgress } from '@/types';

interface SurahDetailClientProps {
  surahNumber: number;
}

export default function SurahDetailClient({ surahNumber }: SurahDetailClientProps) {
  const router = useRouter();
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<QuranProgress | null>(null);

  useEffect(() => {
    const fetchSurahDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSurahDetail(surahNumber);

        if (!data) {
          setError('Failed to load surah data');
        } else if (!data.ayat || data.ayat.length === 0) {
          setError('No verses found for this surah');
        } else {
          setSurahDetail(data);
          setCurrentProgress(getProgress());
        }
      } catch (err) {
        console.error('Error fetching surah detail:', err);
        setError('An error occurred while loading the surah');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahDetail();
  }, [surahNumber]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
          <p className="mt-4 text-primary/70">Loading from EQuran.id API...</p>
        </div>
      </div>
    );
  }

  if (error || !surahDetail) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-primary/70 mb-4">{error || 'Failed to load surah'}</p>
          <button
            onClick={() => router.push('/quran')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90"
          >
            ← Back to Surah List
          </button>
        </div>
      </div>
    );
  }

  const ayatList = surahDetail.ayat || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => router.push('/quran')}
        className="mb-6 px-4 py-2 bg-soft text-primary rounded-lg hover:bg-soft/80 transition-colors"
      >
        ← Back to Surah List
      </button>

      {/* Surah Header */}
      <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 rounded-xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">{surahDetail.namaLatin}</h1>
        <p className="text-2xl text-gold mb-4" dir="rtl">{surahDetail.nama}</p>
        <p className="text-primary/70">{surahDetail.arti}</p>
        <div className="flex justify-center gap-4 mt-4 text-sm text-primary/60">
          <span>{surahDetail.type}</span>
          <span>•</span>
          <span>{surahDetail.jumlahAyat} Ayat</span>
        </div>
      </div>

      {/* Bismillah (except for Surah At-Taubah / Surah 9) */}
      {surahDetail.nomor !== 9 && (
        <div className="text-center mb-8">
          <p className="text-3xl text-primary" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
      )}

      {/* Audio Player */}
      {surahDetail.audioFull && surahDetail.audioFull['05'] && (
        <AudioPlayer audioUrl={surahDetail.audioFull['05']} surahName={surahDetail.namaLatin} />
      )}

      {/* Ayahs */}
      <div className="max-w-4xl mx-auto">
        {ayatList.length > 0 ? (
          ayatList.map((ayah) => (
            <AyahItem
              key={ayah.nomorAyat}
              surahNumber={surahDetail.nomor}
              surahName={surahDetail.namaLatin}
              ayah={ayah}
              currentProgress={currentProgress}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-primary/70">No verses available</p>
          </div>
        )}
      </div>

      {/* API Attribution */}
      <div className="mt-12 text-center text-sm text-primary/50">
        Data provided by <a href="https://equran.id" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">EQuran.id API</a>
      </div>
    </div>
  );
}
