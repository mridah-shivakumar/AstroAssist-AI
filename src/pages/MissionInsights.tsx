import Header from '../components/Header'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSpaceData } from '../hooks/useSpaceData'
import { useInsight } from '../hooks/useInsight'

// ---------------------------------------------------------------------------
// Tiny inline SVG icon (no external lib)
// ---------------------------------------------------------------------------
const Icon = ({ d, className = '' }: { d: string; className?: string }) => (
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
    className={className}
  >
    <path d={d} />
  </svg>
)

const ICON_PATHS = {
  asteroid:
    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  mission:
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-2 10H8m4-3H8m8 6H8',
  mars: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10M12 12l4.5-4.5',
  calendar:
    'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  star: 'M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  sparkle: 'M12 3v1m0 16v1M3 12h1m16 0h1m-3.2-6.8-.7.7M4.9 17.1l-.7.7m0-11.4.7.7m11.4 11.4.7.7',
}

// ---------------------------------------------------------------------------
// Coming-soon placeholder card
// ---------------------------------------------------------------------------
const ComingSoonBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-space-purple-900/50 text-space-purple-400 border border-space-purple-700/40">
    <Icon d={ICON_PATHS.star} className="w-3 h-3" />
    Coming Soon
  </span>
)

interface ComingSoonCardProps {
  title: string
  iconPath: string
  description: string
}

const ComingSoonCard = ({ title, iconPath, description }: ComingSoonCardProps) => (
  <Card title={title} icon={<Icon d={iconPath} />}>
    <p className="text-xs text-slate-400 leading-relaxed mb-3">{description}</p>
    <ComingSoonBadge />
  </Card>
)

// ---------------------------------------------------------------------------
// AI Asteroid Risk Briefing card
// ---------------------------------------------------------------------------
interface AsteroidBriefingCardProps {
  asteroidsLoaded: boolean
  asteroidCount: number
  status: 'idle' | 'loading' | 'done' | 'error'
  content: string | null
  error: string | null
  generatedAt: string | null
  onGenerate: () => void
}

function AsteroidBriefingCard({
  asteroidsLoaded,
  asteroidCount,
  status,
  content,
  error,
  generatedAt,
  onGenerate,
}: AsteroidBriefingCardProps) {
  const formattedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <Card
      title="AI Asteroid Risk Briefing"
      icon={<Icon d={ICON_PATHS.asteroid} />}
    >
      {/* Data source badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 border border-amber-700/30">
          Source: NASA NeoWs (live)
        </span>
        {asteroidsLoaded && (
          <span className="text-xs text-slate-500">
            {asteroidCount} objects in 7-day window
          </span>
        )}
      </div>

      {/* States */}
      {status === 'idle' && (
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Generate an AI-powered risk briefing based on the currently tracked near-Earth objects.
          The model analyses the live NeoWs data and produces a factual, proportionate summary.
        </p>
      )}

      {status === 'loading' && (
        <div className="flex items-center gap-3 py-4 mb-2">
          <LoadingSpinner size="sm" />
          <span className="text-xs text-slate-400">Generating briefing from live asteroid data…</span>
        </div>
      )}

      {status === 'done' && content && (
        <div className="mb-3">
          <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
          {formattedTime && (
            <p className="text-xs text-slate-500 mt-2">
              Generated at {formattedTime} · Model: Llama 3.1 8B · Data: NASA NeoWs
            </p>
          )}
        </div>
      )}

      {status === 'error' && error && (
        <div className="rounded-lg border border-red-800/40 bg-red-900/20 px-4 py-3 mb-3">
          <p className="text-xs font-semibold text-red-400 mb-0.5">Briefing unavailable</p>
          <p className="text-xs text-red-300/80">{error}</p>
          <p className="text-xs text-slate-500 mt-1">
            Ensure the insight proxy is running: <code className="text-slate-400">npm run proxy</code>
          </p>
        </div>
      )}

      {/* Generate / Refresh button */}
      <button
        onClick={onGenerate}
        disabled={!asteroidsLoaded || status === 'loading'}
        className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
          border border-space-blue-700/50 text-space-blue-300
          bg-space-blue-900/30 hover:bg-space-blue-900/60
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
        "
      >
        <Icon d={ICON_PATHS.refresh} className="w-3.5 h-3.5" />
        {status === 'loading'
          ? 'Generating…'
          : status === 'done'
          ? 'Refresh Briefing'
          : 'Generate Briefing'}
      </button>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MissionInsights() {
  const { asteroids, isLoading } = useSpaceData()
  const insight = useInsight(asteroids)

  const asteroidsLoaded = !isLoading && asteroids.length > 0

  return (
    <div>
      <Header
        title="Mission Insights"
        subtitle="AI-generated explanations and summaries of space mission data"
      />

      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-space-purple-700/40 bg-space-purple-900/20 px-5 py-4 flex items-start gap-3">
        <span className="text-space-purple-400 mt-0.5 flex-shrink-0">
          <Icon d={ICON_PATHS.sparkle} />
        </span>
        <div>
          <p className="text-sm font-semibold text-space-purple-300">AI Integration — Phase 4</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            The Asteroid Risk Briefing uses live NASA NeoWs data and a Llama 3.1 8B language model
            to generate a factual, proportionate summary. The AI is instructed to use only supplied
            data and to distinguish PHA classification from actual impact risk. Additional insight
            modules are planned.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Live AI card ── */}
        <AsteroidBriefingCard
          asteroidsLoaded={asteroidsLoaded}
          asteroidCount={asteroids.length}
          status={insight.status}
          content={insight.content}
          error={insight.error}
          generatedAt={insight.generatedAt}
          onGenerate={insight.generate}
        />

        {/* ── Coming Soon cards ── */}
        <ComingSoonCard
          title="Latest Mission Summary"
          iconPath={ICON_PATHS.mission}
          description="An AI-generated narrative overview of the most recent mission milestones — Perseverance sample collection, Europa Clipper trajectory corrections, and Artemis III preparation status."
        />
        <ComingSoonCard
          title="Mars Conditions Report"
          iconPath={ICON_PATHS.mars}
          description="Daily summary of Martian atmospheric and surface conditions derived from MEDA sensor data, including dust storm probability, UV index, and projected traverse conditions for the rover."
        />
        <ComingSoonCard
          title="Upcoming Events"
          iconPath={ICON_PATHS.calendar}
          description="An AI-curated calendar of significant upcoming space events — asteroid close approaches, planned rocket launches, orbital insertions, and planetary conjunctions — for the next 30 days."
        />
      </div>
    </div>
  )
}
