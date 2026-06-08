# Farcast

Farcast is a simple weather app that pulls live forecast data and presents it clearly, with clean design, no accounts needed.

Built with React 19 and the OpenWeather API.

**Live demo:** [farcast.onrender.com](https://farcast.onrender.com)

---

## What Farcast Does

- Shows current conditions including temperature, feels like, wind, humidity, pressure, visibility, and cloud cover
- Highlights when the weather is expected to change in the next 24 hours
- Shows today's forecast in 3-hour intervals
- Shows a 5-day outlook with daily high and low temperatures
- Lets you set your preferred units for temperature, wind speed, and time format
- Saves your location and preferences locally so the app is ready when users return

---

## Tech Stack

- React 19 (Vite)
- MUI Icons (`@mui/icons-material`)
- OpenWeather API (free tier, current weather + 5-day forecast endpoints)
- localStorage for preferences and weather data caching

---

## Project Structure

```
farcast/
  public/
    favicon.svg
  src/
    components/
      Home.jsx        # Main weather screen
      Onboarding.jsx  # First-time setup screen
      Settings.jsx    # Location and display preferences
    context/
      PreferencesContext.jsx  # Stores and persists user preferences
      WeatherContext.jsx      # Fetches and caches weather data
    App.jsx       # Page routing
    main.jsx      # App entry point
    index.css     # Global styles and design system
  docs/
    planning.md   # v2 planning documentation
    style-guide.md
  index.html      # App entry point
  README.md
  NOTES.md

```

---

## Getting Started

**1. Clone the repo**

```bash
git clone https://github.com/noagortler/Farcast.git
cd farcast
```

**2. Install dependencies**

```bash
npm install
```

**3. Add your API key**

Create a `.env` file in the root of the project and add your OpenWeather API key:

```
VITE_OPENWEATHER_KEY=your_api_key_here
```

You can get a free API key at [openweathermap.org](https://openweathermap.org)

**4. Run the app**

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## Data

All user preferences are saved locally in the browser using localStorage. There is no backend and no user accounts. Weather data is fetched from OpenWeather and cached for 30 minutes to avoid unnecessary API calls.

---

## Error Handling

- If the OpenWeather API request fails, the app displays a user-friendly error message on the home screen and does not crash
- If no weather data is available yet, the app shows a loading state while the request is in progress
- If a user opens the app without a saved location, they are redirected to the onboarding screen automatically

### Testing
 
**API failure:** Set `VITE_OPENWEATHER_KEY` to an invalid value in `.env`, run `localStorage.clear()` in the browser console and refresh the page. An error message and a "Try again" button displays on the home screen. Restore API key when done.
 
**Loading state:** Run `localStorage.clear()` in the browser console, then navigate to the home screen. The loading message appears briefly while the weather data loads.
 
**No saved location:** Navigate to the home page, then run `localStorage.clear()` in the browser console and refresh the page. When the page is refreshed, the app redirects to onboarding instead of the homescreen.

---

## Locations

Farcast currently supports a preset list of cities across BC, Alberta, Ontario, and the Pacific Northwest. Users pick their location during onboarding and can change it anytime in Settings.

---

## Known Limitations

- Location support is limited to a preset list. Search and geolocation are planned for a future release.
- Forecast data is provided in 3-hour intervals due to the OpenWeather free tier.
- The 5-day outlook is derived from the same 3-hour forecast data, so coverage varies depending on the time of day.
- Because the free tier only returns future forecast slots, the "Today" entry in the 5-day forecast becomes less accurate as the day progresses. Early in the day this is not noticeable, but by afternoon the high and low temperatures may not reflect the full day, and by late evening the temperature bar may appear empty entirely.

---

## Future Improvements

### v1.5

- **Geolocation** to detect the user's current location automatically
- **Location search** to find any city by name instead of picking from a preset list
- **Day detail view** to see a full hourly breakdown for any day in the 5-day forecast
- **Multiple saved locations** to switch between locations quickly

### v2

- **Activity-based comfort scoring** to score current conditions from 0 to 100 based on a selected activity (cycling, hiking, running, paddling)
- **Best window of opportunity** to identify the optimal time window for your activity today based on forecast conditions
- **Per-activity sensitivity tuning** to adjust how much weight is given to temperature, wind, and rain for each activity
- **Score breakdown** to see exactly which weather factors are helping or hurting your score
- **Activity switcher** to switch between activities on the home screen without re-entering setup

*Full planning documentation for v2 including the scoring algorithm, activity weights, and data workflows can be found in `docs/planning.md`. The style guide can be found in `docs/style-guide.md`.*

---

## Notes

Additional notes on this project can be found in `NOTES.md`.