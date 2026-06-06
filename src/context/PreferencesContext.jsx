import { createContext, useContext, useState } from 'react'

const PreferencesContext = createContext(null)

const DEFAULTS = {
  tempUnit: 'C',
  windUnit: 'kmh',
  timeFormat: '12h',
}

function loadPref(key, fallback) {
  const saved = localStorage.getItem(key)
  return saved !== null ? JSON.parse(saved) : fallback
}

export function PreferencesProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    const saved = localStorage.getItem('farcast_location')
    return saved ? JSON.parse(saved) : null
  })

  const [tempUnit, setTempUnitState] = useState(() => loadPref('farcast_tempUnit', DEFAULTS.tempUnit))
  const [windUnit, setWindUnitState] = useState(() => loadPref('farcast_windUnit', DEFAULTS.windUnit))
  const [timeFormat, setTimeFormatState] = useState(() => loadPref('farcast_timeFormat', DEFAULTS.timeFormat))

  function setLocation(loc) {
    setLocationState(loc)
    localStorage.setItem('farcast_location', JSON.stringify(loc))
  }

  function setTempUnit(val) {
    setTempUnitState(val)
    localStorage.setItem('farcast_tempUnit', JSON.stringify(val))
  }

  function setWindUnit(val) {
    setWindUnitState(val)
    localStorage.setItem('farcast_windUnit', JSON.stringify(val))
  }

  function setTimeFormat(val) {
    setTimeFormatState(val)
    localStorage.setItem('farcast_timeFormat', JSON.stringify(val))
  }

  return (
    <PreferencesContext.Provider value={{
      location, setLocation,
      tempUnit, setTempUnit,
      windUnit, setWindUnit,
      timeFormat, setTimeFormat,
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}