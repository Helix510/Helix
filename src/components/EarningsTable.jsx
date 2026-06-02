import React from 'react';

export default function EarningsTable({ data }) {
  const { earnings } = data;
  if (!earnings || !earnings.financialsChart || !earnings.financialsChart.quarterly) return null;

  const quarterly = earnings.financialsChart.quarterly;

  return (
    <div className="p-6 bg-surface border border-border rounded-xl space-y-6">
      <h3 className="text-xs font-mono font-black text-muted uppercase tracking-widest">Quarterly Performance Matrix</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="text-muted border-b border-border/50 text-left">
              <th className="pb-4 font-black uppercase tracking-wider">Quarter</th>
              <th className="pb-4 font-black uppercase tracking-wider">Revenue</th>
              <th className="pb-4 font-black uppercase tracking-wider">Earnings</th>
              <th className="pb-4 font-black uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {quarterly.map((q, i) => {
              const isBeat = q.actual > q.estimate;
              const isRecent = i === quarterly.length - 1;
              return (
                <tr key={i} className={`group transition-colors hover:bg-white/[0.02] ${isRecent ? 'border-l-2 border-primary' : ''}`}>
                  <td className="py-4 text-white font-bold">{q.date}</td>
                  <td className="py-4 text-muted">{(q.revenue / 1e9).toFixed(2)}B</td>
                  <td className="py-4 text-muted">{(q.actual / 1e6).toFixed(1)}M</td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-0.5 rounded-md font-black text-[10px] ${isBeat ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {isBeat ? 'BEAT' : 'MISS'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
