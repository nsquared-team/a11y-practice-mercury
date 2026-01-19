import { useState, useMemo } from 'react'
import { Search, UserPlus, Calendar, Award, Filter, ChevronDown, X, Mail, Phone, Briefcase } from 'lucide-react'
import ShiftSchedule from '../components/personnel/ShiftSchedule'
import CertificationTracker from '../components/personnel/CertificationTracker'
import PersonnelFormWizard from '../components/personnel/PersonnelFormWizard'
import {
  personnelData,
  Personnel,
  filterPersonnel,
  getFullName,
  getInitials,
  Role,
  Shift,
  PersonnelStatus,
  availableRoles,
  availableShifts,
  getDaysUntilExpiration,
  getPersonnelStats,
} from '../data/personnel'

function PersonnelPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'directory' | 'schedule' | 'certifications'>('directory')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)
  const [showAddWizard, setShowAddWizard] = useState(false)

  // Filters
  const [roleFilters, setRoleFilters] = useState<Set<Role>>(new Set())
  const [shiftFilters, setShiftFilters] = useState<Set<Shift>>(new Set())
  const [statusFilters, setStatusFilters] = useState<Set<PersonnelStatus>>(new Set())

  // Get stats
  const stats = useMemo(() => getPersonnelStats(), [])

  // Filtered personnel
  const filteredPersonnel = useMemo(() => {
    return filterPersonnel(personnelData, {
      search: searchQuery,
      roles: roleFilters.size > 0 ? Array.from(roleFilters) : undefined,
      shifts: shiftFilters.size > 0 ? Array.from(shiftFilters) : undefined,
      statuses: statusFilters.size > 0 ? Array.from(statusFilters) : undefined,
    })
  }, [searchQuery, roleFilters, shiftFilters, statusFilters])

  // Filter handlers
  const toggleRoleFilter = (role: Role) => {
    const newFilters = new Set(roleFilters)
    if (newFilters.has(role)) {
      newFilters.delete(role)
    } else {
      newFilters.add(role)
    }
    setRoleFilters(newFilters)
  }

  const toggleShiftFilter = (shift: Shift) => {
    const newFilters = new Set(shiftFilters)
    if (newFilters.has(shift)) {
      newFilters.delete(shift)
    } else {
      newFilters.add(shift)
    }
    setShiftFilters(newFilters)
  }

  const toggleStatusFilter = (status: PersonnelStatus) => {
    const newFilters = new Set(statusFilters)
    if (newFilters.has(status)) {
      newFilters.delete(status)
    } else {
      newFilters.add(status)
    }
    setStatusFilters(newFilters)
  }

  const clearFilters = () => {
    setRoleFilters(new Set())
    setShiftFilters(new Set())
    setStatusFilters(new Set())
    setSearchQuery('')
  }

  const hasActiveFilters = roleFilters.size > 0 || shiftFilters.size > 0 || statusFilters.size > 0 || searchQuery

  // Status badge helper
  const getStatusBadge = (status: PersonnelStatus) => {
    const classes = {
      'On Duty': 'bg-status-active/20 text-status-active border border-status-active/30',
      'Off Duty': 'bg-status-idle/20 text-status-idle border border-status-idle/30',
      'On Break': 'bg-status-warning/20 text-status-warning border border-status-warning/30',
      'On Leave': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${classes[status]}`}>
        {status}
      </span>
    )
  }

  // Shift badge helper
  const getShiftBadge = (shift: Shift) => {
    const classes = {
      Alpha: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      Beta: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      Gamma: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${classes[shift]}`}>
        {shift} Shift
      </span>
    )
  }

  // Certification status badge
  const getCertStatusBadge = (status: 'valid' | 'expiring' | 'expired') => {
    const classes = {
      valid: 'bg-status-active/20 text-status-active',
      expiring: 'bg-status-warning/20 text-status-warning',
      expired: 'bg-status-error/20 text-status-error',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Personnel Management</h1>
          <p className="text-gray-500 mt-1">
            {stats.total} personnel across {Object.keys(stats.byShift).length} shifts
          </p>
        </div>
        <button
          onClick={() => setShowAddWizard(true)}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">On Duty</p>
          <p className="text-2xl font-semibold text-status-active">{stats.byStatus['On Duty']}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Off Duty</p>
          <p className="text-2xl font-semibold text-gray-400">{stats.byStatus['Off Duty']}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Expiring Certs</p>
          <p className="text-2xl font-semibold text-status-warning">{stats.certsByStatus.expiring}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Expired Certs</p>
          <p className="text-2xl font-semibold text-status-error">{stats.certsByStatus.expired}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'directory', label: 'Directory', icon: Search },
          { id: 'schedule', label: 'Shift Schedule', icon: Calendar },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-mercury-amber' : 'text-gray-400 hover:text-gray-200'
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
          {/* Search and Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
                />
              </div>

              {/* Filter dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-mercury-amber text-mercury-amber' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-mercury-amber text-mercury-dark text-xs px-1.5 py-0.5 rounded-full">
                      {roleFilters.size + shiftFilters.size + statusFilters.size}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-lg z-10 p-4">
                    {/* Role Filter */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Role</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableRoles.map(role => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={roleFilters.has(role)}
                              onChange={() => toggleRoleFilter(role)}
                              className="rounded border-mercury-dark-tertiary bg-mercury-dark text-mercury-amber focus:ring-mercury-amber"
                            />
                            <span className="text-xs text-gray-400">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Shift Filter */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Shift</h4>
                      <div className="flex gap-4">
                        {availableShifts.map(shift => (
                          <label key={shift} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={shiftFilters.has(shift)}
                              onChange={() => toggleShiftFilter(shift)}
                              className="rounded border-mercury-dark-tertiary bg-mercury-dark text-mercury-amber focus:ring-mercury-amber"
                            />
                            <span className="text-sm text-gray-400">{shift}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(['On Duty', 'Off Duty', 'On Break', 'On Leave'] as PersonnelStatus[]).map(status => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={statusFilters.has(status)}
                              onChange={() => toggleStatusFilter(status)}
                              className="rounded border-mercury-dark-tertiary bg-mercury-dark text-mercury-amber focus:ring-mercury-amber"
                            />
                            <span className="text-sm text-gray-400">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-sm text-mercury-amber hover:underline">
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mt-4">
              Showing {filteredPersonnel.length} of {personnelData.length} personnel
            </p>
          </div>

          {/* Personnel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonnel.map(person => (
              <div
                key={person.id}
                className="card-hover cursor-pointer"
                onClick={() => setSelectedPerson(person)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-mercury-dark-tertiary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-medium text-mercury-amber">
                      {getInitials(person)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100 truncate">{getFullName(person)}</h3>
                    <p className="text-sm text-gray-500 truncate">{person.role}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {getStatusBadge(person.status)}
                      {getShiftBadge(person.shift)}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      {person.certifications.length} certifications
                      {person.certifications.some(c => c.status === 'expiring') && (
                        <span className="text-status-warning">• {person.certifications.filter(c => c.status === 'expiring').length} expiring</span>
                      )}
                      {person.certifications.some(c => c.status === 'expired') && (
                        <span className="text-status-error">• {person.certifications.filter(c => c.status === 'expired').length} expired</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPersonnel.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500">No personnel match your search criteria</p>
              <button onClick={clearFilters} className="text-mercury-amber hover:underline mt-2 text-sm">
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="card">
          <ShiftSchedule />
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="card">
          <CertificationTracker />
        </div>
      )}

      {/* Personnel Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-mercury-dark-tertiary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-medium text-mercury-amber">
                      {getInitials(selectedPerson)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">{getFullName(selectedPerson)}</h2>
                    <p className="text-mercury-amber font-mono">{selectedPerson.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedPerson.status)}
                      {getShiftBadge(selectedPerson.shift)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-mercury-dark rounded-lg flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-200">{selectedPerson.email}</p>
                  </div>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-200">{selectedPerson.role}</p>
                  </div>
                </div>
              </div>

              {/* Assignment & Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Current Assignment</p>
                  <p className="text-gray-200 font-mono">
                    {selectedPerson.currentAssignment || 'Unassigned'}
                  </p>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="text-gray-200">
                    {selectedPerson.hireDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Emergency Contact</h3>
                <div className="p-4 bg-mercury-dark rounded-lg flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-200">{selectedPerson.emergencyContact.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedPerson.emergencyContact.relationship} • {selectedPerson.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Certifications ({selectedPerson.certifications.length})
                </h3>
                <div className="space-y-2">
                  {selectedPerson.certifications.map(cert => {
                    const daysUntil = getDaysUntilExpiration(cert)
                    return (
                      <div
                        key={cert.id}
                        className="p-3 bg-mercury-dark rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="text-gray-200">{cert.name}</p>
                          <p className="text-xs text-gray-500">
                            Expires: {cert.expirationDate.toLocaleDateString()}
                            {cert.status === 'expiring' && (
                              <span className="text-status-warning ml-2">({daysUntil} days left)</span>
                            )}
                            {cert.status === 'expired' && (
                              <span className="text-status-error ml-2">({Math.abs(daysUntil)} days ago)</span>
                            )}
                          </p>
                        </div>
                        {getCertStatusBadge(cert.status)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Personnel Wizard */}
      {showAddWizard && (
        <PersonnelFormWizard
          onClose={() => setShowAddWizard(false)}
          onSubmit={(data) => {
            // In a real app, this would save to a backend
            console.log('New personnel data:', data)
            // Show success feedback
            alert(`Personnel "${data.personal.firstName} ${data.personal.lastName}" added successfully!`)
            setShowAddWizard(false)
          }}
        />
      )}
    </div>
  )
}

export default PersonnelPage
