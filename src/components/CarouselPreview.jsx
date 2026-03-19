import { useState, useRef } from "react";

const SLIDE_COLORS = [
  { bg: "from-emerald-700 to-teal-900", text: "text-white" },
  { bg: "from-gray-800 to-gray-900", text: "text-gray-100" },
  { bg: "from-emerald-600 to-emerald-800", text: "text-white" },
  { bg: "from-teal-700 to-cyan-900", text: "text-white" },
  { bg: "from-gray-700 to-gray-800", text: "text-gray-100" },
  { bg: "from-emerald-800 to-gray-900", text: "text-white" },
  { bg: "from-teal-600 to-emerald-800", text: "text-white" },
];

function SlideCard({ slide, index, total }) {
  const colors = SLIDE_COLORS[index % SLIDE_COLORS.length];

  return (
    <div
      className={`aspect-square w-full bg-gradient-to-br ${colors.bg} ${colors.text} rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {slide.type === "cover" && (
          <>
            <div>
              <div className="w-10 h-1 bg-emerald-400 rounded mb-4" />
              <h2 className="text-2xl font-bold leading-tight">
                {slide.headline}
              </h2>
            </div>
            <p className="text-sm opacity-80">{slide.subtitle}</p>
          </>
        )}

        {slide.type === "content" && (
          <>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                {slide.headline}
              </span>
              <div className="w-8 h-0.5 bg-emerald-400 rounded mt-2 mb-4" />
            </div>
            <p className="text-lg leading-relaxed flex-1 flex items-center">
              {slide.body}
            </p>
            <p className="text-xs opacity-40 text-right">
              {index}/{total - 1}
            </p>
          </>
        )}

        {slide.type === "proof" && (
          <>
            <div>
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">{slide.headline}</h3>
              <p className="text-sm leading-relaxed opacity-90">
                {slide.body}
              </p>
            </div>
            <p className="text-xs opacity-40 text-right">
              {index}/{total - 1}
            </p>
          </>
        )}

        {slide.type === "cta" && (
          <>
            <div />
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 whitespace-pre-line">
                {slide.headline}
              </h3>
              <div className="w-12 h-0.5 bg-emerald-400 rounded mx-auto mb-4" />
              <p className="text-sm opacity-80 whitespace-pre-line">
                {slide.subtitle}
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-white/30 rounded-full" />
              <div className="w-2 h-2 bg-white/30 rounded-full" />
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CarouselPreview({ carousels }) {
  const [activeSet, setActiveSet] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef();

  if (!carousels || carousels.length === 0) return null;

  const carousel = carousels[activeSet];

  function scrollToSlide(idx) {
    setActiveSlide(idx);
    const container = scrollRef.current;
    if (container) {
      const slideWidth = container.children[0]?.offsetWidth || 0;
      container.scrollTo({ left: slideWidth * idx, behavior: "smooth" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Carousel Posts
        </h3>
        <div className="flex gap-1">
          {carousels.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveSet(i);
                setActiveSlide(0);
              }}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                i === activeSet
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Slide navigator */}
      <div className="flex gap-1 justify-center">
        {carousel.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === activeSlide
                ? "w-6 bg-emerald-500"
                : "w-1.5 bg-gray-700 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Carousel scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
        onScroll={(e) => {
          const container = e.target;
          const slideWidth = container.children[0]?.offsetWidth || 1;
          const idx = Math.round(container.scrollLeft / slideWidth);
          setActiveSlide(idx);
        }}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {carousel.slides.map((slide, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-72"
          >
            <SlideCard
              slide={slide}
              index={i}
              total={carousel.slides.length}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
          disabled={activeSlide === 0}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-500 text-sm">
          {activeSlide + 1} / {carousel.slides.length}
        </span>
        <button
          onClick={() =>
            scrollToSlide(
              Math.min(carousel.slides.length - 1, activeSlide + 1)
            )
          }
          disabled={activeSlide === carousel.slides.length - 1}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Topic tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Topics:</span>
        {carousel.topics.map((topic) => (
          <span
            key={topic}
            className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
