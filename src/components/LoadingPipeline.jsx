import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const STAGES = [
  "Engaging market ingestion grid...",
  "Pulling structural financials...",
  "Scanning SEC Form 4 filings...",
  "Mapping competitor benchmarks...",
  "Synthesizing analysis thesis...",
  "Building institutional report..."
];

export default function LoadingPipeline({ ticker }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => (s < STAGES.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12 bg-background relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>
      
      <div className="flex flex-col items-center space-y-4 relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <Activity size={24} className="text-primary animate-pulse" />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 relative">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-mono font-black text-white uppercase tracking-tighter">Initializing Research: {ticker}</h2>
          <p className="text-[10px] font-mono font-black text-muted uppercase tracking-[0.3em] animate-pulse">{STAGES[stage]}</p>
        </div>

        <div className="h-1 w-full bg-surface border border-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary shadow-[0_0_12px_#00cfb4] transition-all duration-1000 ease-out" 
            style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {STAGES.map((s, i) => (
             <div key={i} className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${i <= stage ? 'bg-primary' : 'bg-border'}`}></div>
               <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${i <= stage ? 'text-primary' : 'text-muted'}`}>
                 Stage_{i + 1}
               </span>
             </div>
           ))}
        </div>
      </div>

      <footer className="absolute bottom-8 text-[9px] font-mono text-muted uppercase tracking-[0.4em]">
         Terminal Connection Encrypted // Helix_v3.0.0
      </footer>
    </div>
  );
}
