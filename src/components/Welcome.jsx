import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import HikingIcon from '@mui/icons-material/Hiking'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import RowingIcon from '@mui/icons-material/Kayaking'

function Welcome({ setPage }) {
    return (
        <div className="welcome">

            <div className="welcome-left">
                <div className="welcome-hero">
                    <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
                    <p className="tagline">Make the most of every forecast</p>
                </div>

                <div className="welcome-body">
                    <h2 className="welcome-heading">Find your window</h2>
                    <p className="welcome-description">Farcast translates live weather into a clear 0-100 comfort score for 
                        your activity, so you can <span>make the most of every forecast.</span></p>
                </div>
            </div>

            <div className="welcome-cards">

                <div className="welcome-card welcome-card-dark">
                    <p className="card-label">How the comfort scores work</p>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number step-1">1</div>
                            <div className="step-content">
                                <h3>Score each factor</h3>
                                <p>Temperature, wind, and rain each get a 0-100 score against the activity's ideal range.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number step-2">2</div>
                            <div className="step-content">
                                <h3>Weight by activity</h3>
                                <p>Paddling weighs wind heaviest, while running weighs temperature heaviest. Each sport has its own profile.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number step-3">3</div>
                            <div className="step-content">
                                <h3>Tune it to you</h3>
                                <p>Three sliders per activity calibrate the score to your personal preferences.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="welcome-card welcome-card-dark">
                    <p className="card-label">Built for four activities</p>

                    <div className="activity-grid">
                        <div className="activity-item">
                            <DirectionsBikeIcon style={{ fontSize: 32, color: 'var(--dark-navy)' }} />
                            <span>CYCLING</span>
                        </div>

                        <div className="activity-item">
                            <HikingIcon style={{ fontSize: 32, color: 'var(--dark-navy)' }} />
                            <span>HIKING</span>
                        </div>

                        <div className="activity-item">
                            <DirectionsRunIcon style={{ fontSize: 32, color: 'var(--dark-navy)' }} />
                            <span>RUNNING</span>
                        </div>

                        <div className="activity-item">
                            <RowingIcon style={{ fontSize: 32, color: 'var(--dark-navy)' }} />
                            <span>PADDLING</span>
                        </div>
                    </div>
                </div>

            </div>

            <button className="btn-primary" onClick={() => setPage('onboarding')}>
                Get started
            </button>

        </div>
    )
}

export default Welcome