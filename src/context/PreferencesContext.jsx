import { createContext, useContext, useState } from 'react'

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    const saved = localStorage.getItem('farcast_location')
    return saved ? JSON.parse(saved) : null
  })

  function setLocation(loc) {
    setLocationState(loc)
    localStorage.setItem('farcast_location', JSON.stringify(loc))
  }

  return (
    <PreferencesContext.Provider value={{ location, setLocation }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}