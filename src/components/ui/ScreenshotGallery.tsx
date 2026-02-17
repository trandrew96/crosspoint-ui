import { useState, useRef, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Screenshot {
  url?: string;
  id?: number;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  classNames?: string;
}

function ScreenshotGallery({
  screenshots,
  classNames,
}: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (thumbnailContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        thumbnailContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [screenshots]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? thumbnailContainerRef.current.scrollLeft - scrollAmount
          : thumbnailContainerRef.current.scrollLeft + scrollAmount;

      thumbnailContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  if (!screenshots || screenshots.length === 0) {
    return <p className="text-slate-400">No screenshots available.</p>;
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className={classNames}>
      <div className="space-y-4">
        {/* Main large screenshot */}
        <div className="relative group">
          <img
            src={screenshots[selectedIndex].url?.replace(
              "t_thumb",
              "t_screenshot_big",
            )}
            alt={`Screenshot ${selectedIndex + 1}`}
            className="w-full h-auto max-h-[600px] object-cover rounded-lg border-slate-700 hover:border-slate-500 transition-colors"
          />

          {/* Navigation arrows */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-700/80 hover:bg-slate-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous screenshot"
              >
                <IoChevronBack size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700/80 hover:bg-slate-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next screenshot"
              >
                <IoChevronForward size={24} />
              </button>
            </>
          )}

          {/* Screenshot counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {screenshots.length}
          </div>
        </div>

        {/* Thumbnail strip with controls */}
        {screenshots.length > 1 && (
          <div className="relative group/row pt-2">
            {/* Left chevron */}
            {canScrollLeft && (
              <button
                onClick={() => scrollThumbnails("left")}
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

            {/* Thumbnail container */}
            <div className="overflow-x-hidden">
              <div
                ref={thumbnailContainerRef}
                onScroll={checkScrollButtons}
                className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth",
                }}
              >
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot.id || index}
                    onClick={() => setSelectedIndex(index)}
                    className={`shrink-0 transition-all rounded ${
                      index === selectedIndex
                        ? "opacity-100"
                        : "opacity-30 hover:opacity-100"
                    }`}
                    style={
                      index === selectedIndex
                        ? { boxShadow: "inset 0 0 0 2px rgb(99 102 241)" }
                        : {}
                    }
                  >
                    <img
                      src={screenshot.url?.replace("t_thumb", "t_cover_small")}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-20 w-auto object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right chevron */}
            {canScrollRight && (
              <button
                onClick={() => scrollThumbnails("right")}
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
        )}
      </div>
    </section>
  );
}

export default ScreenshotGallery;
