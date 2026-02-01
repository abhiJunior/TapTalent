# Weather Analytics Dashboard

A professional, real-time weather monitoring dashboard built with React, Redux Toolkit, and Tailwind CSS. This application provides live weather updates, detailed 5-day forecasts, and a smart data-refresh system.

## 🚀 Live Demo

[https://tap-talent-six.vercel.app/]

## ✨ Key Features

- **Real-Time Monitoring**: View current weather data (Temp, Humidity, Wind, Conditions) for multiple cities.

- **Smart Refresh System**:
  - **Manual Refresh**: A dedicated button that only fetches new data for cities whose data is older than 60 seconds (optimized for API usage).
  - **Unit Sync**: Changing between Metric (°C) and Imperial (°F) triggers an immediate, forced global update.

- **Detailed Analytics**: Interactive detailed view showing a 5-day weather forecast.

- **Persistence**: Favorites and selected cities are saved in localStorage, so your dashboard stays the same after a refresh.

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views using Tailwind CSS.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI Library & Component Architecture |
| Redux Toolkit | State Management (Slices, AsyncThunks) |
| Lucide React | High-quality iconography |
| Tailwind CSS | Utility-first styling and responsiveness |
| OpenWeather API | Source for real-time and forecast data |

## 🏗️ Architecture & State Management

The application follows a feature-based Redux architecture to ensure scalability:

### 1. Weather Slice (weatherSlice.js)
- `weatherData`: A normalized object where city names are keys. Each entry includes a timestamp to manage the "stale data" logic.
- `favorites`: Tracks which cities the user has added to their dashboard.
- `lastUpdated`: A global state tracking the most recent successful API sync.

### 2. Settings Slice (settingSlice.js)
- `unit`: Global toggle for metric vs imperial. Changing this state acts as a dependency for the Dashboard's primary data-fetching hook.

## ⚙️ Installation & Setup

### Clone the repository:
```bash
git clone https://github.com/abhiJunior/TapTalent
cd weather-analytics-dashboard
```

### Install dependencies:
```bash
npm install
```

### Environment Variables:
Create a `.env` file in the root directory and add your OpenWeather API Key:
```
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

### Run the application:
```bash
npm start
```

## 📝 Assignment Requirements Checklist

- [x] State Management: Used Redux Toolkit with createSlice and createAsyncThunk.
- [x] Data Fetching: Integrated OpenWeatherMap API for current and forecast data.
- [x] Unit Conversion: Implemented seamless toggle between Celsius and Fahrenheit.
- [x] Smart Refresh: Implemented logic to refresh stale data (>60s) independently of unit toggling.
- [x] Dashboard UI: Grid-based layout with interactive weather cards.
- [x] Documentation: Comprehensive README with setup instructions.

## 💡 Technical Challenges & Learnings

**The "Double Trigger" Challenge**: During development, I encountered an issue where the 60s refresh guard interfered with the unit toggle. I solved this by separating the "Manual Refresh" (conditional) from the "Unit Change" effect (forced), ensuring the UI updates immediately when a user switches temperature units.

**Data Normalization**: Storing weather data by city name as a key in Redux made it significantly easier to update individual cards without re-rendering the entire list.

---

Built with ❤️ for real-time weather monitoring
