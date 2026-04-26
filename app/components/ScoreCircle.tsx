"use client";

interface ScoreCircleProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreCircle({ score, label, sublabel, size = "md" }: ScoreCircleProps) {
  const sizes = {
    sm: { circle: 80, stroke: 6, r: 32, fontSize: "text-xl" },
    md: { circle: 110, stroke: 8, r: 44, fontSize: "text-2xl" },
    lg: { circle: 140, stroke: 10, r: 56, fontSize: "text-3xl" },
  };

  const s = sizes[size];
  const circumference = 2 * Math.PI * s.r;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 75) return { stroke: "#22c55e", text: "text-green-600", bg: "bg-green-50" };
    if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50" };
    return { stroke: "#ef4444", text: "text-red-600", bg: "bg-red-50" };
  };

  const colors = getColor(score);
  const center = s.circle / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`rounded-2xl p-4 ${colors.bg}`}>
        <svg width={s.circle} height={s.circle}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={s.r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={s.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={s.r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
          {/* Score text */}
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`${s.fontSize} font-bold`}
            fill={colors.stroke}
            fontSize={size === "lg" ? 28 : size === "md" ? 22 : 18}
            fontWeight="bold"
          >
            {score}%
          </text>
        </svg>
      </div>
      <span className="text-sm font-semibold text-slate-700 text-center">{label}</span>
      {sublabel && <span className="text-xs text-slate-500 text-center">{sublabel}</span>}
    </div>
  );
}
