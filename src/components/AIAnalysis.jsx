import React from 'react';
import { Sparkles, Volume2, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import useAnalysis from '../hooks/useAnalysis.js';

export default function AIAnalysis({ ticker, stockData, isELI5 }) {
  const { analysis, loading, error } = useAnalysis(ticker, stockData, isELI5);

  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = analysis.replace(/[#*-]/g, '');
    window.speechSynthesis.speak(msg);
  };

  const getRecommendation = () => {
    const rec = (stockData?.recommendation || 'hold').toLowerCase();
    if (rec.includes('buy')) return { label: 'BUY', color: 'bg-success', icon: <TrendingUp size={14} /> };
    if (rec.includes('sell')) return { label: 'SELL', color: 'bg-danger', icon: <TrendingDown size={14} /> };
    return { label: 'HOLD', color: 'bg-gray-600', icon: <Minus size={14} /> };
  };

  const recommendation = getRecommendation();

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
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-background text-xs font-bold ${recommendation.color}`}>
              {recommendation.icon}
              {recommendation.label}
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
            <div className="text-muted leading-relaxed text-sm font-medium">
              {analysis || (loading && (
                <div className="flex flex-col gap-3">
                  <div className="h-4 bg-input rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[95%] animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[85%] animate-pulse"></div>
                  <div className="h-4 bg-input rounded-full w-[40%] animate-pulse"></div>
                </div>
              ))}
              {loading && analysis && <span className="inline-block w-2 h-4 bg-primary/30 ml-1 animate-pulse rounded-sm"></span>}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-8 py-5 bg-input border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
          AI-Generated Thesis // Gemini 2.0
        </span>
        {isELI5 && (
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded">
            ELI5 Mode Active
          </span>
        )}
      </div>
    </div>
  );
}
