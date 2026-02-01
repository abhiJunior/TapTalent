import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Thermometer, RefreshCw, Cloud, Sparkles } from 'lucide-react';
import WeatherCard from './WeatherCard.';
import CitySearch from "./CitySearch";
import DetailedView from './DetailedView';
import { getWeatherDetail, getForecastDetail } from '../store/weatherSlice';
import { toggleUnit } from '../store/settingSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { weatherData, forecastData, favorites } = useSelector((state) => state.weather);
  const { unit } = useSelector((state) => state.settings);

  // 1. FORCE REFRESH: Used for unit changes and initial mount
  const fetchAllCities = useCallback(() => {
    favorites.forEach((cityName) => {
      dispatch(getWeatherDetail({ city: cityName, unit }));
    });
    
    if (selectedCityName) {
      dispatch(getForecastDetail({ city: selectedCityName, unit }));
    }
  }, [dispatch, favorites, unit, selectedCityName]);

  // 2. SMART REFRESH: Used only for the manual button (60s check)
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const now = Date.now();
    const SIXTY_SECONDS = 60000;

    favorites.forEach((cityName) => {
      const cityInfo = weatherData[cityName];
      if (!cityInfo || (now - cityInfo.timestamp) > SIXTY_SECONDS) {
        dispatch(getWeatherDetail({ city: cityName, unit }));
      }
    });

    // Reset refresh animation after 1 second
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // 3. TRIGGER: Run fetchAllCities whenever the unit changes
  useEffect(() => {
    fetchAllCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]); 

  const handleOpenDetails = (cityName) => {
    setSelectedCityName(cityName);
    dispatch(getForecastDetail({ city: cityName, unit }));
  };

  const citiesList = Object.values(weatherData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 md:p-10">
        {/* Header Section */}
        <header className="max-w-7xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Cloud className="text-white" size={28} />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Weather Analytics
                  </h1>
                </div>
                <p className="text-slate-600 text-sm md:text-base ml-14 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  Real-time monitoring in {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* MANUAL REFRESH BUTTON */}
                <button 
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="group relative p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:bg-white hover:scale-105 transition-all duration-300 text-slate-700 hover:text-blue-600 disabled:opacity-50"
                  title="Refresh stale data (>60s)"
                >
                  <RefreshCw 
                    size={20} 
                    className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                </button>

                {/* UNIT TOGGLE BUTTON */}
                <button 
                  onClick={() => dispatch(toggleUnit())}
                  className="group relative flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:bg-white hover:scale-105 transition-all duration-300 font-semibold text-slate-700"
                >
                  <Thermometer size={20} className="text-blue-500 group-hover:text-purple-500 transition-colors" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {unit === 'metric' ? '°C' : '°F'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                </button>

                {/* SEARCH BUTTON */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <CitySearch />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto">
          {citiesList.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/60 p-20 text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                <Cloud size={64} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 mb-3">Your Dashboard is Empty</h2>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start by searching and adding your favorite cities to track their weather in real-time
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg">
                <Sparkles size={18} />
                <span className="font-medium">Add your first city</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {citiesList.map((city, index) => (
                <div 
                  key={city.id} 
                  onClick={() => handleOpenDetails(city.name)}
                  className="transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <WeatherCard 
                    city={city.name}
                    temp={Math.round(city.main.temp)} 
                    condition={city.weather[0].main}
                    humidity={city.main.humidity}
                    wind={city.wind.speed}
                    icon={city.weather[0].icon}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detailed View Modal */}
      {selectedCityName && weatherData[selectedCityName] && (
        <DetailedView 
          data={weatherData[selectedCityName]} 
          forecast={forecastData[selectedCityName]}
          unit={unit}
          onClose={() => setSelectedCityName(null)} 
        />
      )}

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;