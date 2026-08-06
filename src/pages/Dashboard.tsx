import Header from '../components/Header'
import Card from '../components/Card'

const StatIcon = ({ paths }: { paths: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths} />
  </svg>
)

const stats = [
  {
    title: 'Active Missions',
    value: '12',
    descriptor: 'Currently operational across the solar system',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z',
    highlight: 'text-space-blue-400',
  },
  {
    title: 'Near-Earth Objects Today',
    value: '47',
    descriptor: 'Tracked asteroid approaches within 0.05 AU',
    icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2',
    highlight: 'text-amber-400',
  },
  {
    title: 'Mars Rover Status',
    value: 'Online',
    descriptor: 'Perseverance — Sol 1234 · Jezero Crater',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    highlight: 'text-red-400',
  },
  {
    title: 'AI Queries Processed',
    value: '3,891',
    descriptor: 'Mission intelligence requests this week',
    icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
    highlight: 'text-space-purple-400',
  },
]

export default function Dashboard() {
  return (
    <div>
      <Header
        title="Mission Control Dashboard"
        subtitle="Real-time space mission intelligence at a glance"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            title={stat.title}
            icon={<StatIcon paths={stat.icon} />}
          >
            <span className={`block text-3xl font-bold ${stat.highlight} mb-1`}>
              {stat.value}
            </span>
            <span className="text-xs text-slate-500">{stat.descriptor}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Mission Timeline" icon={<StatIcon paths="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />}>
          <ul className="space-y-3">
            {[
              { name: 'Artemis III Lunar Landing', status: 'Scheduled', color: 'text-space-blue-400' },
              { name: 'Europa Clipper Flyby', status: 'En Route', color: 'text-green-400' },
              { name: 'OSIRIS-REx Sample Analysis', status: 'In Progress', color: 'text-amber-400' },
              { name: 'Mars Sample Return Phase 1', status: 'Planning', color: 'text-slate-400' },
            ].map((mission) => (
              <li key={mission.name} className="flex items-center justify-between">
                <span className="text-slate-300 text-xs">{mission.name}</span>
                <span className={`text-xs font-medium ${mission.color}`}>{mission.status}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="System Status" icon={<StatIcon paths="M22 12h-4l-3 9L9 3l-3 9H2" />}>
          <ul className="space-y-3">
            {[
              { system: 'Deep Space Network', uptime: '99.8%', ok: true },
              { system: 'Asteroid Tracking Pipeline', uptime: '100%', ok: true },
              { system: 'AI Inference Engine', uptime: '97.2%', ok: true },
              { system: 'Mars Relay Orbiter', uptime: '94.5%', ok: false },
            ].map((s) => (
              <li key={s.system} className="flex items-center justify-between">
                <span className="text-slate-300 text-xs">{s.system}</span>
                <span className={`flex items-center gap-1.5 text-xs font-medium ${s.ok ? 'text-green-400' : 'text-amber-400'}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-400' : 'bg-amber-400'}`} />
                  {s.uptime}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
