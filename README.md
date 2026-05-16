# Farcast

Farcast is a mobile-first web app that translates live weather data into a clear, activity-specific comfort score. Instead of showing raw numbers and leaving interpretation to the user, Farcast answers one question directly: **when is my window of opportunity?**

Built for cyclists, hikers, runners, and paddlers.

---

## What it does

- Scores current weather conditions from 0 to 100 based on your selected activity
- Shows the best window of time for your activity today
- Breaks down what is affecting your score (temperature, wind, rain)
- Shows today's forecast in 3-hour intervals with a comfort score for each slot
- Shows a 5-day outlook with the best score of each day
- Lets you tune how sensitive you are to wind, rain, and temperature per activity

---

## Tech stack

- React (Vite)
- React Router
- Material UI + MUI Icons
- OpenWeather API (free tier)
- localStorage for data persistence

---

## Getting started

**1. Clone the repo**

```bash
git clone https://github.com/noagortler/farcast.git
cd farcast
```

**2. Install dependencies**

```bash
npm install
```

**3. Add your API key**

Create a `.env` file in the root of the project and add your OpenWeather API key:
```
VITE_OPENWEATHER_KEY=api_key_here
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

## Locations

Farcast currently uses a preset list of locations rather than live location search. Users pick from the list on the onboarding screen and can change it in settings.

---

## Documentation

Full planning documentation including the scoring algorithm, API contracts, and data workflows can be found in `docs/planning.md`.

The style guide can be found in `docs/style-guide.md`.

--

## Future Improvements

- **Push notifications** - a daily morning alert with your comfort score and best window for the day
- **Location search** - search for any city or trail by name instead of picking from a preset list
- **Multiple saved locations** - save and switch between multiple locations, useful for people who ride or hike in different spots regularly
- **Hourly forecast** - currently the app shows data in 3-hour intervals due to the free API tier, a paid plan would allow true per-hour breakdown
- **7-day forecast** - extending the outlook from 5 days to 7 days for better weekly planning