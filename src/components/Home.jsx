// React
import { useEffect } from 'react'

// Context
import { usePreferences } from '../context/PreferencesContext'
import { useWeather } from '../context/WeatherContext'

// Components
import ScoreGauge from './ScoreGauge'

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
import AirIcon from '@mui/icons-material/Air'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import OpacityIcon from '@mui/icons-material/Opacity'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'

const ACTIVITIES = [
  { id: 'cycling', label: 'CYCLING', icon: <DirectionsBikeIcon style={{ fontSize: 28 }} /> },
  { id: 'hiking', label: 'HIKING', icon: <HikingIcon style={{ fontSize: 28 }} /> },
  { id: 'running', label: 'RUNNING', icon: <DirectionsRunIcon style={{ fontSize: 28 }} /> },
  { id: 'paddling', label: 'PADDLING', icon: <KayakingIcon style={{ fontSize: 28 }} /> },
]

const OUTLOOK_DATA = [
  { day: 'Today', low: 2,  high: 12, score: 91 },
  { day: 'Wed',   low: 6,  high: 14, score: 82 },
  { day: 'Thu',   low: 5,  high: 13, score: 58 },
  { day: 'Fri',   low: 3,  high: 9,  score: 44 },
  { day: 'Sat',   low: 2,  high: 7,  score: 19 },
]

const FORECAST_DATA = [
  { time: 'Now',  temp: '2°',  score: 81 },
  { time: '9am',  temp: '4°',  score: 85 },
  { time: '12pm', temp: '11°', score: 90 },
  { time: '3pm',  temp: '12°', score: 91 },
  { time: '6pm',  temp: '8°',  score: 85 },
]

function getScoreColor(score) {
  if (score >= 90) return 'var(--score-optimal)'
  if (score >= 70) return 'var(--score-good)'
  if (score >= 45) return 'var(--score-fair)'
  if (score >= 20) return 'var(--score-poor)'
  return 'var(--score-avoid)'
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

function Home({ setPage }) {
  const { location, activity, setActivity } = usePreferences()
  const { weather, loading, error, fetchWeather } = useWeather()

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

        <div className="home-col-left">
          <ScoreGauge score={81} />
          <div className="best-window-card welcome-card-dark">
            <p className="best-window-label">BEST WINDOW FOR CYCLING</p>
            <p className="best-window-time">12pm – 3pm</p>
            <p className="best-window-desc">mild wind & low chance of rain</p>
          </div>
        </div>

        <div className="home-col-center">
          <div className="conditions-card welcome-card-dark">
            <div className="conditions-top">
              <div className="conditions-temp">
                <span className="conditions-temp-value">2°</span>
                <span className="conditions-feels-like">Feels like 3°</span>
              </div>
              <div className="conditions-weather">
                <WbCloudyIcon style={{ fontSize: 40, color: 'var(--dark-navy)' }} />
                <span className="conditions-desc">Partly cloudy</span>
              </div>
            </div>
            <div className="conditions-stats">
              <div className="conditions-stat">
                <AirIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                <div>
                  <p className="conditions-stat-label">WIND</p>
                  <p className="conditions-stat-value">2 km/h</p>
                </div>
              </div>
              <div className="conditions-stat">
                <WaterDropIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                <div>
                  <p className="conditions-stat-label">RAIN</p>
                  <p className="conditions-stat-value">8%</p>
                </div>
              </div>
              <div className="conditions-stat">
                <OpacityIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                <div>
                  <p className="conditions-stat-label">HUMIDITY</p>
                  <p className="conditions-stat-value">78%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sunrise-sunset-card welcome-card-dark">
            <div className="sunrise-sunset-item">
              <WbSunnyIcon style={{ fontSize: 28, color: '#E8C870' }} />
              <p className="sunrise-sunset-label">SUNRISE</p>
              <p className="sunrise-sunset-time">6:28 am</p>
            </div>
            <div className="sunrise-sunset-divider" />
            <div className="sunrise-sunset-item">
              <NightsStayIcon style={{ fontSize: 28, color: '#6B7E8F' }} />
              <p className="sunrise-sunset-label">SUNSET</p>
              <p className="sunrise-sunset-time">7:52 pm</p>
            </div>
          </div>

          <div className="score-bars-card welcome-card-dark">
            <p className="score-bars-title">What's affecting the score</p>
            <div className="score-bars">
              <div className="score-bar-row">
                <span className="score-bar-label">Temperature</span>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: '57%', backgroundColor: 'var(--score-fair)' }} />
                </div>
                <span className="score-bar-value">4°</span>
              </div>
              <div className="score-bar-row">
                <span className="score-bar-label">Wind</span>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: '95%', backgroundColor: 'var(--score-optimal)' }} />
                </div>
                <span className="score-bar-value">2 km/h</span>
              </div>
              <div className="score-bar-row">
                <span className="score-bar-label">Rain</span>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: '92%', backgroundColor: 'var(--score-optimal)' }} />
                </div>
                <span className="score-bar-value">8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-col-right">
          <div className="forecast-card welcome-card-dark">
            <p className="forecast-title">Today's forecast</p>
            <div className="forecast-scroll">
              {FORECAST_DATA.map((item) => (
                <div key={item.time} className="forecast-item">
                  <span className="forecast-time">{item.time}</span>
                  <WbCloudyIcon style={{ fontSize: 24, color: 'var(--text-muted)' }} />
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
              {OUTLOOK_DATA.map((item) => (
                <div key={item.day} className="outlook-row">
                  <span className="outlook-day">{item.day}</span>
                  <WbCloudyIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
                  <span className="outlook-low">{item.low}°</span>
                  <div className="outlook-bar-track">
                    <div style={getOutlookBarStyle(item.low, item.high, OUTLOOK_DATA)} />
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

      </div>

    </div>
  )
}

export default Home