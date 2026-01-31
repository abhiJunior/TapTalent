import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WeatherCard from './WeatherCard.';
import CitySearch from "./CitySearch"
import DetailedView from './DetailedView';
import { getWeatherDetail, getForecastDetail } from '../store/weatherSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // State to track selected city for the Detailed View modal
  const [selectedCityName, setSelectedCityName] = useState(null);

  // 1. Get state from Redux
  const { weatherData, forecastData, unit, favorites } = useSelector((state) => state.weather);
  
  // 2. Fetch weather for favorites on mount
  useEffect(() => {
    if (favorites.length > 0) {
      favorites.forEach((cityName) => {
        if (!weatherData[cityName]) {
          dispatch(getWeatherDetail({ city: cityName, unit }));
        }
      });
    }
  }, [dispatch, favorites, unit]);

  // Handle opening the detailed view
  const handleOpenDetails = (cityName) => {
    setSelectedCityName(cityName);
    // Fetch forecast data specifically for the detailed view charts
    dispatch(getForecastDetail({ city: cityName, unit }));
  };

  const citiesList = Object.values(weatherData);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 relative">
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Weather Analytics</h1>
            <p className="text-slate-500">Explore short-term and long-term patterns</p>
          </div>
          <CitySearch />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {citiesList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-xl font-medium">Your dashboard is empty</p>
            <p>Search for a city to see the weather here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {citiesList.map((city) => (
              <div key={city.id} onClick={() => handleOpenDetails(city.name)}>
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

      {/* 3. Render DetailedView Modal if a city is selected */}
      {selectedCityName && weatherData[selectedCityName] && (
        <DetailedView 
          data={weatherData[selectedCityName]} 
          forecast={forecastData[selectedCityName]} // Passed from Redux
          unit={unit}
          onClose={() => setSelectedCityName(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;