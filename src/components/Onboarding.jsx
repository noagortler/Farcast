// React
import { useState } from 'react'

// Context
import { usePreferences } from '../context/PreferencesContext'

// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn'

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

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="toggle-group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`toggle-option${value === opt.value ? ' toggle-option-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Onboarding({ setPage }) {
  const {
    setLocation,
    tempUnit, setTempUnit,
    windUnit, setWindUnit,
    timeFormat, setTimeFormat,
  } = usePreferences()

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [error, setError] = useState(false)

  function handleLocationSelect(loc) {
    setSelectedLocation(loc)
    setError(false)
  }

  function handleStart() {
    if (!selectedLocation) {
      setError(true)
      return
    }
    setLocation(selectedLocation)
    setPage('home')
  }

  return (
    <div className="onboarding">

      {/* Header */}
      <div className="onboarding-header">
        <h1 className="wordmark onboarding-wordmark">
          <span className="far">FAR</span><span className="cast">CAST</span>
        </h1>
        <p className="onboarding-welcome">Welcome.</p>
        <p className="onboarding-tagline">Let's find your forecast.</p>
      </div>

      {/* Cards */}
      <div className="onboarding-cards">

        {/* Location */}
        <div className="onboarding-card welcome-card-dark">
          <p className="onboarding-section-label">LOCATION</p>

          <div className="onboarding-location-list">
            {LOCATIONS.map(loc => (
              <button
                key={loc.city}
                className={`onboarding-location-item${selectedLocation?.city === loc.city ? ' onboarding-location-item-active' : ''}`}
                onClick={() => handleLocationSelect(loc)}
              >
                <LocationOnIcon style={{ fontSize: 14 }} />
                <span>{loc.city}, {loc.region}</span>
              </button>
            ))}
          </div>

          {error && <p className="onboarding-error">Please select a location to continue.</p>}
        </div>

        {/* Display Preferences */}
        <div className="onboarding-card welcome-card-dark">
          <p className="onboarding-section-label">DISPLAY PREFERENCES</p>

          <div className="settings-pref-row">
            <p className="settings-pref-label">Temperature</p>
            <ToggleGroup
              value={tempUnit}
              onChange={setTempUnit}
              options={[
                { label: 'Celsius °C', value: 'C' },
                { label: 'Fahrenheit °F', value: 'F' },
              ]}
            />
          </div>

          <div className="settings-pref-divider" />

          <div className="settings-pref-row">
            <p className="settings-pref-label">Wind speed</p>
            <ToggleGroup
              value={windUnit}
              onChange={setWindUnit}
              options={[
                { label: 'km/h', value: 'kmh' },
                { label: 'mph', value: 'mph' },
              ]}
            />
          </div>

          <div className="settings-pref-divider" />

          <div className="settings-pref-row">
            <p className="settings-pref-label">Time format</p>
            <ToggleGroup
              value={timeFormat}
              onChange={setTimeFormat}
              options={[
                { label: '12-hour', value: '12h' },
                { label: '24-hour', value: '24h' },
              ]}
            />
          </div>

        </div>

      </div>

      <p className="onboarding-hint">You can adjust your preferences later in Settings.</p>

      <button className="btn-primary onboarding-btn" onClick={handleStart}>
        Get started
      </button>

    </div>
  )
}

export default Onboarding