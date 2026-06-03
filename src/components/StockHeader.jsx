import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

export default function StockHeader({ data, logo }) {
  const [currentQuote, setCurrentQuote] = useState(data);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const ticker = data.ticker;
  const isPositive = (currentQuote.change || 0) >= 0;

  useEffect(() => {
    if (!ticker) return;
    const poll = setInterval(async () => {
      setIsSyncing(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/stock/${ticker}`);
        const json = await res.json();
        if (json.success) {
          setCurrentQuote(json.data);
        }
      } catch (e) {
        console.error("Sync failed", e);
      } finally {
        setTimeout(() => setIsSyncing(false), 1000);
      }
    }, 15000);

    return () => clearInterval(poll);
  }, [ticker]);

  const displayPrice = currentQuote.currentPrice || data.currentPrice || 0;
  const displayPercent = currentQuote.changePercent || data.changePercent || 0;

  return (
    <div className="bg-surface p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] sm:text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase tracking-wider">
              {data.exchange || 'NASDAQ'}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted">
              S&P 500 • {data.sector}
            </span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {logo ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center border border-border p-1 overflow-hidden shrink-0 shadow-sm">
                <img src={logo} alt={data.companyName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-base sm:text-lg font-black text-primary shrink-0 shadow-sm">
                {ticker[0]}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-0.5 truncate">{data.companyName}</h1>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-semibold text-muted uppercase tracking-tight">
                  {ticker}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto border-t lg:border-t-0 border-border/50 pt-6 lg:pt-0">
          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-primary font-['JetBrains_Mono']">
              ${Number(displayPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold text-white ${isPositive ? 'bg-success' : 'bg-danger'}`}>
              {isPositive ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
              {Math.abs(Number(displayPercent)).toFixed(2)}%
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <RefreshCw size={12} className={`text-muted ${isSyncing ? 'animate-spin' : ''}`} />
            <p className="text-[9px] sm:text-[11px] font-bold text-muted uppercase tracking-widest">
              Live {data.exchange} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
