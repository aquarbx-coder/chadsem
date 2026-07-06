"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import OpportunityScore from "@/components/OpportunityScore";
import LoadingState from "@/components/LoadingState";

interface Course {
  topic: string;
  demandScore: number;
  competition: string;
  supplyGap: string;
  suggestedOutline: string[];
  targetAudience: string;
  estimatedPrice: string;
}

interface SourcePost {
  title: string;
  subreddit: string;
  score: number;
  url?: string;
}

interface CourseData {
  courses: Course[];
  posts: SourcePost[];
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

export default function CourseFinderPage() {
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const openaiKey = localStorage.getItem("oai_openai_key");
    const redditClientId = localStorage.getItem("oai_reddit_client_id");
    const redditClientSecret = localStorage.getItem("oai_reddit_client_secret");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: query,
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
            <span className="text-purple-400">Course</span> Idea Finder
          </h1>
          <p className="text-gray-400 text-lg">
            Discover high-demand digital course topics by analyzing what people are asking to learn on Reddit.
          </p>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Enter a topic (e.g., Python, graphic design, investing)"
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10">
            <LoadingState message="Analyzing course demand and supply gaps..." />
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
            {/* Course Ideas */}
            {data.courses && data.courses.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-400 mb-6">
                  Course Ideas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.courses.map((course, idx) => (
                    <ResultCard
                      key={idx}
                      title={course.topic}
                      icon="🎓"
                      accentColor="purple"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <CompetitionBadge level={course.competition} />
                          <OpportunityScore
                            score={course.demandScore}
                            label="Demand"
                            size="sm"
                          />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Supply Gap</p>
                          <p className="text-gray-300 text-sm">{course.supplyGap}</p>
                        </div>

                        {/* Suggested Outline */}
                        {course.suggestedOutline && course.suggestedOutline.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Suggested Outline</p>
                            <ol className="list-none space-y-1">
                              {course.suggestedOutline.map((item, oIdx) => (
                                <li
                                  key={oIdx}
                                  className="text-sm text-gray-400 flex gap-2"
                                >
                                  <span className="text-purple-400/70 font-medium shrink-0">
                                    {oIdx + 1}.
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Target Audience</p>
                          <p className="text-gray-400 text-sm">{course.targetAudience}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                          <p className="text-sm text-gray-500">Estimated Price</p>
                          <p className="text-purple-300 font-semibold">
                            {course.estimatedPrice}
                          </p>
                        </div>
                      </div>
                    </ResultCard>
                  ))}
                </div>
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
                      className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                    >
                      <p className="text-sm text-gray-200 font-medium leading-snug">
                        {post.url ? (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-300 transition-colors"
                          >
                            {post.title}
                          </a>
                        ) : (
                          post.title
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="text-purple-400/70">r/{post.subreddit}</span>
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
