import Header from '../components/Header'
import Card from '../components/Card'

const Icon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const categories = [
  {
    title: 'Close Approach Events',
    icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM4.93 4.93l14.14 14.14',
    count: '47',
    unit: 'objects tracked today',
    detail: 'Nearest approach: 2024 BX1 at 0.0021 AU · Velocity 14.3 km/s',
    badge: { label: 'Monitoring', color: 'bg-space-blue-900 text-space-blue-400' },
  },
  {
    title: 'Potentially Hazardous Asteroids',
    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    count: '3',
    unit: 'PHAs within 7-day window',
    detail: 'All currently classified as non-threatening · Next review in 18 hrs',
    badge: { label: 'Low Risk', color: 'bg-green-900/40 text-green-400' },
  },
  {
    title: 'Velocity Tracking',
    icon: 'M5 12h14M12 5l7 7-7 7',
    count: '14.3',
    unit: 'km/s average approach speed',
    detail: 'Ranging from 3.2 km/s (slow crossers) to 72.8 km/s (fast retrograde)',
    badge: { label: 'Active', color: 'bg-amber-900/40 text-amber-400' },
  },
  {
    title: 'Orbital Analysis',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10M12 12l7-7',
    count: '1,247',
    unit: 'orbits computed this week',
    detail: 'Apollo, Aten, and Amor-class NEOs included · Updated every 4 hours',
    badge: { label: 'Updated', color: 'bg-space-purple-900/40 text-space-purple-400' },
  },
]

export default function AsteroidMonitor() {
  return (
    <div>
      <Header
        title="Asteroid Monitor"
        subtitle="Tracking near-Earth objects and potential impact risk"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {categories.map((cat) => (
          <Card key={cat.title} title={cat.title} icon={<Icon d={cat.icon} />}>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{cat.count}</span>
                <span className="text-xs text-slate-500">{cat.unit}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.detail}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cat.badge.color}`}>
                {cat.badge.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Object Classification Overview" icon={<Icon d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
          {[
            { type: 'Apollo Class', count: '312', color: 'text-red-400' },
            { type: 'Aten Class', count: '85', color: 'text-amber-400' },
            { type: 'Amor Class', count: '221', color: 'text-space-blue-400' },
            { type: 'Atira Class', count: '29', color: 'text-space-purple-400' },
          ].map((cls) => (
            <div key={cls.type} className="text-center">
              <div className={`text-xl font-bold ${cls.color}`}>{cls.count}</div>
              <div className="text-xs text-slate-500 mt-0.5">{cls.type}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
