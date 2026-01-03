import { useState } from 'react'
import { auth } from '../utils/api'

function Login({ setUser, isDark, setIsDark }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: '',
    city: '',
    state: '',
    country: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      // Check for admin login
      if (formData.email === 'admin@globetrotter.com' && formData.password === 'admin123') {
        const adminUser = {
          user_id: 'admin',
          email: 'admin@globetrotter.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
        localStorage.setItem('token', 'admin-token')
        localStorage.setItem('user', JSON.stringify(adminUser))
        setUser(adminUser)
        return
      }
      
      const response = isLogin 
        ? await auth.login(formData.email, formData.password)
        : await auth.register(formData)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-8 right-8 z-20 flex items-center space-x-3">
        <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <div 
          className={`theme-toggle ${isDark ? '' : 'light'}`}
          onClick={() => setIsDark(!isDark)}
        >
          <div className="theme-toggle-slider"></div>
        </div>
        <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0">
        {isDark ? (
          <>
            <div className="floating-orb w-96 h-96 bg-violet-500 top-20 left-20 animate-float"></div>
            <div className="floating-orb w-80 h-80 bg-purple-500 bottom-32 right-32 animate-float" style={{animationDelay: '3s'}}></div>
            <div className="floating-orb w-64 h-64 bg-indigo-500 top-1/2 left-1/2 animate-float" style={{animationDelay: '6s'}}></div>
          </>
        ) : (
          <>
            <div className="floating-orb w-96 h-96 bg-orange-400 top-20 left-20 animate-float"></div>
            <div className="floating-orb w-80 h-80 bg-red-400 bottom-32 right-32 animate-float" style={{animationDelay: '3s'}}></div>
            <div className="floating-orb w-64 h-64 bg-pink-400 top-1/2 left-1/2 animate-float" style={{animationDelay: '6s'}}></div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-lg w-full mx-6">
        <div className={isDark ? 'card' : 'card-light'}>
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <div className={`w-24 h-24 ${isDark ? 'logo-gradient' : 'logo-gradient-light'} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-glow`}>
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${isDark ? 'bg-violet-400' : 'bg-orange-400'} rounded-full animate-pulse`}></div>
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-gradient' : 'text-gradient-light'}`}>
              GlobeTrotter
            </h1>
            <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Discover. Plan. Experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className={isDark ? 'input-field' : 'input-field-light'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className={isDark ? 'input-field' : 'input-field-light'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Choose username"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className={isDark ? 'input-field' : 'input-field-light'}
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary text-lg font-semibold">
              {isLogin ? 'Access Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-orange-600 hover:text-orange-500'} transition-colors font-medium`}
            >
              {isLogin ? "New to GlobeTrotter? Join us" : "Already exploring? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login