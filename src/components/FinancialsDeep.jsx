import React from 'react';

export default function FinancialsDeep({ ticker, financials }) {
  if (!financials) return null;

  const metrics = financials?.metrics || {};
  const income = financials?.income || [];

  const ratios = [
    { label: 'P/E Ratio', value: metrics.peRatio ? metrics.peRatio.toFixed(2) : '—' },
    { label: 'P/B Ratio', value: metrics.pbRatio ? metrics.pbRatio.toFixed(2) : '—' },
    { label: 'P/S Ratio', value: metrics.psRatio ? metrics.psRatio.toFixed(2) : '—' },
    { label: 'Debt/Equity', value: metrics.debtToEquity ? metrics.debtToEquity.toFixed(2) : '—' },
    { label: 'ROE', value: metrics.roe ? (metrics.roe <= 1 ? metrics.roe * 100 : metrics.roe).toFixed(2) + '%' : '—' },
    { label: 'ROA', value: metrics.roa ? (metrics.roa <= 1 ? metrics.roa * 100 : metrics.roa).toFixed(2) + '%' : '—' },
    { label: 'Gross Margin', value: metrics.grossMargin ? (metrics.grossMargin <= 1 ? metrics.grossMargin * 100 : metrics.grossMargin).toFixed(2) + '%' : '—' },
    { label: 'Net Margin', value: metrics.netMargin ? (metrics.netMargin <= 1 ? metrics.netMargin * 100 : metrics.netMargin).toFixed(2) + '%' : '—' },
  ];

  const formatLarge = (val) => {
    if (!val) return '—';
    if (val >= 1e12) return '$' + (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return '$' + (val / 1e6).toFixed(2) + 'M';
    return '$' + val.toLocaleString();
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[#1d2030] bg-[#0c0e14] p-4 sm:p-8">
      <h2 className="text-xs sm:text-sm font-bold text-[#8c92b5] uppercase tracking-widest mb-6">Key Ratios</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
        {ratios.map((r, i) => (
          <div key={i} className="space-y-1">
            <div className="text-[10px] font-bold text-[#454866] uppercase tracking-wider">{r.label}</div>
            <div className="text-xl sm:text-2xl font-bold text-[#e6e9f4] font-['JetBrains_Mono'] tracking-tighter">{r.value}</div>
          </div>
        ))}
      </div>

      {income.length > 0 && (
        <>
          <h2 className="text-xs sm:text-sm font-bold text-[#8c92b5] uppercase tracking-widest mb-4">Income Statement</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-bold text-[#454866] uppercase tracking-wider">
                    <th className="text-left pb-3 whitespace-nowrap">Quarter</th>
                    <th className="text-right pb-3 whitespace-nowrap px-4">Revenue</th>
                    <th className="text-right pb-3 whitespace-nowrap px-4">Gross Profit</th>
                    <th className="text-right pb-3 whitespace-nowrap px-4">Net Income</th>
                    <th className="text-right pb-3 whitespace-nowrap">EPS</th>
                  </tr>
                </thead>
                <tbody>
                  {income.slice(0, 4).map((q, i) => (
                    <tr key={i} className="border-t border-[#1d2030]">
                      <td className="py-4 text-[#8c92b5] font-['JetBrains_Mono'] text-xs whitespace-nowrap">{q.date?.slice(0, 7) || '—'}</td>
                      <td className="py-4 text-right text-[#e6e9f4] font-['JetBrains_Mono'] text-xs whitespace-nowrap px-4">{formatLarge(q.revenue)}</td>
                      <td className="py-4 text-right text-[#e6e9f4] font-['JetBrains_Mono'] text-xs whitespace-nowrap px-4">{formatLarge(q.grossProfit)}</td>
                      <td className="py-4 text-right text-[#e6e9f4] font-['JetBrains_Mono'] text-xs whitespace-nowrap px-4">{formatLarge(q.netIncome)}</td>
                      <td className="py-4 text-right text-[#e6e9f4] font-['JetBrains_Mono'] text-xs whitespace-nowrap">{q.eps ? '$' + q.eps.toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
