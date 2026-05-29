import { useState } from 'react'
import { usePreferences } from '../context/PreferencesContext'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import HikingIcon from '@mui/icons-material/Hiking'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import RowingIcon from '@mui/icons-material/Kayaking'

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

const ACTIVITIES = [
  { id: 'cycling', label: 'CYCLING', icon: <DirectionsBikeIcon style={{ fontSize: 32 }} /> },
  { id: 'hiking', label: 'HIKING', icon: <HikingIcon style={{ fontSize: 32 }} /> },
  { id: 'running', label: 'RUNNING', icon: <DirectionsRunIcon style={{ fontSize: 32 }} /> },
  { id: 'paddling', label: 'PADDLING', icon: <RowingIcon style={{ fontSize: 32 }} /> },
]

function Onboarding({ setPage }) {
  const { setLocation, setActivity } = usePreferences()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [error, setError] = useState(false)

  function handleLocationChange(e) {
    const index = e.target.value
    if (index === '') {
      setSelectedLocation(null)
    } else {
      setSelectedLocation(LOCATIONS[index])
    }
    setError(false)
  }

  function handleStart() {
    if (!selectedLocation || !selectedActivity) {
      setError(true)
      return
    }
    setLocation(selectedLocation)
    setActivity(selectedActivity)
    setPage('home')
  }

  return (
    <div className="onboarding">

      <div className="onboarding-header">
        <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
      </div>

      <p className="onboarding-instructions">Let's get you set up.</p>

      <div className="onboarding-cards">

        <div className="onboarding-card welcome-card-dark">
          <div className="onboarding-card-heading">
            <div className="step-number step-1">1</div>
            <h2>Select your location</h2>
          </div>
          <select
            className="location-select"
            onChange={handleLocationChange}
            defaultValue=""
          >
            <option value="" disabled>Select a city</option>
            {LOCATIONS.map((loc, index) => (
              <option key={loc.city} value={index}>
                {loc.city}, {loc.region}
              </option>
            ))}
          </select>
          <p className="location-helper">We'll pull the live forecast from there.</p>
        </div>

        <div className="onboarding-card welcome-card-dark">
          <div className="onboarding-card-heading">
            <div className="step-number step-2">2</div>
            <h2>Select an activity</h2>
          </div>
          <div className="activity-grid">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity.id}
                className={`activity-item ${selectedActivity === activity.id ? 'activity-item-active' : ''}`}
                onClick={() => {
                  setSelectedActivity(activity.id)
                  setError(false)
                }}
              >
                {activity.icon}
                <span>{activity.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <p className="onboarding-note">You can fine-tune sensitivity for each activity later in Settings.</p>

      {error && (
        <p className="onboarding-error">
          Please select both a location and an activity to continue.
        </p>
      )}

      <button
        className="btn-primary"
        onClick={handleStart}
      >
        Start using Farcast
      </button>

    </div>
  )
}

export default Onboarding