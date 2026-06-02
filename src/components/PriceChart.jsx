import React, { useState, useEffect } from 'react';
import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import { API_BASE_URL } from '../config.js';

const RANGES = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' }
];

export default function PriceChart({ ticker }) {
  const [range, setRange] = useState('1y');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, [range, ticker]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/stock/${ticker}/history?range=${range}`);
      const json = await res.json();
      if (json.success) {
        const formatted = json.data.map(item => ({
          date: item.date,
          fullDate: new Date(item.date).toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: range === '1d' || range === '1w' ? '2-digit' : undefined,
            minute: range === '1d' || range === '1w' ? '2-digit' : undefined
          }),
          price: item.close
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch historical data", err);
    } finally {
      setLoading(false);
    }
  };

  const formatXAxis = (dateStr) => {
    const date = new Date(dateStr);
    if (range === '1d') {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    if (range === '1w') {
      const day = date.toLocaleDateString([], { weekday: 'short' });
      const hour = date.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${day} ${displayHour}${ampm}`;
    }
    if (range === '1m' || range === '3m') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    if (range === '1y' || range === '2y') {
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
    if (range === '5y') {
      return date.getFullYear().toString();
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const strokeColor = '#00cfb4'; // Helix Teal

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c0e14] border border-[#1d2030] p-4 shadow-2xl rounded-2xl font-['DM_Sans']">
          <p className="text-[10px] font-bold text-[#8c92b5] mb-1 uppercase tracking-widest">{payload[0].payload.fullDate}</p>
          <p className="text-xl font-bold text-[#e6e9f4] font-['JetBrains_Mono']">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  if (loading && data.length === 0) {
    return (
      <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 animate-pulse">
        <div className="h-6 w-32 bg-input rounded mb-8"></div>
        <div className="h-[500px] bg-background rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="text-xl font-bold text-primary tracking-tight">Market Trajectory</h3>
          <p className="text-sm font-medium text-muted mt-1">Price history for {ticker}</p>
        </div>
        <div className="flex gap-1 p-1 bg-input rounded-xl">
          {RANGES.map((r) => (
            <button 
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${range === r.value ? 'bg-surface text-primary border border-border' : 'text-muted hover:text-primary'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[500px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-surface/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8c92b5', fontSize: 11, fontWeight: 600 }}
              minTickGap={80}
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              dy={15}
            />
            
            <YAxis 
              domain={['dataMin * 0.98', 'dataMax * 1.02']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8c92b5', fontSize: 11, fontWeight: 600 }}
              dx={-10}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#1d2030', strokeWidth: 1.5 }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1500}
              activeDot={{ r: 6, fill: strokeColor, stroke: '#08090d', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
