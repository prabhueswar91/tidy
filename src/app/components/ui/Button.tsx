"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode; // For React icons (Lucide, Heroicons, etc.)
  image?: ReactNode; // For static images (SVG/PNG/JPG path)
  borderColor?: string;
  fromColor?: string;
  toColor?: string;
  onClick?: () => void;
  className?: string;
  marginTop?: string; 
  shadowClass?: string; // ✅ new prop for shadow
}

export default function Button({
  children,
  icon,
  image,
  borderColor = "#7C7C7C",
  fromColor = "#242424",
  toColor = "#525252",
  onClick,
  className = "",
  marginTop = "mt-20",
  shadowClass = "shadow-lg shadow-black/40", // ✅ default shadow
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${marginTop} w-full rounded-full 
        border py-3 font-semibold 
        hover:scale-105 transition flex items-center justify-center
        ${shadowClass} ${className}
      `}
      style={{
        borderColor: borderColor,
        background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
      }}
    >
      {icon || image ? (
        <span className="flex items-center gap-2">
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
