import React, { useState, useEffect } from 'react';
import { Search, Globe, MessageSquare, Volume2, Mail, ShieldCheck, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Research({ query, onReset, onSearch }) {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchResearch();
  }, [query]);

  const fetchResearch = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const json = JSON.parse(data);
              if (json.token) setResult(prev => prev + json.token);
            } catch (e) {
              // Not JSON
            }
          }
        }
      }
    } catch (err) {
      setResult("Failed to reach research matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-background text-[#e6e9f4]">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onReset}>
          <div className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center group-hover:border-primary transition-colors">
            <span className="text-xs font-mono font-black text-primary">HX</span>
          </div>
          <span className="text-xl font-mono font-black tracking-tighter uppercase">Helix</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Ask anything..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-10 py-2 text-sm font-mono placeholder:text-muted/50 focus:outline-none focus:border-primary transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        </form>

        <div className="flex items-center gap-4 text-muted">
           <Globe size={18} />
           <MessageSquare size={18} />
           <div className="h-4 w-px bg-border mx-1"></div>
           <Volume2 size={18} />
           <Mail size={18} />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tighter italic">{query}</h2>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1"><Activity size={10} className="text-primary" /> Synthesis Matrix Active</span>
              <span>Source: Global Data Hub</span>
            </div>
          </div>

          <div className="p-8 bg-surface/50 border border-border/50 rounded-2xl min-h-[400px] relative overflow-hidden prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-widest">
            {loading && !result && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                </div>
                <p className="text-[10px] font-mono font-bold text-muted uppercase tracking-[0.2em]">Synthesizing market intelligence...</p>
              </div>
            )}
            
            <div className="whitespace-pre-wrap">
              {result}
              {loading && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 bg-surface border border-border rounded-xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-success" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block">Data Integrity</span>
                  <span className="text-xs font-mono text-white">Institutional Grade Verified</span>
                </div>
             </div>
             <div className="p-4 bg-surface border border-border rounded-xl flex items-center gap-3">
                <Activity size={20} className="text-primary" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block">Processing Latency</span>
                  <span className="text-xs font-mono text-white">0.42ms Inference Depth</span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
