import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

const SECTOR_PEERS = {
  'Technology': ['MSFT', 'AAPL', 'NVDA', 'AVGO', 'ORCL', 'ADBE'],
  'Communication Services': ['GOOGL', 'META', 'NFLX', 'TMUS', 'DIS', 'VZ'],
  'Consumer Cyclical': ['AMZN', 'TSLA', 'HD', 'MCD', 'NKE', 'LOW'],
  'Financial Services': ['JPM', 'V', 'MA', 'BAC', 'WFC', 'GS'],
  'Healthcare': ['LLY', 'UNH', 'JNJ', 'ABBV', 'MRK', 'TMO'],
  'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'MPC', 'PSX']
};

export default function CompetitorTiles({ ticker, sector }) {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPeersList = () => {
    const list = SECTOR_PEERS[sector] || ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA'];
    return list.filter(t => t !== ticker).slice(0, 6);
  };

  const fetchPeers = async () => {
    const peerList = getPeersList();
    try {
      const results = await Promise.all(peerList.map(t => 
        fetch(`${API_BASE_URL}/api/stock/${t}`).then(r => r.json())
      ));
      
      const peerData = results
        .filter(r => r.success)
        .map(r => ({
          symbol: r.data.ticker,
          name: r.data.companyName,
          price: r.data.currentPrice,
          change: r.data.changePercent
        }));
      
      setPeers(peerData);
    } catch (err) {
      console.error("Failed to fetch peers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPeers();
    const interval = setInterval(fetchPeers, 60000);
    return () => clearInterval(interval);
  }, [ticker, sector]);

  if (loading && peers.length === 0) return (
    <div className="bg-surface p-8 rounded-3xl border border-border animate-pulse mb-6">
      <div className="h-6 w-32 bg-input rounded mb-8"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-input rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight">Sector Peers</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Top companies in {sector || 'Market'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {peers.map((peer) => {
          const isPositive = peer.change >= 0;
          return (
            <div key={peer.symbol} className="p-5 rounded-2xl border border-border bg-input hover:bg-surface hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">{peer.symbol}</span>
                <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(peer.change).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-muted truncate">{peer.name}</p>
                <p className="text-sm font-bold text-primary font-['JetBrains_Mono'] tracking-tight">
                  ${Number(peer.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
