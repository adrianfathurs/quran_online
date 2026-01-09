import Card from '@/components/ui/Card';

interface PrayerCardProps {
  name: string;
  time: string;
  isActive?: boolean;
}

export default function PrayerCard({ name, time, isActive = false }: PrayerCardProps) {
  return (
    <Card variant={isActive ? 'gold' : 'default'} className="text-center">
      <p className={`text-lg font-semibold mb-2 ${isActive ? 'text-gold' : 'text-primary'}`}>
        {name}
      </p>
      <p className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-primary/80'}`}>
        {time}
      </p>
    </Card>
  );
}
