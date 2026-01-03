import { useState, useEffect } from 'react'
import { admin } from '../utils/api'

// Sample users data
const sampleUsers = [
  {
    id: 1,
    first_name: 'Arjun',
    last_name: 'Kumar',
    email: 'arjun.kumar@email.com',
    city: 'Mumbai',
    country: 'India',
    created_at: '2024-01-15',
    trip_count: 3,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    first_name: 'Priya',
    last_name: 'Sharma',
    email: 'priya.sharma@email.com',
    city: 'Delhi',
    country: 'India',
    created_at: '2024-02-10',
    trip_count: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    first_name: 'Raj',
    last_name: 'Patel',
    email: 'raj.patel@email.com',
    city: 'Ahmedabad',
    country: 'India',
    created_at: '2024-01-20',
    trip_count: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 4,
    first_name: 'Meera',
    last_name: 'Nair',
    email: 'meera.nair@email.com',
    city: 'Kochi',
    country: 'India',
    created_at: '2024-03-05',
    trip_count: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 5,
    first_name: 'Vikram',
    last_name: 'Singh',
    email: 'vikram.singh@email.com',
    city: 'Jaipur',
    country: 'India',
    created_at: '2024-02-28',
    trip_count: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 6,
    first_name: 'Ananya',
    last_name: 'Das',
    email: 'ananya.das@email.com',
    city: 'Kolkata',
    country: 'India',
    created_at: '2024-01-08',
    trip_count: 6,
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face'
  }
]

function ManageUsers({ isDark }) {
  const [users, setUsers] = useState(sampleUsers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(sampleUsers)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await admin.getAllUsers()
      setUsers([...response.data, ...sampleUsers])
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers(sampleUsers)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Loading users...
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Manage Users
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Overview of all registered users and their activities
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <span className="text-sm font-medium">Total Users: {filteredUsers.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          />
        </div>

        {/* Users Table */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    User
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Location
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Trips
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={user.avatar}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.first_name} {user.last_name}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user.email}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      📍 {user.city}, {user.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.trip_count > 3 
                          ? 'bg-green-100 text-green-800' 
                          : user.trip_count > 1 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.trip_count} trips
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No users found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers