import { createContext, useContext, useState } from 'react'

const WeatherContext = createContext(null)

const CACHE_DURATION = 30 * 60 * 1000

export function WeatherProvider({ children }) {
  const [weather, setWeatherState] = useState(() => {
    const saved = localStorage.getItem('farcast_weather_data')
    if (!saved) return null
    const parsed = JSON.parse(saved)
    const age = Date.now() - new Date(parsed.fetchedAt).getTime()
    if (age > CACHE_DURATION) return null
    return parsed
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchWeather(lat, lon) {
    const key = import.meta.env.VITE_OPENWEATHER_KEY

    if (weather) {
      const age = Date.now() - new Date(weather.fetchedAt).getTime()
      if (age < CACHE_DURATION && weather.lat === lat && weather.lon === lon) {
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
      if (!currentRes.ok) throw new Error('API request failed')
      const current = await currentRes.json()

      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
      if (!forecastRes.ok) throw new Error('API request failed')
      const forecast = await forecastRes.json()

      const data = {
        fetchedAt: new Date().toISOString(),
        lat,
        lon,
        current,
        forecast: forecast.list
      }

      setWeatherState(data)
      localStorage.setItem('farcast_weather_data', JSON.stringify(data))
    } catch (err) {
      setError('Unable to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WeatherContext.Provider value={{ weather, loading, error, fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  return useContext(WeatherContext)
}