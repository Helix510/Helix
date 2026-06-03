import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import SP500 from '../data/sp500.js';

export default function SearchBar({ onSearch, placeholder, error, variant = 'home' }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = SP500.filter(item => 
        item.ticker.toLowerCase().includes(input.toLowerCase()) || 
        item.name.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
    setSelectedIndex(-1);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex].ticker);
      } else if (input.trim()) {
        handleSelect(input.trim().toUpperCase());
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSelect = (ticker) => {
    setInput('');
    setShowDropdown(false);
    onSearch(ticker);
  };

  const isHome = variant === 'home';

  return (
    <div className={`relative w-full ${isHome ? 'max-w-[600px]' : 'max-w-xl'}`}>
      <div className={`absolute -inset-1 bg-[#00cfb4]/5 rounded-3xl blur-xl ${showDropdown ? 'bg-[#00cfb4]/10' : ''} transition-all`}></div>
      <div className="relative">
        <input 
          ref={inputRef}
          type="text" 
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => input.trim().length > 0 && setShowDropdown(true)}
          className={`w-full bg-[#111318] border ${error ? 'border-[#ff4f70]' : 'border-[#1d2030]'} rounded-2xl pl-10 pr-12 sm:pl-12 sm:pr-16 ${isHome ? 'py-4 sm:py-5 text-base sm:text-lg' : 'py-2 sm:py-2.5 text-xs sm:text-sm'} font-medium text-white placeholder:text-[#454866] focus:outline-none focus:border-[#00cfb4]/50 focus:ring-1 focus:ring-[#00cfb4]/30 transition-all shadow-2xl`}
        />
        <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#454866] group-focus-within:text-[#00cfb4] transition-colors`} size={isHome ? (window.innerWidth < 640 ? 20 : 24) : 16} />
        {isHome && (
          <button 
            onClick={() => input.trim() && handleSelect(input.trim().toUpperCase())}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-[#00cfb4] text-[#08090d] w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,207,180,0.3)]"
          >
            <ArrowRight size={18} smSize={20} strokeWidth={3} />
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#0c0e14] border border-[#1d2030] rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          {suggestions.map((item, index) => (
            <button
              key={item.ticker}
              onClick={() => handleSelect(item.ticker)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-4 text-left transition-colors border-l-2 ${selectedIndex === index ? 'bg-[#1a1c26] border-[#00cfb4]' : 'border-transparent hover:bg-[#111318]'}`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#00cfb4]/10 border border-[#00cfb4]/20 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black text-[#00cfb4] shrink-0">
                {item.ticker[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white uppercase">{item.ticker}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-[#8c92b5] uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">{item.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
