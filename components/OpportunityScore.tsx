interface OpportunityScoreProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function OpportunityScore({ score, label = "Score", size = "md" }: OpportunityScoreProps) {
  const getColor = (s: number) => {
    if (s >= 80) return { ring: "text-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-400" };
    if (s >= 60) return { ring: "text-cyan-400", bg: "bg-cyan-400/10", text: "text-cyan-400" };
    if (s >= 40) return { ring: "text-yellow-400", bg: "bg-yellow-400/10", text: "text-yellow-400" };
    return { ring: "text-red-400", bg: "bg-red-400/10", text: "text-red-400" };
  };

  const colors = getColor(score);
  const dims = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-20 h-20" : "w-16 h-16";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";
  const radius = size === "sm" ? 20 : size === "lg" ? 34 : 27;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${dims} flex items-center justify-center`}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colors.ring} transition-all duration-1000`}
          />
        </svg>
        <span className={`${textSize} font-bold ${colors.text}`}>{score}</span>
      </div>
      <span className="text-xs text-dark-500">{label}</span>
    </div>
  );
}
