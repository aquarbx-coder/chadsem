"use client";

import { useState, useRef } from "react";

const SEGMENTS = [
  { label: "Diamond Hands", color: "#00ff88", rarity: "common" },
  { label: "1000x Incoming", color: "#00cc6a", rarity: "common" },
  { label: "WAGMI", color: "#00ff88", rarity: "common" },
  { label: "Trench Veteran", color: "#00cc6a", rarity: "uncommon" },
  { label: "Ansem Approved", color: "#00ff88", rarity: "rare" },
  { label: "Paper Hands", color: "#ff4444", rarity: "common" },
  { label: "To The Moon", color: "#00cc6a", rarity: "common" },
  { label: "Chad Status", color: "#00ff88", rarity: "rare" },
  { label: "NGMI", color: "#ff4444", rarity: "common" },
  { label: "Whale Alert", color: "#00cc6a", rarity: "uncommon" },
  { label: "Legendary Degen", color: "#ffd700", rarity: "legendary" },
  { label: "Rug Survivor", color: "#00ff88", rarity: "uncommon" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-400",
  uncommon: "text-chad-green",
  rare: "text-blue-400",
  legendary: "text-yellow-400",
};

const RARITY_BG: Record<string, string> = {
  common: "border-gray-600",
  uncommon: "border-chad-green/40",
  rare: "border-blue-400/40",
  legendary: "border-yellow-400/40 shadow-[0_0_30px_rgba(255,215,0,0.2)]",
};

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<(typeof SEGMENTS)[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [collection, setCollection] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("chadsem-wheel") || "[]");
    } catch {
      return [];
    }
  });
  const [showCollection, setShowCollection] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  function spin() {
    if (spinning) return;

    setSpinning(true);
    setShowResult(false);
    setResult(null);

    const extraSpins = 5 + Math.random() * 3;
    const segmentAngle = 360 / SEGMENTS.length;
    const targetSegment = Math.floor(Math.random() * SEGMENTS.length);
    const targetAngle = 360 - targetSegment * segmentAngle - segmentAngle / 2;
    const totalRotation = rotation + extraSpins * 360 + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[targetSegment]);
      setShowResult(true);

      // Add to collection if not already there
      const label = SEGMENTS[targetSegment].label;
      setCollection((prev) => {
        const next = prev.includes(label) ? prev : [...prev, label];
        localStorage.setItem("chadsem-wheel", JSON.stringify(next));
        return next;
      });
    }, 4000);
  }

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="max-w-3xl mx-auto relative z-10 text-center">
      <div className="relative inline-block mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-chad-green drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-full relative border-4 border-chad-green/30 shadow-[0_0_40px_rgba(0,255,136,0.1)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
            const isEven = i % 2 === 0;

            return (
              <div key={i}>
                {/* Segment background using conic gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from ${startAngle}deg, ${
                      isEven ? "#12121a" : "#1a1a28"
                    } 0deg, ${isEven ? "#12121a" : "#1a1a28"} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                    borderRadius: "50%",
                  }}
                />
                {/* Segment label */}
                <div
                  className="absolute text-[8px] sm:text-[10px] font-bold whitespace-nowrap"
                  style={{
                    left: `${50 + 32 * Math.cos(midAngle)}%`,
                    top: `${50 + 32 * Math.sin(midAngle)}%`,
                    transform: `translate(-50%, -50%) rotate(${(startAngle + endAngle) / 2 + 90}deg)`,
                    color: seg.rarity === "legendary" ? "#ffd700" : seg.rarity === "rare" ? "#60a5fa" : "#9ca3af",
                  }}
                >
                  {seg.label}
                </div>
                {/* Divider line */}
                <div
                  className="absolute top-1/2 left-1/2 h-[1px] origin-left"
                  style={{
                    width: "50%",
                    transform: `rotate(${startAngle}deg)`,
                    background: "rgba(0, 255, 136, 0.15)",
                  }}
                />
              </div>
            );
          })}

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-chad-dark border-2 border-chad-green/30 flex items-center justify-center z-10">
              <span className="text-chad-green font-black text-xs sm:text-sm">SPIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spin button */}
      <div className="mb-6">
        <button
          onClick={spin}
          disabled={spinning}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            spinning
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-chad-green text-black hover:bg-chad-green/90 cta-pulse cursor-pointer"
          }`}
        >
          {spinning ? "Spinning..." : "Spin the Wheel"}
        </button>
      </div>

      {/* Result */}
      {showResult && result && (
        <div
          className={`inline-block px-6 py-4 rounded-xl bg-chad-card border-2 ${
            RARITY_BG[result.rarity]
          } animate-fade-scale`}
        >
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">{result.rarity}</p>
          <p className={`text-xl font-black ${RARITY_COLORS[result.rarity]}`}>
            {result.label}
          </p>
          {!collection.includes(result.label) && (
            <p className="text-xs text-chad-green mt-1">New badge unlocked!</p>
          )}
        </div>
      )}

      {/* Collection */}
      <div className="mt-8">
        <button
          onClick={() => setShowCollection(!showCollection)}
          className="text-sm text-gray-500 hover:text-chad-green transition-colors"
        >
          Collection: {collection.length}/{SEGMENTS.length} badges{" "}
          {showCollection ? "\u25B2" : "\u25BC"}
        </button>

        {showCollection && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
            {SEGMENTS.map((seg) => {
              const owned = collection.includes(seg.label);
              return (
                <div
                  key={seg.label}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                    owned
                      ? `bg-chad-card ${RARITY_BG[seg.rarity]} ${RARITY_COLORS[seg.rarity]}`
                      : "bg-chad-dark border-chad-border text-gray-700"
                  }`}
                >
                  {owned ? seg.label : "???"}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
