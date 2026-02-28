import type { Translations, Language } from '@/types';
import { getLanguage, saveLanguage } from './storage';

const translations: Record<Language, Translations> = {
  id: {
    nav: {
      home: 'Beranda',
      sholat: 'Jadwal Sholat',
      quran: "Al-Qur'an",
      puasa: 'Jadwal Puasa',
      kiblat: 'Arah Kiblat',
    },
    home: {
      title: 'Selamat Datang',
      subtitle: 'Website Islami untuk memudahkan ibadah harian Anda',
      prayerTimes: 'Jadwal Sholat',
      quranReading: "Baca Al-Qur'an",
      fastingSchedule: 'Jadwal Puasa 2026',
    },
    sholat: {
      title: 'Jadwal Sholat',
      selectCity: 'Pilih Kota',
      today: 'Hari Ini',
      subuh: 'Subuh',
      dzuhur: 'Dzuhur',
      ashar: 'Ashar',
      maghrib: 'Maghrib',
      isya: 'Isya',
    },
    quran: {
      title: 'Al-Qur\'an',
      search: 'Cari Surah',
      read: 'Baca',
      verses: 'Ayat',
      lastRead: 'Terakhir Dibaca',
      markRead: 'Tandai Terakhir Dibaca',
      audio: 'Audio',
    },
    puasa: {
      title: 'Jadwal Puasa Ramadhan 2026',
      ramadhan: 'Ramadhan 2026',
      day: 'Hari',
      imsak: 'Imsak',
      buka: 'Buka',
    },
  },
  en: {
    nav: {
      home: 'Home',
      sholat: 'Prayer Times',
      quran: "Quran",
      puasa: 'Fasting Schedule',
      kiblat: 'Qibla Direction',
    },
    home: {
      title: 'Welcome',
      subtitle: 'Islamic website to support your daily worship',
      prayerTimes: 'Prayer Times',
      quranReading: 'Read Quran',
      fastingSchedule: 'Fasting Schedule 2026',
    },
    sholat: {
      title: 'Prayer Times',
      selectCity: 'Select City',
      today: 'Today',
      subuh: 'Fajr',
      dzuhur: 'Dhuhr',
      ashar: 'Asr',
      maghrib: 'Maghrib',
      isya: 'Isha',
    },
    quran: {
      title: 'Al-Qur\'an',
      search: 'Search Surah',
      read: 'Read',
      verses: 'Verses',
      lastRead: 'Last Read',
      markRead: 'Mark Last Read',
      audio: 'Audio',
    },
    puasa: {
      title: 'Ramadhan Fasting Schedule 2026',
      ramadhan: 'Ramadhan 2026',
      day: 'Day',
      imsak: 'Imsak',
      buka: 'Iftar',
    },
  },
};

export const getTranslations = (lang?: Language): Translations => {
  const language = lang || getLanguage();
  return translations[language];
};

export const useTranslation = () => {
  const language = getLanguage();

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    saveLanguage(lang);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return { t, language, setLanguage };
};
