

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { X } from 'lucide-react';

const DetailedView = ({ data, forecast, onClose, unit }) => {
  // Format forecast data for the chart (taking 3-hour intervals)
  const chartData = forecast?.list?.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{data.name}</h2>
          <p className="text-slate-500">24-Hour Temperature Trend</p>
        </div>

        {/* Temperature Chart */}
        <div className="h-64 w-full mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                unit={unit === 'metric' ? "°C" : "°F"}
              />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 5-Day Forecast Summary List */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast?.list?.filter((_, index) => index % 8 === 0).map((day, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl text-center">
              <p className="text-sm font-medium text-slate-500">
                {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}
              </p>
              <img 
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                alt="weather" 
                className="mx-auto w-12 h-12"
              />
              <p className="text-lg font-bold text-slate-800">{Math.round(day.main.temp)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedView