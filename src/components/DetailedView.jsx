import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { 
  X, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset, 
  Cloud,
  Compass,
  CloudRain,
  Activity
} from 'lucide-react';

const DetailedView = ({ data, forecast, onClose, unit }) => {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' or 'daily'

  if (!data) return null;

  // Format hourly forecast data (next 24 hours - 8 intervals of 3 hours)
  const hourlyChartData = forecast?.list?.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(item.dt * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed),
    description: item.weather[0].main,
  })) || [];

  // Format daily forecast (5 days)
  const dailyForecastData = forecast?.list
    ?.filter((_, index) => index % 8 === 0)
    .slice(0, 5)
    .map(day => ({
      day: new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
      fullDate: new Date(day.dt * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      temp: Math.round(day.main.temp),
      tempMin: Math.round(day.main.temp_min),
      tempMax: Math.round(day.main.temp_max),
      icon: day.weather[0].icon,
      description: day.weather[0].description,
      humidity: day.main.humidity,
      windSpeed: Math.round(day.wind.speed),
    })) || [];

  // Get detailed precipitation data
  const precipitationData = hourlyChartData.map(item => ({
    time: item.time,
    rain: forecast?.list?.find(f => 
      new Date(f.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === item.time
    )?.rain?.['3h'] || 0,
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-xs text-slate-600 capitalize">{entry.name}:</span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.value}
                {entry.name.includes('Temp') || entry.name.includes('Feels') 
                  ? `°${unit === 'metric' ? 'C' : 'F'}` 
                  : entry.name === 'Humidity' ? '%' 
                  : entry.name.includes('Wind') ? ' m/s' 
                  : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, subValue, gradient, iconColor }) => (
    <div className="group relative backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/80 hover:bg-white/80 transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium mb-1 truncate">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 truncate">{value}</p>
          {subValue && <p className="text-xs text-slate-500 mt-1 truncate">{subValue}</p>}
        </div>
        <div className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 backdrop-blur-2xl rounded-3xl shadow-2xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header Section */}
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/80 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                  {data.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  {data.sys?.country} • {new Date().toLocaleDateString([], { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2.5 sm:p-3 bg-white/80 hover:bg-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 text-slate-600 hover:text-slate-800"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Current Weather Overview */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-4 sm:p-6 border border-white/80">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Weather Icon & Temp */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@4x.png`}
                      alt={data.weather?.[0]?.description}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent">
                        {Math.round(data.main?.temp)}
                      </span>
                      <span className="text-3xl sm:text-4xl font-semibold text-slate-400 ml-1">
                        °{unit === 'metric' ? 'C' : 'F'}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl text-slate-600 font-medium mt-2 capitalize">
                      {data.weather?.[0]?.description}
                    </p>
                  </div>
                </div>

                {/* High/Low */}
                <div className="flex sm:flex-col gap-4 sm:gap-2 sm:ml-auto">
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl">
                    <Thermometer size={18} className="text-red-500" />
                    <div>
                      <p className="text-xs text-slate-500">High</p>
                      <p className="text-lg font-bold text-slate-800">{Math.round(data.main?.temp_max)}°</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                    <Thermometer size={18} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500">Low</p>
                      <p className="text-lg font-bold text-slate-800">{Math.round(data.main?.temp_min)}°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard 
                icon={Thermometer}
                label="Feels Like"
                value={`${Math.round(data.main?.feels_like)}°`}
                gradient="from-orange-400 to-red-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Droplets}
                label="Humidity"
                value={`${data.main?.humidity}%`}
                gradient="from-blue-400 to-cyan-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Wind}
                label="Wind Speed"
                value={`${Math.round(data.wind?.speed)} m/s`}
                subValue={`${data.wind?.deg}° ${getWindDirection(data.wind?.deg)}`}
                gradient="from-cyan-400 to-teal-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Gauge}
                label="Pressure"
                value={`${data.main?.pressure} hPa`}
                gradient="from-purple-400 to-indigo-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Eye}
                label="Visibility"
                value={`${((data.visibility || 0) / 1000).toFixed(1)} km`}
                gradient="from-indigo-400 to-blue-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Cloud}
                label="Cloudiness"
                value={`${data.clouds?.all || 0}%`}
                gradient="from-slate-400 to-gray-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Sunrise}
                label="Sunrise"
                value={new Date((data.sys?.sunrise || 0) * 1000).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                gradient="from-yellow-400 to-orange-500"
                iconColor="text-white"
              />
              <StatCard 
                icon={Sunset}
                label="Sunset"
                value={new Date((data.sys?.sunset || 0) * 1000).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                gradient="from-pink-400 to-purple-500"
                iconColor="text-white"
              />
            </div>

            {/* Tab Selection */}
            <div className="flex gap-2 sm:gap-3 backdrop-blur-xl bg-white/60 rounded-2xl p-2 border border-white/80">
              <button
                onClick={() => setActiveTab('hourly')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'hourly'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <span className="hidden sm:inline">Hourly Forecast</span>
                <span className="sm:hidden">Hourly</span>
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <span className="hidden sm:inline">5-Day Forecast</span>
                <span className="sm:hidden">5-Day</span>
              </button>
            </div>

            {/* Hourly Tab Content */}
            {activeTab === 'hourly' && hourlyChartData.length > 0 && (
              <div className="space-y-6">
                {/* Temperature Chart */}
                <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-4 sm:p-6 border border-white/80">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity className="text-blue-500" size={24} />
                    <span className="hidden sm:inline">24-Hour Temperature Trend</span>
                    <span className="sm:hidden">Temperature</span>
                  </h3>
                  <div className="h-64 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyChartData}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          interval="preserveStartEnd"
                          tickMargin={10}
                        />
                        <YAxis 
                          stroke="#64748b"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          tickMargin={10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="temp" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fill="url(#tempGradient)"
                          name="Temperature"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="feelsLike" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          fill="url(#feelsLikeGradient)"
                          name="Feels Like"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Humidity & Wind Charts */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Humidity Chart */}
                  <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-4 sm:p-6 border border-white/80">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Droplets className="text-blue-500" size={20} />
                      Humidity
                    </h3>
                    <div className="h-48 sm:h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={hourlyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#64748b"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            stroke="#64748b" 
                            tick={{ fontSize: 10, fill: '#64748b' }} 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="humidity" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', r: 4 }}
                            name="Humidity"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Wind Speed Chart */}
                  <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-4 sm:p-6 border border-white/80">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Wind className="text-teal-500" size={20} />
                      Wind Speed
                    </h3>
                    <div className="h-48 sm:h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#64748b"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            stroke="#64748b" 
                            tick={{ fontSize: 10, fill: '#64748b' }} 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="windSpeed" 
                            fill="#14b8a6" 
                            radius={[8, 8, 0, 0]}
                            name="Wind Speed"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Tab Content */}
            {activeTab === 'daily' && dailyForecastData.length > 0 && (
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-4 sm:p-6 border border-white/80">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Cloud className="text-blue-500" size={24} />
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {dailyForecastData.map((day, index) => (
                    <div 
                      key={index}
                      className="backdrop-blur-sm bg-white/50 rounded-2xl p-3 sm:p-4 text-center border border-white/60 hover:bg-white/70 hover:scale-105 transition-all duration-300"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">{day.day}</p>
                      <p className="text-xs text-slate-500 mb-2 sm:mb-3">{day.fullDate}</p>
                      <img 
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                      />
                      <p className="text-xs text-slate-500 mb-2 sm:mb-3 capitalize truncate">{day.description}</p>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2">
                        <span className="font-bold text-red-500">{day.tempMax}°</span>
                        <span className="text-slate-400">/</span>
                        <span className="font-bold text-blue-500">{day.tempMin}°</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                        <div className="flex items-center justify-center gap-1 bg-blue-50 rounded-lg p-1">
                          <Droplets size={12} className="text-blue-500" />
                          <span className="text-slate-600">{day.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-teal-50 rounded-lg p-1">
                          <Wind size={12} className="text-teal-500" />
                          <span className="text-slate-600">{day.windSpeed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// Helper function to get wind direction
const getWindDirection = (degrees) => {
  if (!degrees && degrees !== 0) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export default DetailedView;