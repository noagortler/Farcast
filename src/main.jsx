import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PreferencesProvider } from './context/PreferencesContext'
import { WeatherProvider } from './context/WeatherContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreferencesProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </PreferencesProvider>
  </StrictMode>
)