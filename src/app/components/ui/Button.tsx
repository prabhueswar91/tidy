"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  image?: ReactNode; 
  borderColor?: string;
  fromColor?: string;
  toColor?: string;
  onClick?: () => void;
  className?: string;
  marginTop?: string; 
  shadowClass?: string; 
  disabled?: boolean;
}

export default function Button({
  children,
  icon,
  image,
  borderColor = "#7C7C7C",
  onClick,
  className = "",
  shadowClass = "shadow-lg shadow-black/40",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        mt-5 w-full rounded-full 
        border py-3
        hover:scale-105 transition flex items-center justify-center
        ${shadowClass} ${className}
      `}
      style={{
        borderColor: borderColor
      }}
    >
      {icon || image ? (
        <span className="flex items-center gap-1">
          {icon && <span>{icon}</span>}
          {image && <span>{image}</span>}
          <span>{children}</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
