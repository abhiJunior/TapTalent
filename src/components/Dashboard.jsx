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

  const fetchAllCities = useCallback(() => {
    favorites.forEach((cityName) => {
      dispatch(getWeatherDetail({ city: cityName, unit }));
    });
    
    if (selectedCityName) {
      dispatch(getForecastDetail({ city: selectedCityName, unit }));
    }
  }, [dispatch, favorites, unit, selectedCityName]);

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

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    fetchAllCities();
  }, [unit]); 

  const handleOpenDetails = (cityName) => {
    setSelectedCityName(cityName);
    dispatch(getForecastDetail({ city: cityName, unit }));
  };

  const citiesList = Object.values(weatherData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-x-hidden">
      {/* Animated Background Elements - Hidden on very small screens to improve performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-10">
        {/* Header Section */}
        <header className="max-w-7xl mx-auto mb-6 sm:mb-8 relative z-50">
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl shadow-xl border border-white/60 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Title Area */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg shrink-0">
                    <Cloud className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                    Weather Analytics
                  </h1>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base flex items-center gap-2 sm:ml-12">
                  <Sparkles size={14} className="text-purple-500 shrink-0" />
                  <span className="truncate">Monitoring in {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</span>
                </p>
              </div>
              
              {/* Controls Area */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1">
                  {/* MANUAL REFRESH BUTTON */}
                  <button 
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="flex-1 sm:flex-none flex justify-center items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/60 hover:bg-white hover:scale-105 transition-all text-slate-700 hover:text-blue-600 disabled:opacity-50"
                  >
                    <RefreshCw 
                      size={20} 
                      className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                  </button>

                  {/* UNIT TOGGLE BUTTON */}
                  <button 
                    onClick={() => dispatch(toggleUnit())}
                    className="flex-1 sm:flex-none group flex items-center justify-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/60 hover:bg-white hover:scale-105 transition-all font-semibold text-slate-700"
                  >
                    <Thermometer size={20} className="text-blue-500 group-hover:text-purple-500 transition-colors" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {unit === 'metric' ? '°C' : '°F'}
                    </span>
                  </button>
                </div>

                {/* SEARCH COMPONENT - Full width on mobile */}
                <div className="w-full lg:w-auto order-1 sm:order-2">
                  <CitySearch />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto relative z-10">
          {citiesList.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl shadow-xl border border-white/60 p-8 sm:p-20 text-center">
              <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4 sm:mb-6">
                <Cloud size={48} className="text-blue-500 sm:w-16 sm:h-16" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">Your Dashboard is Empty</h2>
              <p className="text-sm sm:text-base text-slate-500 mb-6 max-w-md mx-auto">
                Search and add cities to track weather in real-time.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg text-sm sm:text-base">
                <Sparkles size={16} />
                <span className="font-medium">Add your first city</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {citiesList.map((city, index) => (
                <div 
                  key={city.id} 
                  onClick={() => handleOpenDetails(city.name)}
                  className="transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
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

      {selectedCityName && weatherData[selectedCityName] && (
        <DetailedView 
          data={weatherData[selectedCityName]} 
          forecast={forecastData[selectedCityName]}
          unit={unit}
          onClose={() => setSelectedCityName(null)} 
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;