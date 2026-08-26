import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AsteroidMonitor from './pages/AsteroidMonitor'
import MarsExplorer from './pages/MarsExplorer'
import MissionControl from './pages/MissionControl'
import MissionInsights from './pages/MissionInsights'

export default function App() {
  return (
    <div className="flex h-full min-h-screen bg-space-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/asteroids" element={<AsteroidMonitor />} />
          <Route path="/mars" element={<MarsExplorer />} />
          <Route path="/missions" element={<MissionControl />} />
          <Route path="/insights" element={<MissionInsights />} />
        </Routes>
      </main>
    </div>
  )
}
