// src/skeletons/GameByIdSkeleton.tsx

function GameByIdSkeleton() {
  return (
    <div className="animate-pulse space-y-5 mt-4 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row gap-5 bg-slate-800/75 p-5 rounded-lg">
        <div className="flex gap-5 flex-1">
          {/* Cover */}
          <div className="h-32 w-24 sm:h-64 sm:w-[200px] bg-slate-700 rounded-lg shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="h-8 w-2/3 bg-slate-700 rounded" />
            <div className="h-4 w-1/2 bg-slate-700 rounded" />
            <div className="h-4 w-1/3 bg-slate-700 rounded" />
            <div className="h-8 w-32 bg-slate-700 rounded mt-4" />
          </div>
        </div>

        {/* Ratings / Video placeholder */}
        <div className="flex items-center justify-center lg:justify-end gap-6 mt-4 lg:mt-0">
          <div className="w-20 h-20 bg-slate-700 rounded-full" />
          <div className="w-20 h-20 bg-slate-700 rounded-full" />
        </div>
      </section>

      {/* STORYLINE */}
      <section className="p-5 bg-slate-800/75 rounded-lg space-y-4">
        <div className="h-6 w-40 bg-slate-700 rounded" />
        <div className="h-4 w-full bg-slate-700 rounded" />
        <div className="h-4 w-5/6 bg-slate-700 rounded" />
        <div className="h-4 w-2/3 bg-slate-700 rounded" />
      </section>

      {/* SCREENSHOT GALLERY SKELETON */}
      <section className="bg-slate-800/75 rounded-lg p-5 space-y-4">
        <div className="h-6 w-40 bg-slate-700 rounded" />

        {/* Main large screenshot */}
        <div className="w-full h-[400px] bg-slate-700 rounded-lg" />

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-hidden pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 w-32 bg-slate-700 rounded shrink-0" />
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <section className="grid grid-cols-6 gap-4 bg-slate-800/75 rounded-lg p-5">
        <div className="col-span-6 h-6 w-48 bg-slate-700 rounded mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-span-3 lg:col-span-2 space-y-2">
            <div className="h-32 bg-slate-700 rounded-lg" />
            <div className="h-4 w-3/4 bg-slate-700 rounded mx-auto" />
          </div>
        ))}
      </section>

      {/* REVIEWS */}
      <section className="p-5 bg-slate-800/75 rounded-lg space-y-4">
        <div className="h-6 w-40 bg-slate-700 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-slate-700 rounded-lg p-4 space-y-3"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-slate-700 rounded" />
                  <div className="h-3 w-1/3 bg-slate-700 rounded" />
                </div>
              </div>
              <div className="h-6 w-12 bg-slate-700 rounded" />
              <div className="h-3 w-full bg-slate-700 rounded" />
              <div className="h-3 w-5/6 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL / META */}
      <section className="p-5 bg-slate-800/75 rounded-lg grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-32 bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-slate-700 rounded" />
            <div className="h-4 w-20 bg-slate-700 rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default GameByIdSkeleton;
