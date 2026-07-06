import Link from "next/link";

const features = [
  {
    href: "/reddit-scanner",
    title: "Reddit Pain Point Scanner",
    description: "Discover unmet needs by scanning Reddit for frustrations, wishes, and complaints in any niche.",
    gradient: "from-orange-500 to-red-500",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: "/business-scanner",
    title: "Business Scanner",
    description: "Find local businesses without websites — perfect for web design & digital marketing agencies.",
    gradient: "from-emerald-500 to-teal-500",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    href: "/product-finder",
    title: "Product Trend Finder",
    description: "Identify trending products with high profit potential for dropshipping and e-commerce.",
    gradient: "from-cyan-500 to-blue-500",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    href: "/course-finder",
    title: "Digital Course Finder",
    description: "Discover high-demand topics where people are looking to learn but supply is limited.",
    gradient: "from-purple-500 to-pink-500",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">Discover Business Opportunities</span>
        </h1>
        <p className="text-dark-400 text-lg max-w-2xl">
          Use AI to scan real data sources and uncover untapped markets, unmet needs, and profitable niches.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="glass rounded-2xl p-6 glass-hover transition-all duration-300 group block"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
              {feature.icon}
            </div>
            <h2 className="text-lg font-semibold text-white mb-2 group-hover:gradient-text transition-all">
              {feature.title}
            </h2>
            <p className="text-sm text-dark-400 leading-relaxed">
              {feature.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-dark-500 group-hover:text-accent-blue transition-colors">
              Get started
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats/Info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue text-sm font-bold shrink-0">1</span>
            <div>
              <p className="text-sm text-white font-medium">Add API Keys</p>
              <p className="text-xs text-dark-500">Configure OpenAI + Reddit keys in Settings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-purple/10 text-accent-purple text-sm font-bold shrink-0">2</span>
            <div>
              <p className="text-sm text-white font-medium">Pick a Scanner</p>
              <p className="text-xs text-dark-500">Choose a tool based on your business model</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-emerald/10 text-accent-emerald text-sm font-bold shrink-0">3</span>
            <div>
              <p className="text-sm text-white font-medium">Get AI Insights</p>
              <p className="text-xs text-dark-500">AI analyzes real data and scores opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
