# 🌙 Website Islami – Jadwal Sholat, Al-Qur'an & Puasa 2026

Website islami yang **sejuk, nyaman, dan mobile-friendly** untuk menampilkan:

* 🕌 Jadwal Sholat
* 📖 Al-Qur'an (dengan penanda progres bacaan ⭐)
* 🌙 Jadwal Puasa 2026

Dokumen ini berfungsi sebagai **panduan teknis (README.md)** untuk membangun website tersebut menggunakan **Next.js + Tailwind CSS + NPM**.

---

## 1️⃣ Tech Stack

* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS
* **Package Manager**: NPM
* **State Management**: React Hooks + Local Storage
* **API**:

  * Jadwal Sholat: [https://api.myquran.com](https://api.myquran.com)
  * Al-Qur'an: [https://equran.id/api](https://equran.id/api)

---

## 2️⃣ Prinsip Desain

✔ Tampilan islami & menenangkan
✔ Dominan warna hijau, krem, dan emas lembut
✔ Font besar & mudah dibaca
✔ Mobile-first & responsive
✔ Minim distraksi, fokus ibadah

Contoh palet warna:

* Hijau Tua: `#0F3D2E`
* Hijau Lembut: `#E6F4EA`
* Emas: `#D4AF37`
* Putih Hangat: `#FAFAF5`

---

## 3️⃣ Struktur Folder

```
/app
  /page.tsx              → Home
  /sholat/page.tsx       → Jadwal Sholat
  /quran/page.tsx        → Al-Qur'an
  /puasa/page.tsx        → Jadwal Puasa 2026

/components
  /layout
    Header.tsx
    Footer.tsx
  /sholat
    PrayerCard.tsx
    PrayerTimeList.tsx
  /quran
    SurahList.tsx
    AyahItem.tsx
    ReadingProgress.tsx
  /ui
    Card.tsx
    Button.tsx

/lib
  api.ts
  storage.ts

/styles
  globals.css
```

> 📌 **Catatan**: Jika kode sudah >100 baris, WAJIB dipisah menjadi component atau helper reusable.

---

## 4️⃣ Setup Project

```bash
npx create-next-app islamic-app
cd islamic-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Konfigurasi Tailwind di `tailwind.config.js`:

```js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F3D2E',
        soft: '#E6F4EA',
        gold: '#D4AF37'
      }
    }
  }
}
```

---

## 5️⃣ Jadwal Sholat (Reusable Component)

### `PrayerTimeList.tsx`

```tsx
export default function PrayerTimeList({ times }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(times).map(([name, time]) => (
        <div key={name} className="bg-soft p-4 rounded-xl text-center">
          <p className="font-semibold text-primary">{name}</p>
          <p className="text-lg">{time}</p>
        </div>
      ))}
    </div>
  )
}
```

✔ Responsive otomatis di mobile
✔ Mudah digunakan ulang

---

## 6️⃣ Al-Qur'an + ⭐ Progress Bacaan

### Konsep

* User bisa menandai ayat terakhir dibaca
* Disimpan di **localStorage**
* Ditampilkan dengan ikon ⭐

### `storage.ts`

```ts
export const saveProgress = (surah, ayah) => {
  localStorage.setItem('quran-progress', JSON.stringify({ surah, ayah }))
}

export const getProgress = () => {
  return JSON.parse(localStorage.getItem('quran-progress') || '{}')
}
```

### `AyahItem.tsx`

```tsx
export default function AyahItem({ ayah, onMark }) {
  return (
    <div className="flex justify-between items-center p-3">
      <p>{ayah.text}</p>
      <button onClick={onMark} className="text-gold">⭐</button>
    </div>
  )
}
```

✔ User tahu sampai mana terakhir membaca
✔ Nyaman untuk tilawah harian

---

## 7️⃣ Jadwal Puasa 2026

Menampilkan:

* Awal Puasa Ramadhan 2026
* Imsak
* Berbuka

Contoh data statis atau API:

```ts
export const puasa2026 = [
  { date: '2026-02-18', imsak: '04:30', buka: '18:12' }
]
```

---

## 8️⃣ UX & Kenyamanan User

✔ Dark text on soft background
✔ Scroll lembut (`scroll-behavior: smooth`)
✔ Button besar & mudah disentuh
✔ Tidak ada iklan / pop-up

Tambahkan di `globals.css`:

```css
body {
  background-color: #FAFAF5;
}
```

---

## 9️⃣ Pengembangan Lanjutan (Opsional)

* 🔔 Notifikasi waktu sholat
* 🌍 Deteksi lokasi otomatis
* ☁️ Sinkron progres Al-Qur'an (login)
* 🌙 Mode malam

---

## 🤲 Penutup

Website ini dirancang untuk **mendukung ibadah harian**, bukan sekadar aplikasi.

> *“Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.”*

Semoga bermanfaat 🌙✨
