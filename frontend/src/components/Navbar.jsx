import { Link } from 'react-router-dom'

function Navbar({ user, onLogout, isDark, setIsDark }) {
  return (
    <nav className={isDark ? 'glass-nav' : 'glass-nav-light'}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/dashboard" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className={`w-14 h-14 ${isDark ? 'logo-gradient' : 'logo-gradient-light'} rounded-2xl flex items-center justify-center shadow-2xl animate-glow`}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 ${isDark ? 'bg-violet-400' : 'bg-orange-400'} rounded-full animate-pulse`}></div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-gradient' : 'text-gradient-light'}`}>GlobeTrotter</div>
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Travel Beyond Limits</div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className={`${isDark ? 'text-gray-300 hover:text-violet-400' : 'text-gray-700 hover:text-orange-600'} transition-all duration-300 font-medium relative group`}>
              Dashboard
              <div className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-violet-400' : 'bg-orange-500'} group-hover:w-full transition-all duration-300`}></div>
            </Link>
            
            <div className="flex items-center space-x-2">
              <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <div 
                className={`theme-toggle ${isDark ? '' : 'light'}`}
                onClick={() => setIsDark(!isDark)}
              >
                <div className="theme-toggle-slider"></div>
              </div>
              <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </div>
            
            <Link to="/create-trip" className="btn-primary">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2v20m10-10H2"/>
              </svg>
              New Journey
            </Link>
            <div className={`flex items-center space-x-4 pl-8 border-l ${isDark ? 'border-gray-700/50' : 'border-gray-300/50'}`}>
              <div className={`w-12 h-12 ${isDark ? 'logo-gradient' : 'logo-gradient-light'} rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg`}>
                {user.first_name?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.first_name}</span>
                <button onClick={onLogout} className={`${isDark ? 'text-gray-400 hover:text-violet-400' : 'text-gray-600 hover:text-orange-600'} text-sm transition-colors text-left font-medium`}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar