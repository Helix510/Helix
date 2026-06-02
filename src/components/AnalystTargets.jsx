import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function AnalystTargets({ ticker, data: stockData }) {
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
    <div className="bg-surface p-8 rounded-3xl border border-border animate-pulse mb-6">
      <div className="h-6 w-48 bg-input rounded mb-8"></div>
      <div className="h-24 bg-input rounded-2xl"></div>
    </div>
  );

  if (!data) return null;

  const currentPrice = stockData.currentPrice || 0;
  const meanTarget = data.priceTarget.mean || currentPrice;
  const upside = ((meanTarget / (currentPrice || 1) - 1) * 100).toFixed(1);
  
  const totalRecs = Object.values(data.recommendations).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 mb-6 font-['DM_Sans']">
      <div className="bg-surface p-8 rounded-3xl border border-border shadow-none">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-primary tracking-tight">Analyst Consensus</h3>
            <p className="text-xs font-medium text-muted mt-0.5">Based on {totalRecs} ratings</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold font-['JetBrains_Mono'] ${parseFloat(upside) >= 0 ? 'text-success' : 'text-danger'}`}>
              {parseFloat(upside) >= 0 ? '+' : ''}{upside}%
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Est. Upside</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between text-sm font-bold text-primary">
            <span>Mean Target: ${meanTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-muted font-medium">Current: ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="space-y-4">
            <div className="flex h-3 w-full rounded-full overflow-hidden">
              <div style={{ width: `${(data.recommendations.strongBuy / totalRecs) * 100}%` }} className="bg-emerald-600"></div>
              <div style={{ width: `${(data.recommendations.buy / totalRecs) * 100}%` }} className="bg-emerald-400"></div>
              <div style={{ width: `${(data.recommendations.hold / totalRecs) * 100}%` }} className="bg-gray-600"></div>
              <div style={{ width: `${(data.recommendations.sell / totalRecs) * 100}%` }} className="bg-rose-400"></div>
              <div style={{ width: `${(data.recommendations.strongSell / totalRecs) * 100}%` }} className="bg-rose-600"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-muted uppercase tracking-widest px-1">
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
      <div className="bg-surface p-8 rounded-3xl border border-border shadow-none">
        <h3 className="text-lg font-bold text-primary mb-8 tracking-tight">Earnings History</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.earnings.map((e, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 bg-input rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{new Date(e.date).toLocaleDateString(undefined, { quarter: 'short', year: '2-digit' })}</span>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-primary font-['JetBrains_Mono']">${e.actual?.toFixed(2) || '—'}</span>
                <span className={`text-[10px] font-bold ${e.surprisePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {e.surprisePercent >= 0 ? '+' : ''}{e.surprisePercent?.toFixed(1)}%
                </span>
              </div>
              <span className="text-[9px] text-muted font-medium italic">Est: ${e.estimate?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
