import SurahDetailClient from '@/components/quran/SurahDetailClient';

interface PageProps {
  params: Promise<{
    number: string;
  }>;
}

// Generate static params for all 114 surahs at build time
export async function generateStaticParams() {
  const params = [];
  for (let i = 1; i <= 114; i++) {
    params.push({
      number: i.toString(),
    });
  }
  return params;
}

export default async function SurahDetailPage({ params }: PageProps) {
  const { number } = await params;
  const surahNumber = Number(number);

  return <SurahDetailClient surahNumber={surahNumber} />;
}
