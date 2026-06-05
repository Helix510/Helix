import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function InsiderActivity({ ticker }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/insiders/${ticker}`)
      .then(r => r.json())
      .then(json => {
        setData(json.insiders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ticker]);

  const netBuying = data.filter(d => d.action === 'BUY').length > data.filter(d => d.action === 'SELL').length;

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight">Insider Activity</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Recent SEC Form 4 filings</p>
        </div>
        {data.length > 0 && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${netBuying ? 'bg-success/10 border border-success/20 text-success' : 'bg-danger/10 border border-danger/20 text-danger'}`}>
            {netBuying ? 'Net Buying' : 'Net Selling'}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-muted text-sm">Loading insider data...</div>
      ) : data.length === 0 ? (
        <div className="text-muted text-sm">No recent insider transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border">
                <th className="pb-4">Name</th>
                <th className="pb-4">Type</th>
                <th className="pb-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-4">
                    <p className="font-bold text-primary">{row.person}</p>
                    <p className="text-[10px] text-muted font-medium">{row.title}</p>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.action === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-primary font-['JetBrains_Mono']">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
