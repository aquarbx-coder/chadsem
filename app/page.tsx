"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const CursorTrail = dynamic(() => import("./components/CursorTrail"), { ssr: false });
const ScrollProgress = dynamic(() => import("./components/ScrollProgress"), { ssr: false });
const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), { ssr: false });
const ClickerGame = dynamic(() => import("./components/ClickerGame"), { ssr: false });
const SpinWheel = dynamic(() => import("./components/SpinWheel"), { ssr: false });
const Typewriter = dynamic(() => import("./components/Typewriter"), { ssr: false });
const TiltCard = dynamic(() => import("./components/TiltCard"), { ssr: false });
const AnimatedCounter = dynamic(() => import("./components/AnimatedCounter"), { ssr: false });
const HoverGrid = dynamic(() => import("./components/HoverGrid"), { ssr: false });
import { useConfetti } from "./components/ConfettiBurst";

const CA = "HTW3Q9CxmwTKVQfQCVLiXf1D3bx55WRAn21GRC9Dpump";
const PUMP_URL =
  "https://pump.fun/coin/HTW3Q9CxmwTKVQfQCVLiXf1D3bx55WRAn21GRC9Dpump";
const TWITTER_URL = "https://x.com/ChadsemCoin";

interface TokenStats {
  priceUsd: string | null;
  marketCap: number | null;
  volume24h: number | null;
  liquidity: number | null;
  priceChange24h: number | null;
  holders: number | null;
}

function formatNumber(n: number | null): string {
  if (n === null) return "\u2014";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPrice(p: string | null): string {
  if (!p) return "\u2014";
  const num = parseFloat(p);
  if (num < 0.0001) return `$${num.toExponential(2)}`;
  if (num < 1) return `$${num.toFixed(6)}`;
  return `$${num.toFixed(4)}`;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Particles({ count = 12 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 20}px`,
            animationDuration: `${6 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.2 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState<TokenStats>({
    priceUsd: null,
    marketCap: null,
    volume24h: null,
    liquidity: null,
    priceChange24h: null,
    holders: null,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [activeGame, setActiveGame] = useState<"clicker" | "wheel">("clicker");
  const confetti = useConfetti();

  const statsSection = useInView();
  const aboutSection = useInView();
  const legendSection = useInView();
  const whySection = useInView();
  const gamesSection = useInView();
  const howSection = useInView();
  const linksSection = useInView();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `https://frontend-api-v3.pump.fun/coins/${CA}`
        );
        const data = await res.json();
        if (data) {
          const virtualSolReserves = data.virtual_sol_reserves
            ? Number(data.virtual_sol_reserves) / 1e9
            : null;

          let price: string | null = null;
          let mcap: number | null = null;

          if (data.usd_market_cap) {
            mcap = Number(data.usd_market_cap);
          }

          if (!price && mcap && data.total_supply) {
            const totalSupply = Number(data.total_supply) / 1e6;
            if (totalSupply > 0) {
              price = (mcap / totalSupply).toString();
            }
          }

          setStats({
            priceUsd: price,
            marketCap: mcap,
            volume24h: null,
            liquidity: virtualSolReserves ? virtualSolReserves * 150 : null,
            priceChange24h: null,
            holders: null,
          });
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  function copyCA() {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-chad-dark">
      <CursorTrail />
      <ScrollProgress />
      <ScrollToTop />

      {/* ==================== NAV ==================== */}
      <nav className="fixed top-0 w-full z-50 bg-chad-dark/90 backdrop-blur-md border-b border-chad-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xl font-bold text-shimmer cursor-pointer hover:opacity-80 transition-opacity">$CHADSEM</a>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-6 text-sm text-gray-400">
              <a href="#about" className="hover:text-chad-green transition-colors">About</a>
              <a href="#stats" className="hover:text-chad-green transition-colors">Stats</a>
              <a href="#games" className="hover:text-chad-green transition-colors">Games</a>
              <a href="#how" className="hover:text-chad-green transition-colors">How to Buy</a>
              <a href="#links" className="hover:text-chad-green transition-colors">Links</a>
            </div>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-chad-green/10 text-chad-green border border-chad-green/30 rounded-lg hover:bg-chad-green/20 transition-all"
            >
              X
            </a>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden grid-bg">
        <Particles count={15} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-chad-green/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-chad-green/3 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />
        </div>

        {/* Desktop mascot with super saiyan aura */}
        <div className="hidden lg:block absolute right-[5%] xl:right-[10%] bottom-0 z-10 pointer-events-none">
          <div className="relative">
            {/* Aura layers */}
            <div className="absolute inset-0 -inset-x-16 -top-20 aura-outer rounded-full" />
            <div className="absolute inset-0 -inset-x-10 -top-14 aura-mid rounded-full" />
            <div className="absolute inset-0 -inset-x-6 -top-10 aura-inner rounded-full" />
            {/* Energy streaks */}
            <div className="absolute inset-0 -inset-x-12 -top-16 aura-streaks" />
            {/* Sparks */}
            <div className="absolute top-[10%] left-[15%] aura-spark w-1.5 h-1.5 rounded-full bg-chad-green" />
            <div className="absolute top-[20%] right-[20%] aura-spark delay-300 w-2 h-2 rounded-full bg-white" />
            <div className="absolute top-[5%] left-[40%] aura-spark delay-600 w-1 h-1 rounded-full bg-chad-green" />
            <div className="absolute top-[30%] right-[10%] aura-spark delay-200 w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <div className="absolute top-[15%] right-[35%] aura-spark delay-500 w-1 h-1 rounded-full bg-white" />
            <img
              src="/mascot.png"
              alt="CHADSEM Mascot"
              className="relative z-10 animate-sway w-[480px] xl:w-[560px] h-auto drop-shadow-[0_0_60px_rgba(0,255,136,0.3)]"
            />
            {/* Ground glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-chad-green/20 rounded-full blur-xl aura-ground" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto lg:text-left lg:mr-auto lg:ml-[8%] xl:ml-[12%]">
          {/* Mobile mascot with super saiyan aura */}
          <div className="lg:hidden mx-auto mb-8 w-64 h-64 animate-fade-scale">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 -inset-x-8 -top-10 aura-outer rounded-full" />
              <div className="absolute inset-0 -inset-x-5 -top-6 aura-mid rounded-full" />
              <div className="absolute inset-0 -inset-x-3 -top-4 aura-inner rounded-full" />
              <div className="absolute inset-0 -inset-x-6 -top-8 aura-streaks" />
              <div className="absolute top-[10%] left-[10%] aura-spark w-1 h-1 rounded-full bg-chad-green" />
              <div className="absolute top-[15%] right-[15%] aura-spark delay-300 w-1.5 h-1.5 rounded-full bg-white" />
              <div className="absolute top-[5%] left-[35%] aura-spark delay-500 w-1 h-1 rounded-full bg-chad-green" />
              <img
                src="/mascot.png"
                alt="CHADSEM Mascot"
                className="relative z-10 animate-sway w-full h-full object-contain drop-shadow-[0_0_40px_rgba(0,255,136,0.3)]"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-chad-green/20 rounded-full blur-lg aura-ground" />
            </div>
          </div>

          <div className="animate-fade-up inline-block px-4 py-1.5 bg-chad-green/10 border border-chad-green/20 rounded-full text-chad-green text-xs font-semibold tracking-wider uppercase mb-6 pulse-ring">
            Live on Solana
          </div>

          <h1 className="animate-fade-up delay-100 text-6xl sm:text-8xl font-black tracking-tight mb-4 text-glow">
            <span className="text-shimmer">$CHAD</span>
            <span className="text-white">SEM</span>
          </h1>

          <p className="animate-fade-up delay-200 text-lg sm:text-2xl text-gray-400 mb-2 font-medium min-h-[2em]">
            <Typewriter />
          </p>
          <p className="animate-fade-up delay-300 text-sm text-gray-500 mb-10 max-w-lg lg:mx-0 mx-auto">
            Built by degens, for degens. No insiders, no presale, no BS.
            Just a community that knows who put them on.
          </p>

          <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => confetti(e.clientX, e.clientY)}
              className="cta-pulse px-8 py-4 bg-chad-green text-black font-bold rounded-xl hover:bg-chad-green/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all text-lg"
            >
              Buy $CHADSEM
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-card border border-chad-border text-white font-bold rounded-xl hover:border-chad-green/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all text-lg"
            >
              Follow on X
            </a>
          </div>

          <button
            onClick={copyCA}
            className="animate-fade-up delay-500 inline-flex items-center gap-2 bg-chad-card rounded-xl px-6 py-3 border-glow hover:border-chad-green/40 transition-all cursor-pointer group"
          >
            <span className="text-xs text-gray-500">CA:</span>
            <span className="text-chad-green font-mono text-xs sm:text-sm truncate max-w-[280px] sm:max-w-none">
              {CA}
            </span>
            <span className="text-gray-500 group-hover:text-chad-green transition-colors text-xs">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>
      </section>

      {/* ==================== TICKER BAR ==================== */}
      <div className="bg-chad-green/5 border-y border-chad-green/10 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm text-gray-400">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex gap-12 shrink-0">
              <span>$CHADSEM on Solana</span>
              <span className="text-chad-green">&#9679;</span>
              <span>Community Owned</span>
              <span className="text-chad-green">&#9679;</span>
              <span>No Presale</span>
              <span className="text-chad-green">&#9679;</span>
              <span>No Team Tokens</span>
              <span className="text-chad-green">&#9679;</span>
              <span>Honoring @blknoiz06</span>
              <span className="text-chad-green">&#9679;</span>
              <span>From the Trenches</span>
              <span className="text-chad-green">&#9679;</span>
              <span>Built Different</span>
              <span className="text-chad-green">&#9679;</span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== ANIMATED NUMBERS BAR ==================== */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: "#0c0c14" }}>
        <HoverGrid />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { end: 1000000000, prefix: "", suffix: "", label: "Total Supply", display: "1B" },
              { end: 100, prefix: "", suffix: "%", label: "Community Owned" },
              { end: 0, prefix: "", suffix: "", label: "Team Tokens", display: "0" },
              { end: 0, prefix: "", suffix: "", label: "Presale Tokens", display: "0" },
            ].map((item, i) => (
              <div key={item.label} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-3xl sm:text-4xl font-black text-white stat-value mb-1">
                  {item.display !== undefined ? (
                    item.display
                  ) : (
                    <AnimatedCounter end={item.end} prefix={item.prefix} suffix={item.suffix} />
                  )}
                </p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LIVE STATS ==================== */}
      <section
        id="stats"
        ref={statsSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${statsSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            Live <span className="text-shimmer">Stats</span>
          </h2>
          <p className={`text-gray-500 mb-2 text-lg ${statsSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            Pulled straight from Pump.fun
          </p>
          <p className={`text-gray-600 text-xs mb-12 ${statsSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            Updates every 30 seconds
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-chad-card rounded-2xl p-6 border-glow animate-pulse">
                  <div className="h-4 bg-gray-800 rounded w-20 mx-auto mb-3" />
                  <div className="h-8 bg-gray-800 rounded w-28 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Price", value: formatPrice(stats.priceUsd) },
                { label: "Market Cap", value: formatNumber(stats.marketCap) },
                { label: "Liquidity", value: formatNumber(stats.liquidity) },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`bg-chad-card rounded-2xl p-6 border-glow card-glow card-hover ${
                    i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                  } ${statsSection.visible ? `animate-fade-scale delay-${(i + 3) * 100}` : "opacity-0"}`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-chad-green/10 flex items-center justify-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-chad-green animate-pulse" />
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                  <p className="text-white text-2xl font-bold stat-value">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          <a
            href={PUMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block mt-8 text-sm text-chad-green/70 hover:text-chad-green transition-colors ${statsSection.visible ? "animate-fade-up delay-700" : "opacity-0"}`}
          >
            View on Pump.fun &rarr;
          </a>
        </div>
      </section>

      {/* ==================== WHO IS ANSEM ==================== */}
      <section
        id="about"
        ref={aboutSection.ref}
        className="py-24 px-6 relative"
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-chad-green/3 rounded-full blur-[150px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[120px] -translate-y-1/2" />
        </div>
        <Particles count={10} />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 text-center ${aboutSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            Who is <span className="text-shimmer">Ansem</span>?
          </h2>
          <p className={`text-gray-500 text-center mb-4 text-lg ${aboutSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            @blknoiz06 &mdash; if you know, you know
          </p>
          <div className={`mx-auto mb-12 ${aboutSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <TiltCard className={`${aboutSection.visible ? "animate-slide-left delay-300" : "opacity-0"}`}>
              <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                    <span className="text-chad-green text-lg font-black">01</span>
                  </div>
                  <h3 className="text-chad-green font-bold text-xl mb-3">The guy who called SOL before everyone</h3>
                  <p className="text-gray-400 leading-relaxed">
                    While CT was sleeping on Solana, Ansem was already deep in it. He called the SOL run before most
                    people even had a Phantom wallet. His timeline became required reading for anyone trying to catch
                    the next move. Not a guesser &mdash; the man had conviction and the receipts to prove it.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard className={`${aboutSection.visible ? "animate-slide-right delay-400" : "opacity-0"}`}>
              <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow relative overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                    <span className="text-chad-green text-lg font-black">02</span>
                  </div>
                  <h3 className="text-chad-green font-bold text-xl mb-3">Put thousands of people on</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Ansem didn&apos;t gatekeep. He shared his plays, broke down his thinking, and brought
                    an entire generation of traders into Solana. People made life-changing money because
                    they followed his calls. That&apos;s not influence &mdash; that&apos;s impact.
                  </p>
                </div>
              </div>
            </TiltCard>

            <div className={`md:col-span-2 bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover relative overflow-hidden group ${aboutSection.visible ? "animate-fade-up delay-500" : "opacity-0"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 md:flex md:gap-8 md:items-start">
                <div className="flex-shrink-0 mb-5 md:mb-0">
                  <div className="w-14 h-14 rounded-xl bg-chad-green/10 flex items-center justify-center badge-glow">
                    <span className="text-chad-green text-xl font-black">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-chad-green font-bold text-xl mb-3">More than a trader &mdash; a culture</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Ansem became the face of a whole era of Solana trading. The &quot;trench&quot;
                    mentality &mdash; grinding through the noise, holding when it&apos;s ugly, buying when
                    everyone else is scared &mdash; that came from him. He didn&apos;t just make calls,
                    he built a culture around showing up every single day. That&apos;s what $CHADSEM is about.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE LEGEND (timeline) ==================== */}
      <section
        ref={legendSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={8} />

        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 text-center ${legendSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            The <span className="text-shimmer">Legend</span>
          </h2>
          <p className={`text-gray-500 text-center mb-4 text-lg ${legendSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            How Ansem became the most trusted voice in Solana
          </p>
          <div className={`mx-auto mb-16 ${legendSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="space-y-0">
            {[
              {
                period: "Early 2023",
                title: "Called Solana when nobody cared",
                text: "SOL was under $20 and CT had written it off. Ansem was loading bags and telling anyone who\u2019d listen that Solana wasn\u2019t dead. Most people laughed. They\u2019re not laughing anymore.",
              },
              {
                period: "Mid 2023",
                title: "Built the trench army",
                text: "His timeline became a hub for Solana degens. Daily threads, real-time analysis, no paywalls. He wasn\u2019t selling courses or running a paid group \u2014 just sharing plays and building a community that moved together.",
              },
              {
                period: "Late 2023",
                title: "SOL rips past $100",
                text: "Everything Ansem said played out. The people who listened went from underwater to life-changing gains. Solana went from a ghost chain to the most active L1 in crypto. His followers didn\u2019t just make money \u2014 they caught an entire narrative shift.",
              },
              {
                period: "2024",
                title: "Became the face of Solana culture",
                text: "Ansem wasn\u2019t just calling trades anymore. He was on panels, podcasts, and at every major crypto event. He went from anon trench trader to one of the most recognized figures in the space. Still posting, still grinding, still in the trenches.",
              },
            ].map((item, i) => (
              <div
                key={item.period}
                className={`flex gap-6 ${legendSection.visible ? `animate-fade-up delay-${(i + 3) * 100}` : "opacity-0"}`}
              >
                <div className="flex flex-col items-center">
                  <div className="timeline-dot" />
                  {i < 3 && <div className="timeline-line flex-1 min-h-[40px]" />}
                </div>
                <div className="pb-10">
                  <span className="text-chad-green text-xs font-bold uppercase tracking-widest">{item.period}</span>
                  <h3 className="text-white font-bold text-lg mt-1 mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY $CHADSEM ==================== */}
      <section
        ref={whySection.ref}
        className="py-24 px-6 relative"
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-chad-green/3 rounded-full blur-[130px]" />
        </div>
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${whySection.visible ? "animate-fade-up" : "opacity-0"}`}>
            Why <span className="text-shimmer">$CHADSEM</span>?
          </h2>
          <p className={`text-gray-500 mb-4 text-lg max-w-2xl mx-auto ${whySection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            Not another fork. Not another cash grab. Here&apos;s what this actually is.
          </p>
          <div className={`mx-auto mb-16 ${whySection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <svg className="w-7 h-7 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                title: "100% Community",
                desc: "No team allocation. No dev wallets. No insider deals. Every single token is for the community.",
              },
              {
                icon: <svg className="w-7 h-7 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
                title: "No Presale",
                desc: "Nobody got in early behind closed doors. Fair launch on Pump.fun. Same entry for everyone.",
              },
              {
                icon: <svg className="w-7 h-7 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: "Solana Native",
                desc: "Built on the fastest chain. Sub-second transactions, near-zero fees. No bridging headaches.",
              },
              {
                icon: <svg className="w-7 h-7 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                title: "A Tribute",
                desc: "This coin exists because Ansem put people on. It\u2019s how the community says thanks.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-chad-card rounded-2xl p-6 border-glow card-glow card-hover relative overflow-hidden group ${whySection.visible ? `animate-fade-scale delay-${(i + 3) * 100}` : "opacity-0"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GAMES ==================== */}
      <section
        id="games"
        ref={gamesSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={10} />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 text-center ${gamesSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            The <span className="text-shimmer">Trenches</span>
          </h2>
          <p className={`text-gray-500 text-center mb-4 text-lg ${gamesSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            Earn points, collect badges, flex on everyone
          </p>
          <div className={`mx-auto mb-10 ${gamesSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          {/* Game tabs */}
          <div className={`flex justify-center gap-2 mb-10 ${gamesSection.visible ? "animate-fade-up delay-300" : "opacity-0"}`}>
            <button
              onClick={() => setActiveGame("clicker")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeGame === "clicker" ? "tab-active" : "tab-inactive border-chad-border"
              }`}
            >
              $CHADSEM Clicker
            </button>
            <button
              onClick={() => setActiveGame("wheel")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeGame === "wheel" ? "tab-active" : "tab-inactive border-chad-border"
              }`}
            >
              Spin the Wheel
            </button>
          </div>

          {/* Game content */}
          <div className={`${gamesSection.visible ? "animate-fade-scale delay-400" : "opacity-0"}`}>
            {activeGame === "clicker" ? <ClickerGame /> : <SpinWheel />}
          </div>
        </div>
      </section>

      {/* ==================== HOW TO BUY ==================== */}
      <section
        id="how"
        ref={howSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={6} />

        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 text-center ${howSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            How to <span className="text-shimmer">Buy</span>
          </h2>
          <p className={`text-gray-500 text-center mb-4 text-lg ${howSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            Three steps. That&apos;s it.
          </p>
          <div className={`mx-auto mb-16 ${howSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Get a Solana wallet",
                text: "Download Phantom or Solflare. If you\u2019re on mobile, both have solid apps. Set it up, save your seed phrase somewhere safe (not in your notes app).",
              },
              {
                step: "2",
                title: "Load up SOL",
                text: "Buy SOL on any exchange \u2014 Coinbase, Binance, whatever you use. Send it to your Phantom wallet address. Make sure you keep a little SOL for gas (like 0.05 SOL is plenty).",
              },
              {
                step: "3",
                title: "Swap for $CHADSEM",
                text: "Head to Pump.fun or Jupiter. Paste the contract address, set your slippage, and swap your SOL for $CHADSEM. Welcome to the trenches.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`gradient-border card-hover ${howSection.visible ? `animate-fade-up delay-${(i + 3) * 100}` : "opacity-0"}`}
              >
                <div className="p-6 sm:p-8 flex gap-5 items-start relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center flex-shrink-0 badge-glow">
                    <span className="text-chad-green text-xl font-black">{item.step}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-10 ${howSection.visible ? "animate-fade-up delay-700" : "opacity-0"}`}>
            <button
              onClick={copyCA}
              className="inline-flex items-center gap-3 bg-chad-card rounded-xl px-6 py-4 border-glow hover:border-chad-green/40 transition-all cursor-pointer group"
            >
              <span className="text-sm text-gray-500">CA:</span>
              <span className="text-chad-green font-mono text-xs sm:text-sm truncate max-w-[240px] sm:max-w-none">
                {CA}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-chad-green/10 text-chad-green group-hover:bg-chad-green/20 transition-colors">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== LINKS ==================== */}
      <section
        id="links"
        ref={linksSection.ref}
        className="py-24 px-6 relative"
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-chad-green/3 rounded-full blur-[150px]" />
        </div>
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${linksSection.visible ? "animate-fade-up" : "opacity-0"}`}>
            Join the <span className="text-shimmer">Community</span>
          </h2>
          <p className={`text-gray-500 mb-4 text-lg ${linksSection.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
            The trenches are better when you&apos;re not alone.
          </p>
          <div className={`mx-auto mb-12 ${linksSection.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                href: TWITTER_URL,
                isButton: false,
                iconContent: <span className="text-chad-green text-xl font-bold">X</span>,
                title: "X / Twitter",
                sub: "@ChadsemCoin",
              },
              {
                href: PUMP_URL,
                isButton: false,
                iconContent: <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                title: "Pump.fun",
                sub: "Buy $CHADSEM",
              },
              {
                href: undefined,
                isButton: true,
                iconContent: <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>,
                title: "Contract",
                sub: copied ? "Copied!" : `${CA.slice(0, 6)}...${CA.slice(-4)}`,
              },
            ].map((item, i) => {
              const classes = `bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover hover:border-chad-green/40 transition-all group relative overflow-hidden ${
                linksSection.visible ? `animate-fade-scale delay-${(i + 3) * 100}` : "opacity-0"
              }`;
              const inner = (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4 badge-glow">
                      {item.iconContent}
                    </div>
                    <h3 className="text-white font-bold mb-1 group-hover:text-chad-green transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-mono">{item.sub}</p>
                  </div>
                </>
              );

              if (item.isButton) {
                return <button key={item.title} onClick={copyCA} className={`${classes} text-left`}>{inner}</button>;
              }
              return <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={classes}>{inner}</a>;
            })}
          </div>

          {/* Big CTA */}
          <div className={`${linksSection.visible ? "animate-fade-up delay-700" : "opacity-0"}`}>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => confetti(e.clientX, e.clientY)}
              className="cta-pulse inline-block px-10 py-5 bg-chad-green text-black font-bold rounded-xl hover:bg-chad-green/90 hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] transition-all text-xl"
            >
              Buy $CHADSEM Now
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-10 px-6 border-t border-chad-border" style={{ background: "#08080c" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <span className="text-xl font-bold text-shimmer">$CHADSEM</span>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-chad-green transition-colors">X</a>
              <a href={PUMP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-chad-green transition-colors">Pump.fun</a>
            </div>
          </div>
          <div className="w-full h-px bg-chad-border mb-6" />
          <p className="text-gray-600 text-sm text-center">
            $CHADSEM is a community memecoin with no intrinsic value or expectation of financial return.
            Not affiliated with Ansem. This is a fan token made by the community. Do your own research. Not financial advice.
          </p>
          <p className="text-gray-700 text-xs mt-3 text-center">
            &copy; 2025 $CHADSEM Community
          </p>
        </div>
      </footer>
    </div>
  );
}
