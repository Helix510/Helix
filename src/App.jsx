import React, { useState } from 'react';
import Home from './pages/Home.jsx';
import Report from './pages/Report.jsx';
import Research from './pages/Research.jsx';
import { API_BASE_URL } from './config.js';

function App() {
  const [ticker, setTicker] = useState(null);
  const [researchQuery, setResearchQuery] = useState(null);
  const [isELI5, setIsELI5] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setError(null);

    // DECISION MATRIX: Single word = Ticker, Multiple words = Research
    const words = trimmedQuery.split(/\s+/);

    if (words.length === 1) {
      const ticker = trimmedQuery.toUpperCase();
      // Validate ticker via a quick fetch to see if it's S&P 500
      try {
        const res = await fetch(`${API_BASE_URL}/api/stock/${ticker}`);
        const json = await res.json();
        if (json.success) {
          setTicker(ticker);
          setResearchQuery(null);
        } else {
          setError(json.message || "Ticker not found in S&P 500 index.");
        }
      } catch (err) {
        setError("Failed to validate ticker with research matrix.");
      }
      return;
    }

    // For multi-word queries, we use the research/search pipeline
    setResearchQuery(trimmedQuery);
    setTicker(null);
  };

  const resetSearch = () => {
    setTicker(null);
    setResearchQuery(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {!ticker && !researchQuery && (
        <Home onSearch={handleSearch} error={error} />
      )}
      {ticker && (
        <Report 
          ticker={ticker} 
          onSearch={handleSearch} 
          onReset={resetSearch} 
          isELI5={isELI5}
          toggleELI5={() => setIsELI5(!isELI5)}
        />
      )}
      {researchQuery && (
        <Research 
          query={researchQuery}
          onSearch={handleSearch}
          onReset={resetSearch}
        />
      )}
    </div>
  );
}

export default App;
