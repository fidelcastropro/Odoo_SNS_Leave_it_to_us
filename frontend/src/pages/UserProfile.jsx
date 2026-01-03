import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { trips, users } from '../utils/api'

function UserProfile({ user, isDark, onUpdateUser }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  
  const [profileImage, setProfileImage] = useState(user?.avatar || 'https://via.placeholder.com/200?text=User+Avatar')
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState({
    name: user?.first_name + ' ' + user?.last_name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    bio: 'Travel enthusiast exploring the world one destination at a time. Love discovering hidden gems and creating unforgettable memories.',
    location: user?.city + ', ' + user?.country || 'Mumbai, India'
  })

  // Trip images mapping
  const tripImages = {
    'chennai': 'https://images.unsplash.com/photo-1595211877493-41a4e5cd4b19?w=300&h=200&fit=crop',
    'madurai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop',
    'ooty': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'kanyakumari': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop',
    'munnar': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop',
    'alleppey': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    'kochi': 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=300&h=200&fit=crop',
    'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop',
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop',
    'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop',
    'jaipur': 'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=300&h=200&fit=crop',
    'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=200&fit=crop',
    'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop',
    'rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=200&fit=crop',
    'himachal': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'kashmir': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'bangalore': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop',
    'hyderabad': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop',
    'pune': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop',
    'kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=300&h=200&fit=crop',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop'
  }

  useEffect(() => {
    loadUserTrips()
  }, [])

  const loadUserTrips = async () => {
    try {
      const response = await trips.getAll()
      // Filter trips for the current user only
      const filteredTrips = response.data.filter(trip => trip.user_id === user.user_id)
      setUserTrips(filteredTrips)
    } catch (error) {
      console.error('Error loading trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTripImage = (tripTitle) => {
    const title = tripTitle.toLowerCase()
    for (const [key, image] of Object.entries(tripImages)) {
      if (title.includes(key)) {
        return image
      }
    }
    return tripImages.default
  }

  const preplannedTrips = userTrips.filter(trip => trip.status === 'upcoming')
  const previousTrips = userTrips.filter(trip => trip.status === 'completed')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target.result)
        setShowImageEditor(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const cropImage = async () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = async () => {
      const size = Math.min(img.width, img.height)
      const startX = (img.width - size) / 2
      const startY = (img.height - size) / 2
      
      canvas.width = 200
      canvas.height = 200
      
      ctx.drawImage(img, startX, startY, size, size, 0, 0, 200, 200)
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8)
      setProfileImage(croppedImageUrl)
      
      try {
        await users.updateAvatar(user.user_id, { avatar: croppedImageUrl })
        if (onUpdateUser) {
          onUpdateUser({ ...user, avatar: croppedImageUrl })
        }
      } catch (error) {
        console.error('Error updating avatar:', error)
      }
      
      setShowImageEditor(false)
      setSelectedImage(null)
    }
    
    img.src = selectedImage
  }

  const handleSaveDetails = async () => {
    try {
      await users.updateProfile(user.user_id, userDetails)
      if (onUpdateUser) {
        onUpdateUser({ ...user, ...userDetails })
      }
      setIsEditingDetails(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}`)
  }

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading profile...</div>
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          User Profile
        </h1>

        {/* Profile Section */}
        <div className={`rounded-2xl shadow-lg p-8 mb-8 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white'}`}>
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Edit profile image"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    User Details
                  </h2>
                  <button
                    onClick={() => setIsEditingDetails(!isEditingDetails)}
                    className="text-green-500 hover:text-green-600 font-medium"
                  >
                    {isEditingDetails ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingDetails ? (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bio
                      </label>
                      <textarea
                        value={userDetails.bio}
                        onChange={(e) => setUserDetails({...userDetails, bio: e.target.value})}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border resize-none ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleSaveDetails}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name: </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{userDetails.name}</span>
                    </div>
                    <div>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email: </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{userDetails.email}</span>
                    </div>
                    <div>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Location: </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{userDetails.location}</span>
                    </div>
                    <div>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bio: </span>
                      <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{userDetails.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preplanned Trips */}
        <section className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Preplanned Trips
          </h2>
          {preplannedTrips.length === 0 ? (
            <div className={`rounded-lg shadow-md p-8 text-center ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No preplanned trips available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {preplannedTrips.map((trip) => (
                <div
                  key={trip.trip_id}
                  className={`rounded-lg shadow-md p-4 hover:scale-105 transition-transform duration-300 ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
                >
                  <img
                    src={getTripImage(trip.title)}
                    alt={trip.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trip.title}
                  </h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleViewTrip(trip.trip_id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Previous Trips */}
        <section>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Previous Trips
          </h2>
          {previousTrips.length === 0 ? (
            <div className={`rounded-lg shadow-md p-8 text-center ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No previous trips available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previousTrips.map((trip) => (
                <div
                  key={trip.trip_id}
                  className={`rounded-lg shadow-md p-4 hover:scale-105 transition-transform duration-300 ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
                >
                  <img
                    src={getTripImage(trip.title)}
                    alt={trip.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trip.title}
                  </h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleViewTrip(trip.trip_id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Image Crop Modal */}
      {showImageEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Crop Profile Image
            </h3>
            
            <div className="mb-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowImageEditor(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={cropImage}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile