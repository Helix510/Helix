import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import SP500 from '../data/sp500.js';

const STAGES = [
  { label: "Fetching market data", duration: 500 },
  { label: "Pulling financial statements", duration: 800 },
  { label: "Scanning insider activity", duration: 500 },
  { label: "Analyzing sector peers", duration: 600 },
  { label: "Running AI analysis", duration: 1200 },
  { label: "Building your report", duration: 400 }
];

export default function LoadingPipeline({ ticker }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [progress, setProgress] = useState(0);

  const company = SP500.find(s => s.ticker === ticker);
  const companyName = company ? company.name : 'Institutional Asset';

  useEffect(() => {
    let timeout;
    let stageIndex = 0;
    
    const runStage = () => {
      if (stageIndex < STAGES.length) {
        timeout = setTimeout(() => {
          setCompletedStages(prev => [...prev, stageIndex]);
          stageIndex++;
          setCurrentStage(stageIndex);
          setProgress((stageIndex / STAGES.length) * 100);
          runStage();
        }, STAGES[stageIndex].duration);
      }
    };

    runStage();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['DM_Sans']">
      {/* Pulse Logo */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-[#00cfb4]/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="w-20 h-20 bg-[#0c0e14] border border-[#1d2030] rounded-2xl flex items-center justify-center relative z-10">
          <span className="text-3xl font-black text-[#00cfb4]">HX</span>
        </div>
      </div>

      {/* Ticker & Name */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-5xl font-bold tracking-tighter text-[#00cfb4] font-mono uppercase">{ticker}</h2>
        <p className="text-sm font-medium text-[#8c92b5] uppercase tracking-[0.2em]">{companyName}</p>
      </div>

      {/* Pipeline Grid */}
      <div className="w-full max-w-sm space-y-4">
        {STAGES.map((stage, i) => {
          const isCompleted = completedStages.includes(i);
          const isActive = currentStage === i;
          const isPending = !isCompleted && !isActive;

          return (
            <div 
              key={i} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-[#0c0e14] border-[#00cfb4]/30' : 'bg-transparent border-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-5 h-5 bg-[#2de2a0] rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                      <Check size={12} className="text-[#08090d]" strokeWidth={4} />
                    </div>
                  ) : isActive ? (
                    <Loader2 size={18} className="text-[#00cfb4] animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-[#1d2030] rounded-full"></div>
                  )}
                </div>
                <span className={`text-sm font-bold tracking-tight transition-colors duration-500 ${isActive ? 'text-[#e6e9f4]' : isCompleted ? 'text-[#8c92b5]' : 'text-[#454866]'}`}>
                  {stage.label}
                </span>
              </div>
              {isActive && (
                <span className="text-[10px] font-bold text-[#00cfb4] animate-pulse">PROCESSING</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#111318]">
        <div 
          className="h-full bg-[#00cfb4] shadow-[0_0_15px_#00cfb4] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Connection Status */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
         <div className="flex items-center gap-3 opacity-20">
            <div className="w-1 h-1 bg-[#00cfb4] rounded-full animate-ping"></div>
            <span className="text-[8px] font-bold text-[#e6e9f4] uppercase tracking-[0.5em]">Establishing Neural Connection // Sector_Hub_Verified</span>
         </div>
      </div>
    </div>
  );
}
