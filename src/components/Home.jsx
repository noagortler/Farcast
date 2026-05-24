import { usePreferences } from '../context/PreferencesContext'
import { useWeather } from '../context/WeatherContext'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import HikingIcon from '@mui/icons-material/Hiking'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import KayakingIcon from '@mui/icons-material/Kayaking'
import ScoreGauge from './ScoreGauge'
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
        <ScoreGauge score={81} />

        <div className="best-window-card welcome-card-dark">
          <p className="best-window-label">BEST WINDOW FOR CYCLING</p>
          <p className="best-window-time">12pm – 3pm</p>
          <p className="best-window-desc">mild wind & low chance of rain</p>
        </div>

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

    </div>
  )
}

export default Home