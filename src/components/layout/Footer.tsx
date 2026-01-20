import { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, Activity } from 'lucide-react'

function Footer() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastSync, setLastSync] = useState(new Date())

  // Simulate connection status and periodic sync
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setLastSync(new Date())
    }, 30000) // Update every 30 seconds

    // Simulate occasional connection issues
    const connectionInterval = setInterval(() => {
      setIsConnected((prev) => (Math.random() > 0.1 ? true : !prev))
    }, 60000)

    return () => {
      clearInterval(syncInterval)
      clearInterval(connectionInterval)
    }
  }, [])

  const formatLastSync = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <footer className="h-10 bg-mercury-dark-secondary border-t border-mercury-dark-tertiary flex items-center justify-between px-4 text-xs">
      {/* System Status */}
      {/* A11Y ISSUE: Low contrast text - gray-700 on dark background fails WCAG 1.4.3 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-status-active" />
          <span className="text-gray-700">System Status:</span>
          <span className="text-status-active font-medium">Operational</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-700">|</span>
          <span className="text-gray-700">Active Sites:</span>
          <span className="text-mercury-amber font-mono">17</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-gray-700">|</span>
          <span className="text-gray-700">
            Mercury icon by{' '}
            <a
              href="https://thenounproject.com/icon/mercury-2414024/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-mercury-amber underline"
            >
              supalerk laipawat
            </a>{' '}
            from the Noun Project
          </span>
        </div>
      </div>

      {/* Connection Status and Sync */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-status-active" />
              <span className="text-status-active">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-status-error" />
              <span className="text-status-error">Disconnected</span>
            </>
          )}
        </div>

        {/* Last Sync */}
        {/* A11Y ISSUE: Low contrast text - gray-700 fails WCAG 1.4.3 */}
        <div className="hidden sm:flex items-center gap-2">
          <RefreshCw className="w-3 h-3 text-gray-700" />
          <span className="text-gray-700">Last sync:</span>
          <span className="text-gray-600 font-mono">{formatLastSync(lastSync)}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
