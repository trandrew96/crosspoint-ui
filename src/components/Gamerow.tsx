// src/components/GameRow.tsx
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Game {
  id: number;
  name: string;
  cover?: {
    url?: string;
  };
}

interface GameRowProps {
  title: string;
  games: Game[];
}

function GameRow({ title, games }: GameRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [games]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 640; // Scroll by ~4 game covers (160px each)
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update buttons after scroll animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      scrollContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {/* Container with buttons on sides */}
      <div className="flex items-center gap-4">
        {/* Left button */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors"
          aria-label="Scroll left"
        >
          <IoChevronBack size={24} />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth select-none flex-1"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
            cursor: "grab",
          }}
        >
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="flex-shrink-0 group"
              draggable={false}
            >
              <div className="w-40 transition-transform duration-200 group-hover:scale-105">
                {game.cover?.url ? (
                  <img
                    src={game.cover.url.replace("t_thumb", "t_cover_big")}
                    alt={game.name}
                    className="w-full h-56 object-cover rounded-lg shadow-lg pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-56 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500 text-sm">No Image</span>
                  </div>
                )}

                <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {game.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Right button */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors"
          aria-label="Scroll right"
        >
          <IoChevronForward size={24} />
        </button>
      </div>
    </section>
  );
}

export default GameRow;
