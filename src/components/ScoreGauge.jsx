import { getScoreLabel } from '../utils/scoring'

function ScoreGauge({ score }) {
  const { label, color } = getScoreLabel(score)

  return (
    <div
      className="score-gauge"
      style={{
        background: `conic-gradient(${color} ${score}%, var(--card-dark) 0)`,
      }}
    >
      <div className="score-gauge-hole">
        <span className="score-number">{score}</span>
        <span className="score-out-of">/ 100</span>
        <span className="score-label" style={{ color }}>{label.toUpperCase()}</span>
      </div>
    </div>
  )
}

export default ScoreGauge