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
  const forwardPe = data?.forwardPE || metrics?.forwardPe || 0;
  const eps = metrics.eps || data?.eps || 0;
  const revenue = data?.revenue || metrics.revenue || 0;
  const grossMargin = data?.grossMargin || metrics.grossMargin || 0;
  const mktCap = data?.marketCap || profile.marketCap || 0;

  const divYield = data?.dividendYield || metrics.dividendYield || 0;
  const annualDiv = divYield > 0 && data?.currentPrice ? (divYield * data.currentPrice).toFixed(2) : null;

  const stats = [
    { label: 'Market Cap', value: formatValue(mktCap, true) },
    { label: 'P/E Ratio', value: pe ? pe.toFixed(2) : '—' },
    { label: 'Forward P/E', value: forwardPe ? forwardPe.toFixed(2) : '—' },
    { label: 'Dividend Yield', value: divYield > 0 ? (divYield * 100).toFixed(2) + '%' : '—', sub: annualDiv ? `Est. $${annualDiv} / share annually` : null },
    { label: 'EPS (TTM)', value: eps ? '$' + eps.toFixed(2) : '—' },
    { label: 'Revenue', value: formatValue(revenue, true) },
    { label: 'Gross Margin', value: formatValue(grossMargin, false, true) },
    { label: '52W High', value: formatValue(data?.fiftyTwoWeekHigh || metrics.fiftyTwoWeekHigh, true) },
    { label: '52W Low', value: formatValue(data?.fiftyTwoWeekLow || metrics.fiftyTwoWeekLow, true) },
    { label: 'Volume', value: formatValue(data?.volume) },
  ];

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <h3 className="text-base sm:text-lg font-bold text-primary mb-6 sm:mb-8 tracking-tight">Financial Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 sm:gap-y-10 gap-x-4 sm:gap-x-6">
        {stats.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-widest">
              {m.label}
            </span>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-primary font-['JetBrains_Mono'] tracking-tighter leading-tight">
                {m.value}
              </span>
              {m.sub && (
                <span className="text-[8px] sm:text-[9px] font-medium text-[#454866] mt-1 uppercase tracking-wider leading-tight">
                  {m.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
