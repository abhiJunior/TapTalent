import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const isInitialMount = useRef(true);

  const { weatherData, forecastData, favorites } = useSelector((state) => state.weather);
  const { unit } = useSelector((state) => state.settings);

  // FETCH LOGIC: Handles both Favorites (on load) and All Data (on unit change)
  const refreshVisibleWeather = useCallback((targetList) => {
    targetList.forEach((cityName) => {
      dispatch(getWeatherDetail({ city: cityName, unit }));
    });
    
    if (selectedCityName) {
      dispatch(getForecastDetail({ city: selectedCityName, unit }));
    }
  }, [dispatch, unit, selectedCityName]);

  // 1. EFFECT: On Dashboard Load (Fetch Favorites from localStorage)
  useEffect(() => {
    if (favorites.length > 0 && isInitialMount.current) {
      refreshVisibleWeather(favorites);
      isInitialMount.current = false;
    }
  }, [favorites, refreshVisibleWeather]);

  // 2. EFFECT: On Unit Change (Fetch EVERYTHING currently in state)
  useEffect(() => {
    // We skip the very first run because the "On Dashboard Load" effect handles it
    if (!isInitialMount.current) {
      const allCitiesOnScreen = Object.keys(weatherData);
      refreshVisibleWeather(allCitiesOnScreen);
    }
  }, [unit, refreshVisibleWeather]); 

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const now = Date.now();
    const SIXTY_SECONDS = 60000;
    
    const allCitiesOnScreen = Object.keys(weatherData);
    allCitiesOnScreen.forEach((cityName) => {
      const cityInfo = weatherData[cityName];
      if (!cityInfo || (now - cityInfo.timestamp) > SIXTY_SECONDS) {
        dispatch(getWeatherDetail({ city: cityName, unit }));
      }
    });

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleOpenDetails = (cityName) => {
    setSelectedCityName(cityName);
    dispatch(getForecastDetail({ city: cityName, unit }));
  };

  const citiesList = Object.values(weatherData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-x-hidden">
      {/* Background & Header logic remains the same for responsiveness... */}
      {/* (Keep your existing responsive JSX here) */}
      
      <div className="relative z-10 p-4 sm:p-6 md:p-10">
        <header className="max-w-7xl mx-auto mb-6 sm:mb-8 relative z-50">
           {/* ... existing header code ... */}
           <div className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl shadow-xl border border-white/60 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1">
                  <button onClick={handleManualRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none flex justify-center items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/60">
                    <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
                  </button>
                  <button onClick={() => dispatch(toggleUnit())} className="flex-1 sm:flex-none group flex items-center justify-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/60">
                    <Thermometer size={20} className="text-blue-500" />
                    <span className="font-semibold text-slate-700">{unit === 'metric' ? '°C' : '°F'}</span>
                  </button>
                </div>
                <div className="w-full lg:w-auto order-1 sm:order-2">
                  <CitySearch />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto relative z-10">
          {citiesList.length === 0 ? (
            <div className="text-center p-20 bg-white/40 rounded-3xl border border-white/60">
               <Cloud size={48} className="mx-auto text-blue-500 mb-4" />
               <h2 className="text-2xl font-bold text-slate-700">No Cities Tracked</h2>
               <p className="text-slate-500">Search for a city to see weather data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {citiesList.map((city) => (
                <div key={city.id} onClick={() => handleOpenDetails(city.name)} className="cursor-pointer">
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

      {selectedCityName && (
        <DetailedView 
          data={weatherData[selectedCityName]} 
          forecast={forecastData[selectedCityName]}
          unit={unit}
          onClose={() => setSelectedCityName(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;