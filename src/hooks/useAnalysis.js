import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function useAnalysis(ticker, stockData, isELI5) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker || !stockData) return;

    setLoading(true);
    setAnalysis('');
    setError(null);

    const mode = isELI5 ? 'eli5' : 'normal';
    const eventSource = new EventSource(`${API_BASE_URL}/api/analyze/${ticker}?mode=${mode}`);

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        setLoading(false);
        return;
      }

      try {
        const { token, error: backendError } = JSON.parse(event.data);
        if (backendError) {
          setError(backendError);
          eventSource.close();
          setLoading(false);
        } else if (token) {
          setAnalysis((prev) => prev + token);
        }
      } catch (err) {
        console.error("SSE Parse Error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
      setError("Matrix synthesis stream interrupted.");
      eventSource.close();
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [ticker, isELI5, stockData]);

  return { analysis, loading, error };
}
