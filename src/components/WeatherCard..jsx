import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, CloudRain, Cloud, CloudLightning, Wind, Droplets, Star, CloudSnow, CloudFog, CloudDrizzle, Snowflake, Zap } from 'lucide-react';
import { toggleFavorite } from '../store/weatherSlice';

const WeatherCard = ({ city, temp, condition, humidity, wind, icon }) => {
  const dispatch = useDispatch();
  
  const favorites = useSelector((state) => state.weather.favorites);
  const { unit } = useSelector((state) => state.settings);
  const isFavorite = favorites.includes(city);

  // Enhanced weather icon component with animations
  const WeatherIcon = ({ condition }) => {
    const c = condition?.toLowerCase() || '';
    
    // Clear/Sunny
    if (c.includes('clear') || c.includes('sunny')) {
      return (
        <div className="relative">
          {/* Sun rays animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-30 blur-xl animate-pulse"></div>
          </div>
          <Sun 
            size={72} 
            className="relative text-yellow-500 drop-shadow-lg animate-spin-slow" 
            strokeWidth={1.5}
            fill="currentColor"
          />
          {/* Rotating rays */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slower">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-yellow-400 rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-40px)`,
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Rain
    if (c.includes('rain') && !c.includes('drizzle')) {
      return (
        <div className="relative">
          <CloudRain 
            size={72} 
            className="text-blue-500 drop-shadow-lg" 
            strokeWidth={1.5}
          />
          {/* Animated rain drops */}
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-3 bg-blue-400 rounded-full animate-rain"
                style={{
                  left: `${20 + i * 15}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Drizzle
    if (c.includes('drizzle')) {
      return (
        <div className="relative">
          <CloudDrizzle 
            size={72} 
            className="text-cyan-500 drop-shadow-lg" 
            strokeWidth={1.5}
          />
          {/* Light rain animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-2 bg-cyan-300 rounded-full animate-drizzle"
                style={{
                  left: `${25 + i * 12}px`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Thunderstorm
    if (c.includes('thunder') || c.includes('storm')) {
      return (
        <div className="relative">
          <CloudLightning 
            size={72} 
            className="text-purple-600 drop-shadow-lg animate-pulse-fast" 
            strokeWidth={1.5}
          />
          {/* Lightning bolt effect */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <Zap 
              size={24} 
              className="text-yellow-400 animate-lightning"
              fill="currentColor"
            />
          </div>
          {/* Flash effect */}
          <div className="absolute inset-0 bg-yellow-200 rounded-full opacity-0 animate-flash blur-xl"></div>
        </div>
      );
    }
    
    // Snow
    if (c.includes('snow')) {
      return (
        <div className="relative">
          <CloudSnow 
            size={72} 
            className="text-cyan-400 drop-shadow-lg" 
            strokeWidth={1.5}
          />
          {/* Falling snowflakes */}
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            {[...Array(5)].map((_, i) => (
              <Snowflake
                key={i}
                size={12}
                className="absolute text-cyan-300 animate-snow"
                style={{
                  left: `${15 + i * 12}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Mist/Fog/Haze
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
      return (
        <div className="relative">
          <CloudFog 
            size={72} 
            className="text-slate-400 drop-shadow-lg" 
            strokeWidth={1.5}
          />
          {/* Fog layers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-1 bg-slate-300 rounded-full opacity-50 animate-fog mb-2"></div>
            <div className="w-14 h-1 bg-slate-300 rounded-full opacity-40 animate-fog-delay"></div>
          </div>
        </div>
      );
    }
    
    // Cloudy (default)
    return (
      <div className="relative">
        <Cloud 
          size={72} 
          className="text-slate-500 drop-shadow-lg" 
          strokeWidth={1.5}
        />
        {/* Gentle floating animation */}
        <div className="absolute inset-0 bg-slate-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
      </div>
    );
  };

  // Get weather-specific theme
  const getWeatherTheme = (cond) => {
    const c = cond?.toLowerCase() || '';
    
    if (c.includes('clear') || c.includes('sunny')) {
      return {
        gradient: 'from-amber-400 via-orange-400 to-red-500',
        bgGradient: 'from-yellow-50/80 to-orange-50/80',
        cardBg: 'bg-gradient-to-br from-yellow-50/90 via-orange-50/80 to-amber-50/90',
        borderColor: 'border-amber-200/50',
        glowColor: 'group-hover:shadow-amber-300/50',
      };
    }
    if (c.includes('rain') || c.includes('drizzle')) {
      return {
        gradient: 'from-blue-400 via-cyan-500 to-blue-600',
        bgGradient: 'from-blue-50/80 to-cyan-50/80',
        cardBg: 'bg-gradient-to-br from-blue-50/90 via-cyan-50/80 to-blue-50/90',
        borderColor: 'border-blue-200/50',
        glowColor: 'group-hover:shadow-blue-300/50',
      };
    }
    if (c.includes('storm') || c.includes('thunder')) {
      return {
        gradient: 'from-purple-500 via-indigo-600 to-violet-700',
        bgGradient: 'from-purple-50/80 to-indigo-50/80',
        cardBg: 'bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-violet-50/90',
        borderColor: 'border-purple-200/50',
        glowColor: 'group-hover:shadow-purple-300/50',
      };
    }
    if (c.includes('snow')) {
      return {
        gradient: 'from-cyan-300 via-blue-300 to-indigo-400',
        bgGradient: 'from-cyan-50/80 to-blue-50/80',
        cardBg: 'bg-gradient-to-br from-cyan-50/90 via-blue-50/80 to-indigo-50/90',
        borderColor: 'border-cyan-200/50',
        glowColor: 'group-hover:shadow-cyan-300/50',
      };
    }
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
      return {
        gradient: 'from-slate-300 via-gray-400 to-zinc-400',
        bgGradient: 'from-slate-50/80 to-gray-50/80',
        cardBg: 'bg-gradient-to-br from-slate-50/90 via-gray-50/80 to-zinc-50/90',
        borderColor: 'border-slate-200/50',
        glowColor: 'group-hover:shadow-slate-300/50',
      };
    }
    // Default cloudy
    return {
      gradient: 'from-slate-300 via-gray-400 to-slate-500',
      bgGradient: 'from-slate-50/80 to-gray-100/80',
      cardBg: 'bg-gradient-to-br from-slate-50/90 via-gray-50/80 to-slate-100/90',
      borderColor: 'border-slate-200/50',
      glowColor: 'group-hover:shadow-slate-300/50',
    };
  };

  const theme = getWeatherTheme(condition);

  return (
    <div className="group relative transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 ${theme.cardBg} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10`}></div>
      
      {/* Main Card */}
      <div className={`
        relative overflow-hidden
        backdrop-blur-xl ${theme.cardBg}
        rounded-3xl shadow-lg ${theme.glowColor}
        border-2 ${theme.borderColor}
        transition-all duration-500
        cursor-pointer
      `}>
        
        {/* Gradient Accent Bar */}
        <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>
        
        {/* Card Content */}
        <div className="p-6">
          {/* Header with City and Favorite */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-800 truncate mb-1">
                {city}
              </h3>
              <p className="text-sm text-slate-500 capitalize font-medium">
                {condition}
              </p>
            </div>
            
            {/* Favorite Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleFavorite(city));
              }}
              className={`
                p-2.5 rounded-xl transition-all duration-300
                transform hover:scale-110 active:scale-95
                ${isFavorite 
                  ? 'bg-yellow-100 text-yellow-500 hover:bg-yellow-200 shadow-md' 
                  : 'bg-white/50 text-slate-300 hover:bg-white hover:text-yellow-400'
                }
              `}
            >
              <Star 
                size={20} 
                fill={isFavorite ? "currentColor" : "none"}
                className="transition-all duration-300"
              />
            </button>
          </div>

          {/* Weather Icon */}
          <div className="flex justify-center my-6">
            <WeatherIcon condition={condition} />
          </div>
          
          {/* Temperature Display */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {temp}
              </span>
              <span className="text-3xl font-semibold text-slate-400 ml-1">
                °{unit === 'metric' ? 'C' : 'F'}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-white/50">
            {/* Humidity */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-105">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium">Humidity</p>
                <p className="text-sm font-bold text-slate-700">{humidity}%</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-105">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Wind size={18} className="text-teal-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium">Wind</p>
                <p className="text-sm font-bold text-slate-700 truncate">
                  {wind} {unit === 'metric' ? 'm/s' : 'mph'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom shine effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
      </div>

      {/* Custom Animations Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rain {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(40px);
            opacity: 0;
          }
        }
        
        @keyframes drizzle {
          0% {
            transform: translateY(-5px);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(30px);
            opacity: 0;
          }
        }
        
        @keyframes snow {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(40px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes lightning {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        @keyframes fog {
          0%, 100% {
            transform: translateX(-5px);
            opacity: 0.3;
          }
          50% {
            transform: translateX(5px);
            opacity: 0.6;
          }
        }
        
        @keyframes pulse-fast {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }
        
        .animate-rain {
          animation: rain 1.5s ease-in infinite;
        }
        
        .animate-drizzle {
          animation: drizzle 2s ease-in infinite;
        }
        
        .animate-snow {
          animation: snow 3s ease-in-out infinite;
        }
        
        .animate-lightning {
          animation: lightning 2s ease-in-out infinite;
        }
        
        .animate-flash {
          animation: flash 2s ease-in-out infinite;
        }
        
        .animate-fog {
          animation: fog 4s ease-in-out infinite;
        }
        
        .animate-fog-delay {
          animation: fog 4s ease-in-out 0.5s infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WeatherCard;