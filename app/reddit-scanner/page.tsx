"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import OpportunityScore from "@/components/OpportunityScore";
import LoadingState from "@/components/LoadingState";

interface ExamplePost {
  title: string;
  url?: string;
}

interface Opportunity {
  theme: string;
  summary: string;
  score: number;
  frequency: string;
  examplePosts: ExamplePost[];
  productIdea: string;
  targetMarket: string;
}

interface SourcePost {
  title: string;
  subreddit: string;
  score: number;
  url?: string;
}

interface RedditData {
  opportunities: Opportunity[];
  posts: SourcePost[];
}

export default function RedditScannerPage() {
  const [data, setData] = useState<RedditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subreddit, setSubreddit] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const openaiKey = localStorage.getItem("oai_openai_key");
    const redditClientId = localStorage.getItem("oai_reddit_client_id");
    const redditClientSecret = localStorage.getItem("oai_reddit_client_secret");

    const parts = query.split("|||");
    const topic = parts[0]?.trim();

    try {
      const res = await fetch("/api/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          subreddit: subreddit || undefined,
          openaiKey,
          redditClientId,
          redditClientSecret,
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
            <span className="text-orange-400">Reddit</span> Pain Point Scanner
          </h1>
          <p className="text-gray-400 text-lg">
            Discover real problems people are complaining about on Reddit and uncover product opportunities backed by genuine user frustration.
          </p>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Enter a topic (e.g., project management, fitness tracking)"
          secondaryPlaceholder="Subreddit (optional)"
          onSearch={handleSearch}
          onSecondaryChange={setSubreddit}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <LoadingState message="Scanning Reddit for pain points... This may take a moment." />
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
            {/* Opportunities */}
            {data.opportunities && data.opportunities.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-orange-400">
                  Opportunities Found
                </h2>
                {data.opportunities.map((opp, idx) => (
                  <ResultCard
                    key={idx}
                    title={opp.theme}
                    icon="🔥"
                    accentColor="orange"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300">{opp.summary}</p>
                        </div>
                        <OpportunityScore score={opp.score} label="Opportunity" />
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                          Frequency: {opp.frequency}
                        </span>
                      </div>

                      {/* Example Posts */}
                      {opp.examplePosts && opp.examplePosts.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Example Posts:</p>
                          <div className="space-y-2">
                            {opp.examplePosts.slice(0, 2).map((post, pIdx) => (
                              <div
                                key={pIdx}
                                className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50"
                              >
                                {post.url ? (
                                  <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-300 transition-colors"
                                  >
                                    {post.title}
                                  </a>
                                ) : (
                                  post.title
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Idea */}
                      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50">
                        <p className="text-sm text-gray-500 mb-1">Product Idea</p>
                        <p className="text-gray-200">{opp.productIdea}</p>
                      </div>

                      {/* Target Market */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Target Market</p>
                        <p className="text-gray-300">{opp.targetMarket}</p>
                      </div>
                    </div>
                  </ResultCard>
                ))}
              </div>
            )}

            {/* Source Posts */}
            {data.posts && data.posts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                  Source Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.posts.map((post, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-orange-500/30 transition-colors"
                    >
                      <p className="text-sm text-gray-200 font-medium leading-snug">
                        {post.url ? (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-300 transition-colors"
                          >
                            {post.title}
                          </a>
                        ) : (
                          post.title
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="text-orange-400/70">r/{post.subreddit}</span>
                        <span>Score: {post.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
