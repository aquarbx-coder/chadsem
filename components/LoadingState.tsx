export default function LoadingState({ message = "Analyzing data with AI..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-purple animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
      <div className="text-center">
        <p className="text-sm text-dark-400">{message}</p>
        <div className="flex items-center gap-1 justify-center mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}
