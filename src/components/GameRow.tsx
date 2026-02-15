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
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 pb-8 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-slate-500/20 after:shadow-[0_0_6px_2px_rgba(148,163,184,0.15)]">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* Container - symmetrical layout with group for hover */}
      <div className="relative group/row">
        {/* Left button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="max-md:hidden flex absolute left-0 top-0 bottom-0 z-10 bg-slate-700/30 hover:bg-slate-600/50 text-white w-10 items-center justify-center opacity-0 group-hover/row:opacity-100 rounded-r-lg"
            style={{
              transition:
                "background-color 0.3s ease-in-out, opacity 0.3s ease-in-out",
            }}
            aria-label="Scroll left"
          >
            <IoChevronBack size={24} />
          </button>
        )}

        {/* Outer wrapper - full width */}
        <div className="overflow-x-hidden py-4">
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none -my-4 py-4 px-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
              scrollBehavior: "smooth",
            }}
          >
            {games.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="shrink-0 block group"
                draggable={false}
              >
                <div className="w-24 md:w-40">
                  {game.cover?.url ? (
                    <img
                      src={game.cover.url.replace("t_thumb", "t_cover_big")}
                      alt={game.name}
                      className="w-24 md:w-full h-34 md:h-56 object-cover rounded-lg shadow-lg pointer-events-none transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-24 md:w-full h-34 md:h-56 bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-slate-500 text-sm">No Image</span>
                    </div>
                  )}

                  <h3 className="hidden md:block mt-2 text-sm font-medium line-clamp-2">
                    {game.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="max-md:hidden flex absolute right-0 top-0 bottom-0 z-10 bg-slate-700/30 hover:bg-slate-600/50 text-white w-10 items-center justify-center opacity-0 group-hover/row:opacity-100 rounded-l-lg"
            style={{
              transition:
                "background-color 0.3s ease-in-out, opacity 0.3s ease-in-out",
            }}
            aria-label="Scroll right"
          >
            <IoChevronForward size={24} />
          </button>
        )}
      </div>
    </section>
  );
}

export default GameRow;
