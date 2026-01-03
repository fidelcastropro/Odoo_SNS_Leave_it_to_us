import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trips } from '../utils/api'

function Dashboard({ user, isDark }) {
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [groupBy, setGroupBy] = useState('all')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Regional destinations with real travel photos
  const regionalDestinations = [
    { 
      id: 1, 
      name: 'Tamil Nadu Heritage', 
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=250&h=200&fit=crop&crop=center',
      trips: 12 
    },
    { 
      id: 2, 
      name: 'Kerala Backwaters', 
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=250&h=200&fit=crop&crop=center',
      trips: 8 
    },
    { 
      id: 3, 
      name: 'Rajasthan Royal', 
      image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=250&h=200&fit=crop&crop=center',
      trips: 15 
    },
    { 
      id: 4, 
      name: 'Goa Beaches', 
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=250&h=200&fit=crop&crop=center',
      trips: 20 
    },
    { 
      id: 5, 
      name: 'Himachal Hills', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=200&fit=crop&crop=center',
      trips: 6 
    },
    { 
      id: 6, 
      name: 'Karnataka Culture', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=250&h=200&fit=crop&crop=center',
      trips: 9 
    }
  ]

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

  const filteredTrips = userTrips.filter(trip => 
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner with beautiful travel photo */}
      <div className="relative w-full aspect-[3/1] mb-8">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop&crop=center" 
          alt="Beautiful mountain landscape with winding road"
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome back, {user.first_name}!</h1>
            <p className="text-xl md:text-2xl opacity-90">Ready for your next journey?</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search your trips..."
              className={`w-full px-6 py-3 rounded-full border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-violet-500/50' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500/50'
              } focus:ring-2 focus:ring-opacity-20`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className={`px-4 py-3 rounded-xl border font-medium ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="all">Group by</option>
              <option value="status">Status</option>
              <option value="region">Region</option>
            </select>
            <select 
              className={`px-4 py-3 rounded-xl border font-medium ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">Filter by</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select 
              className={`px-4 py-3 rounded-xl border font-medium ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Sort by Recent</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Top Regional Selections */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Regional Selections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
            {regionalDestinations.map((destination) => (
              <div 
                key={destination.id}
                className={`${isDark ? 'card' : 'card-light'} group cursor-pointer hover:scale-105 transition-all duration-300`}
              >
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {destination.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {destination.trips} trips available
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Cards */}
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

        {/* Previous Trips */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Trips</h2>
          </div>

          {filteredTrips.length === 0 ? (
            <div className={`${isDark ? 'card' : 'card-light'} text-center py-16`}>
              <div className="text-6xl mb-6">
                <svg className={`w-20 h-20 mx-auto ${isDark ? 'text-violet-400' : 'text-orange-500'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>No trips yet</h3>
              <p className={`mb-8 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Start planning your first adventure!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <Link key={trip.trip_id} to={`/trip/${trip.trip_id}`} className={`${isDark ? 'trip-card' : 'trip-card-light'} group`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{trip.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                      trip.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  
                  <div className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </div>
                    {trip.tourist_region && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {trip.tourist_region}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link 
          to="/create-trip" 
          className="btn-primary shadow-2xl hover:scale-110 transition-all duration-300 flex items-center space-x-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2v20m10-10H2"/>
          </svg>
          <span className="font-bold">Plan a Trip</span>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard