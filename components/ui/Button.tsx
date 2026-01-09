import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-soft text-primary hover:bg-soft/80',
  outline: 'border-2 border-primary text-primary hover:bg-primary/5',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-h-[44px] min-w-[120px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
