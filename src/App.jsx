import { useState } from 'react'
import Welcome from './components/Welcome'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import Settings from './components/Settings'
import About from './components/About'

function App() {
  const [page, setPage] = useState('welcome')

  if (page === 'welcome') return <Welcome setPage={setPage} />
  if (page === 'onboarding') return <Onboarding setPage={setPage} />
  if (page === 'home') return <Home setPage={setPage} />
  if (page === 'settings') return <Settings setPage={setPage} />
  if (page === 'about') return <About setPage={setPage} />
}

export default App