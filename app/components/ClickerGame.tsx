"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}

const UPGRADES = [
  { name: "Double Tap", desc: "+1 per click", baseCost: 50, perClick: 1, perSec: 0 },
  { name: "Auto Grind", desc: "+1 per second", baseCost: 100, perClick: 0, perSec: 1 },
  { name: "Trench Hands", desc: "+5 per click", baseCost: 500, perClick: 5, perSec: 0 },
  { name: "Bot Army", desc: "+5 per second", baseCost: 1000, perClick: 0, perSec: 5 },
  { name: "Whale Mode", desc: "+25 per click", baseCost: 5000, perClick: 25, perSec: 0 },
  { name: "Ansem's Blessing", desc: "+25 per second", baseCost: 10000, perClick: 0, perSec: 25 },
];

const RANKS = [
  { min: 0, name: "Paper Hands" },
  { min: 100, name: "Trench Recruit" },
  { min: 500, name: "Degen Soldier" },
  { min: 2000, name: "Diamond Hands" },
  { min: 10000, name: "Trench Commander" },
  { min: 50000, name: "Whale" },
  { min: 200000, name: "Ansem Jr." },
  { min: 1000000, name: "The Chad" },
];

export default function ClickerGame() {
  const [score, setScore] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState<number[]>(UPGRADES.map(() => 0));
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [scale, setScale] = useState(1);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chadsem-clicker");
      if (saved) {
        const data = JSON.parse(saved);
        setScore(data.score || 0);
        setTotalEarned(data.totalEarned || 0);
        setClickPower(data.clickPower || 1);
        setAutoRate(data.autoRate || 0);
        setUpgradeLevels(data.upgradeLevels || UPGRADES.map(() => 0));
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        "chadsem-clicker",
        JSON.stringify({ score, totalEarned, clickPower, autoRate, upgradeLevels })
      );
    }, 500);
    return () => clearTimeout(timeout);
  }, [score, totalEarned, clickPower, autoRate, upgradeLevels]);

  // Auto-earn
  useEffect(() => {
    if (autoRate <= 0) return;
    const interval = setInterval(() => {
      setScore((s) => s + autoRate);
      setTotalEarned((t) => t + autoRate);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRate]);

  // Clean floating texts
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingTexts((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [floatingTexts]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setScore((s) => s + clickPower);
      setTotalEarned((t) => t + clickPower);

      // Bounce
      setScale(0.9);
      setTimeout(() => setScale(1), 100);

      // Floating text
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left + (Math.random() - 0.5) * 40;
        const y = e.clientY - rect.top - 20;
        setFloatingTexts((prev) => [
          ...prev.slice(-8),
          { id: nextId.current++, x, y, value: clickPower },
        ]);
      }
    },
    [clickPower]
  );

  function buyUpgrade(index: number) {
    const upgrade = UPGRADES[index];
    const level = upgradeLevels[index];
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, level));

    if (score < cost) return;

    setScore((s) => s - cost);
    setClickPower((c) => c + upgrade.perClick);
    setAutoRate((a) => a + upgrade.perSec);
    setUpgradeLevels((prev) => {
      const next = [...prev];
      next[index] = prev[index] + 1;
      return next;
    });
  }

  const rank = [...RANKS].reverse().find((r) => totalEarned >= r.min) || RANKS[0];
  const nextRank = RANKS.find((r) => r.min > totalEarned);
  const progress = nextRank
    ? ((totalEarned - rank.min) / (nextRank.min - rank.min)) * 100
    : 100;

  return (
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Clicker area */}
        <div className="text-center">
          {/* Score */}
          <div className="mb-2">
            <p className="text-5xl sm:text-6xl font-black text-white stat-value">
              {score.toLocaleString()}
            </p>
            <p className="text-chad-green text-sm font-bold mt-1">$CHADSEM points</p>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 text-xs text-gray-500 mb-6">
            <span>+{clickPower}/click</span>
            <span>+{autoRate}/sec</span>
          </div>

          {/* Rank */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-1">
              Rank: <span className="text-chad-green font-bold">{rank.name}</span>
            </p>
            <div className="w-48 mx-auto h-1.5 bg-chad-card rounded-full overflow-hidden">
              <div
                className="h-full bg-chad-green rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            {nextRank && (
              <p className="text-[10px] text-gray-600 mt-1">
                {(nextRank.min - totalEarned).toLocaleString()} to {nextRank.name}
              </p>
            )}
          </div>

          {/* Click target */}
          <div ref={containerRef} className="relative inline-block">
            {floatingTexts.map((ft) => (
              <span
                key={ft.id}
                className="absolute text-chad-green font-black text-lg pointer-events-none select-none"
                style={{
                  left: ft.x,
                  top: ft.y,
                  animation: "floatClickText 0.8s ease-out forwards",
                }}
              >
                +{ft.value}
              </span>
            ))}

            <button
              onClick={handleClick}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-chad-card border-2 border-chad-green/30 hover:border-chad-green/60 transition-all cursor-pointer active:border-chad-green select-none"
              style={{ transform: `scale(${scale})`, transition: "transform 0.1s ease" }}
            >
              <img
                src="/mascot.png"
                alt="Click me!"
                className="w-full h-full object-contain p-4 pointer-events-none"
                draggable={false}
              />
              <div className="absolute inset-0 rounded-full bg-chad-green/5 hover:bg-chad-green/10 transition-colors" />
            </button>
          </div>

          <p className="text-gray-600 text-xs mt-4">Click the mascot to earn points!</p>

          {/* Mobile toggle for upgrades */}
          <button
            onClick={() => setShowUpgrades(!showUpgrades)}
            className="lg:hidden mt-4 text-sm text-chad-green/70 hover:text-chad-green transition-colors"
          >
            {showUpgrades ? "Hide" : "Show"} Upgrades
          </button>
        </div>

        {/* Right: Upgrades */}
        <div className={`space-y-3 ${showUpgrades ? "block" : "hidden lg:block"}`}>
          <h3 className="text-white font-bold text-lg mb-4">Upgrades</h3>
          {UPGRADES.map((upgrade, i) => {
            const level = upgradeLevels[i];
            const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, level));
            const canBuy = score >= cost;

            return (
              <button
                key={upgrade.name}
                onClick={() => buyUpgrade(i)}
                disabled={!canBuy}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  canBuy
                    ? "bg-chad-card border-chad-green/20 hover:border-chad-green/40 cursor-pointer card-hover"
                    : "bg-chad-card/50 border-chad-border opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-sm">{upgrade.name}</span>
                    {level > 0 && (
                      <span className="text-chad-green text-xs ml-2">Lv.{level}</span>
                    )}
                    <p className="text-gray-500 text-xs mt-0.5">{upgrade.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${canBuy ? "text-chad-green" : "text-gray-600"}`}>
                      {cost.toLocaleString()}
                    </span>
                    <p className="text-gray-600 text-[10px]">pts</p>
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => {
              if (confirm("Reset all progress? This can't be undone.")) {
                setScore(0);
                setTotalEarned(0);
                setClickPower(1);
                setAutoRate(0);
                setUpgradeLevels(UPGRADES.map(() => 0));
                localStorage.removeItem("chadsem-clicker");
              }
            }}
            className="w-full text-center text-xs text-gray-600 hover:text-red-500 transition-colors mt-4 py-2"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
