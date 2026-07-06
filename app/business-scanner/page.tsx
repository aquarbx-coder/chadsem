"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";

interface Business {
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  types?: string[];
  website?: string;
  hasWebsite: boolean;
}

interface Pitch {
  subject: string;
  body: string;
  followUp: string;
  tips: string[];
}

interface BusinessData {
  totalBusinesses: number;
  noWebsiteCount: number;
  noWebsiteBusinesses: Business[];
  allBusinesses: Business[];
  pitch?: Pitch;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(full)}
      {half && "½"}
      {"☆".repeat(empty)}
      <span className="text-gray-500 ml-1 text-xs">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function BusinessScannerPage() {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const openaiKey = localStorage.getItem("oai_openai_key");
    const googlePlacesKey = localStorage.getItem("oai_google_places_key");

    const parts = query.split("|||");
    const category = parts[0]?.trim();

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          location: location || undefined,
          openaiKey,
          googlePlacesKey,
        }),
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
            <span className="text-emerald-400">Business</span> Scanner
          </h1>
          <p className="text-gray-400 text-lg">
            Find local businesses without websites — perfect leads for web design, SEO, and digital marketing services.
          </p>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Business category (e.g., restaurants, dentists)"
          secondaryPlaceholder="City/Location"
          onSearch={handleSearch}
          onSecondaryChange={setLocation}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <LoadingState message="Scanning Google Maps for businesses... This may take a moment." />
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
        {data && !loading && (
          <div className="mt-10 space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center">
                <p className="text-3xl font-bold text-emerald-400">{data.totalBusinesses}</p>
                <p className="text-sm text-gray-400 mt-1">Total Businesses</p>
              </div>
              <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center">
                <p className="text-3xl font-bold text-red-400">{data.noWebsiteCount}</p>
                <p className="text-sm text-gray-400 mt-1">Without Website</p>
              </div>
            </div>

            {/* No Website Businesses */}
            {data.noWebsiteBusinesses && data.noWebsiteBusinesses.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
                  Businesses Without Websites
                </h2>
                <div className="space-y-3">
                  {data.noWebsiteBusinesses.map((biz, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-gray-800/50 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-100 font-medium">{biz.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{biz.address}</p>
                          {biz.phone && (
                            <p className="text-sm text-gray-500 mt-0.5">{biz.phone}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {biz.rating != null && <StarRating rating={biz.rating} />}
                        </div>
                      </div>
                      {biz.types && biz.types.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {biz.types.map((type, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 border border-gray-600/30"
                            >
                              {type.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Businesses */}
            {data.allBusinesses && data.allBusinesses.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                  All Businesses
                </h2>
                <div className="space-y-3">
                  {data.allBusinesses.map((biz, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/40 hover:border-gray-600/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-100 font-medium">{biz.name}</p>
                            {biz.hasWebsite ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Has Website
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                                No Website
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{biz.address}</p>
                          {biz.phone && (
                            <p className="text-sm text-gray-500 mt-0.5">{biz.phone}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {biz.rating != null && <StarRating rating={biz.rating} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Pitch Template */}
            {data.pitch && (
              <ResultCard title="AI Pitch Template" icon="📧" accentColor="emerald">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Subject Line</p>
                    <p className="text-gray-200 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50">
                      {data.pitch.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Body</p>
                    <p className="text-gray-300 bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50 whitespace-pre-wrap">
                      {data.pitch.body}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Follow-Up</p>
                    <p className="text-gray-300 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50">
                      {data.pitch.followUp}
                    </p>
                  </div>
                  {data.pitch.tips && data.pitch.tips.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Tips</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                        {data.pitch.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ResultCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
