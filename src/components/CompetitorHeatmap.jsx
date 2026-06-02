import React, { useState, useEffect } from 'react';

export default function CompetitorHeatmap({ ticker }) {
  const [peers, setPeers] = useState([
    { ticker: 'MSFT', change: 1.2 },
    { ticker: 'GOOGL', change: -0.8 },
    { ticker: 'AMZN', change: 2.5 },
    { ticker: 'META', change: 0.4 },
    { ticker: 'AAPL', change: -1.5 },
    { ticker: 'TSLA', change: 4.2 }
  ]);

  const getHeatColor = (val) => {
    if (val >= 3) return 'bg-success border-success/50';
    if (val > 0) return 'bg-success/20 border-success/30';
    if (val <= -3) return 'bg-danger border-danger/50';
    if (val < 0) return 'bg-danger/20 border-danger/30';
    return 'bg-surface border-border';
  };

  return (
    <div className="p-6 bg-surface border border-border rounded-xl space-y-6">
      <h3 className="text-xs font-mono font-black text-muted uppercase tracking-widest">{ticker} vs Sector Peers</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {peers.map((p, i) => (
          <div key={i} className={`p-4 rounded-lg border font-mono flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer ${getHeatColor(p.change)}`}>
            <div className="text-xs font-black text-white">{p.ticker}</div>
            <div className={`text-[10px] font-bold ${p.change >= 0 ? 'text-success' : 'text-danger'}`}>
              {p.change >= 0 ? '+' : ''}{p.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
