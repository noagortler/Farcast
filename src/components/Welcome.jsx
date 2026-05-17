function Welcome({ setPage }) {
  return (
    <div className="welcome">

      <div className="welcome-hero">
        <h1 className="wordmark"><span className="far">FAR</span><span className="cast">CAST</span></h1>
        <p className="tagline">Make the most of every forecast</p>
      </div>

      <div className="welcome-body">
        <h2 className="welcome-heading">Find your window</h2>
        <p className="welcome-description">Farcast translates live weather into a clear 0-100 comfort score for your activity,</p>
        <p className="welcome-description">so you can <span>make the most of every forecast.</span></p>
      </div>

      <button className="btn-primary" onClick={() => setPage('onboarding')}>
        Get started
      </button>

    </div>
  )
}

export default Welcome