"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import OpportunityScore from "@/components/OpportunityScore";
import LoadingState from "@/components/LoadingState";

interface Product {
  name: string;
  trendScore: number;
  competition: string;
  profitPotential: string;
  suggestedNiche: string;
  reasoning: string;
  targetAudience: string;
}

interface ProductData {
  products: Product[];
}

function CompetitionBadge({ level }: { level: string }) {
  const lower = level.toLowerCase();
  let colorClasses = "bg-gray-500/15 text-gray-400 border-gray-500/30";
  if (lower === "low") {
    colorClasses = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  } else if (lower === "medium") {
    colorClasses = "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  } else if (lower === "high") {
    colorClasses = "bg-red-500/15 text-red-400 border-red-500/30";
  }
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${colorClasses}`}>
      {level} Competition
    </span>
  );
}

function ProfitBadge({ level }: { level: string }) {
  const lower = level.toLowerCase();
  let colorClasses = "bg-gray-500/15 text-gray-400 border-gray-500/30";
  if (lower === "high" || lower === "very high") {
    colorClasses = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  } else if (lower === "medium") {
    colorClasses = "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  } else if (lower === "low") {
    colorClasses = "bg-orange-500/15 text-orange-400 border-orange-500/30";
  }
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${colorClasses}`}>
      {level} Profit
    </span>
  );
}

export default function ProductFinderPage() {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const openaiKey = localStorage.getItem("oai_openai_key");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, openaiKey }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || `Request failed with status ${res.status}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-cyan-400">Product</span> Trend Finder
          </h1>
          <p className="text-gray-400 text-lg">
            Discover trending product opportunities with AI-powered market analysis. Find winning products before they go mainstream.
          </p>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search for product trends (e.g., home fitness, pet accessories)"
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <LoadingState message="Analyzing product trends and market data..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 p-5 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur">
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && data.products && data.products.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
              Trending Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.products.map((product, idx) => (
                <ResultCard
                  key={idx}
                  title={product.name}
                  icon="📦"
                  accentColor="cyan"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex flex-wrap gap-2">
                        <CompetitionBadge level={product.competition} />
                        <ProfitBadge level={product.profitPotential} />
                      </div>
                      <OpportunityScore
                        score={product.trendScore}
                        label="Trend"
                        size="sm"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Suggested Niche</p>
                      <p className="text-gray-300 text-sm">{product.suggestedNiche}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Reasoning</p>
                      <p className="text-gray-400 text-sm">{product.reasoning}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Target Audience</p>
                      <p className="text-gray-400 text-sm">{product.targetAudience}</p>
                    </div>
                  </div>
                </ResultCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
