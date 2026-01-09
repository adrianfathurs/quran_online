import { ReactNode } from 'react';

type CardVariant = 'default' | 'highlighted' | 'gold';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white border border-soft/30 shadow-sm',
  highlighted: 'bg-soft border-2 border-primary/20 shadow-md',
  gold: 'bg-gradient-to-br from-gold/20 to-gold/10 border-2 border-gold/40 shadow-md',
};

export default function Card({ children, variant = 'default', className = '', onClick }: CardProps) {
  const baseStyles = 'rounded-xl p-6 transition-all duration-200';
  const hoverStyles = onClick ? 'hover:shadow-lg cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
