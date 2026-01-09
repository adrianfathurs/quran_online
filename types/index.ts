// Prayer Times Types
export interface PrayerTimes {
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface PrayerTimesRequest {
  lat: number;
  lng: number;
  madhab?: 'Shafi' | 'Hanafi';
  method?: string;
}

export interface PrayerScheduleResponse {
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

// Quran Types
export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun?: string;
  type: string;
}

export interface Ayah {
  nomorAyat: number;
  teksArab?: string;
  teksLatin?: string;
  teksIndonesia?: string;
  audio?: string;
}

export interface SurahDetail extends Surah {
  ayat?: Ayah[];
  audioFull?: {
    '01'?: string; // Abdullah Al-Juhany
    '02'?: string; // Abdul Muhsin Al-Qasim
    '03'?: string; // Abdurrahman as-Sudais
    '04'?: string; // Ibrahim Al-Dossari
    '05'?: string; // Misyari Rasyid Al-Afasi (default)
    '06'?: string; // Yasser Al-Dosari
  };
}

export interface QuranProgress {
  surah: number;
  ayah: number;
  surahName: string;
  timestamp: number;
}

// Fasting Schedule Types
export interface PuasaSchedule {
  date: string;
  day: number;
  imsak: string;
  buka: string;
}

// Language Types
export type Language = 'id' | 'en';

export interface Translations {
  nav: {
    home: string;
    sholat: string;
    quran: string;
    puasa: string;
  };
  home: {
    title: string;
    subtitle: string;
    prayerTimes: string;
    quranReading: string;
    fastingSchedule: string;
  };
  sholat: {
    title: string;
    selectCity: string;
    today: string;
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
  quran: {
    title: string;
    search: string;
    read: string;
    verses: string;
    lastRead: string;
    markRead: string;
    audio: string;
  };
  puasa: {
    title: string;
    ramadhan: string;
    day: string;
    imsak: string;
    buka: string;
  };
}
