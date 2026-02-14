import React from "react";

interface GameCardSkeletonProps {
  className?: string;
}

const GameCardSkeleton: React.FC<GameCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative block ${className}`}>
      {/* Keep same spacing as GameCard but no hover glow */}

      {/* Card Content */}
      <div className="relative rounded-lg overflow-hidden bg-gray-900 animate-pulse">
        {/* Image skeleton (top portion) */}
        <div className="w-full aspect-[3/4] bg-gray-800" />

        {/* Content section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <div className="h-4 w-3/4 bg-gray-800 rounded" />

          {/* Subtitle / meta */}
          <div className="h-3 w-1/2 bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default GameCardSkeleton;
