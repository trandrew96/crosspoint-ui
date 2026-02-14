// src/pages/Home.tsx
import { useEffect } from "react";
import GameRow from "../components/Gamerow";
import HeroCarousel from "../components/HeroCarousel";
import { useExploreGames } from "../hooks/useExploreGames";

function Home() {
  const { data, loading, error, refetch } = useExploreGames(20);

  useEffect(() => {
    document.title = "Home Games - CrossPoint";
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Error fetching explore games:", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log("Home data loaded:", data);
    }
  }, [data]);

  if (loading) {
    return (
      <div>
        {/* Hero skeleton */}
        <div className="h-96 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl animate-pulse" />
        <div className="h-20" /> {/* Match hero gap */}
        {/* Loading skeleton for rows with asymmetric spacing */}
        <div>
          {/* Row 1 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
          <div className="h-16" />

          {/* Row 2 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
          <div className="h-20" />

          {/* Row 3 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
          <div className="h-12" />

          {/* Row 4 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
          <div className="h-24" />

          {/* Row 5 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
          <div className="h-14" />

          {/* Row 6 */}
          <section className="mb-10 pb-8">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-40">
                  <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Home Games</h1>
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold mb-2">Failed to load games</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel games={data.trending.slice(0, 5)} />
      <div className="h-20" /> {/* 80px tasteful gap after hero */}
      {/* Game rows with individual spacing */}
      <div>
        <GameRow title="Most Anticipated" games={data.mostAnticipated} />
        <div className="h-16" /> {/* 64px gap */}
        <GameRow title="Trending Now" games={data.trending} />
        <div className="h-20" /> {/* 80px gap */}
        <GameRow title="Top Rated All Time" games={data.topRated} />
        <div className="h-12" /> {/* 48px gap */}
        <GameRow title="Recently Released" games={data.recent} />
        <div className="h-24" /> {/* 96px gap */}
        <GameRow title="Hidden Gems" games={data.hiddenGems} />
        <div className="h-14" /> {/* 56px gap */}
        <GameRow title="Upcoming Releases" games={data.upcoming} />
      </div>
    </div>
  );
}

export default Home;
