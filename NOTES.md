# Weather App Project Notes

## Project Scope

The original plan for this app was more ambitious than what is submitted here. The idea was to build a weather app with a scoring system that would rate the day's conditions and recommend activities based on the user's preferences.

I started building this and got fairly far into it. The scoring logic worked and the activity recommendations were functional. But the more I built, the more I noticed the app's scope was far larger than anticipated.

I made the decision to step back and build a simpler, more focused version for the assignment submission. All the scoring and activity work was moved to a separate v2 branch where it is fully preserved. The main branch was rebuilt from scratch as a clean, straightforward weather app to be submitted as v1.

## Technical Decisions

**No routing library.** Page navigation is handled manually using React state in `App.jsx`. This was a deliberate choice to keep the app lightweight given the small number of screens.

**Unit conversions are done in the UI.** All weather data is fetched in metric from OpenWeather. Temperature, wind speed, and time format are converted on the fly in the component layer, so preference changes don't need to trigger a new API call.

**30-minute cache.** Weather data is cached in localStorage with a timestamp. If the user returns within 30 minutes and the location has not changed, the app uses the saved data instead of making a new API call.

## Accessibility Considerations
 
- All text color combinations were verified against WCAG contrast ratios. Every pairing in the app passes AA, and most pass AAA. The lowest ratio is the green CAST text in the wordmark on dark navy at 6.11:1, which still passes AA for large text.
- All interactive touch targets meet the 44px minimum height requirement, including the toggle buttons for temperature, wind speed, and time format.
- A meta description is included in `index.html` for SEO and accessibility tooling.