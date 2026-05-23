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
      </div>

    </div>
  )
}

export default Home