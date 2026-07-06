interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
}

export default function ResultCard({ title, children, icon, accentColor = "from-accent-blue to-accent-purple" }: ResultCardProps) {
  return (
    <div className="glass rounded-xl p-5 glass-hover transition-all duration-300 group">
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <div className={`p-2 rounded-lg bg-gradient-to-br ${accentColor} bg-opacity-20 shrink-0`}>
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-white text-sm leading-relaxed">{title}</h3>
      </div>
      <div className="text-sm text-dark-400 leading-relaxed">{children}</div>
    </div>
  );
}
