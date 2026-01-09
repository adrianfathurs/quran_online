'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { getAllSurahs } from '@/lib/api';
import { getProgress } from '@/lib/storage';
import SurahList from '@/components/quran/SurahList';
import ReadingProgress from '@/components/quran/ReadingProgress';
import type { Surah, QuranProgress } from '@/types';

export default function QuranPage() {
  const { t } = useTranslation();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProgress, setCurrentProgress] = useState<QuranProgress | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      setIsLoading(true);
      const data = await getAllSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
      setCurrentProgress(getProgress());
      setIsLoading(false);
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.nomor.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">{t.quran.title}</h1>
        <p className="text-lg text-primary/70">114 Surah • 6,236 Ayat</p>
      </div>

      <ReadingProgress />

      {/* Search */}
      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder={t.quran.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-xl border-2 border-primary/20 bg-white text-primary focus:border-gold focus:outline-none min-h-[48px]"
        />
      </div>

      <SurahList surahs={filteredSurahs} isLoading={isLoading} currentProgress={currentProgress} />

      {/* API Attribution */}
      <div className="mt-12 text-center text-sm text-primary/50">
        Data provided by <a href="https://equran.id" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">EQuran.id API</a>
      </div>
    </div>
  );
}
