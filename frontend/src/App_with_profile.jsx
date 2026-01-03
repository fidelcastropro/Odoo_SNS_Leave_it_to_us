import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard_fixed'
import NewTripPlanner from './pages/NewTripPlanner_with_itinerary'
import TripDetails from './pages/TripDetails'
import UserProfile from './pages/UserProfile'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Always require fresh login - don't persist login state
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'dark' : 'light'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${isDark ? 'logo-gradient' : 'logo-gradient-light'} rounded-3xl flex items-center justify-center mx-auto mb-4 animate-glow`}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading your adventure...</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className={`min-h-screen ${isDark ? 'dark' : 'light'}`}>
        {user && <Navbar user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />}
        <Routes>
          <Route path="/login" element={!user ? <Login setUser={handleLogin} isDark={isDark} setIsDark={setIsDark} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/create-trip" element={user ? <NewTripPlanner user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <UserProfile user={user} isDark={isDark} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/trip/:id" element={user ? <TripDetails user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App