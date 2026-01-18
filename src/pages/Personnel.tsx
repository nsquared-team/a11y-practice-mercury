import { useState } from 'react'
import { Search, UserPlus, Calendar, Award } from 'lucide-react'

function Personnel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'directory' | 'schedule' | 'certifications'>('directory')

  // Placeholder data
  const personnel = [
    { id: 'P001', name: 'Elena Rodriguez', role: 'Shift Supervisor', shift: 'Alpha', status: 'On Duty', certifications: 4 },
    { id: 'P002', name: 'Marcus Chen', role: 'Equipment Operator', shift: 'Alpha', status: 'On Duty', certifications: 3 },
    { id: 'P003', name: 'Aisha Patel', role: 'Safety Coordinator', shift: 'Alpha', status: 'On Break', certifications: 5 },
    { id: 'P004', name: 'James Okonkwo', role: 'Extraction Technician', shift: 'Beta', status: 'Off Duty', certifications: 2 },
    { id: 'P005', name: 'Sofia Andersson', role: 'Maintenance Engineer', shift: 'Beta', status: 'Off Duty', certifications: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Personnel Management</h1>
          <p className="text-gray-500 mt-1">Staff scheduling and certification tracking</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <UserPlus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'directory', label: 'Directory', icon: Search },
          { id: 'schedule', label: 'Shift Schedule', icon: Calendar },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mercury-amber"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
            />
          </div>

          {/* Personnel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personnel.map((person) => (
              <div key={person.id} className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-mercury-dark-tertiary rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-mercury-amber">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-100">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        person.status === 'On Duty'
                          ? 'bg-status-active/20 text-status-active'
                          : person.status === 'On Break'
                            ? 'bg-status-warning/20 text-status-warning'
                            : 'bg-status-idle/20 text-status-idle'
                      }`}>
                        {person.status}
                      </span>
                      <span className="text-xs text-gray-500">{person.shift} Shift</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="card">
          <div className="h-96 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Shift Schedule Calendar will be implemented in Phase 4</p>
          </div>
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="card">
          <div className="h-96 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Certification Tracker will be implemented in Phase 4</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Personnel
