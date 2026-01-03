import { useState, useEffect } from 'react'
import { activities } from '../utils/api'

// Sample activities data
const sampleActivities = [
  {
    id: 1,
    name: 'Tea Garden Tour',
    city: 'Munnar',
    state: 'Kerala',
    category: 'Nature',
    duration: '4 hours',
    price: 1500,
    rating: 4.8,
    description: 'Explore lush tea plantations and learn about tea processing',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Backwater Cruise',
    city: 'Alleppey',
    state: 'Kerala',
    category: 'Water Sports',
    duration: '6 hours',
    price: 2500,
    rating: 4.9,
    description: 'Scenic houseboat cruise through Kerala backwaters',
    image: 'https://images.unsplash.com/photo-1571140727018-13d6da5a305d?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Hill Station Trek',
    city: 'Ooty',
    state: 'Tamil Nadu',
    category: 'Adventure',
    duration: '8 hours',
    price: 1200,
    rating: 4.6,
    description: 'Trekking through scenic hills and valleys',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Temple Heritage Walk',
    city: 'Madurai',
    state: 'Tamil Nadu',
    category: 'Cultural',
    duration: '3 hours',
    price: 800,
    rating: 4.7,
    description: 'Guided tour of ancient temples and cultural sites',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    name: 'Beach Sunset View',
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    category: 'Nature',
    duration: '2 hours',
    price: 500,
    rating: 4.5,
    description: 'Watch spectacular sunset at the southernmost tip of India',
    image: 'https://images.unsplash.com/photo-1647106271999-f8bd20d3a8e5?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    name: 'Spice Plantation Tour',
    city: 'Thekkady',
    state: 'Kerala',
    category: 'Nature',
    duration: '5 hours',
    price: 1800,
    rating: 4.4,
    description: 'Explore aromatic spice gardens and wildlife sanctuary',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    name: 'Fort Kochi Walking Tour',
    city: 'Kochi',
    state: 'Kerala',
    category: 'Cultural',
    duration: '3 hours',
    price: 900,
    rating: 4.6,
    description: 'Historical walk through colonial architecture and fishing nets',
    image: 'https://images.unsplash.com/photo-1708189562958-eb448082a122?w=300&h=200&fit=crop'
  },
  {
    id: 8,
    name: 'Lake Boating',
    city: 'Kodaikanal',
    state: 'Tamil Nadu',
    category: 'Water Sports',
    duration: '2 hours',
    price: 600,
    rating: 4.3,
    description: 'Peaceful boating in the scenic hill station lake',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  }
]

function ActivitySearch({ isDark }) {
  const [activities, setActivities] = useState(sampleActivities)
  const [filteredActivities, setFilteredActivities] = useState(sampleActivities)
  const [searchTerm, setSearchTerm] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [groupBy, setGroupBy] = useState('None')
  const [filterBy, setFilterBy] = useState('All')
  const [sortBy, setSortBy] = useState('Rating')
  const [loading, setLoading] = useState(false)

  // Filter and sort activities
  useEffect(() => {
    let filtered = [...activities]

    // Apply search filters
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (citySearch) {
      filtered = filtered.filter(activity =>
        activity.city.toLowerCase().includes(citySearch.toLowerCase()) ||
        activity.state.toLowerCase().includes(citySearch.toLowerCase())
      )
    }

    // Apply category filter
    if (filterBy === 'Nature') {
      filtered = filtered.filter(activity => activity.category === 'Nature')
    } else if (filterBy === 'Cultural') {
      filtered = filtered.filter(activity => activity.category === 'Cultural')
    } else if (filterBy === 'Adventure') {
      filtered = filtered.filter(activity => activity.category === 'Adventure')
    } else if (filterBy === 'Water Sports') {
      filtered = filtered.filter(activity => activity.category === 'Water Sports')
    } else if (filterBy === 'High Rating') {
      filtered = filtered.filter(activity => activity.rating >= 4.5)
    }

    // Apply sorting
    if (sortBy === 'Rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'Price Low to High') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price High to Low') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'Duration') {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration))
    }

    setFilteredActivities(filtered)
  }, [searchTerm, citySearch, groupBy, filterBy, sortBy, activities])

  // Group activities if groupBy is not 'None'
  const getGroupedActivities = () => {
    if (groupBy === 'None') return { 'All Activities': filteredActivities }

    const grouped = {}
    filteredActivities.forEach(activity => {
      let key
      if (groupBy === 'City') key = activity.city
      else if (groupBy === 'Category') key = activity.category
      else if (groupBy === 'State') key = activity.state

      if (!grouped[key]) grouped[key] = []
      grouped[key].push(activity)
    })
    return grouped
  }

  const groupedActivities = getGroupedActivities()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-4">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            <input
              type="text"
              placeholder="Search city..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className={`px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500`}
            >
              <option value="None">Group by</option>
              <option value="City">City</option>
              <option value="Category">Category</option>
              <option value="State">State</option>
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
              <option value="All">Filter</option>
              <option value="Nature">Nature</option>
              <option value="Cultural">Cultural</option>
              <option value="Adventure">Adventure</option>
              <option value="Water Sports">Water Sports</option>
              <option value="High Rating">High Rating (4.5+)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500`}
            >
              <option value="Rating">Sort by Rating</option>
              <option value="Price Low to High">Price Low to High</option>
              <option value="Price High to Low">Price High to Low</option>
              <option value="Duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Page Title */}
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Activity Search
        </h1>

        {/* Activities List */}
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([groupName, groupActivities]) => (
            <div key={groupName}>
              {groupBy !== 'None' && (
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {groupName}
                </h2>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`rounded-xl shadow-lg overflow-hidden ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                    } hover:shadow-xl transition-shadow duration-300`}
                  >
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {activity.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activity.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        📍 {activity.city}, {activity.state}
                      </div>
                      
                      <div className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        🏷️ {activity.category} • ⏱️ {activity.duration}
                      </div>
                      
                      <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activity.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-lg font-bold text-green-500`}>
                          ₹{activity.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No activities found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivitySearch