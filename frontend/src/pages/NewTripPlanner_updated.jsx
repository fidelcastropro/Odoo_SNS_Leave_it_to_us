import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trips } from '../utils/api'

function NewTripPlanner({ user, isDark }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    startPlace: '',
    startDate: '',
    endDate: '',
    title: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Hardcoded suggestions with real photos
  const allSuggestions = [
    { id: 1, name: 'Meenakshi Temple', state: 'Tamil Nadu', city: 'Madurai', imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop&crop=center' },
    { id: 2, name: 'Marina Beach', state: 'Tamil Nadu', city: 'Chennai', imageUrl: 'https://images.unsplash.com/photo-1595211877493-41a4e5cd4b19?w=300&h=200&fit=crop&crop=center' },
    { id: 3, name: 'Ooty Hill Station', state: 'Tamil Nadu', city: 'Ooty', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center' },
    { id: 4, name: 'Brihadeeswarar Temple', state: 'Tamil Nadu', city: 'Thanjavur', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop&crop=center' },
    { id: 5, name: 'Kanyakumari Beach', state: 'Tamil Nadu', city: 'Kanyakumari', imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop&crop=center' },
    { id: 6, name: 'Mahabalipuram Shore Temple', state: 'Tamil Nadu', city: 'Mahabalipuram', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop&crop=center' },
    { id: 7, name: 'Munnar Tea Gardens', state: 'Kerala', city: 'Munnar', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop&crop=center' },
    { id: 8, name: 'Alleppey Backwaters', state: 'Kerala', city: 'Alleppey', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center' },
    { id: 9, name: 'Varkala Beach', state: 'Kerala', city: 'Varkala', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop&crop=center' },
    { id: 10, name: 'Periyar National Park', state: 'Kerala', city: 'Thekkady', imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300&h=200&fit=crop&crop=center' },
    { id: 11, name: 'Kochi Fort', state: 'Kerala', city: 'Kochi', imageUrl: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=300&h=200&fit=crop&crop=center' },
    { id: 12, name: 'Athirappilly Waterfalls', state: 'Kerala', city: 'Thrissur', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop&crop=center' }
  ]

  const [filteredSuggestions, setFilteredSuggestions] = useState(allSuggestions)

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuggestions(allSuggestions)
    } else {
      const filtered = allSuggestions.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSuggestions(filtered)
    }
  }, [searchQuery])

  const handlePlaceSelect = (place) => {
    setFormData({
      ...formData,
      startPlace: `${place.name}, ${place.city}`,
      title: `Trip to ${place.city}`
    })
    setSelectedPlace(place)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setFormData({ ...formData, startPlace: value })
    setShowSuggestions(true)
    setSelectedPlace(null)
  }

  const validateForm = () => {
    if (!formData.startPlace.trim()) {
      setError('Please select a starting place')
      return false
    }
    if (!formData.startDate) {
      setError('Please select a start date')
      return false
    }
    if (!formData.endDate) {
      setError('Please select an end date')
      return false
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await trips.create({
        title: formData.title || `Trip to ${formData.startPlace}`,
        startDate: formData.startDate,
        endDate: formData.endDate,
        touristRegion: selectedPlace?.state || 'South India'
      })
      
      navigate(`/trip/${response.data.tripId}`)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto p-6 pt-8">
        {/* Title */}
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Plan a new trip</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Start Place - Searchable */}
            <div className="relative">
              <label htmlFor="startPlace" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Place:
              </label>
              <div className="relative">
                <input
                  id="startPlace"
                  type="text"
                  placeholder="Search for a place..."
                  className={`w-full px-4 py-3 rounded-full border transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                  } focus:ring-2 focus:ring-opacity-20`}
                  value={formData.startPlace}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                <svg className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Dropdown suggestions */}
              {showSuggestions && searchQuery && (
                <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                  isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                } border`}>
                  {filteredSuggestions.slice(0, 5).map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handlePlaceSelect(place)}
                      className={`w-full px-4 py-3 text-left border-b last:border-b-0 transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-700 border-gray-600 text-white' 
                          : 'hover:bg-gray-50 border-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="font-medium">{place.name}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{place.city}, {place.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Date:
              </label>
              <input
                id="startDate"
                type="date"
                className={`w-full px-4 py-3 rounded-full border transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-violet-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:ring-2 focus:ring-opacity-20`}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                className={`w-full px-4 py-3 rounded-full border transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-violet-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:ring-2 focus:ring-opacity-20`}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {/* Suggestions Section */}
        <div className={`border rounded-2xl p-6 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Suggestions for Places to Visit/Activities to perform
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredSuggestions.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handlePlaceSelect(place)}
                className={`group border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ${
                  selectedPlace?.id === place.id 
                    ? 'ring-2 ring-green-500 border-green-500' 
                    : isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <h4 className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{place.name}</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{place.city}, {place.state}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !formData.startPlace || !formData.startDate || !formData.endDate}
            className="w-full bg-green-600 text-white py-4 px-8 rounded-full font-semibold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewTripPlanner