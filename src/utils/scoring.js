// How much each factor affects the score for each activity
const WEIGHTS = {
  cycling:  { temperature: 0.25, wind: 0.45, rain: 0.30 },
  hiking:   { temperature: 0.30, wind: 0.25, rain: 0.45 },
  running:  { temperature: 0.40, wind: 0.25, rain: 0.35 },
  paddling: { temperature: 0.20, wind: 0.55, rain: 0.25 },
}

// The ideal and avoid ranges for each factor and activity
const RANGES = {
  temperature: {
    cycling:  { ideal: [8, 22],  avoid: [2, 32] },
    hiking:   { ideal: [8, 20],  avoid: [0, 30] },
    running:  { ideal: [5, 16],  avoid: [0, 28] },
    paddling: { ideal: [12, 24], avoid: [5, 36] },
  },
  wind: {
    cycling:  { ideal: 15, avoid: 40 },
    hiking:   { ideal: 20, avoid: 50 },
    running:  { ideal: 15, avoid: 42 },
    paddling: { ideal: 10, avoid: 30 },
  },
  rain: {
    cycling:  { ideal: 15, avoid: 55 },
    hiking:   { ideal: 20, avoid: 65 },
    running:  { ideal: 20, avoid: 60 },
    paddling: { ideal: 25, avoid: 70 },
  },
}

// Keeps a number between a minimum and maximum value
function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

// Returns a score 0-100 for temperature based on the activity
function scoreTemperature(temp, activity) {
  const idealMin = RANGES.temperature[activity].ideal[0]
  const idealMax = RANGES.temperature[activity].ideal[1]
  const avoidMin = RANGES.temperature[activity].avoid[0]
  const avoidMax = RANGES.temperature[activity].avoid[1]

  if (temp >= idealMin && temp <= idealMax) return 100

  if (temp < idealMin) {
    if (temp <= avoidMin) return 0
    return Math.round(((temp - avoidMin) / (idealMin - avoidMin)) * 100)
  }

  if (temp > idealMax) {
    if (temp >= avoidMax) return 0
    return Math.round(((avoidMax - temp) / (avoidMax - idealMax)) * 100)
  }

  return 0
}

// Returns a score 0-100 for wind speed based on the activity
function scoreWind(wind, activity) {
  const ideal = RANGES.wind[activity].ideal
  const avoid = RANGES.wind[activity].avoid

  if (wind <= ideal) return 100
  if (wind >= avoid) return 0

  return Math.round(((avoid - wind) / (avoid - ideal)) * 100)
}

function scoreRain(rain, activity) {
  const ideal = RANGES.rain[activity].ideal
  const avoid = RANGES.rain[activity].avoid

  if (rain <= ideal) return 100
  if (rain >= avoid) return 0

  return Math.round(((avoid - rain) / (avoid - ideal)) * 100)
}

// Calculates the overall comfort score for an activity given weather conditions
// sensitivity is an object like { temperature: 3, wind: 3, rain: 3 } between 1-5
export function calculateScore(temp, windSpeed, rainChance, activity, sensitivity) {

  // Step 1: score each weather factor individually (0-100)
  const tempScore = scoreTemperature(temp, activity)
  const windScore = scoreWind(windSpeed, activity)
  const rainScore = scoreRain(rainChance, activity)

  // Step 2: get the base weights for this activity
  const baseWeights = WEIGHTS[activity]

  // Step 3: adjust weights based on user sensitivity (1=less sensitive, 5=more sensitive)
  const multipliers = { 1: 0.6, 2: 0.8, 3: 1.0, 4: 1.2, 5: 1.4 }

  const adjustedWeights = {
    temperature: baseWeights.temperature * multipliers[sensitivity.temperature],
    wind:        baseWeights.wind        * multipliers[sensitivity.wind],
    rain:        baseWeights.rain        * multipliers[sensitivity.rain],
  }

  // Step 4: re-normalise so weights still add up to 1.0 after adjustment
  const weightTotal = adjustedWeights.temperature + adjustedWeights.wind + adjustedWeights.rain

  const normalisedWeights = {
    temperature: adjustedWeights.temperature / weightTotal,
    wind:        adjustedWeights.wind        / weightTotal,
    rain:        adjustedWeights.rain        / weightTotal,
  }

  // Step 5: calculate the weighted average score
  const rawScore = (tempScore * normalisedWeights.temperature) +
                   (windScore * normalisedWeights.wind) +
                   (rainScore * normalisedWeights.rain)

  // Step 6: round and clamp to 0-100
  const finalScore = clamp(Math.round(rawScore), 0, 100)

  return {
    score: finalScore,
    breakdown: {
      temperature: { score: tempScore },
      wind:        { score: windScore },
      rain:        { score: rainScore },
    }
  }
}

// Returns a label and colour for a given score
export function getScoreLabel(score) {
  if (score >= 90) return { label: 'Optimal', color: 'var(--score-optimal)' }
  if (score >= 70) return { label: 'Good',    color: 'var(--score-good)' }
  if (score >= 45) return { label: 'Fair',    color: 'var(--score-fair)' }
  if (score >= 20) return { label: 'Poor',    color: 'var(--score-poor)' }
  return { label: 'Avoid', color: 'var(--score-avoid)' }
}