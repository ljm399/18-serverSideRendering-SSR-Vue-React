import { Link, Route, Routes } from 'react-router-dom'

import Home from './pages/home.jsx'
import About from './pages/about.jsx'

export default function AppRouter() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
