import React from "react";
import * as Icons from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    type: "up" | "down" | "neutral";
    value: string;
  };
  colorClass?: string; // e.g. text-indigo-600 bg-indigo-50
  id?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  trend,
  colorClass = "text-indigo-600 bg-indigo-50",
  id
}) => {
  const IconComponent = (Icons as any)[icon] || Icons.TrendingUp;

  return (
    <div
      id={id || `stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
    >
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-900 leading-none mb-2">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-bold flex items-center ${
                trend.type === "up"
                  ? "text-emerald-600"
                  : trend.type === "down"
                  ? "text-rose-600"
                  : "text-gray-500"
              }`}
            >
              {trend.type === "up" ? "▲" : trend.type === "down" ? "▼" : "•"} {trend.value}
            </span>
            <span className="text-[10px] text-gray-400">vs bulan lalu</span>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <IconComponent className="w-6 h-6 stroke-[2.2px]" />
      </div>
    </div>
  );
};
