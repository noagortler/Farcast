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
import VisibilityIcon from '@mui/icons-material/Visibility'
import CompressIcon from '@mui/icons-material/Compress'
import CloudIcon from '@mui/icons-material/Cloud'

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

function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

function getHumidityLabel(humidity) {
  if (humidity < 30) return 'Dry air'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Damp air'
  return 'Very humid'
}

function getVisibilityLabel(metres) {
  if (metres >= 8000) return 'Clear view'
  if (metres >= 4000) return 'Mostly clear'
  if (metres >= 1000) return 'Hazy'
  return 'Poor visibility'
}

function getCloudLabel(percent) {
  if (percent < 20) return 'Clear skies'
  if (percent < 50) return 'Partly cloudy'
  if (percent < 80) return 'Mostly cloudy'
  return 'Overcast'
}

function getWeatherCategory(weatherCode) {
  if (weatherCode >= 200 && weatherCode < 300) return 'storm'
  if (weatherCode >= 300 && weatherCode < 600) return 'rain'
  if (weatherCode >= 600 && weatherCode < 700) return 'snow'
  if (weatherCode >= 700 && weatherCode < 800) return 'fog'
  if (weatherCode === 800) return 'clear'
  return 'cloudy'
}

function getChangeHeadline(category, time) {
  if (category === 'clear') return `Clearing by ${time}`
  if (category === 'rain') return `Rain moving in by ${time}`
  if (category === 'storm') return `Storms expected by ${time}`
  if (category === 'snow') return `Snow arriving by ${time}`
  if (category === 'fog') return `Fog rolling in by ${time}`
  return `Clouding over by ${time}`
}

function getChangeDescription(fromCategory, toCategory, temp, time) {
  if (toCategory === 'clear') return `Conditions improving through the morning, with a high of ${temp}° expected around ${time}.`
  if (toCategory === 'rain') return `Rain expected to move in around ${time}, with temperatures around ${temp}°.`
  if (toCategory === 'storm') return `Storms likely to develop around ${time}. Temperatures around ${temp}°.`
  if (toCategory === 'snow') return `Snow expected to arrive around ${time}. Temperatures dropping to ${temp}°.`
  if (toCategory === 'cloudy') return `Clouds building through the morning, with temperatures around ${temp}° by ${time}.`
  return `Conditions changing around ${time}, with temperatures around ${temp}°.`
}

function getNextChange(currentWeatherCode, forecastList, timezoneOffset) {
  const currentCategory = getWeatherCategory(currentWeatherCode)
  const now = Date.now() / 1000
  const upcoming = forecastList.filter(item => item.dt >= now)

  for (const item of upcoming) {
    const hoursAway = (item.dt - now) / 3600
    if (hoursAway > 24) break
    const itemCategory = getWeatherCategory(item.weather[0].id)
    if (itemCategory !== currentCategory) {
      const time = formatTime(item.dt, timezoneOffset)
      const temp = Math.round(item.main.temp)
      const rainChance = Math.round((item.pop || 0) * 100)
      return {
        headline: getChangeHeadline(itemCategory, time),
        description: getChangeDescription(currentCategory, itemCategory, temp, time),
        hoursAway: Math.round(hoursAway),
        temp,
        time,
        rainChance,
      }
    }
  }

  return null
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
  let todayHigh = null
  let todayLow = null
  let nextChange = null

  if (weather) {
    const timezoneOffset = weather.current.timezone
    const now = Date.now() / 1000
    const sunrise = weather.current.sys.sunrise
    const sunset = weather.current.sys.sunset
    isNight = now < sunrise || now > sunset
    todayForecast = buildTodayForecast(weather.forecast, timezoneOffset)
    outlookData = buildOutlookData(weather.forecast, timezoneOffset)

    // Get today's high and low from the forecast
    const todayTemps = weather.forecast
      .filter(item => getDayName(item.dt, timezoneOffset) === 'Today')
      .map(item => item.main.temp)

    if (todayTemps.length > 0) {
      todayHigh = Math.round(Math.max(...todayTemps))
      todayLow = Math.round(Math.min(...todayTemps))
    }

    nextChange = getNextChange(
      weather.current.weather[0].id,
      weather.forecast,
      timezoneOffset
    )
  }

  return (
    <div className="home">

      <nav className="home-nav">
        <div className="home-nav-left">
          <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
          <div className="home-nav-location">
            <LocationOnIcon style={{ fontSize: 14 }} />
            <span>{location?.city}, {location?.region}</span>
          </div>
        </div>

        <div className="home-nav-right">
          <button
            className="home-search-bar"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
          >
            <SearchIcon style={{ fontSize: 18, color: 'var(--text-muted)' }} />
            <span>Search a city</span>
          </button>
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
            {/* Mobile: single column, cards in order */}
            <div className="home-col-mobile">

              <div className="conditions-card welcome-card-dark">
                <div className="conditions-top">
                  <div className="conditions-temp">
                    <span className="conditions-temp-value">{Math.round(weather.current.main.temp)}°</span>
                    <span className="conditions-desc" style={{ textTransform: 'capitalize' }}>
                      {weather.current.weather[0].description}
                    </span>
                    <span className="conditions-feels-like">Feels like {Math.round(weather.current.main.feels_like)}°</span>
                    {todayHigh !== null && (
                      <span className="conditions-high-low">H: {todayHigh}° · L: {todayLow}°</span>
                    )}
                  </div>
                  <div className="conditions-weather">
                    {getWeatherIcon(weather.current.weather[0].id, 48, isNight)}
                  </div>
                </div>
              </div>

              <div className="next-change-card welcome-card-dark">
                <p className="next-change-label">NEXT CHANGE</p>
                {nextChange ? (
                  <>
                    <p className="next-change-headline">{nextChange.headline}</p>
                    <p className="next-change-desc">{nextChange.description}</p>
                    <div className="next-change-stats">
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">IN</p>
                        <p className="next-change-stat-value">~{nextChange.hoursAway} hrs</p>
                      </div>
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">THEN</p>
                        <p className="next-change-stat-value">{nextChange.temp}° at {nextChange.time}</p>
                      </div>
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">RAIN CHANCE</p>
                        <p className="next-change-stat-value">{nextChange.rainChance}%</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="next-change-headline">Conditions holding steady</p>
                    <p className="next-change-desc" style={{ textTransform: 'capitalize' }}>
                      {weather.current.weather[0].description} expected to continue through the day.
                    </p>
                  </>
                )}
              </div>

              <div className="today-conditions-card welcome-card-dark">
                <p className="today-conditions-title">Today's conditions</p>
                <div className="today-conditions-grid">
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <AirIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">WIND</span>
                    </div>
                    <p className="today-condition-value">{Math.round(weather.current.wind.speed * 3.6)} <span className="today-condition-unit">km/h</span></p>
                    <p className="today-condition-sub">From the {getWindDirection(weather.current.wind.deg)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <WaterDropIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">RAIN</span>
                    </div>
                    <p className="today-condition-value">{Math.round((weather.forecast[0]?.pop || 0) * 100)} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">
                      {weather.current.rain?.['1h'] ? `${weather.current.rain['1h']} mm in 1 hr` : '0 mm in 1 hr'}
                    </p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <OpacityIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">HUMIDITY</span>
                    </div>
                    <p className="today-condition-value">{weather.current.main.humidity} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">{getHumidityLabel(weather.current.main.humidity)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <CloudIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">CLOUD COVER</span>
                    </div>
                    <p className="today-condition-value">{weather.current.clouds.all} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">{getCloudLabel(weather.current.clouds.all)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <CompressIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">PRESSURE</span>
                    </div>
                    <p className="today-condition-value">{weather.current.main.pressure} <span className="today-condition-unit">hPa</span></p>
                    <p className="today-condition-sub">Steady</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <VisibilityIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">VISIBILITY</span>
                    </div>
                    <p className="today-condition-value">{Math.round((weather.current.visibility || 10000) / 1000)} <span className="today-condition-unit">km</span></p>
                    <p className="today-condition-sub">{getVisibilityLabel(weather.current.visibility || 10000)}</p>
                  </div>
                </div>
                <div className="today-conditions-sun">
                  <div className="today-conditions-sun-item">
                    <WbSunnyIcon style={{ fontSize: 20, color: '#E8C870' }} />
                    <div>
                      <p className="today-condition-label">SUNRISE</p>
                      <p className="today-condition-sun-time">{formatTime(weather.current.sys.sunrise, weather.current.timezone)}</p>
                    </div>
                  </div>
                  <div className="today-conditions-sun-item">
                    <NightsStayIcon style={{ fontSize: 20, color: '#6B7E8F' }} />
                    <div>
                      <p className="today-condition-label">SUNSET</p>
                      <p className="today-condition-sun-time">{formatTime(weather.current.sys.sunset, weather.current.timezone)}</p>
                    </div>
                  </div>
                </div>
              </div>

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

            {/* Desktop col 1: conditions + today's conditions */}
            <div className="home-col-left">

              <div className="conditions-card welcome-card-dark">
                <div className="conditions-top">
                  <div className="conditions-temp">
                    <span className="conditions-temp-value">{Math.round(weather.current.main.temp)}°</span>
                    <span className="conditions-desc" style={{ textTransform: 'capitalize' }}>
                      {weather.current.weather[0].description}
                    </span>
                    <span className="conditions-feels-like">Feels like {Math.round(weather.current.main.feels_like)}°</span>
                    {todayHigh !== null && (
                      <span className="conditions-high-low">H: {todayHigh}° · L: {todayLow}°</span>
                    )}
                  </div>
                  <div className="conditions-weather">
                    {getWeatherIcon(weather.current.weather[0].id, 48, isNight)}
                  </div>
                </div>
              </div>

              <div className="today-conditions-card welcome-card-dark">
                <p className="today-conditions-title">Today's conditions</p>
                <div className="today-conditions-grid">
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <AirIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">WIND</span>
                    </div>
                    <p className="today-condition-value">{Math.round(weather.current.wind.speed * 3.6)} <span className="today-condition-unit">km/h</span></p>
                    <p className="today-condition-sub">From the {getWindDirection(weather.current.wind.deg)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <WaterDropIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">RAIN</span>
                    </div>
                    <p className="today-condition-value">{Math.round((weather.forecast[0]?.pop || 0) * 100)} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">
                      {weather.current.rain?.['1h'] ? `${weather.current.rain['1h']} mm in 1 hr` : '0 mm in 1 hr'}
                    </p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <OpacityIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">HUMIDITY</span>
                    </div>
                    <p className="today-condition-value">{weather.current.main.humidity} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">{getHumidityLabel(weather.current.main.humidity)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <CloudIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">CLOUD COVER</span>
                    </div>
                    <p className="today-condition-value">{weather.current.clouds.all} <span className="today-condition-unit">%</span></p>
                    <p className="today-condition-sub">{getCloudLabel(weather.current.clouds.all)}</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <CompressIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">PRESSURE</span>
                    </div>
                    <p className="today-condition-value">{weather.current.main.pressure} <span className="today-condition-unit">hPa</span></p>
                    <p className="today-condition-sub">Steady</p>
                  </div>
                  <div className="today-condition-stat">
                    <div className="today-condition-header">
                      <VisibilityIcon style={{ fontSize: 16, color: 'var(--text-muted)' }} />
                      <span className="today-condition-label">VISIBILITY</span>
                    </div>
                    <p className="today-condition-value">{Math.round((weather.current.visibility || 10000) / 1000)} <span className="today-condition-unit">km</span></p>
                    <p className="today-condition-sub">{getVisibilityLabel(weather.current.visibility || 10000)}</p>
                  </div>
                </div>
                <div className="today-conditions-sun">
                  <div className="today-conditions-sun-item">
                    <WbSunnyIcon style={{ fontSize: 20, color: '#E8C870' }} />
                    <div>
                      <p className="today-condition-label">SUNRISE</p>
                      <p className="today-condition-sun-time">{formatTime(weather.current.sys.sunrise, weather.current.timezone)}</p>
                    </div>
                  </div>
                  <div className="today-conditions-sun-item">
                    <NightsStayIcon style={{ fontSize: 20, color: '#6B7E8F' }} />
                    <div>
                      <p className="today-condition-label">SUNSET</p>
                      <p className="today-condition-sun-time">{formatTime(weather.current.sys.sunset, weather.current.timezone)}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Desktop col 2: next change + next 24 hrs + 5-day */}
            <div className="home-col-center">

              <div className="next-change-card welcome-card-dark">
                <p className="next-change-label">NEXT CHANGE</p>
                {nextChange ? (
                  <>
                    <p className="next-change-headline">{nextChange.headline}</p>
                    <p className="next-change-desc">{nextChange.description}</p>
                    <div className="next-change-stats">
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">IN</p>
                        <p className="next-change-stat-value">~{nextChange.hoursAway} hrs</p>
                      </div>
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">THEN</p>
                        <p className="next-change-stat-value">{nextChange.temp}° at {nextChange.time}</p>
                      </div>
                      <div className="next-change-stat">
                        <p className="next-change-stat-label">RAIN CHANCE</p>
                        <p className="next-change-stat-value">{nextChange.rainChance}%</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="next-change-headline">Conditions holding steady</p>
                    <p className="next-change-desc" style={{ textTransform: 'capitalize' }}>
                      {weather.current.weather[0].description} expected to continue through the day.
                    </p>
                  </>
                )}
              </div>

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