import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowUpRight, ArrowDownRight, RefreshCw, Star } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

export default function Watchlist({ ticker: currentTicker, stockData, onSearch }) {
  const [watchlistTickers, setWatchlistTickers] = useState(() => {
    const saved = localStorage.getItem('helix_watchlist_v2');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [watchlistData, setWatchlistData] = useState({});
  const [loading, setLoading] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('helix_watchlist_v2', JSON.stringify(watchlistTickers));
    fetchWatchlistData();
  }, [watchlistTickers]);

  // Polling
  useEffect(() => {
    const interval = setInterval(fetchWatchlistData, 30000);
    return () => clearInterval(interval);
  }, [watchlistTickers]);

  const fetchWatchlistData = async () => {
    if (watchlistTickers.length === 0) return;
    try {
      const results = await Promise.all(
        watchlistTickers.map(t => 
          fetch(`${API_BASE_URL}/api/stock/${t}`).then(r => r.json())
        )
      );
      
      const newData = {};
      results.forEach(res => {
        if (res.success) {
          newData[res.data.ticker] = res.data;
        }
      });
      setWatchlistData(newData);
    } catch (err) {
      console.error("Watchlist Fetch Error:", err);
    }
  };

  const toggleWatchlist = () => {
    if (watchlistTickers.includes(currentTicker)) {
      setWatchlistTickers(prev => prev.filter(t => t !== currentTicker));
    } else {
      if (watchlistTickers.length >= 10) return; // Limit
      setWatchlistTickers(prev => [currentTicker, ...prev]);
    }
  };

  const removeTicker = (e, t) => {
    e.stopPropagation();
    setWatchlistTickers(prev => prev.filter(item => item !== t));
  };

  const isWatching = watchlistTickers.includes(currentTicker);

  return (
    <div className="bg-surface border border-border rounded-3xl p-8 shadow-none font-['DM_Sans']">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight">Your Watchlist</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Tracked institutional assets</p>
        </div>
        <button 
          onClick={toggleWatchlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all ${isWatching ? 'bg-[#00cfb4]/10 border-[#00cfb4]/20 text-[#00cfb4]' : 'bg-input border-border text-muted hover:text-primary'}`}
        >
          {isWatching ? <Star size={14} fill="currentColor" /> : <Plus size={14} />}
          {isWatching ? 'Watching' : 'Add to Watchlist'}
        </button>
      </div>

      <div className="space-y-3">
        {watchlistTickers.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-sm font-medium text-muted">No stocks tracked yet.</p>
          </div>
        ) : (
          watchlistTickers.map((t) => {
            const data = watchlistData[t];
            const isPos = (data?.changePercent || 0) >= 0;
            
            return (
              <div 
                key={t} 
                onClick={() => onSearch && onSearch(t)}
                className="group flex items-center justify-between p-4 bg-input rounded-2xl border border-border hover:bg-surface hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-[10px] font-black text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-all">
                    {t[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary group-hover:text-white transition-colors">{t}</span>
                    <span className="text-[9px] text-muted font-medium uppercase truncate w-20">
                      {data?.companyName || 'Loading...'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-primary font-['JetBrains_Mono'] tracking-tighter">
                      {data?.currentPrice ? `$${data.currentPrice.toFixed(2)}` : '—'}
                    </span>
                    <div className={`flex items-center text-[10px] font-bold ${isPos ? 'text-success' : 'text-danger'}`}>
                      {isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {Math.abs(data?.changePercent || 0).toFixed(1)}%
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => removeTicker(e, t)}
                    className="p-1 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {watchlistTickers.length > 0 && (
        <div className="flex items-center gap-2 mt-6 justify-center">
           <RefreshCw size={10} className="text-muted animate-spin-slow" />
           <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Auto-Sync Active (30s)</span>
        </div>
      )}
    </div>
  );
}
