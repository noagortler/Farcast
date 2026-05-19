import { createContext, useContext, useState } from 'react'

const PreferencesContext = createContext(null)

const DEFAULT_SENSITIVITY = {
  cycling:  { temperature: 3, wind: 3, rain: 3 },
  hiking:   { temperature: 3, wind: 3, rain: 3 },
  running:  { temperature: 3, wind: 3, rain: 3 },
  paddling: { temperature: 3, wind: 3, rain: 3 },
}

export function PreferencesProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    const saved = localStorage.getItem('farcast_location')
    return saved ? JSON.parse(saved) : null
  })

  const [activity, setActivityState] = useState(() => {
    return localStorage.getItem('farcast_active_activity') || null
  })

  const [sensitivity, setSensitivityState] = useState(() => {
    const saved = localStorage.getItem('farcast_sensitivity')
    return saved ? JSON.parse(saved) : DEFAULT_SENSITIVITY
  })

  function setLocation(loc) {
    setLocationState(loc)
    localStorage.setItem('farcast_location', JSON.stringify(loc))
  }

  function setActivity(act) {
    setActivityState(act)
    localStorage.setItem('farcast_active_activity', act)
  }

  function setSensitivity(newSensitivity) {
    setSensitivityState(newSensitivity)
    localStorage.setItem('farcast_sensitivity', JSON.stringify(newSensitivity))
  }

  function resetSensitivity() {
    setSensitivityState(DEFAULT_SENSITIVITY)
    localStorage.setItem('farcast_sensitivity', JSON.stringify(DEFAULT_SENSITIVITY))
  }

  return (
    <PreferencesContext.Provider value={{
      location, setLocation,
      activity, setActivity,
      sensitivity, setSensitivity,
      resetSensitivity,
      DEFAULT_SENSITIVITY
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}