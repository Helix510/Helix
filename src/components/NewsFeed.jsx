import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function NewsFeed({ ticker, companyName }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/${ticker}?companyName=${encodeURIComponent(companyName || ticker)}`);
        const json = await res.json();
        if (json.success) {
          setNews(json.news);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };

    if (ticker) fetchNews();
  }, [ticker, companyName]);

  if (loading) return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border animate-pulse mb-6">
      <div className="h-6 w-32 bg-input rounded mb-8"></div>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-input rounded-xl"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <h3 className="text-lg font-bold text-primary mb-6 sm:mb-8 tracking-tight">Latest News</h3>
      
      <div className="space-y-6">
        {news.length === 0 ? (
          <p className="text-sm text-muted">No recent news found for {ticker}.</p>
        ) : (
          news.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative block pl-5 sm:pl-6 hover:bg-input/50 transition-all rounded-xl -ml-2 p-2"
            >
              <div className="absolute left-2 top-2 bottom-2 w-1 rounded-full bg-gray-600 group-hover:bg-primary transition-colors"></div>
              <h4 className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors mb-1.5 leading-snug">{item.title}</h4>
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">
                <span>{item.source}</span>
                <span>•</span>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
              {item.summary && <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.summary}</p>}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
