import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { getWeatherDetail, getCitySuggestions, clearSearch } from '../store/weatherSlice';

const CitySearch = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  
  // Grab search results and loading state from Redux
  const { searchResults, searchLoading, unit } = useSelector((state) => state.weather);

  useEffect(() => {
    if (query.length < 3) {
      dispatch(clearSearch());
      return;
    }

    const timer = setTimeout(() => {
      // Dispatching the thunk instead of calling API directly
      dispatch(getCitySuggestions(query));
    }, 500);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSelect = (city) => {
    dispatch(getWeatherDetail({ city: city.name, unit }));
    setQuery('');
    dispatch(clearSearch());
  };

  return (
    <div className="relative w-full md:w-96 z-50">
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..." 
          className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        {searchLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />}
      </div>

      {searchResults.length > 0 && (
        <ul className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {searchResults.map((city, index) => (
            <li 
              key={`${city.name}-${index}`}
              onClick={() => handleSelect(city)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b last:border-none border-slate-50"
            >
              <MapPin size={16} className="text-slate-400" />
              <div>
                <span className="font-medium text-slate-800">{city.name}</span>
                <span className="text-xs text-slate-500 ml-2">{city.state ? `${city.state}, ` : ''}{city.country}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;