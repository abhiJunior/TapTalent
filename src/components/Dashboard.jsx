import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings, Thermometer } from 'lucide-react'; // Icons for the toggle
import WeatherCard from './WeatherCard.';
import CitySearch from "./CitySearch";
import DetailedView from './DetailedView';
import { getWeatherDetail, getForecastDetail } from '../store/weatherSlice';
import { toggleUnit } from '../store/settingSlice'; // Import the new action

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedCityName, setSelectedCityName] = useState(null);

  // 1. Get state from both slices
  const { weatherData, forecastData, favorites } = useSelector((state) => state.weather);
  const {unit} = useSelector((state)=> state.settings)// Get unit from settings slice

  // 2. Re-fetch weather when unit changes
  useEffect(() => {
    if (favorites.length > 0) {
      favorites.forEach((cityName) => {
        // When unit changes, we force a re-fetch to get correct API values
        dispatch(getWeatherDetail({ city: cityName, unit }));
      });
    }
    
    // If a detailed view is open, update its forecast too
    if (selectedCityName) {
        dispatch(getForecastDetail({ city: selectedCityName, unit }));
    }
  }, [dispatch, unit, favorites]); // Depend on unit to trigger re-fetch

  const handleOpenDetails = (cityName) => {
    setSelectedCityName(cityName);
    dispatch(getForecastDetail({ city: cityName, unit }));
  };

  const citiesList = Object.values(weatherData);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 relative">
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Weather Analytics</h1>
            <p className="text-slate-500">Explore patterns in {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* UNIT TOGGLE BUTTON */}
            <button 
              onClick={() => dispatch(toggleUnit())}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all font-medium text-slate-700"
            >
              <Thermometer size={18} className="text-blue-500" />
              <span>{unit === 'metric' ? '°C' : '°F'}</span>
            </button>

            <CitySearch />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {citiesList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-xl font-medium">Your dashboard is empty</p>
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

      {selectedCityName && weatherData[selectedCityName] && (
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