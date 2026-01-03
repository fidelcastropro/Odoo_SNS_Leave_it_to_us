import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trips } from '../utils/api'

function CreateTrip({ user, isDark }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    touristRegion: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date')
      setLoading(false)
      return
    }

    try {
      const response = await trips.create(formData)
      navigate(`/trip/${response.data.tripId}`)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Trip</h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Start planning your next adventure</p>
      </div>

      <div className={isDark ? 'card' : 'card-light'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Trip Title *
            </label>
            <input
              type="text"
              className={isDark ? 'input-field' : 'input-field-light'}
              placeholder="e.g., European Adventure 2024"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Date *
              </label>
              <input
                type="date"
                className={isDark ? 'input-field' : 'input-field-light'}
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                End Date *
              </label>
              <input
                type="date"
                className={isDark ? 'input-field' : 'input-field-light'}
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Primary Region
            </label>
            <input
              type="text"
              className={isDark ? 'input-field' : 'input-field-light'}
              placeholder="e.g., Europe, Southeast Asia"
              value={formData.touristRegion}
              onChange={(e) => setFormData({...formData, touristRegion: e.target.value})}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={`flex-1 ${isDark ? 'btn-secondary' : 'btn-secondary-light'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTrip