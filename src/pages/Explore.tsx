// src/pages/Explore.tsx
import { useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GameRow from "../components/Gamerow";
import { useExploreGames } from "../hooks/useExploreGames";

function Explore() {
  const { data, loading, error, refetch } = useExploreGames(20);

  useEffect(() => {
    document.title = "Explore Games - CrossPoint";
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Error fetching explore games:", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log("Explore data loaded:", data);
    }
  }, [data]);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="max-w-7xl mx-auto px-10 py-8">
          <h1 className="text-4xl font-bold mb-8">Explore Games</h1>

          {/* Loading skeleton */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <section key={i} className="mb-10">
              <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="flex-shrink-0 w-40">
                    <div className="w-full h-56 bg-slate-700 rounded-lg animate-pulse" />
                    <div className="mt-2 h-4 w-32 bg-slate-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <main className="max-w-7xl mx-auto px-10 py-8">
          <h1 className="text-4xl font-bold mb-8">Explore Games</h1>
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
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-10 py-8">
        <h1 className="text-4xl font-bold mb-8">Explore Games</h1>

        <GameRow title="Most Anticipated" games={data.mostAnticipated} />
        <GameRow title="Trending Now" games={data.trending} />
        <GameRow title="Top Rated All Time" games={data.topRated} />
        <GameRow title="Recently Released" games={data.recent} />
        <GameRow title="Hidden Gems" games={data.hiddenGems} />
        <GameRow title="Upcoming Releases" games={data.upcoming} />
      </main>
      <Footer />
    </>
  );
}

export default Explore;
