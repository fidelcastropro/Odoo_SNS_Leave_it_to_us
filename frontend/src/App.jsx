import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard_fixed'
import NewTripPlanner from './pages/NewTripPlanner_with_itinerary'
import TripDetails from './pages/TripDetails'
import UserProfile from './pages/UserProfile'
import CommunityTab from './pages/CommunityTab'
import ActivitySearch from './pages/ActivitySearch'
import AdminDashboard from './pages/AdminDashboard'
import ManageUsers from './pages/ManageUsers'
import PopularActivities from './pages/PopularActivities'
import Navbar from './components/Navbar_with_profile'
import AdminNavbar from './components/AdminNavbar'

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
    // Store updated user data in localStorage for persistence
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
        {user && (
          user.role === 'admin' ? (
            <AdminNavbar user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />
          ) : (
            <Navbar user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />
          )
        )}
        <Routes>
          <Route path="/login" element={!user ? <Login setUser={handleLogin} isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/admin/manage-users" element={user?.role === 'admin' ? <ManageUsers isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/admin/popular-activities" element={user?.role === 'admin' ? <PopularActivities isDark={isDark} /> : <Navigate to="/login" />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={user && user.role !== 'admin' ? <Dashboard user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/create-trip" element={user && user.role !== 'admin' ? <NewTripPlanner user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user && user.role !== 'admin' ? <UserProfile user={user} isDark={isDark} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/community" element={user && user.role !== 'admin' ? <CommunityTab isDark={isDark} user={user} /> : <Navigate to="/login" />} />
          <Route path="/activities" element={user && user.role !== 'admin' ? <ActivitySearch isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/trip/:id" element={user && user.role !== 'admin' ? <TripDetails user={user} isDark={isDark} /> : <Navigate to="/login" />} />
          
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App