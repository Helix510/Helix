import React from 'react';

export default function FinancialsGrid({ data, financials }) {
  const formatValue = (val, isMoney = false, isPercent = false) => {
    if (val === null || val === undefined || val === 0) {
       if (val !== 0) return '—';
    }
    
    if (isPercent) return (Number(val) <= 1 ? (Number(val) * 100).toFixed(2) : Number(val).toFixed(2)) + '%';
    
    const num = Number(val);
    if (isNaN(num)) return '—';
    
    if (num >= 1e12) return (isMoney ? '$' : '') + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (isMoney ? '$' : '') + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (isMoney ? '$' : '') + (num / 1e6).toFixed(2) + 'M';
    
    return isMoney ? '$' + num.toLocaleString() : num.toLocaleString();
  };

  // Mappings with fallbacks to financials (new structure)
  const metrics = financials?.metrics || {};
  const profile = financials?.profile || {};
  
  const pe = metrics?.peRatio || data?.peRatio || 0;
  const eps = metrics.eps || data?.eps || 0;
  const revenue = data?.revenue || metrics.revenue || 0;
  const grossMargin = data?.grossMargin || metrics.grossMargin || 0;
  const mktCap = data?.marketCap || profile.marketCap || 0;

  const stats = [
    { label: 'Market Cap', value: formatValue(mktCap, true) },
    { label: 'P/E Ratio', value: pe ? pe.toFixed(2) : '—' },
    { label: 'EPS (TTM)', value: eps ? '$' + eps.toFixed(2) : '—' },
    { label: 'Revenue', value: formatValue(revenue, true) },
    { label: 'Gross Margin', value: formatValue(grossMargin, false, true) },
    { label: '52W High', value: formatValue(data?.fiftyTwoWeekHigh || metrics.fiftyTwoWeekHigh, true) },
    { label: '52W Low', value: formatValue(data?.fiftyTwoWeekLow || metrics.fiftyTwoWeekLow, true) },
    { label: 'Volume', value: formatValue(data?.volume) },
  ];

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <h3 className="text-lg font-bold text-primary mb-8 tracking-tight">Financial Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {stats.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
              {m.label}
            </span>
            <span className="text-2xl font-bold text-primary font-['JetBrains_Mono'] tracking-tighter">
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
