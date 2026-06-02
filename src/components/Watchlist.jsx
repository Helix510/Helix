import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Watchlist({ ticker, stockData }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('helix_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('helix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = () => {
    if (watchlist.find(item => item.symbol === ticker)) {
      setWatchlist(watchlist.filter(item => item.symbol !== ticker));
    } else {
      setWatchlist([...watchlist, { 
        symbol: ticker, 
        price: stockData.currentPrice, 
        changePercent: stockData.changePercent 
      }]);
    }
  };

  const isInWatchlist = watchlist.find(item => item.symbol === ticker);

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 shadow-none font-['DM_Sans']">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight">Your Watchlist</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Tracked assets</p>
        </div>
        <button 
          onClick={toggleWatchlist}
          className={`p-2 rounded-xl border transition-all ${isInWatchlist ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-primary/10 border-primary/20 text-primary'}`}
        >
          {isInWatchlist ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <div className="space-y-4">
        {watchlist.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-sm font-medium text-muted">No stocks tracked yet.</p>
          </div>
        ) : (
          watchlist.map((item, i) => {
             const isPos = item.changePercent >= 0;
             return (
              <div key={i} className="flex items-center justify-between p-4 bg-input rounded-2xl border border-border hover:bg-surface hover:border-primary/30 transition-all cursor-pointer group">
                <span className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">{item.symbol}</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-primary font-['JetBrains_Mono'] tracking-tighter">${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className={`text-[10px] font-bold ${isPos ? 'text-success' : 'text-danger'}`}>
                    {isPos ? '+' : ''}{item.changePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
             );
          })
        )}
      </div>
    </div>
  );
}
