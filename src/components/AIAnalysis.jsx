import React from 'react';
import { Sparkles, Volume2, AlertCircle, TrendingUp, TrendingDown, Minus, ShieldCheck } from 'lucide-react';
import useAnalysis from '../hooks/useAnalysis.js';

export default function AIAnalysis({ ticker, stockData }) {
  const { analysis, rating, confidence, loading, error } = useAnalysis(ticker, stockData);

  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = analysis.replace(/[#*-]/g, '');
    window.speechSynthesis.speak(msg);
  };

  const getRatingUI = () => {
    const r = rating?.toUpperCase() || 'HOLD';
    if (r === 'BUY') return { label: 'BUY', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <TrendingUp size={16} /> };
    if (r === 'SELL') return { label: 'SELL', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: <TrendingDown size={16} /> };
    return { label: 'HOLD', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: <Minus size={16} /> };
  };

  const ratingUI = getRatingUI();

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-none mb-6 overflow-hidden font-['DM_Sans']">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Sparkles size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">Helix Analysis</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={speak}
              disabled={!analysis || loading}
              className="p-2 text-muted hover:text-primary transition-colors disabled:opacity-20"
            >
              <Volume2 size={20} />
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${ratingUI.bg} ${ratingUI.color} ${ratingUI.border}`}>
              {ratingUI.icon}
              {ratingUI.label}
            </div>
          </div>
        </div>

        <div className="min-h-[160px]">
          {error ? (
            <div className="flex items-center gap-3 text-danger text-sm font-bold p-5 bg-danger/5 rounded-2xl border border-danger/10">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col gap-3">
                  <div className="h-4 bg-input rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[95%] animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[85%] animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[40%] animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-muted leading-relaxed text-sm font-medium whitespace-pre-wrap">
                    {analysis}
                  </div>
                  
                  {!loading && analysis && (
                    <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Conviction</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary font-['JetBrains_Mono']">{confidence}%</span>
                          <div className="w-20 h-1.5 bg-input rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${confidence}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Institutional Grade</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-8 py-5 bg-input border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
          AI-Generated Note // Wall Street Matrix
        </span>
      </div>
    </div>
  );
}
