import { useNavigate } from 'react-router-dom'
import mercuryLogo from '../assets/mercury.svg'

function Home() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-mercury-dark flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <img
          src={mercuryLogo}
          alt="Mercury logo"
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Mercury
        </h1>
        <p className="text-base text-mercury-amber font-mono mb-8">
          Mercury Operations dashboard for Helios Mining
        </p>
        <button
          onClick={handleLogin}
          className="px-8 py-3 bg-mercury-amber hover:bg-mercury-amber/80 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mercury-amber focus:ring-offset-2 focus:ring-offset-mercury-dark"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Home
