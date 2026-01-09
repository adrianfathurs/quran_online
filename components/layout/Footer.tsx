import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className="text-sm text-white/80 mb-4">
            {t.home.subtitle}
          </p>
          <div className="flex justify-center gap-4 text-sm text-white/60 mb-4">
            <a
              href="https://ummahapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Ummah API
            </a>
            <span>•</span>
            <a
              href="https://equran.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              EQuran API
            </a>
          </div>
          <p className="text-xs text-white/50">
            © 2026 Quran Online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
