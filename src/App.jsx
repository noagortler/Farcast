import { useState } from 'react'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import Settings from './components/Settings'

function App() {
  const savedLocation = localStorage.getItem('farcast_location')
  const [page, setPage] = useState(savedLocation ? 'home' : 'onboarding')

  if (page === 'onboarding') return <Onboarding setPage={setPage} />
  if (page === 'home') return <Home setPage={setPage} />
  if (page === 'settings') return <Settings setPage={setPage} />
}

export default App