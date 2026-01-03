import { useState, useEffect } from 'react'
import { community } from '../utils/api'

// Star component
const Star = ({ className, filled }) => (
  <svg className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
  </svg>
)

// Sample community comments data
const sampleComments = [
  {
    id: 1,
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    username: 'Arjun Kumar',
    place: 'Munnar',
    rating: 5,
    travelDate: '2025-01-15',
    comment: 'Amazing tea gardens and misty mountains! Perfect for a romantic getaway. The weather was incredible.'
  },
  {
    id: 2,
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    username: 'Priya Sharma',
    place: 'Alleppey',
    rating: 4,
    travelDate: '2024-12-20',
    comment: 'Backwater cruise was magical! Houseboat experience exceeded expectations. Food was authentic and delicious.'
  },
  {
    id: 3,
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    username: 'Raj Patel',
    place: 'Ooty',
    rating: 4,
    travelDate: '2025-01-10',
    comment: 'Hill station vibes were perfect! Toy train ride was nostalgic. Great place for family vacation.'
  },
  {
    id: 4,
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    username: 'Meera Nair',
    place: 'Kanyakumari',
    rating: 5,
    travelDate: '2024-11-25',
    comment: 'Sunrise at the southernmost tip was breathtaking! Vivekananda Rock Memorial is a must-visit.'
  },
  {
    id: 5,
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    username: 'Vikram Singh',
    place: 'Madurai',
    rating: 4,
    travelDate: '2024-12-05',
    comment: 'Meenakshi Temple architecture is mind-blowing! Rich cultural heritage and amazing street food.'
  },
  {
    id: 6,
    userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face',
    username: 'Ananya Das',
    place: 'Kochi',
    rating: 5,
    travelDate: '2025-01-05',
    comment: 'Fort Kochi charm is unmatched! Chinese fishing nets and colonial architecture create perfect ambiance.'
  },
  {
    id: 7,
    userAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=40&h=40&fit=crop&crop=face',
    username: 'Rohit Menon',
    place: 'Thekkady',
    rating: 3,
    travelDate: '2024-10-15',
    comment: 'Wildlife sanctuary was good but crowded. Spice plantations tour was educational and aromatic.'
  },
  {
    id: 8,
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face',
    username: 'Kavya Reddy',
    place: 'Kodaikanal',
    rating: 4,
    travelDate: '2024-12-30',
    comment: 'Princess of Hill Stations lived up to its name! Coaker Walk and Bryant Park were highlights.'
  },
  {
    id: 9,
    userAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face',
    username: 'Arun Kumar',
    place: 'Rameswaram',
    rating: 5,
    travelDate: '2024-11-10',
    comment: 'Spiritual journey was transformative! Ramanathaswamy Temple corridors are architectural marvels.'
  },
  {
    id: 10,
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    username: 'Deepika Iyer',
    place: 'Coimbatore',
    rating: 3,
    travelDate: '2024-09-20',
    comment: 'Good base for exploring Western Ghats. Isha Yoga Center was peaceful and rejuvenating.'
  },
  {
    id: 11,
    userAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
    username: 'Suresh Babu',
    place: 'Thanjavur',
    rating: 4,
    travelDate: '2024-08-15',
    comment: 'Brihadeeswarar Temple is UNESCO heritage wonder! Rich Chola dynasty history comes alive here.'
  },
  {
    id: 12,
    userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face',
    username: 'Lakshmi Pillai',
    place: 'Wayanad',
    rating: 5,
    travelDate: '2025-01-20',
    comment: 'Nature paradise with coffee plantations! Chembra Peak trek was challenging but rewarding experience.'
  }
]

function CommunityTab({ isDark, user }) {
  const [comments, setComments] = useState([])
  const [filteredComments, setFilteredComments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [groupBy, setGroupBy] = useState('None')
  const [filterBy, setFilterBy] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [showAddComment, setShowAddComment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    place: '',
    rating: 5,
    travelDate: '',
    comment: ''
  })

  // Load comments from API and handle adding new comments
  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await community.getComments()
      // Combine API data with sample data for demo purposes
      const allComments = [...response.data, ...sampleComments]
      setComments(allComments)
    } catch (error) {
      console.error('Error loading comments:', error)
      // Use sample data if API fails
      setComments(sampleComments)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    const commentData = {
      ...newComment,
      user_id: user.user_id,
      userAvatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name + ' ' + user?.last_name)}&background=10b981&color=fff&size=40`,
      username: user?.first_name + ' ' + user?.last_name || 'Anonymous User',
      created_at: new Date().toISOString()
    }

    try {
      const response = await community.addComment(commentData)
      setComments(prev => [response.data, ...prev])
    } catch (error) {
      console.error('Error adding comment:', error)
      // Add locally with temporary ID if API fails
      const tempComment = { ...commentData, id: Date.now() }
      setComments(prev => [tempComment, ...prev])
    }
    
    setNewComment({ place: '', rating: 5, travelDate: '', comment: '' })
    setShowAddComment(false)
  }

  // Filter and sort comments based on current filters
  useEffect(() => {
    let filtered = [...comments]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply rating/date/location filters
    if (filterBy === '4+ Stars') {
      filtered = filtered.filter(comment => comment.rating >= 4)
    } else if (filterBy === '2025') {
      filtered = filtered.filter(comment => comment.travelDate.startsWith('2025'))
    } else if (filterBy === 'Tamil Nadu') {
      const tnPlaces = ['Ooty', 'Madurai', 'Kanyakumari', 'Kodaikanal', 'Rameswaram', 'Coimbatore', 'Thanjavur']
      filtered = filtered.filter(comment => tnPlaces.includes(comment.place))
    } else if (filterBy === 'Kerala') {
      const keralaPlaces = ['Munnar', 'Alleppey', 'Kochi', 'Thekkady', 'Wayanad']
      filtered = filtered.filter(comment => keralaPlaces.includes(comment.place))
    }

    // Apply sorting
    if (sortBy === 'Newest') {
      filtered.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate))
    } else if (sortBy === 'Highest Rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'Most Recent Travel') {
      filtered.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate))
    }

    setFilteredComments(filtered)
  }, [searchTerm, groupBy, filterBy, sortBy, comments])

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        filled={i < rating}
      />
    ))
  }

  // Group comments if groupBy is not 'None'
  const getGroupedComments = () => {
    if (groupBy === 'None') return { 'All Comments': filteredComments }

    const grouped = {}
    filteredComments.forEach(comment => {
      let key
      if (groupBy === 'Place') key = comment.place
      else if (groupBy === 'Rating') key = `${comment.rating} Stars`
      else if (groupBy === 'Travel Date') key = comment.travelDate.substring(0, 7) // YYYY-MM

      if (!grouped[key]) grouped[key] = []
      grouped[key].push(comment)
    })
    return grouped
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Loading community experiences...
      </div>
    )
  }

  const groupedComments = getGroupedComments()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search experiences, places, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
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
              <option value="Place">Place</option>
              <option value="Rating">Rating</option>
              <option value="Travel Date">Travel Date</option>
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
              <option value="4+ Stars">4+ Stars</option>
              <option value="2025">2025</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
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
              <option value="Newest">Sort by</option>
              <option value="Highest Rating">Highest Rating</option>
              <option value="Most Recent Travel">Most Recent Travel</option>
            </select>
          </div>
        </div>

        {/* Add Comment Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Community Tab
          </h1>
          <button
            onClick={() => setShowAddComment(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2v20m10-10H2"/>
            </svg>
            Share Experience
          </button>
        </div>

        {/* Comments List */}
        <div aria-live="polite" className="space-y-6">
          {Object.entries(groupedComments).map(([groupName, groupComments]) => (
            <div key={groupName}>
              {groupBy !== 'None' && (
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {groupName}
                </h2>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`rounded-xl shadow-lg p-6 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                    } hover:shadow-xl transition-shadow duration-300`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={comment.userAvatar}
                        alt={comment.username}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {comment.username}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {renderStars(comment.rating)}
                          </div>
                        </div>
                        
                        <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {comment.place} • {new Date(comment.travelDate).toLocaleDateString()}
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No experiences found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Comment Modal */}
      {showAddComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Share Your Travel Experience
            </h3>
            
            <form onSubmit={handleAddComment} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Place
                </label>
                <input
                  type="text"
                  required
                  value={newComment.place}
                  onChange={(e) => setNewComment({...newComment, place: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="e.g., Munnar, Ooty, Alleppey"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Rating
                </label>
                <select
                  value={newComment.rating}
                  onChange={(e) => setNewComment({...newComment, rating: parseInt(e.target.value)})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Travel Date
                </label>
                <input
                  type="date"
                  required
                  value={newComment.travelDate}
                  onChange={(e) => setNewComment({...newComment, travelDate: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Experience
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Share your travel experience, highlights, and recommendations..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddComment(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityTab