import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

export default function Home({ onSearch, error }) {
  const [input, setInput] = useState('');
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/market/trending`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setTrending(json.data);
      })
      .catch(err => console.error("Failed to fetch trending", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-['DM_Sans']">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center shadow-none">
            <span className="text-sm font-black text-primary">HX</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter text-primary uppercase">Helix</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="w-full relative group mb-8">
          <input 
            type="text" 
            autoFocus
            placeholder="Search stocks, ETFs, companies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full bg-input border ${error ? 'border-danger' : 'border-border'} rounded-2xl px-12 py-5 text-xl font-sans text-primary placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all shadow-none`}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={24} />
          <button 
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-background font-bold px-5 py-2 rounded-xl text-sm hover:brightness-105 transition-all"
          >
            ANALYZE
          </button>
        </form>

        {error && (
          <div className="mb-8 px-4 py-2 bg-danger/10 border border-danger/20 rounded-lg text-danger text-[11px] font-bold uppercase tracking-widest animate-pulse">
            {error}
          </div>
        )}

        {/* Trending */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="w-full text-center text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Trending Now</span>
          {trending.map(stock => {
            const isPositive = stock.changePercent >= 0;
            return (
              <button 
                key={stock.symbol}
                onClick={() => onSearch(stock.symbol)}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-xs font-bold text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shadow-none group"
              >
                {stock.symbol}
                <span className={`flex items-center text-[10px] ${isPositive ? 'text-success' : 'text-danger'}`}>
                   {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                   {Math.abs(stock.changePercent).toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
