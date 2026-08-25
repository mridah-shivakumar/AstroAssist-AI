import Header from '../components/Header'
import Card from '../components/Card'
import { useSpaceData } from '../hooks/useSpaceData'

const Icon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function AsteroidMonitor() {
  const { asteroids, isLoading, error } = useSpaceData()

  // --- Derived statistics ---
  const totalObjects = asteroids.length

  const hazardousCount = asteroids.filter((a) => a.isPotentiallyHazardous).length

  const avgVelocity =
    totalObjects > 0
      ? asteroids.reduce((sum, a) => sum + a.relativeVelocity, 0) / totalObjects
      : 0

  const orbitCounts = { Apollo: 0, Aten: 0, Amor: 0, Atira: 0, Unknown: 0 }
  for (const a of asteroids) {
    orbitCounts[a.orbitClass]++
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <div>
        <Header
          title="Asteroid Monitor"
          subtitle="Tracking near-Earth objects and potential impact risk"
        />
        <div className="flex items-center justify-center py-24 text-slate-400">
          <svg className="animate-spin mr-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-sm">Fetching asteroid data from NASA NeoWs…</span>
        </div>
      </div>
    )
  }

  // --- Error state ---
  if (error) {
    return (
      <div>
        <Header
          title="Asteroid Monitor"
          subtitle="Tracking near-Earth objects and potential impact risk"
        />
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-6 text-center">
          <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
          <p className="mt-3 text-sm font-medium text-red-400">Failed to load asteroid data</p>
          <p className="mt-1 text-xs text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  // --- Normal state ---
  const categories = [
    {
      title: 'Close Approach Events',
      icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM4.93 4.93l14.14 14.14',
      count: String(totalObjects),
      unit: 'objects tracked (7-day window)',
      detail: 'Live data from NASA NeoWs · Updated on page load',
      badge: { label: 'Monitoring', color: 'bg-space-blue-900 text-space-blue-400' },
    },
    {
      title: 'Potentially Hazardous Asteroids',
      icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
      count: String(hazardousCount),
      unit: 'PHAs within 7-day window',
      detail:
        hazardousCount === 0
          ? 'No potentially hazardous asteroids detected in this window'
          : `${hazardousCount} asteroid${hazardousCount > 1 ? 's' : ''} flagged as potentially hazardous`,
      badge: {
        label: hazardousCount === 0 ? 'Low Risk' : 'Caution',
        color: hazardousCount === 0 ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400',
      },
    },
    {
      title: 'Velocity Tracking',
      icon: 'M5 12h14M12 5l7 7-7 7',
      count: avgVelocity.toFixed(1),
      unit: 'km/s average approach speed',
      detail: totalObjects > 0
        ? `Across ${totalObjects} tracked objects in the current 7-day window`
        : 'No velocity data available',
      badge: { label: 'Active', color: 'bg-amber-900/40 text-amber-400' },
    },
    {
      title: 'Orbital Analysis',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10M12 12l7-7',
      count: String(totalObjects),
      unit: 'orbits computed this window',
      detail: 'Apollo, Aten, Amor and Atira-class NEOs · Live from NASA NeoWs',
      badge: { label: 'Updated', color: 'bg-space-purple-900/40 text-space-purple-400' },
    },
  ]

  const orbitClasses = [
    { type: 'Apollo Class',  count: orbitCounts.Apollo,  color: 'text-red-400' },
    { type: 'Aten Class',    count: orbitCounts.Aten,    color: 'text-amber-400' },
    { type: 'Amor Class',    count: orbitCounts.Amor,    color: 'text-space-blue-400' },
    { type: 'Atira Class',   count: orbitCounts.Atira,   color: 'text-space-purple-400' },
    // Shown when orbit class is unavailable (NeoWs /feed omits orbital_data)
    ...(orbitCounts.Unknown > 0
      ? [{ type: 'Class N/A', count: orbitCounts.Unknown, color: 'text-slate-400' }]
      : []),
  ]

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
          {orbitClasses.map((cls) => (
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
