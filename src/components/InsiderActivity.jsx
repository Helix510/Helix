import React from 'react';

export default function InsiderActivity({ ticker }) {
  // Sample data
  const data = [
    { name: 'Cook Timothy D', role: 'CEO', type: 'Sell', value: '$12.4M', date: '2024-05-12' },
    { name: 'Maestri Luca', role: 'CFO', type: 'Buy', value: '$2.1M', date: '2024-04-28' },
    { name: 'Levinson Arthur D', role: 'Director', type: 'Sell', value: '$850K', date: '2024-04-15' },
    { name: 'Adams Katherine L', role: 'General Counsel', type: 'Sell', value: '$1.2M', date: '2024-03-22' },
  ];

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-primary tracking-tight">Insider Activity</h3>
          <p className="text-xs font-medium text-muted mt-0.5">Recent SEC Form 4 filings</p>
        </div>
        <div className="px-3 py-1 bg-danger/10 border border-danger/20 rounded-full text-danger text-[10px] font-bold uppercase tracking-widest">
          Net Selling
        </div>
      </div>

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
                  <p className="font-bold text-primary">{row.name}</p>
                  <p className="text-[10px] text-muted font-medium">{row.role}</p>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.type === 'Buy' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {row.type}
                  </span>
                </td>
                <td className="py-4 text-right font-bold text-primary font-['JetBrains_Mono']">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
