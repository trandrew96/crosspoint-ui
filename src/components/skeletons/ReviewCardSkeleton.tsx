import React from "react";

const ReviewCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex gap-4">
        {/* Cover skeleton */}
        <div className="w-20 h-28 bg-gray-700 rounded" />

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              {/* Game name */}
              <div className="h-6 w-48 bg-gray-700 rounded mb-2" />

              <div className="flex items-center gap-2 mt-1">
                {/* Rating */}
                <div className="h-6 w-14 bg-gray-700 rounded" />
                {/* Date */}
                <div className="h-3 w-20 bg-gray-700 rounded" />
              </div>
            </div>

            {/* Edit button skeleton */}
            <div className="h-9 w-20 bg-gray-700 rounded-lg" />
          </div>

          {/* Review text lines */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded" />
            <div className="h-4 w-11/12 bg-gray-700 rounded" />
            <div className="h-4 w-10/12 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardSkeleton;
