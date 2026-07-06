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
          `https://api.dexscreener.com/latest/dex/tokens/${CA}`
        );
        const data = await res.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setStats({
            priceUsd: pair.priceUsd,
            marketCap: pair.marketCap ?? pair.fdv ?? null,
            volume24h: pair.volume?.h24 ?? null,
            liquidity: pair.liquidity?.usd ?? null,
            priceChange24h: pair.priceChange?.h24 ?? null,
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
      <nav className="fixed top-0 w-full z-50 bg-chad-dark/80 backdrop-blur-md border-b border-chad-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-chad-gold">$CHADSEM</span>
          <div className="hidden sm:flex gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-chad-gold transition-colors">
              About
            </a>
            <a href="#stats" className="hover:text-chad-gold transition-colors">
              Stats
            </a>
            <a
              href="#tokenomics"
              className="hover:text-chad-gold transition-colors"
            >
              Purpose
            </a>
            <a href="#links" className="hover:text-chad-gold transition-colors">
              Links
            </a>
          </div>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-chad-gold/10 text-chad-gold border border-chad-gold/30 rounded-lg hover:bg-chad-gold/20 transition-all"
          >
            Twitter
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-chad-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-chad-orange/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mx-auto mb-8 w-40 h-40 rounded-full bg-chad-card border-2 border-chad-gold/30 flex items-center justify-center animate-float card-glow">
            <span className="text-5xl">🗿</span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-4 text-glow">
            <span className="text-chad-gold">$CHAD</span>
            <span className="text-white">SEM</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 mb-2 font-medium">
            From the trenches to the top.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-lg mx-auto">
            The community memecoin honoring the king of Solana calls. Built by
            degens, for degens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-gold text-black font-bold rounded-xl hover:bg-chad-gold/90 transition-all text-lg"
            >
              Follow on Twitter
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-chad-card border border-chad-border text-white font-bold rounded-xl hover:border-chad-gold/40 transition-all text-lg"
            >
              Buy on Pump.fun
            </a>
          </div>

          {/* CA in hero */}
          <button
            onClick={copyCA}
            className="inline-flex items-center gap-2 bg-chad-card rounded-xl px-6 py-3 border-glow hover:border-chad-gold/40 transition-all cursor-pointer group"
          >
            <span className="text-xs text-gray-500">CA:</span>
            <span className="text-chad-gold font-mono text-xs sm:text-sm truncate max-w-[280px] sm:max-w-none">
              {CA}
            </span>
            <span className="text-gray-500 group-hover:text-chad-gold transition-colors text-xs">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>
      </section>

      {/* Live Stats */}
      <section id="stats" className="py-24 px-6 bg-chad-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Live <span className="text-chad-gold">Stats</span>
          </h2>
          <p className="text-gray-500 mb-2 text-lg">
            Real-time data from DexScreener
          </p>
          <p className="text-gray-600 text-xs mb-12">
            Auto-refreshes every 30 seconds
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-chad-dark rounded-2xl p-6 border-glow animate-pulse"
                >
                  <div className="h-4 bg-gray-800 rounded w-20 mx-auto mb-3" />
                  <div className="h-8 bg-gray-800 rounded w-28 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-chad-dark rounded-2xl p-6 border-glow">
                <p className="text-gray-500 text-sm mb-2">Price</p>
                <p className="text-white text-2xl font-bold">
                  {formatPrice(stats.priceUsd)}
                </p>
                {stats.priceChange24h !== null && (
                  <p
                    className={`text-sm mt-1 font-medium ${
                      stats.priceChange24h >= 0
                        ? "text-chad-green"
                        : "text-red-500"
                    }`}
                  >
                    {stats.priceChange24h >= 0 ? "+" : ""}
                    {stats.priceChange24h.toFixed(2)}% (24h)
                  </p>
                )}
              </div>
              <div className="bg-chad-dark rounded-2xl p-6 border-glow">
                <p className="text-gray-500 text-sm mb-2">Market Cap</p>
                <p className="text-white text-2xl font-bold">
                  {formatNumber(stats.marketCap)}
                </p>
              </div>
              <div className="bg-chad-dark rounded-2xl p-6 border-glow">
                <p className="text-gray-500 text-sm mb-2">24h Volume</p>
                <p className="text-white text-2xl font-bold">
                  {formatNumber(stats.volume24h)}
                </p>
              </div>
              <div className="bg-chad-dark rounded-2xl p-6 border-glow">
                <p className="text-gray-500 text-sm mb-2">Liquidity</p>
                <p className="text-white text-2xl font-bold">
                  {formatNumber(stats.liquidity)}
                </p>
              </div>
            </div>
          )}

          <a
            href={`https://dexscreener.com/solana/${CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 text-sm text-chad-gold/70 hover:text-chad-gold transition-colors"
          >
            View on DexScreener &rarr;
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-center">
            Who is <span className="text-chad-gold">Ansem</span>?
          </h2>
          <p className="text-gray-500 text-center mb-12 text-lg">
            @blknoiz06 — The legend behind the calls
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-chad-card rounded-2xl p-8 border-glow card-glow">
              <h3 className="text-chad-gold font-bold text-lg mb-3">
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
              <h3 className="text-chad-gold font-bold text-lg mb-3">
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
              <h3 className="text-chad-gold font-bold text-lg mb-3">
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
      <section id="tokenomics" className="py-24 px-6 bg-chad-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Pure <span className="text-chad-gold">Market Presence</span>
          </h2>
          <p className="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">
            No roadmap fluff. No empty promises. Just community and culture.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-chad-dark rounded-2xl p-8 border-glow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Community Driven
              </h3>
              <p className="text-gray-500 text-sm">
                No team tokens. No dev allocation. 100% for the people in the
                trenches.
              </p>
            </div>
            <div className="bg-chad-dark rounded-2xl p-8 border-glow">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-white font-bold text-lg mb-2">No Fluff</h3>
              <p className="text-gray-500 text-sm">
                We don&apos;t need a 50-page whitepaper. The culture speaks for
                itself.
              </p>
            </div>
            <div className="bg-chad-dark rounded-2xl p-8 border-glow">
              <div className="text-4xl mb-4">📈</div>
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
      <section id="links" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Join the <span className="text-chad-gold">Movement</span>
          </h2>
          <p className="text-gray-500 mb-12 text-lg">
            Get in before the rest figure it out.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-chad-card rounded-2xl p-8 border-glow hover:border-chad-gold/40 transition-all group"
            >
              <div className="text-3xl mb-3">𝕏</div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-gold transition-colors">
                Twitter
              </h3>
              <p className="text-gray-500 text-sm">@ChadsemCoin</p>
            </a>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-chad-card rounded-2xl p-8 border-glow hover:border-chad-gold/40 transition-all group"
            >
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-gold transition-colors">
                Pump.fun
              </h3>
              <p className="text-gray-500 text-sm">Buy Now</p>
            </a>
            <button
              onClick={copyCA}
              className="bg-chad-card rounded-2xl p-8 border-glow hover:border-chad-gold/40 transition-all group text-left"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-white font-bold mb-1 group-hover:text-chad-gold transition-colors">
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
            className="inline-block bg-chad-card rounded-xl px-8 py-4 border-glow hover:border-chad-gold/40 transition-all cursor-pointer"
          >
            <p className="text-sm text-gray-500 mb-1">CA (click to copy)</p>
            <p className="text-chad-gold font-mono font-bold tracking-wide text-xs sm:text-sm break-all">
              {copied ? "Copied to clipboard!" : CA}
            </p>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-chad-border text-center">
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
