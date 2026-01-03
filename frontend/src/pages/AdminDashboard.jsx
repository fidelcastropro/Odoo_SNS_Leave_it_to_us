import { useState, useEffect } from 'react'
import { admin } from '../utils/api'

// Sample popular cities data
const samplePopularCities = [
  {
    id: 1,
    city_name: 'Munnar',
    state: 'Kerala',
    user_count: 4,
    trip_count: 5,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    city_name: 'Alleppey',
    state: 'Kerala',
    user_count: 3,
    trip_count: 6,
    image: 'https://images.unsplash.com/photo-1677475455506-1e429162f44f?w=400&h=250&fit=crop'
  },
  
  {
    id: 3,
    city_name: 'Ooty',
    state: 'Tamil Nadu',
    user_count: 2,
    trip_count: 5,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    city_name: 'Kanyakumari',
    state: 'Tamil Nadu',
    user_count: 1,
    trip_count: 4,
    image: 'https://images.unsplash.com/photo-1527705381526-469031509a9d?w=400&h=250&fit=crop'
  },
  
  {
    id: 5,
    city_name: 'Madurai',
    state: 'Tamil Nadu',
    user_count: 1,
    trip_count: 47,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    city_name: 'Kochi',
    state: 'Kerala',
    user_count: 1,
    trip_count: 6,
    image: 'https://images.unsplash.com/photo-1625721838087-c46e51c89558?w=400&h=250&fit=crop'
  }
]

function AdminDashboard({ isDark }) {
  const [popularCities, setPopularCities] = useState(samplePopularCities)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPopularCities()
  }, [])

  const loadPopularCities = async () => {
    try {
      setLoading(true)
      const response = await admin.getPopularCities()
      setPopularCities([...response.data, ...samplePopularCities])
    } catch (error) {
      console.error('Error loading popular cities:', error)
      setPopularCities(samplePopularCities)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Loading admin dashboard...
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Overview of popular destinations and user preferences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Cities</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {popularCities.length}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {popularCities.reduce((sum, city) => sum + city.user_count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
                <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Trips</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {popularCities.reduce((sum, city) => sum + city.trip_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cities */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Most Popular Cities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCities.map((city) => (
              <div
                key={city.id}
                className={`rounded-xl shadow-lg overflow-hidden ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                } hover:shadow-xl transition-shadow duration-300`}
              >
                <img
                  src={city.image}
                  alt={city.city_name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {city.city_name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    📍 {city.state}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Users Preferred
                      </span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {city.user_count}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Trips
                      </span>
                      <span className={`font-semibold text-green-500`}>
                        {city.trip_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard