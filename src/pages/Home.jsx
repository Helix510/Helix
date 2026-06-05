import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config.js';
import SearchBar from '../components/SearchBar.jsx';

function TrendingCard({ stock, onSearch }) {
  const [logo, setLogo] = useState(null);
  const isPos = stock.changePercent >= 0;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/financials/${stock.symbol}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.profile?.logo) {
          setLogo(json.data.profile.logo);
        }
      })
      .catch(() => {});
  }, [stock.symbol]);

  return (
    <button 
      onClick={() => onSearch(stock.symbol)}
      className={`min-w-[180px] sm:min-w-[220px] p-5 sm:p-6 bg-[#0c0e14] border ${isPos ? 'border-[#2de2a0]/10 hover:border-[#2de2a0]/30' : 'border-[#ff4f70]/10 hover:border-[#ff4f70]/30'} rounded-2xl flex flex-col gap-4 transition-all hover:-translate-y-1 active:scale-95 group text-left`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {logo ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center p-1 shrink-0">
              <img src={logo} alt={stock.symbol} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00cfb4]/10 border border-[#00cfb4]/20 flex items-center justify-center text-[10px] font-bold text-[#00cfb4] shrink-0">
              {stock.symbol[0]}
            </div>
          )}
          <span className="text-sm font-bold text-white group-hover:text-[#00cfb4] transition-colors">{stock.symbol}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${isPos ? 'bg-[#2de2a0]/10 text-[#2de2a0]' : 'bg-[#ff4f70]/10 text-[#ff4f70]'}`}>
          {isPos ? '+' : ''}{stock.changePercent.toFixed(1)}%
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold text-white font-mono">${stock.regularMarketPrice?.toFixed(2) || stock.price?.toFixed(2)}</span>
        <span className="text-[9px] font-medium text-[#454866] truncate uppercase tracking-widest mt-0.5">{stock.companyName}</span>
      </div>
    </button>
  );
}

export default function Home({ onSearch, error }) {
  const [marketOverview, setMarketOverview] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('helix_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));

    const fetchData = async () => {
      setLoading(true);
      try {
        const [overRes, trendRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/market/overview`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/market/trending`).then(r => r.json())
        ]);
        
        if (overRes.success) setMarketOverview(overRes.data);
        if (trendRes.success) setTrending(trendRes.data);
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (ticker) => {
    saveRecentSearch(ticker);
    onSearch(ticker);
  };

  const saveRecentSearch = (ticker) => {
    const updated = [ticker, ...recentSearches.filter(t => t !== ticker)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('helix_recent_searches', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e6e9f4] font-['DM_Sans'] overflow-x-hidden flex flex-col">
      {/* Top Nav */}
      <nav className="px-6 sm:px-8 py-4 flex items-center justify-between border-b border-[#1d2030] bg-[#0c0e14]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00cfb4]/10 border border-[#00cfb4]/30 rounded-lg flex items-center justify-center">
            <span className="text-xs font-black text-[#00cfb4]">HX</span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">Helix</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span className="text-[10px] font-bold text-[#8c92b5] uppercase tracking-[0.2em]">S&P 500 Intelligence Platform</span>
          <div className="w-2 h-2 bg-[#00cfb4] rounded-full animate-pulse shadow-[0_0_8px_#00cfb4]"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-20 sm:pt-24 animate-in fade-in duration-1000">
        <div className="flex flex-col items-center mb-10 sm:mb-14 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#00cfb4]/20 blur-[60px] rounded-full"></div>
          
          <div className="w-16 h-16 bg-[#0c0e14] border border-[#1d2030] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,207,180,0.1)] mb-6 relative z-10">
            <span className="text-2xl font-black text-[#00cfb4]">HX</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white mb-3">Helix</h1>
          <p className="text-sm sm:text-lg text-[#8c92b5] font-medium text-center max-w-md">Institutional-grade equity research. Powered by AI.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full flex justify-center mb-16 sm:mb-20 px-4">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search stocks — AAPL, NVDA, TSLA..."
            error={error}
            variant="home"
          />
        </div>

        {/* Market Overview Strip */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 px-4">
          {marketOverview.map((index, i) => {
            const isPos = index.changePercent >= 0;
            return (
              <div key={i} className="w-full bg-[#0c0e14] border border-[#1d2030] p-6 rounded-2xl flex flex-col gap-2 hover:border-[#00cfb4]/30 transition-all group">
                <span className="text-[10px] font-bold text-[#8c92b5] uppercase tracking-widest group-hover:text-[#00cfb4] transition-colors">{index.shortName}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-white font-mono">{index.price?.toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
                  <div className={`flex items-center gap-0.5 text-xs font-bold ${isPos ? 'text-[#2de2a0]' : 'text-[#ff4f70]'}`}>
                    {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(index.changePercent).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
          {loading && [1,2,3].map(i => <div key={i} className="w-full h-24 bg-[#0c0e14] border border-[#1d2030] rounded-2xl animate-pulse"></div>)}
        </div>

        {/* Trending Tickers */}
        <div className="w-full max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-bold text-[#8c92b5] uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity size={14} className="text-[#00cfb4]" /> Trending Today
            </h3>
            <span className="text-[9px] font-medium text-[#454866]">REAL-TIME FEED ACTIVE</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
            {trending.map((stock) => (
              <TrendingCard key={stock.symbol} stock={stock} onSearch={handleSearch} />
            ))}
            {loading && [1,2,3,4,5,6].map(i => <div key={i} className="min-w-[200px] h-36 bg-[#0c0e14] border border-[#1d2030] rounded-2xl animate-pulse"></div>)}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-12 flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#454866] uppercase tracking-widest mb-4">Recent Searches</span>
            <div className="flex flex-wrap justify-center gap-3">
              {recentSearches.map(t => (
                <button 
                  key={t}
                  onClick={() => handleSearch(t)}
                  className="px-5 py-2.5 bg-[#0c0e14] border border-[#1d2030] rounded-xl text-xs font-bold text-[#8c92b5] hover:border-[#00cfb4]/30 hover:text-[#00cfb4] transition-all"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-10 flex flex-col items-center gap-4 mt-auto">
        <div className="flex items-center gap-6 opacity-30">
          <ShieldCheck size={18} />
          <div className="h-4 w-px bg-[#1d2030]"></div>
          <Activity size={18} />
          <div className="h-4 w-px bg-[#1d2030]"></div>
          <Clock size={18} />
        </div>
        <p className="text-[9px] font-bold text-[#454866] uppercase tracking-[0.4em] text-center max-w-lg leading-loose">
          Market data powered by Yahoo Finance · AI by Gemini 2.0 · Built with Helix Neural Matrix
        </p>
      </footer>
    </div>
  );
}
