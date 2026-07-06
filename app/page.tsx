"use client";

import { useEffect, useState } from "react";

const CA = "HTW3Q9CxmwTKVQfQCVLiXf1D3bx55WRAn21GRC9Dpump";
const PUMP_URL = "https://pump.fun/coin/HTW3Q9CxmwTKVQfQCVLiXf1D3bx55WRAn21GRC9Dpump";
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

          if (virtualSolReserves && virtualTokenReserves && virtualTokenReserves > 0) {
            const solPrice = mcap && data.total_supply
              ? (mcap / (Number(data.total_supply) / 1e6)) / (virtualSolReserves / virtualTokenReserves)
              : null;

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
        // silently fail — stats just show dashes
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
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-chad-dark/90 backdrop-blur-md border-b border-chad-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-chad-green">$CHADSEM</span>
          <div className="hidden sm:flex gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-chad-green transition-colors">
              About
            </a>
            <a href="#stats" className="hover:text-chad-green transition-colors">
              Stats
            </a>
            <a
              href="#tokenomics"
              className="hover:text-chad-green transition-colors"
            >
              Purpose
            </a>
            <a href="#links" className="hover:text-chad-green transition-colors">
              Links
            </a>
          </div>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-chad-green/10 text-chad-green border border-chad-green/30 rounded-lg hover:bg-chad-green/20 transition-all"
          >
            Twitter
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden grid-bg">
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
            className="animate-sway w-[350px] xl:w-[420px] h-auto drop-shadow-[0_0_40px_rgba(0,255,136,0.2)]"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto lg:text-left lg:mr-auto lg:ml-[8%] xl:ml-[12%]">
          {/* Mobile mascot */}
          <div className="lg:hidden mx-auto mb-8 w-48 h-48">
            <img
              src="/mascot.png"
              alt="CHADSEM Mascot"
              className="animate-sway w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            />
          </div>

          <div className="inline-block px-4 py-1.5 bg-chad-green/10 border border-chad-green/20 rounded-full text-chad-green text-xs font-semibold tracking-wider uppercase mb-6">
            Live on Solana
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-4 text-glow">
            <span className="text-chad-green">$CHAD</span>
            <span className="text-white">SEM</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 mb-2 font-medium">
            From the trenches to the top.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-lg lg:mx-0 mx-auto">
            The community memecoin honoring the king of Solana calls. Built by
            degens, for degens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-green text-black font-bold rounded-xl hover:bg-chad-green/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all text-lg"
            >
              Follow on Twitter
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-card border border-chad-border text-white font-bold rounded-xl hover:border-chad-green/40 transition-all text-lg"
            >
              Buy on Pump.fun
            </a>
          </div>

          {/* CA in hero */}
          <button
            onClick={copyCA}
            className="inline-flex items-center gap-2 bg-chad-card rounded-xl px-6 py-3 border-glow hover:border-chad-green/40 transition-all cursor-pointer group"
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

      {/* Live Stats */}
      <section id="stats" className="py-24 px-6 relative noise-bg" style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chad-green/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chad-green/20 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Live <span className="text-chad-green">Stats</span>
          </h2>
          <p className="text-gray-500 mb-2 text-lg">
            Real-time data from Pump.fun
          </p>
          <p className="text-gray-600 text-xs mb-12">
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
              <div className="bg-chad-card rounded-2xl p-6 border-glow card-glow">
                <p className="text-gray-500 text-sm mb-2">Price</p>
                <p className="text-white text-2xl font-bold">
                  {formatPrice(stats.priceUsd)}
                </p>
              </div>
              <div className="bg-chad-card rounded-2xl p-6 border-glow card-glow">
                <p className="text-gray-500 text-sm mb-2">Market Cap</p>
                <p className="text-white text-2xl font-bold">
                  {formatNumber(stats.marketCap)}
                </p>
              </div>
              <div className="bg-chad-card rounded-2xl p-6 border-glow card-glow sm:col-span-2 lg:col-span-1">
                <p className="text-gray-500 text-sm mb-2">Liquidity</p>
                <p className="text-white text-2xl font-bold">
                  {formatNumber(stats.liquidity)}
                </p>
              </div>
            </div>
          )}

          <a
            href={PUMP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 text-sm text-chad-green/70 hover:text-chad-green transition-colors"
          >
            View on Pump.fun &rarr;
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 relative" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-chad-green/3 rounded-full blur-[150px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[120px] -translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-center">
            Who is <span className="text-chad-green">Ansem</span>?
          </h2>
          <p className="text-gray-500 text-center mb-12 text-lg">
            @blknoiz06 — The legend behind the calls
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-10 h-10 rounded-lg bg-chad-green/10 flex items-center justify-center mb-4">
                <span className="text-chad-green text-lg font-bold">01</span>
              </div>
              <h3 className="text-chad-green font-bold text-lg mb-3">
                The Trench King
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ansem (@blknoiz06) became one of the most influential voices in
                crypto Twitter. Known for his early Solana calls and fearless
                market takes, he built a massive following of degens who trusted
                his vision when no one else was paying attention.
              </p>
            </div>
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-10 h-10 rounded-lg bg-chad-green/10 flex items-center justify-center mb-4">
                <span className="text-chad-green text-lg font-bold">02</span>
              </div>
              <h3 className="text-chad-green font-bold text-lg mb-3">
                Community Builder
              </h3>
              <p className="text-gray-400 leading-relaxed">
                While others chased hype, Ansem stayed in the trenches. He
                shared alpha, called bottoms, and helped countless community
                members navigate the chaos of crypto. His dedication to the
                culture made him a legend.
              </p>
            </div>
            <div className="md:col-span-2 bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-10 h-10 rounded-lg bg-chad-green/10 flex items-center justify-center mb-4">
                <span className="text-chad-green text-lg font-bold">03</span>
              </div>
              <h3 className="text-chad-green font-bold text-lg mb-3">
                Why $CHADSEM?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                $CHADSEM is a tribute to everything Ansem represents — the grit,
                the calls, the community. This isn&apos;t just another memecoin.
                It&apos;s a movement built by the people who were in the
                trenches, for the people who understand what it means to hold
                through the noise. No VC backing, no insider deals — just pure,
                unfiltered community energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics / Purpose */}
      <section id="tokenomics" className="py-24 px-6 relative noise-bg" style={{ background: "linear-gradient(180deg, #0d0d15 0%, #0a0a0f 50%, #0d0d15 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chad-green/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-chad-green/20 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Pure <span className="text-chad-green">Market Presence</span>
          </h2>
          <p className="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">
            No roadmap fluff. No empty promises. Just community and culture.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                Community Driven
              </h3>
              <p className="text-gray-500 text-sm">
                No team tokens. No dev allocation. 100% for the people in the
                trenches.
              </p>
            </div>
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Fluff</h3>
              <p className="text-gray-500 text-sm">
                We don&apos;t need a 50-page whitepaper. The culture speaks for
                itself.
              </p>
            </div>
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                Market Energy
              </h3>
              <p className="text-gray-500 text-sm">
                Built on Solana. Fast, cheap, and ready for the next wave.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Links / Community */}
      <section id="links" className="py-24 px-6 relative" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0e0e18 50%, #0a0a0f 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-chad-green/3 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Join the <span className="text-chad-green">Movement</span>
          </h2>
          <p className="text-gray-500 mb-12 text-lg">
            Get in before the rest figure it out.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-chad-card rounded-2xl p-8 border-glow card-glow hover:border-chad-green/40 transition-all group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <span className="text-chad-green text-xl font-bold">X</span>
              </div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-green transition-colors">
                Twitter
              </h3>
              <p className="text-gray-500 text-sm">@ChadsemCoin</p>
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-chad-card rounded-2xl p-8 border-glow card-glow hover:border-chad-green/40 transition-all group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-green transition-colors">
                Pump.fun
              </h3>
              <p className="text-gray-500 text-sm">Buy Now</p>
            </a>
            <button
              onClick={copyCA}
              className="bg-chad-card rounded-2xl p-8 border-glow card-glow hover:border-chad-green/40 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-chad-green/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-green transition-colors">
                Contract Address
              </h3>
              <p className="text-gray-500 text-xs font-mono truncate">
                {copied ? "Copied!" : CA}
              </p>
            </button>
          </div>

          {/* CA display box */}
          <button
            onClick={copyCA}
            className="inline-block bg-chad-card rounded-xl px-8 py-4 border-glow hover:border-chad-green/40 transition-all cursor-pointer"
          >
            <p className="text-sm text-gray-500 mb-1">CA (click to copy)</p>
            <p className="text-chad-green font-mono font-bold tracking-wide text-xs sm:text-sm break-all">
              {copied ? "Copied to clipboard!" : CA}
            </p>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-chad-border text-center" style={{ background: "#08080c" }}>
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
