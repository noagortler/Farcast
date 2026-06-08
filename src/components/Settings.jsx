// React
import { useState } from 'react'

// Context
import { usePreferences } from '../context/PreferencesContext'
import { useWeather } from '../context/WeatherContext'

// Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'

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

function getRegionLabel(loc) {
  const regionNames = { CA: 'Canada', US: 'United States' }
  const provinceNames = {
    BC: 'British Columbia', AB: 'Alberta', ON: 'Ontario',
    WA: 'Washington', OR: 'Oregon',
  }
  return `${provinceNames[loc.region] || loc.region}, ${regionNames[loc.country] || loc.country}`
}

function getRelativeTime(isoString) {
  if (!isoString) return 'Never'
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  return `${Math.floor(diffHr / 24)} days ago`
}

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

function LocationCard({ location, showLocationPicker, setShowLocationPicker, handleLocationSelect }) {
  return (
    <div className="settings-section">
      <p className="settings-section-label">LOCATION</p>
      <div className="settings-card welcome-card-dark">

        {location && (
          <div className="settings-location-row">
            <div className="settings-location-icon">
              <LocationOnIcon style={{ fontSize: 20, color: 'var(--text-muted)' }} />
            </div>
            <div className="settings-location-info">
              <p className="settings-location-city">{location.city}</p>
              <p className="settings-location-region">{getRegionLabel(location)}</p>
            </div>
          </div>
        )}

        <button
          className="settings-change-location-btn"
          onClick={() => setShowLocationPicker(!showLocationPicker)}
        >
          <SearchIcon style={{ fontSize: 18 }} />
          <span>Change default location</span>
        </button>

        {showLocationPicker && (
          <div className="settings-location-dropdown">
            {LOCATIONS.map(loc => (
              <button
                key={loc.city}
                className={`settings-location-item${location?.city === loc.city ? ' settings-location-item-active' : ''}`}
                onClick={() => handleLocationSelect(loc)}
              >
                <LocationOnIcon style={{ fontSize: 14 }} />
                <span>{loc.city}, {loc.region}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function AboutCard({ weather }) {
  return (
    <div className="settings-section">
      <p className="settings-section-label">ABOUT</p>
      <div className="settings-card welcome-card-dark">
        <div className="settings-about-row">
          <span className="settings-about-label">Data source</span>
          <span className="settings-about-value">OpenWeather API</span>
        </div>
        <div className="settings-about-divider" />
        <div className="settings-about-row">
          <span className="settings-about-label">Last updated</span>
          <span className="settings-about-value">{getRelativeTime(weather?.fetchedAt)}</span>
        </div>
        <div className="settings-about-divider" />
        <div className="settings-about-row">
          <span className="settings-about-label">Version</span>
          <span className="settings-about-value">1.0.0</span>
        </div>
      </div>
    </div>
  )
}

function Settings({ setPage }) {
  const {
    location, setLocation,
    tempUnit, setTempUnit,
    windUnit, setWindUnit,
    timeFormat, setTimeFormat,
  } = usePreferences()

  const { weather } = useWeather()
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  function handleLocationSelect(loc) {
    setLocation(loc)
    setShowLocationPicker(false)
  }

  return (
    <div className="settings">

      {/* Nav */}
      <nav className="settings-nav">
        <button className="settings-back-btn" onClick={() => setPage('home')}>
          <ArrowBackIosNewIcon style={{ fontSize: 16 }} />
        </button>
        <h1 className="settings-title">Settings</h1>
      </nav>

      <div className="settings-body">

        {/* Mobile: location, display prefs, about */}
        {/* Display preferences is duplicated below for desktop layout */}
        <div className="settings-mobile-col">
          <LocationCard
            location={location}
            showLocationPicker={showLocationPicker}
            setShowLocationPicker={setShowLocationPicker}
            handleLocationSelect={handleLocationSelect}
          />

          {/* Display Preferences */}
          <div className="settings-section">
            <p className="settings-section-label">DISPLAY PREFERENCES</p>
            <div className="settings-card welcome-card-dark">

              <div className="settings-pref-row">
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Temperature</p>
                  <p className="settings-pref-hint">Used everywhere temperatures appear</p>
                </div>
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
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Wind speed</p>
                  <p className="settings-pref-hint">Affects today's conditions card</p>
                </div>
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
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Time format</p>
                </div>
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

          <AboutCard weather={weather} />
        </div>

        {/* Desktop left column: location + about */}
        <div className="settings-desktop-left">
          <LocationCard
            location={location}
            showLocationPicker={showLocationPicker}
            setShowLocationPicker={setShowLocationPicker}
            handleLocationSelect={handleLocationSelect}
          />
          <AboutCard weather={weather} />
        </div>

        {/* Desktop right column: display preferences */}
        <div className="settings-desktop-right">
          <div className="settings-section">
            <p className="settings-section-label">DISPLAY PREFERENCES</p>
            <div className="settings-card welcome-card-dark">

              <div className="settings-pref-row">
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Temperature</p>
                  <p className="settings-pref-hint">Used everywhere temperatures appear</p>
                </div>
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
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Wind speed</p>
                  <p className="settings-pref-hint">Affects today's conditions card</p>
                </div>
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
                <div className="settings-pref-header">
                  <p className="settings-pref-label">Time format</p>
                </div>
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
        </div>

      </div>
    </div>
  )
}

export default Settings