"use client";

import { useState, useCallback } from "react";

const SEGMENTS = [
  { label: "Diamond Hands", rarity: "common" },
  { label: "1000x", rarity: "common" },
  { label: "WAGMI", rarity: "common" },
  { label: "Trench Vet", rarity: "uncommon" },
  { label: "Ansem Pick", rarity: "rare" },
  { label: "Paper Hands", rarity: "common" },
  { label: "Moon", rarity: "common" },
  { label: "Chad", rarity: "rare" },
  { label: "NGMI", rarity: "common" },
  { label: "Whale", rarity: "uncommon" },
  { label: "LEGEND", rarity: "legendary" },
  { label: "Rug Survivor", rarity: "uncommon" },
];

const SPIN_COST = 50;

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

const RARITY_FILL: Record<string, string> = {
  common: "#9ca3af",
  uncommon: "#00ff88",
  rare: "#60a5fa",
  legendary: "#ffd700",
};

const NUM = SEGMENTS.length;
const SEG_ANGLE = 360 / NUM;

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCart(cx, cy, r, endAngle);
  const end = polarToCart(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

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

  // Read clicker score
  const getClickerScore = useCallback(() => {
    try {
      const saved = localStorage.getItem("chadsem-clicker");
      if (saved) return JSON.parse(saved).score || 0;
    } catch {}
    return 0;
  }, []);

  const deductScore = useCallback((amount: number) => {
    try {
      const saved = localStorage.getItem("chadsem-clicker");
      if (saved) {
        const data = JSON.parse(saved);
        data.score = Math.max(0, (data.score || 0) - amount);
        localStorage.setItem("chadsem-clicker", JSON.stringify(data));
        // Dispatch event so clicker component can update
        window.dispatchEvent(new Event("chadsem-score-update"));
      }
    } catch {}
  }, []);

  function spin() {
    if (spinning) return;

    const currentScore = getClickerScore();
    if (currentScore < SPIN_COST) return;

    // Deduct cost
    deductScore(SPIN_COST);

    setSpinning(true);
    setShowResult(false);
    setResult(null);

    const targetSegment = Math.floor(Math.random() * NUM);

    // Calculate rotation: pointer is at top (0 deg).
    // Segment i occupies from i*SEG_ANGLE to (i+1)*SEG_ANGLE.
    // We want the center of targetSegment at the top.
    // Center of segment i is at i*SEG_ANGLE + SEG_ANGLE/2.
    // To bring that to the top we need to rotate by -(center angle) mod 360.
    const centerAngle = targetSegment * SEG_ANGLE + SEG_ANGLE / 2;
    const normalizedTarget = (360 - centerAngle + 360) % 360;

    // Add full spins so it always goes forward
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    // Current effective rotation
    const currentNormalized = rotation % 360;
    let delta = normalizedTarget - currentNormalized;
    if (delta < 0) delta += 360;

    const totalRotation = rotation + fullSpins * 360 + delta;
    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[targetSegment]);
      setShowResult(true);

      const label = SEGMENTS[targetSegment].label;
      setCollection((prev) => {
        const next = prev.includes(label) ? prev : [...prev, label];
        localStorage.setItem("chadsem-wheel", JSON.stringify(next));
        return next;
      });
    }, 4000);
  }

  const SIZE = 320;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = SIZE / 2 - 4;
  const TEXT_R = R * 0.62;

  const clickerScore = typeof window !== "undefined" ? getClickerScore() : 0;
  const canAfford = clickerScore >= SPIN_COST;

  return (
    <div className="max-w-3xl mx-auto relative z-10 text-center">
      {/* Cost indicator */}
      <p className="text-gray-500 text-sm mb-6">
        Cost: <span className="text-chad-green font-bold">{SPIN_COST} clicker pts</span> per spin
        {!canAfford && !spinning && (
          <span className="text-red-400 ml-2">(earn more in the clicker!)</span>
        )}
      </p>

      <div className="relative inline-block mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-chad-green drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
        </div>

        {/* Wheel */}
        <div
          className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="3" />

            {SEGMENTS.map((seg, i) => {
              const startAngle = i * SEG_ANGLE;
              const endAngle = (i + 1) * SEG_ANGLE;
              const midAngle = startAngle + SEG_ANGLE / 2;
              const isEven = i % 2 === 0;

              return (
                <g key={i}>
                  <path
                    d={describeArc(CX, CY, R, startAngle, endAngle)}
                    fill={isEven ? "#12121a" : "#1a1a2a"}
                    stroke="rgba(0,255,136,0.12)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={CX}
                    y={CY - TEXT_R}
                    fill={RARITY_FILL[seg.rarity]}
                    fontSize="7.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngle}, ${CX}, ${CY})`}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            <circle cx={CX} cy={CY} r="32" fill="#0a0a0f" stroke="rgba(0,255,136,0.3)" strokeWidth="2" />
            <text x={CX} y={CY} fill="#00ff88" fontSize="11" fontWeight="900" textAnchor="middle" dominantBaseline="central">
              SPIN
            </text>
          </svg>
        </div>
      </div>

      {/* Spin button */}
      <div className="mb-6">
        <button
          onClick={spin}
          disabled={spinning || !canAfford}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            spinning || !canAfford
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-chad-green text-black hover:bg-chad-green/90 cta-pulse cursor-pointer"
          }`}
        >
          {spinning ? "Spinning..." : !canAfford ? `Need ${SPIN_COST} pts` : `Spin (${SPIN_COST} pts)`}
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
          <p className={`text-xl font-black ${RARITY_COLORS[result.rarity]}`}>{result.label}</p>
        </div>
      )}

      {/* Collection */}
      <div className="mt-8">
        <button
          onClick={() => setShowCollection(!showCollection)}
          className="text-sm text-gray-500 hover:text-chad-green transition-colors"
        >
          Collection: {collection.length}/{NUM} badges {showCollection ? "\u25B2" : "\u25BC"}
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
