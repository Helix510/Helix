import React, { useState, useEffect } from 'react';
import { Mail, ShieldAlert, Volume2, MessageSquare, ChevronRight } from 'lucide-react';
import StockHeader from '../components/StockHeader.jsx';
import PriceChart from '../components/PriceChart.jsx';
import AIAnalysis from '../components/AIAnalysis.jsx';
import FinancialsGrid from '../components/FinancialsGrid.jsx';
import FinancialsDeep from '../components/FinancialsDeep.jsx';
import AboutSection from '../components/AboutSection.jsx';
import AnalystTargets from '../components/AnalystTargets.jsx';
import InsiderActivity from '../components/InsiderActivity.jsx';
import Watchlist from '../components/Watchlist.jsx';
import CompetitorTiles from '../components/CompetitorTiles.jsx';
import NewsFeed from '../components/NewsFeed.jsx';
import LoadingPipeline from '../components/LoadingPipeline.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { API_BASE_URL } from '../config.js';

export default function Report({ ticker, onSearch, onReset, isELI5, toggleELI5 }) {
  const [data, setData] = useState(null);
  const [financialsData, setFinancialsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [ticker]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stockRes, financialsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stock/${ticker}`),
        fetch(`${API_BASE_URL}/api/financials/${ticker}`)
      ]);

      const stockJson = await stockRes.json();
      const financialsJson = await financialsRes.json();

      if (stockJson.success) {
        setData(stockJson.data);
      } else {
        setError(stockJson.message);
        setLoading(false);
        return;
      }

      if (financialsJson.success) {
        setFinancialsData(financialsJson.data);
      }
    } catch (err) {
      setError("Failed to reach research matrix.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPipeline ticker={ticker} />;

  if (error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="text-rose-500 mb-4" size={48} />
      <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight text-gray-900">Research Core Exception</h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md font-medium">{error}</p>
      <button onClick={onReset} className="bg-primary text-background font-bold px-6 py-2 rounded-lg text-sm transition-transform hover:scale-105 active:scale-95 shadow-none">RETURN TO TERMINAL</button>
    </div>
  );

  const companyLogo = financialsData?.profile?.logo;

  return (
    <div className="min-h-screen bg-background text-primary font-['DM_Sans']">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onReset}>
          <div className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center group-hover:border-primary transition-colors shadow-none">
            <span className="text-xs font-black text-primary">HX</span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tighter text-gray-900">Helix</span>
        </div>

        <div className="flex-1 max-w-xl">
          <SearchBar 
            onSearch={onSearch} 
            placeholder="Search stocks..."
            variant="nav"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <button 
            onClick={toggleELI5}
            className={`flex items-center gap-2 px-2 sm:px-3.5 py-1.5 rounded-lg border text-[9px] sm:text-[11px] font-bold transition-all ${isELI5 ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted hover:border-primary'}`}
          >
            <MessageSquare size={14} className="hidden xs:block" /> 
            <span className="xs:hidden">ELI5</span>
            <span className="hidden xs:inline">ELI5: {isELI5 ? 'ON' : 'OFF'}</span>
          </button>
          <div className="hidden sm:block h-4 w-px bg-border"></div>
          <button className="hidden sm:block text-muted hover:text-primary transition-colors"><Volume2 size={20} /></button>
          <button className="hidden sm:block text-muted hover:text-primary transition-colors"><Mail size={20} /></button>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-bold text-breadcrumb uppercase tracking-widest overflow-x-auto whitespace-nowrap no-scrollbar">
        <span>S&P 500</span>
        <ChevronRight size={10} className="text-border shrink-0" />
        <span>{data.sector}</span>
        <ChevronRight size={10} className="text-border shrink-0" />
        
        <div className="flex items-center gap-1.5 shrink-0">
          {companyLogo ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center border border-border overflow-hidden shrink-0">
              <img src={companyLogo} alt={ticker} className="w-full h-full object-contain p-0.5" />
            </div>
          ) : (
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-[6px] sm:text-[8px] font-black text-primary shrink-0">
              {ticker[0]}
            </div>
          )}
          <span className="text-primary">{ticker}</span>
        </div>
      </div>

      {/* Report Layout */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10 items-start pb-32">
        
        {/* Left Column (Main Content) */}
        <div className="space-y-8 lg:space-y-10 order-1">
          <StockHeader data={data} logo={companyLogo} />
          <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-none overflow-hidden">
             <PriceChart ticker={ticker} />
          </div>
          <FinancialsGrid data={data} financials={financialsData} />
          <FinancialsDeep ticker={ticker} financials={financialsData} />
          <AboutSection data={data} financials={financialsData} />
          <AnalystTargets ticker={ticker} stockData={data} financials={financialsData} />
          <NewsFeed ticker={ticker} companyName={data.companyName} />
        </div>

        {/* Right Column (Sidebar - stacks below on mobile) */}
        <div className="space-y-8 lg:space-y-10 lg:sticky lg:top-24 order-2">
          <AIAnalysis ticker={ticker} stockData={data} isELI5={isELI5} />
          <CompetitorTiles ticker={ticker} sector={data.sector} />
          <InsiderActivity ticker={ticker} />
          <Watchlist ticker={ticker} stockData={data} onSearch={onSearch} />
          
          <div className="p-6 sm:p-8 bg-surface border border-border rounded-2xl sm:rounded-3xl shadow-none">
             <h3 className="text-[10px] sm:text-[11px] font-bold text-muted uppercase tracking-widest mb-6 sm:mb-8">Helix Proprietary Score</h3>
             <div className="space-y-6 sm:space-y-8">
               {[
                 { label: 'Valuation', value: 72, color: 'bg-primary' },
                 { label: 'Fundamentals', value: 85, color: 'bg-success' },
                 { label: 'Market Sentiment', value: 64, color: 'bg-info' }
               ].map((score, i) => (
                 <div key={i} className="space-y-2 sm:space-y-3">
                   <div className="flex justify-between text-[10px] sm:text-[11px] uppercase font-bold">
                     <span className="text-muted">{score.label}</span>
                     <span className="text-primary">{score.value}/100</span>
                   </div>
                   <div className="h-1 sm:h-1.5 w-full bg-background rounded-full overflow-hidden">
                     <div className={`h-full ${score.color} transition-all duration-1000 rounded-full`} style={{ width: `${score.value}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
