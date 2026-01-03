import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trips } from '../utils/api'

function Dashboard({ user, isDark }) {
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      const response = await trips.getAll()
      setUserTrips(response.data)
    } catch (error) {
      console.error('Error loading trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome back, {user.first_name}!</h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Plan your next adventure with GlobeTrotter</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={isDark ? 'card' : 'card-light'}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total Trips</h3>
          <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-violet-400' : 'text-orange-600'}`}>{userTrips.length}</p>
        </div>
        <div className={isDark ? 'card' : 'card-light'}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {userTrips.filter(trip => trip.status === 'upcoming').length}
          </p>
        </div>
        <div className={isDark ? 'card' : 'card-light'}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Completed</h3>
          <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {userTrips.filter(trip => trip.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Trips</h2>
        <Link to="/create-trip" className="btn-primary">
          + Create New Trip
        </Link>
      </div>

      {userTrips.length === 0 ? (
        <div className={`${isDark ? 'card' : 'card-light'} text-center py-12`}>
          <div className="text-6xl mb-4">
            <svg className={`w-16 h-16 mx-auto ${isDark ? 'text-violet-400' : 'text-orange-500'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No trips yet</h3>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Start planning your first adventure!</p>
          <Link to="/create-trip" className="btn-primary">
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTrips.map((trip) => (
            <Link key={trip.trip_id} to={`/trip/${trip.trip_id}`} className={`${isDark ? 'trip-card' : 'trip-card-light'} group`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{trip.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                  trip.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trip.status}
                </span>
              </div>
              
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </div>
                {trip.tourist_region && (
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    {trip.tourist_region}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard