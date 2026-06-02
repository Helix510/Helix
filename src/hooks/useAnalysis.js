import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function useAnalysis(ticker, stockData) {
  const [analysis, setAnalysis] = useState('');
  const [rating, setRating] = useState('HOLD');
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker || !stockData) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/analyze/${ticker}`);
        const data = await res.json();

        if (data.success) {
          setAnalysis(data.analysis);
          setRating(data.rating);
          setConfidence(data.confidence);
        } else {
          setError(data.error || "Analysis failed.");
        }
      } catch (err) {
        console.error("Analysis Fetch Error:", err);
        setError("Failed to reach research matrix.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [ticker, stockData]);

  return { analysis, rating, confidence, loading, error };
}
