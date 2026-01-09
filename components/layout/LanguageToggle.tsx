'use client';

import { useTranslation } from '@/lib/i18n';
import type { Language } from '@/types';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLang: Language = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-gold/10 text-primary font-semibold hover:bg-gold/20 transition-colors min-h-[44px]"
      aria-label="Toggle language"
    >
      {language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
    </button>
  );
}
