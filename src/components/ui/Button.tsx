import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-normal tracking-tight transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#533afd]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] whitespace-nowrap cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1 rounded-full gap-1.5',
    md: 'text-sm px-4 py-2 rounded-full gap-2',
    lg: 'text-sm md:text-base px-5 py-2.5 rounded-full gap-2 font-medium',
    icon: 'p-2 rounded-full',
  };

  const variantStyles = {
    primary: 'bg-[#533afd] hover:bg-[#4434d4] active:bg-[#2e2b8c] text-white shadow-[0_1px_3px_rgba(0,55,112,0.12)] border border-transparent',
    secondary: 'bg-white hover:bg-[#f6f9fc] active:bg-[#eef2f6] text-[#0d253d] border border-[#e3e8ee] shadow-[0_1px_2px_rgba(0,55,112,0.06)]',
    outline: 'bg-transparent hover:bg-[#f6f9fc] text-[#273951] hover:text-[#0d253d] border border-[#e3e8ee]',
    ghost: 'bg-transparent hover:bg-[#f6f9fc] text-[#64748d] hover:text-[#0d253d]',
    dark: 'bg-[#0d253d] hover:bg-[#1c1e54] text-white shadow-[0_1px_3px_rgba(0,55,112,0.15)] border border-transparent',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
    glow: 'bg-[#533afd] hover:bg-[#4434d4] text-white shadow-[0_4px_16px_rgba(83,58,253,0.35)]',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;

