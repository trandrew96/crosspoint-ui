// src/components/HeroCarousel.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Game {
  id: number;
  name: string;
  cover?: {
    url?: string;
  };
  summary?: string;
}

interface HeroCarouselProps {
  games: Game[];
}

function HeroCarousel({ games }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying || games.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, games.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (games.length === 0) return null;

  const currentGame = games[currentIndex];

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      {/* Background image with overlay */}
      {currentGame.cover?.url && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${currentGame.cover.url.replace("t_thumb", "t_1080p")})`,
            filter: "blur(8px) brightness(0.3)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-12 md:px-16">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            {currentGame.name}
          </h2>
          {currentGame.summary && (
            <p className="text-lg text-gray-200 line-clamp-3 drop-shadow-md">
              {currentGame.summary}
            </p>
          )}
          <Link
            to={`/games/${currentGame.id}`}
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous"
      >
        <IoChevronBack size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next"
      >
        <IoChevronForward size={24} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
