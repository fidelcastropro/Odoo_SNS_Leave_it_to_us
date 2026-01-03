import { useState, useEffect } from 'react'
import { admin } from '../utils/api'

// Sample popular activities data
const samplePopularActivities = [
  {
    id: 1,
    name: 'Tea Garden Tour',
    city: 'Munnar',
    state: 'Kerala',
    category: 'Nature',
    search_count: 30,
    booking_count: 4,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Backwater Cruise',
    city: 'Alleppey',
    state: 'Kerala',
    category: 'Water Sports',
    search_count: 14,
    booking_count: 6,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571140727018-13d6da5a305d?w=300&h=200&fit=crop'
  },
  
  {
    id: 3,
    name: 'Hill Station Trek',
    city: 'Ooty',
    state: 'Tamil Nadu',
    category: 'Adventure',
    search_count: 13,
    booking_count: 5,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Temple Heritage Walk',
    city: 'Madurai',
    state: 'Tamil Nadu',
    category: 'Cultural',
    search_count: 20,
    booking_count: 12,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    name: 'Beach Sunset View',
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    category: 'Nature',
    search_count: 9,
    booking_count: 3,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1647106271999-f8bd20d3a8e5?w=300&h=200&fit=crop'
  },
  
  {
    id: 6,
    name: 'Spice Plantation Tour',
    city: 'Thekkady',
    state: 'Kerala',
    category: 'Nature',
    search_count: 5,
    booking_count: 2,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    name: 'Fort Kochi Walking Tour',
    city: 'Kochi',
    state: 'Kerala',
    category: 'Cultural',
    search_count: 6,
    booking_count: 3,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1708189562958-eb448082a122?w=300&h=200&fit=crop'
  },
  
  {
    id: 8,
    name: 'Lake Boating',
    city: 'Kodaikanal',
    state: 'Tamil Nadu',
    category: 'Water Sports',
    search_count: 5,
    booking_count: 2,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  }
]

function PopularActivities({ isDark }) {
  const [activities, setActivities] = useState(samplePopularActivities)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('search_count')
  const [filterBy, setFilterBy] = useState('All')

  useEffect(() => {
    loadPopularActivities()
  }, [])

  useEffect(() => {
    // Sort and filter activities
    let filtered = [...activities]
    
    if (filterBy !== 'All') {
      filtered = filtered.filter(activity => activity.category === filterBy)
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'search_count') return b.search_count - a.search_count
      if (sortBy === 'booking_count') return b.booking_count - a.booking_count
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })
    
    setActivities(filtered)
  }, [sortBy, filterBy])

  const loadPopularActivities = async () => {
    try {
      setLoading(true)
      const response = await admin.getPopularActivities()
      setActivities([...response.data, ...samplePopularActivities])
    } catch (error) {
      console.error('Error loading popular activities:', error)
      setActivities(samplePopularActivities)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Loading popular activities...
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Popular Activities
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Most searched and booked activities by users
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-green-500`}
          >
            <option value="search_count">Sort by Search Count</option>
            <option value="booking_count">Sort by Bookings</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-green-500`}
          >
            <option value="All">All Categories</option>
            <option value="Nature">Nature</option>
            <option value="Cultural">Cultural</option>
            <option value="Adventure">Adventure</option>
            <option value="Water Sports">Water Sports</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center">
              <p className={`text-2xl font-bold text-blue-500`}>
                {activities.reduce((sum, activity) => sum + activity.search_count, 0)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Searches</p>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center">
              <p className={`text-2xl font-bold text-green-500`}>
                {activities.reduce((sum, activity) => sum + activity.booking_count, 0)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Bookings</p>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center">
              <p className={`text-2xl font-bold text-purple-500`}>
                {activities.length}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Activities</p>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="text-center">
              <p className={`text-2xl font-bold text-yellow-500`}>
                {(activities.reduce((sum, activity) => sum + activity.rating, 0) / activities.length).toFixed(1)}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`rounded-xl shadow-lg overflow-hidden ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              } hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="relative">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    #{index + 1}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activity.name}
                </h3>
                
                <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  📍 {activity.city}, {activity.state}
                </div>
                
                <div className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  🏷️ {activity.category}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Searches
                    </span>
                    <span className={`font-semibold text-blue-500`}>
                      {activity.search_count}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Bookings
                    </span>
                    <span className={`font-semibold text-green-500`}>
                      {activity.booking_count}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Rating
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {activity.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PopularActivities