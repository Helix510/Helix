import React from 'react';

export default function RiskGauge({ data }) {
  // Logic to determine score based on stats
  // Mocking score for visual implementation
  const score = 42; 
  const label = "MODERATE";

  const subScores = [
    { label: 'Valuation Risk', value: 65, color: 'bg-warning' },
    { label: 'Financial Health', value: 20, color: 'bg-success' },
    { label: 'Growth Momentum', value: 45, color: 'bg-warning' }
  ];

  return (
    <div className="p-6 bg-surface border border-border rounded-xl flex flex-col items-center space-y-6">
      <h3 className="text-[10px] font-mono font-black text-muted uppercase tracking-widest self-start">Tactical Risk Position</h3>
      
      <div className="relative mt-4">
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2de2a0" />
              <stop offset="50%" stopColor="#ffc85c" />
              <stop offset="100%" stopColor="#ff4f70" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1d2030" strokeWidth="14" strokeLinecap="round"/>
          {/* Active Overlay */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="url(#riskGradient)" 
            strokeWidth="14" 
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * score) / 100}
            className="transition-all duration-1000 ease-out"
          />
          {/* Needle */}
          <line 
            x1="100" y1="100" 
            x2={100 + 70 * Math.cos((180 - (180 * score) / 100) * Math.PI / 180)} 
            y2={100 - 70 * Math.sin((180 - (180 * score) / 100) * Math.PI / 180)} 
            stroke="#ffffff" strokeWidth="3" strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill="#ffffff"/>
        </svg>
        
        <div className="absolute top-[85px] left-0 right-0 text-center">
          <div className="text-3xl font-mono font-black text-white">{score}</div>
          <div className="text-[10px] font-mono font-black text-muted uppercase tracking-widest mt-1">{label} RISK</div>
        </div>
      </div>

      <div className="w-full space-y-4 pt-4 border-t border-border/50">
        {subScores.map((s, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-mono uppercase font-bold">
              <span className="text-muted">{s.label}</span>
              <span className="text-white">{s.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
