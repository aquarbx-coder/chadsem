"use client";

import { useEffect, useState, useRef } from "react";

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
  if (n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPrice(p: string | null): string {
  if (!p) return "—";
  const num = parseFloat(p);
  if (num < 0.0001) return `$${num.toExponential(2)}`;
  if (num < 1) return `$${num.toFixed(6)}`;
  return `$${num.toFixed(4)}`;
}

/* Hook: animate elements when they scroll into view */
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

/* Floating particles background */
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

  const statsSection = useInView();
  const aboutSection = useInView();
  const purposeSection = useInView();
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
          const virtualTokenReserves = data.virtual_token_reserves
            ? Number(data.virtual_token_reserves) / 1e6
            : null;

          let price: string | null = null;
          let mcap: number | null = null;

          if (data.usd_market_cap) {
            mcap = Number(data.usd_market_cap);
          }

          if (
            virtualSolReserves &&
            virtualTokenReserves &&
            virtualTokenReserves > 0
          ) {
            if (mcap && data.total_supply) {
              const totalSupply = Number(data.total_supply) / 1e6;
              price = (mcap / totalSupply).toString();
            }
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
      {/* ==================== NAV ==================== */}
      <nav className="fixed top-0 w-full z-50 bg-chad-dark/90 backdrop-blur-md border-b border-chad-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-shimmer">$CHADSEM</span>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-6 text-sm text-gray-400">
              <a
                href="#about"
                className="hover:text-chad-green transition-colors"
              >
                About
              </a>
              <a
                href="#stats"
                className="hover:text-chad-green transition-colors"
              >
                Stats
              </a>
              <a
                href="#tokenomics"
                className="hover:text-chad-green transition-colors"
              >
                Purpose
              </a>
              <a
                href="#links"
                className="hover:text-chad-green transition-colors"
              >
                Links
              </a>
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

        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-chad-green/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-chad-green/3 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />
        </div>

        {/* Mascot - right side on desktop */}
        <div className="hidden lg:block absolute right-[5%] xl:right-[10%] bottom-0 z-10 pointer-events-none">
          <img
            src="/mascot.png"
            alt="CHADSEM Mascot"
            className="animate-sway w-[480px] xl:w-[560px] h-auto drop-shadow-[0_0_60px_rgba(0,255,136,0.15)]"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto lg:text-left lg:mr-auto lg:ml-[8%] xl:ml-[12%]">
          {/* Mobile mascot */}
          <div className="lg:hidden mx-auto mb-8 w-64 h-64 animate-fade-scale">
            <img
              src="/mascot.png"
              alt="CHADSEM Mascot"
              className="animate-sway w-full h-full object-contain drop-shadow-[0_0_40px_rgba(0,255,136,0.15)]"
            />
          </div>

          <div className="animate-fade-up inline-block px-4 py-1.5 bg-chad-green/10 border border-chad-green/20 rounded-full text-chad-green text-xs font-semibold tracking-wider uppercase mb-6 pulse-ring">
            Live on Solana
          </div>

          <h1 className="animate-fade-up delay-100 text-6xl sm:text-8xl font-black tracking-tight mb-4 text-glow">
            <span className="text-shimmer">$CHAD</span>
            <span className="text-white">SEM</span>
          </h1>

          <p className="animate-fade-up delay-200 text-xl sm:text-2xl text-gray-400 mb-2 font-medium">
            From the trenches to the top.
          </p>
          <p className="animate-fade-up delay-300 text-sm text-gray-500 mb-10 max-w-lg lg:mx-0 mx-auto">
            The community memecoin honoring the king of Solana calls. Built by
            degens, for degens.
          </p>

          <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pulse px-8 py-4 bg-chad-green text-black font-bold rounded-xl hover:bg-chad-green/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all text-lg"
            >
              Follow on X
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-card border border-chad-border text-white font-bold rounded-xl hover:border-chad-green/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all text-lg"
            >
              Buy on Pump.fun
            </a>
          </div>

          {/* CA in hero */}
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

      {/* ==================== LIVE STATS ==================== */}
      <section
        id="stats"
        ref={statsSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{
          background:
            "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)",
        }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2
            className={`text-4xl sm:text-5xl font-black mb-4 transition-all duration-700 ${
              statsSection.visible
                ? "animate-fade-up"
                : "opacity-0"
            }`}
          >
            Live <span className="text-shimmer">Stats</span>
          </h2>
          <p
            className={`text-gray-500 mb-2 text-lg transition-all duration-700 ${
              statsSection.visible
                ? "animate-fade-up delay-100"
                : "opacity-0"
            }`}
          >
            Real-time data from Pump.fun
          </p>
          <p
            className={`text-gray-600 text-xs mb-12 transition-all duration-700 ${
              statsSection.visible
                ? "animate-fade-up delay-200"
                : "opacity-0"
            }`}
          >
            Auto-refreshes every 30 seconds
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-chad-card rounded-2xl p-6 border-glow animate-pulse"
                >
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
                  } ${
                    statsSection.visible
                      ? `animate-fade-scale delay-${(i + 3) * 100}`
                      : "opacity-0"
                  }`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-chad-green/10 flex items-center justify-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-chad-green animate-pulse" />
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                  <p className="text-white text-2xl font-bold stat-value">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <a
            href={PUMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block mt-8 text-sm text-chad-green/70 hover:text-chad-green transition-colors ${
              statsSection.visible
                ? "animate-fade-up delay-700"
                : "opacity-0"
            }`}
          >
            View on Pump.fun &rarr;
          </a>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section
        id="about"
        ref={aboutSection.ref}
        className="py-24 px-6 relative"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-chad-green/3 rounded-full blur-[150px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[120px] -translate-y-1/2" />
        </div>
        <Particles count={10} />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2
            className={`text-4xl sm:text-5xl font-black mb-4 text-center ${
              aboutSection.visible ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Who is <span className="text-shimmer">Ansem</span>?
          </h2>
          <p
            className={`text-gray-500 text-center mb-4 text-lg ${
              aboutSection.visible
                ? "animate-fade-up delay-100"
                : "opacity-0"
            }`}
          >
            @blknoiz06 — The legend behind the calls
          </p>

          {/* Decorative line */}
          <div
            className={`mx-auto mb-12 ${
              aboutSection.visible
                ? "animate-fade-up delay-200"
                : "opacity-0"
            }`}
          >
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 01 */}
            <div
              className={`bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover relative overflow-hidden group ${
                aboutSection.visible
                  ? "animate-slide-left delay-300"
                  : "opacity-0"
              }`}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                  <span className="text-chad-green text-lg font-black">01</span>
                </div>
                <h3 className="text-chad-green font-bold text-xl mb-3">
                  The Trench King
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Ansem (@blknoiz06) became one of the most influential voices in
                  crypto Twitter. Known for his early Solana calls and fearless
                  market takes, he built a massive following of degens who trusted
                  his vision when no one else was paying attention.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div
              className={`bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover relative overflow-hidden group ${
                aboutSection.visible
                  ? "animate-slide-right delay-400"
                  : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                  <span className="text-chad-green text-lg font-black">02</span>
                </div>
                <h3 className="text-chad-green font-bold text-xl mb-3">
                  Community Builder
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  While others chased hype, Ansem stayed in the trenches. He
                  shared alpha, called bottoms, and helped countless community
                  members navigate the chaos of crypto. His dedication to the
                  culture made him a legend.
                </p>
              </div>
            </div>

            {/* Card 03 - full width */}
            <div
              className={`md:col-span-2 bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover relative overflow-hidden group ${
                aboutSection.visible
                  ? "animate-fade-up delay-500"
                  : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 md:flex md:gap-8 md:items-start">
                <div className="flex-shrink-0 mb-5 md:mb-0">
                  <div className="w-14 h-14 rounded-xl bg-chad-green/10 flex items-center justify-center badge-glow">
                    <span className="text-chad-green text-xl font-black">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-chad-green font-bold text-xl mb-3">
                    Why $CHADSEM?
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    $CHADSEM is a tribute to everything Ansem represents — the
                    grit, the calls, the community. This isn&apos;t just another
                    memecoin. It&apos;s a movement built by the people who were
                    in the trenches, for the people who understand what it means
                    to hold through the noise. No VC backing, no insider deals —
                    just pure, unfiltered community energy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PURPOSE ==================== */}
      <section
        id="tokenomics"
        ref={purposeSection.ref}
        className="py-24 px-6 relative noise-bg"
        style={{
          background:
            "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)",
        }}
      >
        <div className="glow-divider absolute top-0 left-0 right-0" />
        <div className="glow-divider absolute bottom-0 left-0 right-0" />
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2
            className={`text-4xl sm:text-5xl font-black mb-4 ${
              purposeSection.visible ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Pure <span className="text-shimmer">Market Presence</span>
          </h2>
          <p
            className={`text-gray-500 mb-4 text-lg max-w-2xl mx-auto ${
              purposeSection.visible
                ? "animate-fade-up delay-100"
                : "opacity-0"
            }`}
          >
            No roadmap fluff. No empty promises. Just community and culture.
          </p>
          <div
            className={`mx-auto mb-16 ${
              purposeSection.visible
                ? "animate-fade-up delay-200"
                : "opacity-0"
            }`}
          >
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-chad-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Community Driven",
                desc: "No team tokens. No dev allocation. 100% for the people in the trenches.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-chad-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "No Fluff",
                desc: "We don\u2019t need a 50-page whitepaper. The culture speaks for itself.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-chad-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                title: "Market Energy",
                desc: "Built on Solana. Fast, cheap, and ready for the next wave.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover relative overflow-hidden group ${
                  purposeSection.visible
                    ? `animate-fade-scale delay-${(i + 3) * 100}`
                    : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-chad-green/10 flex items-center justify-center mb-5 badge-glow">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LINKS ==================== */}
      <section
        id="links"
        ref={linksSection.ref}
        className="py-24 px-6 relative"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-chad-green/3 rounded-full blur-[150px]" />
        </div>
        <Particles count={8} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2
            className={`text-4xl sm:text-5xl font-black mb-4 ${
              linksSection.visible ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Join the <span className="text-shimmer">Movement</span>
          </h2>
          <p
            className={`text-gray-500 mb-4 text-lg ${
              linksSection.visible
                ? "animate-fade-up delay-100"
                : "opacity-0"
            }`}
          >
            Get in before the rest figure it out.
          </p>
          <div
            className={`mx-auto mb-12 ${
              linksSection.visible
                ? "animate-fade-up delay-200"
                : "opacity-0"
            }`}
          >
            <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-chad-green to-transparent" />
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                href: TWITTER_URL,
                isButton: false,
                iconContent: (
                  <span className="text-chad-green text-xl font-bold">X</span>
                ),
                title: "X",
                sub: "@ChadsemCoin",
              },
              {
                href: PUMP_URL,
                isButton: false,
                iconContent: (
                  <svg
                    className="w-6 h-6 text-chad-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                title: "Pump.fun",
                sub: "Buy Now",
              },
              {
                href: undefined,
                isButton: true,
                iconContent: (
                  <svg
                    className="w-6 h-6 text-chad-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                ),
                title: "Contract Address",
                sub: copied ? "Copied!" : CA,
              },
            ].map((item, i) => {
              const classes = `bg-chad-card rounded-2xl p-8 border-glow card-glow card-hover hover:border-chad-green/40 transition-all group relative overflow-hidden ${
                linksSection.visible
                  ? `animate-fade-scale delay-${(i + 3) * 100}`
                  : "opacity-0"
              }`;

              const inner = (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-chad-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4 badge-glow">
                      {item.iconContent}
                    </div>
                    <h3 className="text-white font-bold mb-1 group-hover:text-chad-green transition-colors">
                      {item.title}
                    </h3>
                    <p
                      className={`text-gray-500 font-mono truncate ${
                        item.isButton ? "text-xs" : "text-sm"
                      }`}
                    >
                      {item.sub}
                    </p>
                  </div>
                </>
              );

              if (item.isButton) {
                return (
                  <button
                    key={item.title}
                    onClick={copyCA}
                    className={`${classes} text-left`}
                  >
                    {inner}
                  </button>
                );
              }

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes}
                >
                  {inner}
                </a>
              );
            })}
          </div>

          {/* CA display box */}
          <button
            onClick={copyCA}
            className={`inline-block bg-chad-card rounded-xl px-8 py-4 border-glow hover:border-chad-green/40 transition-all cursor-pointer card-hover ${
              linksSection.visible
                ? "animate-fade-up delay-700"
                : "opacity-0"
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">CA (click to copy)</p>
            <p className="text-chad-green font-mono font-bold tracking-wide text-xs sm:text-sm break-all">
              {copied ? "Copied to clipboard!" : CA}
            </p>
          </button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="py-8 px-6 border-t border-chad-border text-center"
        style={{ background: "#08080c" }}
      >
        <p className="text-gray-600 text-sm">
          $CHADSEM is a community memecoin with no intrinsic value or
          expectation of financial return. For entertainment purposes only.
        </p>
        <p className="text-gray-700 text-xs mt-2">
          &copy; 2025 $CHADSEM Community
        </p>
      </footer>
    </div>
  );
}
