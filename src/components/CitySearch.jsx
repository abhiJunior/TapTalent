import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Loader2, X, TrendingUp } from 'lucide-react';
import { getWeatherDetail, getCitySuggestions, clearSearch } from '../store/weatherSlice';

const CitySearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  
  const { searchResults, searchLoading, unit, favorites } = useSelector((state) => state.weather);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (query.length < 2) {
      dispatch(clearSearch());
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const timer = setTimeout(() => {
      dispatch(getCitySuggestions(query));
    }, 400); // Slightly faster debounce for better UX

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSelect = (city) => {
    dispatch(getWeatherDetail({ city: city.name, unit }));
    setQuery('');
    dispatch(clearSearch());
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearch());
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  
  const getRecentSearches = () => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent).slice(0, 3) : [];
    } catch {
      return [];
    }
  };

  const saveRecentSearch = (cityName) => {
    try {
      const recent = getRecentSearches();
      const updated = [cityName, ...recent.filter(c => c !== cityName)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  const handleSelectWithHistory = (city) => {
    saveRecentSearch(city.name);
    handleSelect(city);
  };

  const recentSearches = getRecentSearches();
  const showRecent = isOpen && query.length === 0 && recentSearches.length > 0;
  const showSuggestions = isOpen && searchResults.length > 0;
  const showNoResults = isOpen && query.length >= 2 && !searchLoading && searchResults.length === 0;

  return (
    <div ref={searchRef} className="relative w-full md:w-96">
      {/* Search Input */}
      <div className="relative group">
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search for a city..." 
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border-2 border-slate-200 shadow-sm 
                     hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                     outline-none transition-all duration-200 text-slate-800 placeholder-slate-400"
        />
        
        {/* Search Icon */}
        <Search 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
          size={18} 
        />
        
        {/* Loading Spinner or Clear Button */}
        {searchLoading ? (
          <Loader2 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" 
            size={18} 
          />
        ) : query.length > 0 ? (
          <button
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 
                       hover:bg-slate-100 rounded-full p-1 transition-all"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Dropdown Results */}
      {(showSuggestions || showRecent || showNoResults) && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
          
          {/* Recent Searches */}
          {showRecent && (
            <div className="border-b border-slate-100">
              <div className="px-4 py-2 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Recent Searches
                </p>
              </div>
              <ul className="py-1">
                {recentSearches.map((cityName, index) => (
                  <li 
                    key={`recent-${index}`}
                    onClick={() => {
                      setQuery(cityName);
                      dispatch(getCitySuggestions(cityName));
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer 
                               transition-colors group"
                  >
                    <MapPin size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium text-slate-700 group-hover:text-blue-600">{cityName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search Suggestions */}
          {showSuggestions && (
            <ul className="max-h-80 overflow-y-auto py-1">
              {searchResults.map((city, index) => {
                const isInFavorites = favorites.includes(city.name);
                
                return (
                  <li 
                    key={`${city.name}-${city.country}-${index}`}
                    onClick={() => handleSelectWithHistory(city)}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-blue-50 
                               cursor-pointer transition-colors group border-b border-slate-50 last:border-none"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 
                                      flex items-center justify-center transition-colors">
                        <MapPin size={16} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                            {city.name}
                          </span>
                          {isInFavorites && (
                            <span className="flex-shrink-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                              Favorite
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {city.state ? `${city.state}, ` : ''}{city.country}
                        </p>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg 
                          className="w-3 h-3 text-white" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">No cities found</p>
              <p className="text-xs text-slate-500">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Inline Styles for Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CitySearch;