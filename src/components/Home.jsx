// React
import { useEffect } from 'react'

// Context
import { usePreferences } from '../context/PreferencesContext'
import { useWeather } from '../context/WeatherContext'

// Components
import ScoreGauge from './ScoreGauge'

// Utils
import { calculateScore } from '../utils/scoring'

// Navigation icons
import SettingsIcon from '@mui/icons-material/Settings'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// Activity icons
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import HikingIcon from '@mui/icons-material/Hiking'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import KayakingIcon from '@mui/icons-material/Kayaking'

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

const ACTIVITIES = [
  { id: 'cycling', label: 'CYCLING', icon: <DirectionsBikeIcon style={{ fontSize: 28 }} /> },
  { id: 'hiking', label: 'HIKING', icon: <HikingIcon style={{ fontSize: 28 }} /> },
  { id: 'running', label: 'RUNNING', icon: <DirectionsRunIcon style={{ fontSize: 28 }} /> },
  { id: 'paddling', label: 'PADDLING', icon: <KayakingIcon style={{ fontSize: 28 }} /> },
]

function getScoreColor(score) {
  if (score >= 90) return 'var(--score-optimal)'
  if (score >= 70) return 'var(--score-good)'
  if (score >= 45) return 'var(--score-fair)'
  if (score >= 20) return 'var(--score-poor)'
  return 'var(--score-avoid)'
}

function getWeatherIcon(weatherCode, size = 40) {
  // OpenWeather condition codes: https://openweathermap.org/weather-conditions
  if (weatherCode >= 200 && weatherCode < 300) return <ThunderstormIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 300 && weatherCode < 600) return <GrainIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 600 && weatherCode < 700) return <AcUnitIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode >= 700 && weatherCode < 800) return <DehazeIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
  if (weatherCode === 800) return <WbSunnyIcon style={{ fontSize: size, color: '#E8C870' }} />
  return <WbCloudyIcon style={{ fontSize: size, color: 'var(--dark-navy)' }} />
}

function getOutlookBarStyle(low, high, allData) {
  // Find the coldest low and hottest high across all days, pad by 2° on each side
  // This makes the bars fill the full width relative to the week's temperature range
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
  // OpenWeather returns UTC timestamps — we add the location's timezone offset
  // to convert to local time before formatting
  const utcMs = unixTimestamp * 1000
  const localMs = utcMs + timezoneOffset * 1000
  const date = new Date(localMs)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  // Only show minutes if they're not zero
  if (minutes === 0) return `${displayHours} ${ampm}`
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function getDayName(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  return date.toLocaleDateString([], { weekday: 'short' })
}

function getScoreForItem(temp, windSpeed, rainChance, activity, sensitivity) {
  // Multiply by 3.6 to convert metres per second to km/h
  const wind = windSpeed * 3.6
  // rainChance from OpenWeather is 0–1, multiply by 100 to get a percentage
  const rain = rainChance * 100
  const activitySensitivity = sensitivity[activity] || { temperature: 3, wind: 3, rain: 3 }
  return calculateScore(temp, wind, rain, activity, activitySensitivity)
}

function buildTodayForecast(forecastList, activity, sensitivity, timezoneOffset) {
  // Divide by 1000 because JS uses milliseconds but OpenWeather uses seconds
  const now = Date.now() / 1000
  const upcoming = forecastList.filter(item => item.dt >= now)
  return upcoming.slice(0, 6).map(item => {
    const result = getScoreForItem(item.main.temp, item.wind.speed, item.pop || 0, activity, sensitivity)
    const time = formatTime(item.dt, timezoneOffset)
    return {
      time,
      temp: `${Math.round(item.main.temp)}°`,
      score: result.score,
      weatherCode: item.weather[0].id
    }
  })
}

function buildOutlookData(forecastList, activity, sensitivity) {
  // Group forecast intervals by day, then find the best score and temp range for each day
  const days = {}
  forecastList.forEach(item => {
    const day = getDayName(item.dt)
    if (!days[day]) {
      days[day] = { temps: [], scores: [], weatherCode: item.weather[0].id }
    }
    const result = getScoreForItem(item.main.temp, item.wind.speed, item.pop || 0, activity, sensitivity)
    days[day].temps.push(item.main.temp)
    days[day].scores.push(result.score)
  })
  return Object.entries(days).slice(0, 5).map(([day, data]) => ({
    day,
    low: Math.round(Math.min(...data.temps)),
    high: Math.round(Math.max(...data.temps)),
    // Use the best score of the day, not the average
    score: Math.max(...data.scores),
    weatherCode: data.weatherCode
  }))
}

function Home({ setPage }) {
  const { location, activity, setActivity, sensitivity } = usePreferences()
  const { weather, loading, error, fetchWeather } = useWeather()

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lon)
    }
  }, [location])

  // Only compute derived data if weather is available
  let currentScore = null
  let scoreBreakdown = null
  let todayForecast = []
  let outlookData = []

  if (weather) {
    const temp = weather.current.main.temp
    const windSpeed = weather.current.wind.speed
    const rainChance = weather.forecast[0]?.pop || 0

    const result = getScoreForItem(temp, windSpeed, rainChance, activity, sensitivity)
    currentScore = result.score
    scoreBreakdown = result.breakdown

    todayForecast = buildTodayForecast(weather.forecast, activity, sensitivity, weather.current.timezone)
    outlookData = buildOutlookData(weather.forecast, activity, sensitivity)
  }

  return (
    <div className="home">

      <nav className="home-nav">
        <div className="home-nav-brand">
          <div className="home-nav-brand-left">
            <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
            <div className="home-location">
              <LocationOnIcon style={{ fontSize: 14 }} />
              <span>{location?.city}, {location?.region}</span>
            </div>
          </div>
          <div className="home-nav-icons">
            <button onClick={() => setPage('about')}>
              <InfoOutlinedIcon style={{ fontSize: 22, color: 'var(--dark-navy)' }} />
            </button>
            <button onClick={() => setPage('settings')}>
              <SettingsIcon style={{ fontSize: 22, color: 'var(--dark-navy)' }} />
            </button>
          </div>
        </div>

        <div className="home-nav-activities">
          {ACTIVITIES.map((a) => (
            <button
              key={a.id}
              className={`activity-tab ${activity === a.id ? 'activity-tab-active' : ''}`}
              onClick={() => setActivity(a.id)}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          ))}
        </div>

        <div className="home-desktop-icons">
          <button onClick={() => setPage('about')}>
            <InfoOutlinedIcon style={{ fontSize: 22, color: 'var(--dark-navy)' }} />
          </button>
          <button onClick={() => setPage('settings')}>
            <SettingsIcon style={{ fontSize: 22, color: 'var(--dark-navy)' }} />
          </button>
        </div>
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

        {weather && (
          <>
            <div className="home-col-left">
              <ScoreGauge score={currentScore} />
              <div className="best-window-card welcome-card-dark">
                <p className="best-window-label">BEST WINDOW FOR {activity.toUpperCase()}</p>
                <p className="best-window-time">12pm – 3pm</p>
                <p className="best-window-desc">mild wind & low chance of rain</p>
              </div>
            </div>

            <div className="home-col-center">
              <div className="conditions-card welcome-card-dark">
                <div className="conditions-top">
                  <div className="conditions-temp">
                    <span className="conditions-temp-value">{Math.round(weather.current.main.temp)}°</span>
                    <span className="conditions-feels-like">Feels like {Math.round(weather.current.main.feels_like)}°</span>
                  </div>
                  <div className="conditions-weather">
                    {getWeatherIcon(weather.current.weather[0].id, 40)}
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

              {scoreBreakdown && (
                <div className="score-bars-card welcome-card-dark">
                  <p className="score-bars-title">What's affecting the score</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Wind: {scoreBreakdown.wind.score} / Rain: {scoreBreakdown.rain.score}
                  </p>
                  <div className="score-bars">
                    <div className="score-bar-row">
                      <span className="score-bar-label">Temperature</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${scoreBreakdown.temperature.score}%`,
                          backgroundColor: getScoreColor(scoreBreakdown.temperature.score)
                        }} />
                      </div>
                      <span className="score-bar-value">{Math.round(weather.current.main.temp)}°</span>
                    </div>
                    <div className="score-bar-row">
                      <span className="score-bar-label">Wind</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${scoreBreakdown.wind.score}%`,
                          backgroundColor: getScoreColor(scoreBreakdown.wind.score)
                        }} />
                      </div>
                      <span className="score-bar-value">{Math.round(weather.current.wind.speed * 3.6)} km/h</span>
                    </div>
                    <div className="score-bar-row">
                      <span className="score-bar-label">Rain</span>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{
                          width: `${scoreBreakdown.rain.score}%`,
                          backgroundColor: getScoreColor(scoreBreakdown.rain.score)
                        }} />
                      </div>
                      <span className="score-bar-value">{Math.round((weather.forecast[0]?.pop || 0) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="home-col-right">
              <div className="forecast-card welcome-card-dark">
                <p className="forecast-title">Today's forecast</p>
                <div className="forecast-scroll">
                  {todayForecast.map((item, i) => (
                    <div key={i} className="forecast-item">
                      <span className="forecast-time">{item.time}</span>
                      {getWeatherIcon(item.weatherCode, 24)}
                      <span className="forecast-temp">{item.temp}</span>
                      <span className="forecast-score" style={{ color: getScoreColor(item.score) }}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="outlook-card welcome-card-dark">
                <p className="outlook-title">5-day outlook</p>
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
                      <span className="outlook-score" style={{ color: getScoreColor(item.score) }}>
                        {item.score}
                      </span>
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