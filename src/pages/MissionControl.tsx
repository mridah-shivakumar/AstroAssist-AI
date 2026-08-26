import Header from '../components/Header'
import Card from '../components/Card'
import { useSpaceData } from '../hooks/useSpaceData'
import type { Mission } from '../types'

const Icon = ({ d }: { d: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
)

const STATUS_CONFIG: Record<
  Mission['status'],
  { label: string; dot: string; text: string; badge: string }
> = {
  active:    { label: 'Active',    dot: 'bg-green-400',           text: 'text-green-400',          badge: 'bg-green-900/30 text-green-400 border-green-800/40' },
  planned:   { label: 'Planned',   dot: 'bg-space-blue-400',      text: 'text-space-blue-400',     badge: 'bg-space-blue-900/30 text-space-blue-400 border-space-blue-800/40' },
  completed: { label: 'Completed', dot: 'bg-slate-400',           text: 'text-slate-400',          badge: 'bg-slate-800/50 text-slate-400 border-slate-700/40' },
  standby:   { label: 'Standby',   dot: 'bg-amber-400',           text: 'text-amber-400',          badge: 'bg-amber-900/30 text-amber-400 border-amber-800/40' },
}

function StatusBadge({ status }: { status: Mission['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${cfg.badge}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function MissionCard({ mission }: { mission: Mission }) {
  const formattedDate = mission.launchDate
    ? new Date(mission.launchDate + 'T00:00:00Z').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : '—'

  return (
    <div className="rounded-xl bg-space-card border border-space-border hover:border-space-blue-800 transition-colors duration-200 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      {mission.thumbUrl ? (
        <div className="h-36 overflow-hidden bg-space-surface">
          <img
            src={mission.thumbUrl}
            alt={mission.name}
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-36 bg-space-surface flex items-center justify-center text-slate-600">
          <Icon d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </div>
      )}

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100 leading-tight">{mission.name}</h3>
          <StatusBadge status={mission.status} />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            <span>{mission.target}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Icon d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{mission.description}</p>
      </div>
    </div>
  )
}

export default function MissionControl() {
  const { missions, missionsLoading } = useSpaceData()

  const activeCount    = missions.filter((m) => m.status === 'active').length
  const plannedCount   = missions.filter((m) => m.status === 'planned').length
  const completedCount = missions.filter((m) => m.status === 'completed').length

  return (
    <div>
      <Header
        title="Mission Control"
        subtitle="Active, planned, and historical NASA missions"
      />

      {/* Data provenance notice */}
      <div className="mb-6 rounded-xl border border-space-blue-700/40 bg-space-blue-900/10 px-5 py-4 flex items-start gap-3">
        <span className="text-space-blue-400 mt-0.5 flex-shrink-0">
          <Icon d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 8v4m0 4h.01" />
        </span>
        <div>
          <p className="text-sm font-semibold text-space-blue-300">About this data</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Mission facts (name, status, launch date, target, description) are sourced from{' '}
            <a
              href="https://www.nasa.gov/missions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-space-blue-400 hover:underline"
            >
              NASA.gov mission pages
            </a>{' '}
            and are curated, not fetched live. Thumbnail images are retrieved live from the{' '}
            <a
              href="https://images.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-space-blue-400 hover:underline"
            >
              NASA Image and Video Library API
            </a>
            . No single NASA public endpoint exposes all structured mission fields in machine-readable form.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active',    count: activeCount,    color: 'text-green-400' },
          { label: 'Planned',   count: plannedCount,   color: 'text-space-blue-400' },
          { label: 'Completed', count: completedCount, color: 'text-slate-400' },
        ].map((s) => (
          <Card
            key={s.label}
            title={s.label}
            icon={<Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.38L7 14.14 2 9.27l6.91-1.01L12 2z" />}
          >
            <span className={`block text-3xl font-bold ${s.color}`}>{count(s.count, missionsLoading)}</span>
          </Card>
        ))}
      </div>

      {/* Mission cards grid */}
      {missionsLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <svg
            className="animate-spin mr-3"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-sm">Loading mission data from NASA Image Library…</span>
        </div>
      ) : missions.length === 0 ? (
        <div className="rounded-lg border border-space-border bg-space-card p-8 text-center text-slate-500 text-sm">
          No mission data available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Returns the count as a string or a dash while loading */
function count(n: number, loading: boolean): string {
  return loading ? '—' : String(n)
}
