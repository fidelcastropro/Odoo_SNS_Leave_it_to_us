import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { trips, cities, activities, itinerary } from '../utils/api'

function TripDetails({ user, isDark }) {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [cityResults, setCityResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [itineraryForm, setItineraryForm] = useState({
    startDate: '',
    endDate: '',
    budget: ''
  })
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    loadTrip()
  }, [id])

  const loadTrip = async () => {
    try {
      const response = await trips.getById(id)
      const tripData = response.data
      
      // Sort itinerary by start date
      if (tripData.itinerary) {
        tripData.itinerary.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      }
      
      setTrip(tripData)
    } catch (error) {
      console.error('Error loading trip:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchCities = async (query) => {
    if (!query) {
      setCityResults([])
      return
    }
    
    try {
      const response = await cities.search({ search: query })
      setCityResults(response.data)
    } catch (error) {
      console.error('Error searching cities:', error)
    }
  }

  const addItineraryItem = async () => {
    if (!selectedCity || !itineraryForm.startDate || !itineraryForm.endDate || !itineraryForm.budget) {
      alert('Please fill all fields')
      return
    }

    try {
      await itinerary.add({
        tripId: id,
        title: `Visit ${selectedCity.city_name}`,
        details: selectedCity.description,
        startDate: itineraryForm.startDate,
        endDate: itineraryForm.endDate,
        budgetAmount: parseFloat(itineraryForm.budget)
      })
      await loadTrip()
      setShowCitySearch(false)
      setSearchQuery('')
      setCityResults([])
      setSelectedCity(null)
      setItineraryForm({ startDate: '', endDate: '', budget: '' })
    } catch (error) {
      console.error('Error adding itinerary item:', error)
    }
  }

  const selectCity = (city) => {
    setSelectedCity(city)
    setCityResults([])
    setSearchQuery(city.city_name)
  }

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getItineraryForDate = (date) => {
    if (!trip?.itinerary) return []
    
    return trip.itinerary.filter(item => {
      const itemStart = new Date(item.start_date)
      const itemEnd = new Date(item.end_date)
      const checkDate = new Date(date)
      
      return checkDate >= itemStart && checkDate <= itemEnd
    })
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const itineraryItems = getItineraryForDate(date)
      
      days.push(
        <div key={day} className={`h-24 border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-1 overflow-hidden`}>
          <div className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {itineraryItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-green-500 text-white text-xs px-1 py-0.5 rounded truncate"
                title={item.title}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCalendarView(false)}
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} transition-colors`}
              >
                ← Back to Trip
              </button>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {trip.title} - Calendar View
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} transition-colors`}
              >
                ←
              </button>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} min-w-48 text-center`}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} transition-colors`}
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Day Headers */}
            <div className="grid grid-cols-7">
              {dayNames.map(day => (
                <div key={day} className={`p-4 text-center font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days}
            </div>
          </div>

          {/* Legend */}
          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Legend</h3>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">Itinerary Item</div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>- Activities and destinations planned for your trip</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showCalendarView) {
    return renderCalendar()
  }

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading...</div>
  }

  if (!trip) {
    return <div className={`text-center py-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Trip not found</div>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const totalBudget = trip.itinerary?.reduce((sum, item) => sum + parseFloat(item.budget_amount || 0), 0) || 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{trip.title}</h1>
        <div className={`flex items-center space-x-4 mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          {trip.tourist_region && <span>📍 {trip.tourist_region}</span>}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
            trip.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trip.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Itinerary</h2>
            <button
              onClick={() => setShowCitySearch(true)}
              className="btn-primary"
            >
              + Add Destination
            </button>
          </div>

          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="space-y-4">
              {trip.itinerary.map((item, index) => (
                <div key={item.id} className={isDark ? 'card' : 'card-light'}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                      <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.details}</p>
                      <div className={`flex items-center space-x-4 mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span>📅 {formatDate(item.start_date)} - {formatDate(item.end_date)}</span>
                        <span>💰 ${item.budget_amount}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary ml-4">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations added yet</h3>
              <p className="text-gray-600 mb-6">Start building your itinerary by adding destinations</p>
              <button
                onClick={() => setShowCitySearch(true)}
                className="btn-primary"
              >
                Add First Destination
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destinations</span>
                <span className="font-medium">{trip.itinerary?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Budget</span>
                <span className="font-medium text-primary">${totalBudget.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-left">📊 View Budget Breakdown</button>
              <button 
                onClick={() => setShowCalendarView(true)}
                className="w-full btn-secondary text-left"
              >
                📅 Calendar View
              </button>
              <button className="w-full btn-secondary text-left">🔗 Share Trip</button>
            </div>
          </div>
        </div>
      </div>

      {showCitySearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add Destination</h3>
              <button
                onClick={() => {
                  setShowCitySearch(false)
                  setSelectedCity(null)
                  setSearchQuery('')
                  setCityResults([])
                  setItineraryForm({ startDate: '', endDate: '', budget: '' })
                }}
                className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* City Search */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search City
                </label>
                <input
                  type="text"
                  placeholder="Search for cities..."
                  className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    searchCities(e.target.value)
                    setSelectedCity(null)
                  }}
                />
                
                {cityResults.length > 0 && !selectedCity && (
                  <div className={`mt-2 max-h-40 overflow-y-auto border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    {cityResults.map((city) => (
                      <div
                        key={city.city_id}
                        className={`flex justify-between items-center p-3 cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        onClick={() => selectCity(city)}
                      >
                        <div>
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{city.city_name}</h4>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{city.country}, {city.region}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{city.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Cost Index: {city.cost_index}</div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Popularity: {city.popularity}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date and Budget Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={itineraryForm.startDate}
                    min={trip.start_date}
                    max={trip.end_date}
                    onChange={(e) => setItineraryForm({...itineraryForm, startDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={itineraryForm.endDate}
                    min={itineraryForm.startDate || trip.start_date}
                    max={trip.end_date}
                    onChange={(e) => setItineraryForm({...itineraryForm, endDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Budget Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  value={itineraryForm.budget}
                  onChange={(e) => setItineraryForm({...itineraryForm, budget: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              {selectedCity && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Selected: {selectedCity.city_name}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedCity.description}</p>
                </div>
              )}

              <button
                onClick={addItineraryItem}
                disabled={!selectedCity || !itineraryForm.startDate || !itineraryForm.endDate || !itineraryForm.budget}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetails