import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  paddingY?: string;
  bgClass?: string;
  disableOverlay?: boolean;
  variant?: 'default' | 'conic';
}

export default function Card({
  children,
  className = '',
  paddingY = 'py-16 md:py-20',
  bgClass,
  disableOverlay = false,
  variant = 'default',
}: CardProps) {
  const defaultBg = 'bg-gradient-to-b from-[#0B1925] to-[#141318]';
  
  const conicBg = 'bg-[conic-gradient(at_top_center,#141318,#8EFFC780,#8EFFC780_50%,#BFF36D3B_75%,#BFF36D80_100%)]';
  
  const backgroundClass = bgClass || (variant === 'conic' ? conicBg : defaultBg);

  return (
    <div
      className={`relative w-full md:max-w-sm ${paddingY} overflow-hidden shadow-2xl text-center ${backgroundClass} ${className}`}
    >
      {!disableOverlay && variant === 'default' && (
        <div
          className="absolute inset-0 bg-[#0B1925] before:absolute before:inset-x-0 before:top-0 before:h-[40%] before:bg-[radial-gradient(ellipse_at_top,#BFF36D3B_0%,transparent_70%)] before:opacity-90 after:absolute after:inset-x-0 after:bottom-0 after:h-[40%] after:bg-[radial-gradient(ellipse_at_bottom,#BFF36D80_0%,transparent_70%)] after:opacity-90 pointer-events-none"
        ></div>
      )}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
