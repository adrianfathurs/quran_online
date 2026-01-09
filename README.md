# 🕌 Quran Online

Website Islami untuk menampilkan Jadwal Sholat, Al-Qur'an dengan penanda progres bacaan, dan Jadwal Puasa 2026.

## ✨ Fitur

- 🕌 **Jadwal Sholat** - Cek jadwal sholat untuk kota-kota besar di Indonesia
- 📖 **Al-Qur'an** - Baca 114 surah dengan Arabic + Indonesian translation
- ⭐ **Progress Bacaan** - Tandai ayat terakhir yang dibaca (tersimpan di localStorage)
- 🌙 **Jadwal Puasa** - Jadwal puasa Ramadhan 1447 H / 2026
- 🌐 **Multi Bahasa** - Support Indonesia & English
- 📱 **PWA Ready** - Bisa di-install di HP sebagai aplikasi
- 🎨 **Islamic Theme** - Desain sejuk dengan warna hijau, krem, dan emas

## 🚀 Deployment ke GitHub Pages

### 1. Siapkan Icons (Wajib untuk PWA)

Icon SVG sudah dibuat, tapi perlu dikonversi ke PNG:

**Opsi 1: Online Converter**
1. Buka https://svgtopng.com/
2. Upload `public/icon-192x192.svg` dan `public/icon-512x512.svg`
3. Download hasil konversi
4. Rename dan taruh di folder `public/`

**Opsi 2: Menggunakan ImageMagick**
```bash
# Install ImageMagick terlebih dahulu
convert public/icon-192x192.svg public/icon-192x192.png
convert public/icon-512x512.svg public/icon-512x512.png
```

### 2. Push ke GitHub

```bash
# Init repository git
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit: Quran Online PWA"

# Create repository baru di GitHub, lalu:
git remote add origin https://github.com/USERNAME/quran_online.git
git branch -M main
git push -u origin main
```

### 3. Aktifkan GitHub Pages

1. Buka repository GitHub anda
2. Go ke **Settings** → **Pages**
3. Under **Build and deployment**, select **Source** = **GitHub Actions**

### 4. Deployment Otomatis

Setiap kali anda push ke branch `main`, website akan otomatis di-deploy ke GitHub Pages!

## 🛠️ Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build untuk production
```bash
npm run build
```

Output ada di folder `out/`

## 📁 Struktur Project

```
quran-online/
├── app/
│   ├── page.tsx              # Home
│   ├── sholat/page.tsx       # Jadwal Sholat
│   ├── quran/page.tsx        # List Surah
│   ├── quran/[number]/page.tsx # Detail Surah
│   ├── puasa/page.tsx        # Jadwal Puasa
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── layout/               # Header, Footer, LanguageToggle
│   ├── sholat/               # Prayer times components
│   ├── quran/                # Quran components
│   └── ui/                   # Card, Button
├── lib/
│   ├── api.ts                # API functions
│   ├── storage.ts            # localStorage utilities
│   └── i18n.ts               # Translations
├── types/index.ts            # TypeScript types
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # PWA icons
└── .github/workflows/
    └── deploy.yml            # GitHub Actions
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **PWA**: @ducanh2912/next-pwa
- **API**:
  - Jadwal Sholat: [Ummah API](https://ummahapi.com) - dengan dukungan geolocation & map
  - Al-Qur'an: [EQuran.id](https://equran.id)

## 🌐 API Credits

- [Ummah API](https://ummahapi.com) - Prayer Times API (with geolocation support)
- [EQuran](https://equran.id) - Al-Qur'an API (Arabic + Indonesian Translation)

## 📝 License

MIT License - feel free to use for personal and commercial purposes.

## 🤲 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

---

> *"Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya."* — HR. Bukhari
