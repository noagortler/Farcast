import { useState } from 'react'
import { usePreferences } from '../context/PreferencesContext'

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

function Onboarding({ setPage }) {
  const { setLocation } = usePreferences()
  const [selectedLocation, setSelectedLocation] = useState(null)
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
    if (!selectedLocation) {
      setError(true)
      return
    }
    setLocation(selectedLocation)
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
      </div>

      {error && (
        <p className="onboarding-error">Please select a location to continue.</p>
      )}

      <button className="btn-primary" onClick={handleStart}>
        Start using Farcast
      </button>

    </div>
  )
}

export default Onboarding