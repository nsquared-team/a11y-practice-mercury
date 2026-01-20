import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Operations from './pages/Operations'
import Personnel from './pages/Personnel'
import Equipment from './pages/Equipment'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Admin from './pages/Admin'

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          {/* Home/Login page - no layout */}
          <Route path="/" element={<Home />} />

          {/* Main app routes - with layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/operations" element={<Operations />} />
                  <Route path="/personnel" element={<Personnel />} />
                  <Route path="/equipment" element={<Equipment />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Hidden admin page - not linked in navigation */}
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </SettingsProvider>
  )
}

export default App
