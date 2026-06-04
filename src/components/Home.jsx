// React
import { useEffect, useState } from 'react'

// Context
import { usePreferences } from '../context/PreferencesContext'
import { useWeather } from '../context/WeatherContext'

// Navigation icons
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'

// Weather icons
import WbCloudyIcon from '@mui/icons-material/WbCloudy'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import AirIcon from '@mui/icons-material/Air'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import OpacityIcon from '@mui/icons-material/Opacity'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'
import GrainIcon from '@mui/icons-material/Grain'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import DehazeIcon from '@mui/icons-material/Dehaze'

const LOCATIONS = [
  { city: 'North Vancouver', region: 'BC', country: 'CA', lat: 49.3198, lon: -123.0724 },
  { city: 'Vancouver', region: 'BC', country: 'CA', lat: 49.2827, lon: -123.1207 },
  { city: 'Whistler', region: 'BC', country: 'CA', lat: 50.1163, lon: -122.9574 },
  { city: 'Squamish', region: 'BC', country: 'CA', lat: 49.7016, lon: -123.1558 },
  { city: 'Kelowna', region: 'BC', country: 'CA', lat: 49.8880, lon: -119.4960 },
  { city: 'Victoria', region: 'BC', country: 'CA', lat: 48.4284, lon: -123.3656 },
  { city: 'Calgary', region: 'AB', country: 'CA', lat: 51.0447, lon: -114.0719 },
  { city: 'Banff', region: 'AB', country: 'CA', lat: 51.1784, lon: -115.5708 },
  { city: 'Toronto', region: 'ON', country: 'CA', lat: 43.6532, lon: -79.3832 },
  { city: 'Ottawa', region: 'ON', country: 'CA', lat: 45.4215, lon: -75.6972 },
  { city: 'Seattle', region: 'WA', country: 'US', lat: 47.6062, lon: -122.3321 },
  { city: 'Portland', region: 'OR', country: 'US', lat: 45.5051, lon: -122.6750 },
]

function getWeatherIcon(weatherCode, size = 40, isNight = false) {
  if (weatherCode >= 200 && weatherCode < 300) return <ThunderstormIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 300 && weatherCode < 600) return <GrainIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 600 && weatherCode < 700) return <AcUnitIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 700 && weatherCode < 800) return <DehazeIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode === 800) {
    return isNight
      ? <NightsStayIcon style={{ fontSize: size, color: '#6B7E8F' }} />
      : <WbSunnyIcon style={{ fontSize: size, color: '#E8C870' }} />
  }
  return <WbCloudyIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
}

function getOutlookBarStyle(low, high, allData) {
  const minTemp = Math.min(...allData.map(d => d.low)) - 2
  const maxTemp = Math.max(...allData.map(d => d.high)) + 2
  const range = maxTemp - minTemp
  const leftPercent = ((low - minTemp) / range) * 100
  const widthPercent = ((high - low) / range) * 100
  return {
    marginLeft: `${leftPercent}%`,
    width: `${widthPercent}%`,
    background: 'linear-gradient(to right, #7EB8D4, #E8C870, #E89080)',
    height: '100%',
    borderRadius: '3px',
  }
}

function formatTime(unixTimestamp, timezoneOffset) {
  const utcMs = unixTimestamp * 1000
  const localMs = utcMs + timezoneOffset * 1000
  const date = new Date(localMs)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  if (minutes === 0) return `${displayHours} ${ampm}`
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function getDayName(unixTimestamp, timezoneOffset) {
  const localMs = unixTimestamp * 1000 + timezoneOffset * 1000
  const date = new Date(localMs)
  const todayMs = Date.now() + timezoneOffset * 1000
  const today = new Date(todayMs)
  if (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  ) return 'Today'
  return date.toLocaleDateString([], { weekday: 'short' })
}

function buildTodayForecast(forecastList, timezoneOffset) {
  const now = Date.now() / 1000
  const upcoming = forecastList.filter(item => item.dt >= now)
  return upcoming.slice(0, 8).map(item => ({
    time: formatTime(item.dt, timezoneOffset),
    temp: Math.round(item.main.temp),
    weatherCode: item.weather[0].id,
    rain: Math.round((item.pop || 0) * 100),
  }))
}

function buildOutlookData(forecastList, timezoneOffset) {
  const days = {}
  forecastList.forEach(item => {
    const day = getDayName(item.dt, timezoneOffset)
    if (!days[day]) {
      days[day] = { temps: [], weatherCode: item.weather[0].id }
    }
    days[day].temps.push(item.main.temp)
  })
  return Object.entries(days).slice(0, 5).map(([day, data]) => ({
    day,
    low: Math.round(Math.min(...data.temps)),
    high: Math.round(Math.max(...data.temps)),
    weatherCode: data.weatherCode
  }))
}

function Home({ setPage }) {
  const { location, setLocation } = usePreferences()
  const { weather, loading, error, fetchWeather } = useWeather()
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon)
    }
  }, [location])

  function handleLocationSelect(loc) {
    setLocation(loc)
    setShowLocationPicker(false)
  }

  let todayForecast = []
  let outlookData = []
  let isNight = false

  if (weather) {
    const timezoneOffset = weather.current.timezone
    const now = Date.now() / 1000
    const sunrise = weather.current.sys.sunrise
    const sunset = weather.current.sys.sunset
    isNight = now < sunrise || now > sunset
    todayForecast = buildTodayForecast(weather.forecast, timezoneOffset)
    outlookData = buildOutlookData(weather.forecast, timezoneOffset)
  }

  return (
    <div className="home">

      <nav className="home-nav">
        {/* Left: wordmark + location */}
        <div className="home-nav-left">
          <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
          <div className="home-nav-location">
            <LocationOnIcon style={{ fontSize: 14 }} />
            <span>{location?.city}, {location?.region}</span>
          </div>
        </div>

        {/* Right: search + settings */}
        <div className="home-nav-right">
          {/* Search bar — desktop only */}
          <button
            className="home-search-bar"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
          >
            <SearchIcon style={{ fontSize: 18, color: 'var(--text-muted)' }} />
            <span>Search a city</span>
          </button>

          {/* Search icon — mobile only */}
          <button
            className="home-nav-icon-btn mobile-search"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
          >
            <SearchIcon style={{ fontSize: 20, color: 'var(--dark-navy)' }} />
          </button>

          <button
            className="home-nav-icon-btn"
            onClick={() => setPage('settings')}
          >
            <SettingsIcon style={{ fontSize: 20, color: 'var(--dark-navy)' }} />
          </button>
        </div>

        {/* Dropdown list of cities */}
        {showLocationPicker && (
          <div className="location-dropdown">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.city}
                className="location-dropdown-item"
                onClick={() => handleLocationSelect(loc)}
              >
                <LocationOnIcon style={{ fontSize: 14 }} />
                <span>{loc.city}, {loc.region}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="home-body">

        {loading && (
          <div className="home-loading-screen">
            <p className="home-loading">Loading weather...</p>
          </div>
        )}

        {error && !weather && (
          <div className="home-loading-screen">
            <p className="home-error">{error}</p>
          </div>
        )}

        {!loading && weather && (
          <>
            <div className="home-col-left">
              <div className="conditions-card welcome-card-dark">
                <div className="conditions-top">
                  <div className="conditions-temp">
                    <span className="conditions-temp-value">{Math.round(weather.current.main.temp)}°</span>
                    <span className="conditions-feels-like">Feels like {Math.round(weather.current.main.feels_like)}°</span>
                  </div>
                  <div className="conditions-weather">
                    {getWeatherIcon(weather.current.weather[0].id, 40, isNight)}
                    <span className="conditions-desc" style={{ textTransform: 'capitalize' }}>
                      {weather.current.weather[0].description}
                    </span>
                  </div>
                </div>
                <div className="conditions-stats">
                  <div className="conditions-stat">
                    <AirIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                    <div>
                      <p className="conditions-stat-label">WIND</p>
                      <p className="conditions-stat-value">{Math.round(weather.current.wind.speed * 3.6)} km/h</p>
                    </div>
                  </div>
                  <div className="conditions-stat">
                    <WaterDropIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                    <div>
                      <p className="conditions-stat-label">RAIN</p>
                      <p className="conditions-stat-value">{Math.round((weather.forecast[0]?.pop || 0) * 100)}%</p>
                    </div>
                  </div>
                  <div className="conditions-stat">
                    <OpacityIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                    <div>
                      <p className="conditions-stat-label">HUMIDITY</p>
                      <p className="conditions-stat-value">{weather.current.main.humidity}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sunrise-sunset-card welcome-card-dark">
                <div className="sunrise-sunset-item">
                  <WbSunnyIcon style={{ fontSize: 28, color: '#E8C870' }} />
                  <p className="sunrise-sunset-label">SUNRISE</p>
                  <p className="sunrise-sunset-time">{formatTime(weather.current.sys.sunrise, weather.current.timezone)}</p>
                </div>
                <div className="sunrise-sunset-divider" />
                <div className="sunrise-sunset-item">
                  <NightsStayIcon style={{ fontSize: 28, color: '#6B7E8F' }} />
                  <p className="sunrise-sunset-label">SUNSET</p>
                  <p className="sunrise-sunset-time">{formatTime(weather.current.sys.sunset, weather.current.timezone)}</p>
                </div>
              </div>
            </div>

            <div className="home-col-center">
              <div className="forecast-card welcome-card-dark">
                <p className="forecast-title">Next 24 hours</p>
                <div className="forecast-scroll">
                  {todayForecast.map((item, i) => (
                    <div key={i} className="forecast-item">
                      <span className="forecast-time">{item.time}</span>
                      {getWeatherIcon(item.weatherCode, 24)}
                      <span className="forecast-temp">{item.temp}°</span>
                      <span className="forecast-rain">{item.rain}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-col-right">
              <div className="outlook-card welcome-card-dark">
                <p className="outlook-title">5-day forecast</p>
                <div className="outlook-list">
                  {outlookData.map((item) => (
                    <div key={item.day} className="outlook-row">
                      <span className="outlook-day">{item.day}</span>
                      {getWeatherIcon(item.weatherCode, 20)}
                      <span className="outlook-low">{item.low}°</span>
                      <div className="outlook-bar-track">
                        <div style={getOutlookBarStyle(item.low, item.high, outlookData)} />
                      </div>
                      <span className="outlook-high">{item.high}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default Home