import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, CloudRain, Cloud, CloudLightning, Wind, Droplets, Star } from 'lucide-react';
import { toggleFavorite } from '../store/weatherSlice';

const WeatherCard = ({ city, temp, condition, humidity, wind,icon }) => {
  const dispatch = useDispatch();
  
  // 1. Check if this city is in the favorites list in Redux
  const favorites = useSelector((state) => state.weather.favorites);
  const unit = useSelector((state) => state.weather.unit);
  const isFavorite = favorites.includes(city);

  // 2. Helper to get the correct icon based on condition string
  const getWeatherIcon = (cond) => {
    console.log("cond",cond)
    const c = cond?.toLowerCase();
    if (c?.includes('rain')) return <CloudRain size={64} strokeWidth={1.5} />;
    if (c?.includes('cloud')) return <Cloud size={64} strokeWidth={1.5} />;
    if (c?.includes('storm')) return <CloudLightning size={64} strokeWidth={1.5} />;
    else{
        return <Sun size={64} strokeWidth={1.5} />
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer relative group">
      {/* Favorite Toggle Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent opening detailed view when clicking star
          dispatch(toggleFavorite(city));
        }}
        className={`absolute top-4 right-4 transition-colors ${
          isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'
        }`}
      >
        <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <div className="flex flex-col items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">{city}</h3>
        <p className="text-slate-500 capitalize">{condition}</p>
        
        <div className="my-4 text-orange-500">
          {getWeatherIcon(condition)}
        </div>
        
        <h2 className="text-5xl font-light text-slate-900">
          {temp}°<span className="text-2xl font-normal">{unit === 'metric' ? 'C' : 'F'}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Droplets size={18} className="text-blue-400" />
          <span className="text-sm">{humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Wind size={18} className="text-teal-400" />
          <span className="text-sm">{wind} {unit === 'metric' ? 'km/h' : 'mph'}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard