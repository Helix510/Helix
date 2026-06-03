import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function AnalystTargets({ ticker, stockData, financials }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalystData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/analyst/${ticker}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch analyst data", err);
      } finally {
        setLoading(false);
      }
    };

    if (ticker) fetchAnalystData();
  }, [ticker]);

  if (loading) return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border animate-pulse mb-6">
      <div className="h-6 w-48 bg-input rounded mb-8"></div>
      <div className="h-24 bg-input rounded-2xl"></div>
    </div>
  );

  if (!data) return null;

  const currentPrice = stockData?.currentPrice || 0;
  const targetPrice = data.priceTarget?.mean || stockData?.targetPrice || 0;
  const upside = (targetPrice && currentPrice) ? ((targetPrice - currentPrice) / currentPrice * 100).toFixed(1) : 0;
  const upsideNum = parseFloat(upside);
  const upsideDisplay = upsideNum > 0 ? `+${upside}%` : `${upside}%`;
  
  const totalRecs = Object.values(data.recommendations).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 mb-6 font-['DM_Sans']">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-none">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">Analyst Consensus</h3>
            <p className="text-[10px] sm:text-xs font-medium text-muted mt-0.5">Based on {totalRecs} ratings</p>
          </div>
          <div className="text-right">
            <div className={`text-xl sm:text-2xl font-bold font-['JetBrains_Mono'] ${upsideNum >= 0 ? 'text-success' : 'text-danger'}`}>
              {upsideDisplay}
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-muted uppercase tracking-widest">Est. Upside</p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm font-bold text-primary">
            <span>Analyst Mean Target: ${targetPrice.toFixed(2)}</span>
            <span className="text-muted font-medium">Current: ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="space-y-4">
            <div className="flex h-2.5 sm:h-3 w-full rounded-full overflow-hidden">
              <div style={{ width: `${(data.recommendations.strongBuy / (totalRecs || 1)) * 100}%` }} className="bg-emerald-600"></div>
              <div style={{ width: `${(data.recommendations.buy / (totalRecs || 1)) * 100}%` }} className="bg-emerald-400"></div>
              <div style={{ width: `${(data.recommendations.hold / (totalRecs || 1)) * 100}%` }} className="bg-gray-600"></div>
              <div style={{ width: `${(data.recommendations.sell / (totalRecs || 1)) * 100}%` }} className="bg-rose-400"></div>
              <div style={{ width: `${(data.recommendations.strongSell / (totalRecs || 1)) * 100}%` }} className="bg-rose-600"></div>
            </div>
            <div className="flex justify-between text-[8px] sm:text-[10px] font-bold text-muted uppercase tracking-widest px-1 overflow-x-auto whitespace-nowrap no-scrollbar gap-4">
              <span>Strong Buy ({data.recommendations.strongBuy})</span>
              <span>Buy ({data.recommendations.buy})</span>
              <span>Hold ({data.recommendations.hold})</span>
              <span>Sell ({data.recommendations.sell})</span>
              <span>Strong Sell ({data.recommendations.strongSell})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Surprise */}
      <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-none">
        <h3 className="text-base sm:text-lg font-bold text-primary mb-6 sm:mb-8 tracking-tight">Earnings History</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.earnings.map((e, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 sm:p-4 bg-input rounded-xl sm:rounded-2xl border border-border">
              <span className="text-[9px] sm:text-[10px] font-bold text-muted uppercase tracking-widest">{new Date(e.date).toLocaleDateString(undefined, { quarter: 'short', year: '2-digit' })}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-base sm:text-lg font-bold text-primary font-['JetBrains_Mono']">${e.actual?.toFixed(2) || '—'}</span>
                <span className={`text-[9px] sm:text-[10px] font-bold ${e.surprisePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {e.surprisePercent >= 0 ? '+' : ''}{e.surprisePercent?.toFixed(1)}%
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] text-muted font-medium italic">Est: ${e.estimate?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
