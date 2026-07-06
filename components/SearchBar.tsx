"use client";

import { useState } from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  secondaryPlaceholder?: string;
  onSecondaryChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder,
  onSearch,
  loading,
  secondaryPlaceholder,
  onSecondaryChange,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [secondary, setSecondary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(secondaryPlaceholder ? `${query}|||${secondary}` : query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/25 transition-all"
          />
        </div>
        {secondaryPlaceholder && (
          <div className="w-48">
            <input
              type="text"
              value={secondary}
              onChange={(e) => {
                setSecondary(e.target.value);
                onSecondaryChange?.(e.target.value);
              }}
              placeholder={secondaryPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/25 transition-all"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
}
