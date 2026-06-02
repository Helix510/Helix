import React from 'react';

export default function ValuationGrid({ data }) {
  const { quote, stats } = data;

  const metrics = [
    { label: 'P/E Ratio', value: quote.trailingPE, sector: 24.5 },
    { label: 'P/S Ratio', value: quote.priceToSales, sector: 4.2 },
    { label: 'P/B Ratio', value: stats.priceToBook, sector: 3.8 },
    { label: 'EV/EBITDA', value: quote.enterpriseToEbitda, sector: 18.2 },
    { label: 'PEG Ratio', value: stats.pegRatio, sector: 1.5 },
    { label: 'Fwd P/E', value: quote.forwardPE, sector: 21.0 }
  ];

  const getStatus = (val, sector) => {
    if (!val) return { label: 'N/A', color: 'bg-muted' };
    const ratio = val / sector;
    if (ratio < 0.8) return { label: 'CHEAP', color: 'bg-success/20 text-success' };
    if (ratio < 1.2) return { label: 'FAIR', color: 'bg-warning/20 text-warning' };
    return { label: 'EXPENSIVE', color: 'bg-danger/20 text-danger' };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-mono font-black text-muted uppercase tracking-[0.2em] ml-1">Valuation Multiples</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const status = getStatus(m.value, m.sector);
          return (
            <div key={i} className="p-4 bg-surface border border-border rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono font-bold text-muted uppercase tracking-widest">{m.label}</span>
                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-mono font-black border border-border/50 ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-mono font-black text-white">{m.value?.toFixed(2) || 'N/A'}</div>
                <div className="text-[9px] font-mono text-muted">SEC: {m.sector}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
