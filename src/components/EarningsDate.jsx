import React from 'react';
import { Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default function EarningsDate({ data }) {
  if (!data) return null;

  const { date, daysUntil, hourLabel, epsEstimate, revenueEstimate, quarter, year } = data;

  const formatLargeNumber = (num) => {
    if (!num) return '—';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    return num.toLocaleString();
  };

  const getStatusColor = (days) => {
    if (days < 10) return 'bg-[#ff4f70]';
    if (days < 30) return 'bg-amber-500';
    return 'bg-[#00cfb4]';
  };

  const statusColor = getStatusColor(daysUntil);
  const isSoon = daysUntil <= 7;

  return (
    <div className="bg-[#0c0e14] border border-[#1d2030] rounded-3xl p-6 shadow-none font-['DM_Sans'] mb-6 relative overflow-hidden">
      {isSoon && (
        <div className="absolute top-4 right-4 bg-[#ff4f70]/10 border border-[#ff4f70]/20 px-3 py-1 rounded-full animate-pulse">
          <span className="text-[#ff4f70] text-[10px] font-bold uppercase tracking-widest">Earnings Soon</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-[#00cfb4]/10 rounded-lg">
          <Calendar size={18} className="text-[#00cfb4]" />
        </div>
        <h3 className="text-lg font-bold text-[#e6e9f4]">Next Earnings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-4xl font-bold text-[#00cfb4] font-['JetBrains_Mono'] tracking-tighter mb-1">
            In {daysUntil} days
          </div>
          <div className="flex items-center gap-2 text-sm text-[#8c92b5] font-medium">
            <span>{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{hourLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111318] border border-[#1d2030] p-4 rounded-2xl">
            <div className="flex items-center gap-1 text-[#8c92b5] text-[10px] font-bold uppercase tracking-widest mb-1">
              <TrendingUp size={12} />
              <span>EPS Est.</span>
            </div>
            <div className="text-xl font-bold text-[#e6e9f4] font-['JetBrains_Mono'] tracking-tight">
              ${epsEstimate?.toFixed(2) || '—'}
            </div>
          </div>
          <div className="bg-[#111318] border border-[#1d2030] p-4 rounded-2xl">
            <div className="flex items-center gap-1 text-[#8c92b5] text-[10px] font-bold uppercase tracking-widest mb-1">
              <DollarSign size={12} />
              <span>Rev Est.</span>
            </div>
            <div className="text-xl font-bold text-[#e6e9f4] font-['JetBrains_Mono'] tracking-tight">
              {formatLargeNumber(revenueEstimate)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <span className="text-[#8c92b5]">Progress to {quarter ? `Q${quarter} ` : ''}FY{year}</span>
            <span className="text-[#00cfb4]">{Math.max(0, 100 - (daysUntil / 120 * 100)).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#111318] rounded-full overflow-hidden">
            <div 
              className={`h-full ${statusColor} transition-all duration-1000 shadow-[0_0_10px_rgba(0,207,180,0.3)]`} 
              style={{ width: `${Math.max(5, 100 - (daysUntil / 120 * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
