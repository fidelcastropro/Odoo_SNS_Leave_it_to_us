import { useState, useEffect } from 'react'

function ItinerarySection({ onChange, isDark }) {
  const [sections, setSections] = useState([]) // Start with empty array

  // Calculate total budget and notify parent
  useEffect(() => {
    const totalBudget = sections.reduce((sum, section) => sum + (section.budget || 0), 0)
    if (onChange) {
      onChange(totalBudget, sections)
    }
  }, [sections, onChange])

  const addSection = () => {
    const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1
    const newSection = {
      id: newId,
      title: `Section ${newId}:`,
      description: 'All the necessary information about this section... (travel, hotel, activity)',
      startDate: '',
      endDate: '',
      budget: 0
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id) => {
    setSections(sections.filter(section => section.id !== id))
  }

  const updateField = (id, field, value) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

  const validateSection = (section) => {
    const errors = []
    if (section.startDate && section.endDate && new Date(section.endDate) <= new Date(section.startDate)) {
      errors.push('End date must be after start date')
    }
    if (section.budget < 0) {
      errors.push('Budget must be positive')
    }
    return errors
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Trip Itinerary Sections
      </h3>
      
      {/* Only show sections if they exist */}
      {sections.map((section, index) => {
        const errors = validateSection(section)
        
        return (
          <div 
            key={section.id} 
            className={`border-2 rounded-xl p-6 mb-4 shadow-md transition-all duration-300 ${
              isDark 
                ? 'border-gray-600 bg-gray-800/50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Section Header with Remove Button */}
            <div className="flex justify-between items-center mb-4">
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Section {index + 1}
              </h4>
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Remove section"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Title Field */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Section Title:
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateField(section.id, 'title', e.target.value)}
                className={`w-full rounded-lg border p-3 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                } focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter section title..."
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description:
              </label>
              <textarea
                value={section.description}
                onChange={(e) => updateField(section.id, 'description', e.target.value)}
                rows={3}
                className={`w-full rounded-lg border p-3 transition-all duration-300 resize-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                } focus:ring-2 focus:ring-opacity-20`}
                placeholder="All the necessary information about this section... (travel, hotel, activity)"
              />
            </div>

            {/* Date Range */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Date Range:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={section.startDate}
                    onChange={(e) => updateField(section.id, 'startDate', e.target.value)}
                    className={`w-full rounded-lg border p-3 transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-violet-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    } focus:ring-2 focus:ring-opacity-20`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={section.endDate}
                    onChange={(e) => updateField(section.id, 'endDate', e.target.value)}
                    min={section.startDate}
                    className={`w-full rounded-lg border p-3 transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-violet-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    } focus:ring-2 focus:ring-opacity-20`}
                  />
                </div>
              </div>
            </div>

            {/* Budget Field */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Budget of this section:
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ₹
                </span>
                <input
                  type="number"
                  value={section.budget}
                  onChange={(e) => updateField(section.id, 'budget', parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full rounded-lg border p-3 pl-8 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                  } focus:ring-2 focus:ring-opacity-20`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {errors.map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Add Section Button */}
      <button
        onClick={addSection}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2v20m10-10H2"/>
        </svg>
        <span>+ Add another section</span>
      </button>

      {/* Total Budget Display - Only show if there are sections */}
      {sections.length > 0 && (
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Estimated Budget:
            </span>
            <span className={`text-xl font-bold ${isDark ? 'text-violet-400' : 'text-green-600'}`}>
              ₹{sections.reduce((sum, section) => sum + (section.budget || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItinerarySection