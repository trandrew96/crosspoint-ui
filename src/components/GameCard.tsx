import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface GlowCardProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function GameCard({ to, children, className = "" }: GlowCardProps) {
  return (
    <Link to={to} className={`relative group block ${className}`}>
      {/* Outer Glow */}
      <div
        className="absolute -inset-2 rounded-xl opacity-0 
         group-hover:opacity-100
         transition-opacity duration-300
         bg-gradient-to-r 
         from-indigo-500 via-purple-500 to-pink-500
         blur-lg"
      />

      {/* Border Ring (separate layer) */}
      <div
        className="absolute inset-0 rounded-xl 
         opacity-0 group-hover:opacity-100
         transition-opacity duration-300
         bg-gradient-to-r 
         from-indigo-500 via-purple-500 to-pink-500"
      />

      {/* Card Content (ALWAYS visible) */}
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        {children}
      </div>
    </Link>
  );
}
