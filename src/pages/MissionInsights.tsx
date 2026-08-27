import { useCallback, useState, useEffect } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSpaceData } from '../hooks/useSpaceData'
import { useInsightModule } from '../hooks/useInsightModule'
import type { InsightModuleState } from '../hooks/useInsightModule'
import {
  buildAsteroidPrompt,
  buildMissionPrompt,
  buildMarsPrompt,
  buildSpaceEventsPrompt,
  fetchMarsPhotos,
} from '../services/nasaApi'
import type { NasaImageItem } from '../types'

// ---------------------------------------------------------------------------
// Inline SVG icon helper
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

const ICONS = {
  asteroid:
    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  mission:
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M12 12H8m4 3H8',
  mars: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10M12 12l4.5-4.5',
  calendar:
    'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  refresh:
    'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  sparkle:
    'M12 3v1m0 16v1M3 12h1m16 0h1m-3.2-6.8-.7.7M4.9 17.1l-.7.7m0-11.4.7.7m11.4 11.4.7.7',
  warning: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
}

// ---------------------------------------------------------------------------
// Reusable source badge
// ---------------------------------------------------------------------------
function SourceBadge({
  label,
  live = false,
}: {
  label: string
  live?: boolean
}) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border ${
        live
          ? 'bg-amber-900/30 text-amber-400 border-amber-700/30'
          : 'bg-space-blue-900/30 text-space-blue-300 border-space-blue-700/30'
      }`}
    >
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Reusable insight module card
// ---------------------------------------------------------------------------
interface InsightCardProps {
  title: string
  iconPath: string
  sourceBadge: React.ReactNode
  dataNote?: string
  idleDescription: string
  loadingLabel: string
  insight: InsightModuleState
  generateLabel?: string
  canGenerate: boolean
}

function InsightCard({
  title,
  iconPath,
  sourceBadge,
  dataNote,
  idleDescription,
  loadingLabel,
  insight,
  generateLabel,
  canGenerate,
}: InsightCardProps) {
  const { status, content, error, generatedAt, generate } = insight

  const formattedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null

  const btnLabel =
    status === 'loading'
      ? 'Generating…'
      : status === 'done'
      ? `Refresh ${generateLabel ?? 'Report'}`
      : `Generate ${generateLabel ?? 'Report'}`

  return (
    <Card title={title} icon={<Icon d={iconPath} />}>
      {/* Source row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {sourceBadge}
        {dataNote && <span className="text-xs text-slate-500">{dataNote}</span>}
      </div>

      {/* Idle */}
      {status === 'idle' && (
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {idleDescription}
        </p>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="flex items-center gap-3 py-4 mb-2">
          <LoadingSpinner size="sm" />
          <span className="text-xs text-slate-400">{loadingLabel}</span>
        </div>
      )}

      {/* Done */}
      {status === 'done' && content && (
        <div className="mb-3">
          <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
          {formattedTime && (
            <p className="text-xs text-slate-500 mt-2">
              Generated at {formattedTime} · Model: Llama 3.1 8B Instruct ·
              via Hugging Face Inference Router
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {status === 'error' && error && (
        <div className="rounded-lg border border-red-800/40 bg-red-900/20 px-4 py-3 mb-3">
          <p className="text-xs font-semibold text-red-400 mb-0.5">
            Report unavailable
          </p>
          <p className="text-xs text-red-300/80">{error}</p>
          <p className="text-xs text-slate-500 mt-1">
            Ensure the insight proxy is running:{' '}
            <code className="text-slate-400">npm run proxy</code>
          </p>
        </div>
      )}

      {/* Generate / Refresh button */}
      <button
        onClick={generate}
        disabled={!canGenerate || status === 'loading'}
        className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
          border border-space-blue-700/50 text-space-blue-300
          bg-space-blue-900/30 hover:bg-space-blue-900/60
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
        "
      >
        <Icon d={ICONS.refresh} className="w-3.5 h-3.5" />
        {btnLabel}
      </button>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Upcoming events list (data-driven, shown alongside the AI summary)
// ---------------------------------------------------------------------------
function EventRow({
  name,
  date,
  distance,
  lunarDist,
  velocity,
  isPHA,
}: {
  name: string
  date: string
  distance: number
  lunarDist: number
  velocity: number
  isPHA: boolean
}) {
  const fmt = (n: number, d = 0) =>
    n.toLocaleString('en-US', { maximumFractionDigits: d })

  return (
    <li className="border border-space-border rounded-lg px-3 py-2 bg-space-surface/60">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-200">{name}</span>
        {isPHA && (
          <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/40">
            PHA
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
        <span className="text-xs text-slate-500">📅 {date}</span>
        <span className="text-xs text-slate-500">
          📍 {fmt(distance, 0)} km ({fmt(lunarDist, 2)} LD)
        </span>
        <span className="text-xs text-slate-500">⚡ {fmt(velocity, 2)} km/s</span>
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function MissionInsights() {
  const { asteroids, missions, isLoading, missionsLoading } = useSpaceData()

  // ── Mars images fetched independently for the Mars module ──
  const [marsImages, setMarsImages] = useState<NasaImageItem[]>([])
  const [marsImagesLoading, setMarsImagesLoading] = useState(true)

  useEffect(() => {
    fetchMarsPhotos(1, 'perseverance mars')
      .then((imgs) => setMarsImages(imgs))
      .catch(() => setMarsImages([]))
      .finally(() => setMarsImagesLoading(false))
  }, [])

  // ── Four independent insight modules ──
  const asteroidInsight = useInsightModule(
    useCallback(() => buildAsteroidPrompt(asteroids), [asteroids])
  )
  const missionInsight = useInsightModule(
    useCallback(() => buildMissionPrompt(missions), [missions])
  )
  const marsInsight = useInsightModule(
    useCallback(() => buildMarsPrompt(marsImages), [marsImages])
  )
  const eventsInsight = useInsightModule(
    useCallback(() => buildSpaceEventsPrompt(asteroids), [asteroids])
  )

  const asteroidsReady = !isLoading && asteroids.length > 0
  const missionsReady  = !missionsLoading && missions.length > 0
  const marsReady      = !marsImagesLoading
  const eventsReady    = !isLoading && asteroids.length > 0

  // Upcoming events data for display
  const upcomingEvents = [...asteroids]
    .sort((a, b) => {
      const dateDiff = a.closeApproachDate.localeCompare(b.closeApproachDate)
      if (dateDiff !== 0) return dateDiff
      return a.missDistance - b.missDistance
    })
    .slice(0, 6)

  return (
    <div>
      <Header
        title="Mission Insights"
        subtitle="AI-generated intelligence from live and curated space mission data"
      />

      {/* Banner */}
      <div className="mb-6 rounded-xl border border-space-purple-700/40 bg-space-purple-900/20 px-5 py-4 flex items-start gap-3">
        <span className="text-space-purple-400 mt-0.5 flex-shrink-0">
          <Icon d={ICONS.sparkle} />
        </span>
        <div>
          <p className="text-sm font-semibold text-space-purple-300">
            AI Intelligence Centre
          </p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Each module uses real data from NASA APIs or the curated mission
            catalogue and passes it to{' '}
            <span className="text-slate-300">Llama 3.1 8B Instruct</span> via
            a secure server-side proxy. The model is explicitly instructed to
            reason only over the supplied data and never fabricate facts.
            Modules are independent — a failure in one does not affect the
            others.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── 1. ASTEROID RISK BRIEFING ── */}
        <InsightCard
          title="Asteroid Risk Briefing"
          iconPath={ICONS.asteroid}
          sourceBadge={<SourceBadge label="Source: NASA NeoWs (live)" live />}
          dataNote={
            asteroidsReady
              ? `${asteroids.length} objects in 7-day window`
              : isLoading
              ? 'Loading asteroid data…'
              : 'No asteroid data'
          }
          idleDescription="Generate an AI-powered risk briefing based on the currently tracked near-Earth objects. The model analyses live NeoWs data and produces a factual, proportionate summary."
          loadingLabel="Generating briefing from live asteroid data…"
          generateLabel="Briefing"
          insight={asteroidInsight}
          canGenerate={asteroidsReady}
        />

        {/* ── 2. MISSION INTELLIGENCE SUMMARY ── */}
        <InsightCard
          title="Mission Intelligence Summary"
          iconPath={ICONS.mission}
          sourceBadge={
            <SourceBadge label="Source: AstroAssist curated catalogue + NASA Image Library" />
          }
          dataNote={
            missionsReady
              ? `${missions.length} missions in catalogue`
              : missionsLoading
              ? 'Loading mission data…'
              : 'No mission data'
          }
          idleDescription="Generate an operational summary of all missions in the catalogue — status distribution, notable targets, and key context. Data is from curated NASA mission fact-sheets."
          loadingLabel="Generating intelligence summary from mission catalogue…"
          generateLabel="Summary"
          insight={missionInsight}
          canGenerate={missionsReady}
        />

        {/* ── 3. MARS CONDITIONS REPORT ── */}
        <InsightCard
          title="Mars Conditions Report"
          iconPath={ICONS.mars}
          sourceBadge={
            <SourceBadge label="Source: NASA Image and Video Library (live)" live />
          }
          dataNote={
            marsReady
              ? `${marsImages.length} imagery records retrieved`
              : 'Loading imagery catalogue…'
          }
          idleDescription="Generate a Mars conditions report analysing NASA imagery catalogue metadata. Note: live rover telemetry is unavailable — this report is based on image titles, dates, and descriptions from the NASA Image Library."
          loadingLabel="Generating Mars report from imagery catalogue…"
          generateLabel="Report"
          insight={marsInsight}
          canGenerate={marsReady}
        />

        {/* ── 4. UPCOMING SPACE EVENTS ── */}
        <Card
          title="Upcoming Space Events"
          icon={<Icon d={ICONS.calendar} />}
        >
          {/* Source row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SourceBadge label="Source: NASA NeoWs (live)" live />
            {eventsReady && (
              <span className="text-xs text-slate-500">
                {asteroids.length} close-approach events in 7-day window
              </span>
            )}
          </div>

          {/* Events list */}
          {isLoading && (
            <div className="flex items-center gap-3 py-3 mb-2">
              <LoadingSpinner size="sm" />
              <span className="text-xs text-slate-400">
                Loading close-approach event data…
              </span>
            </div>
          )}

          {!isLoading && upcomingEvents.length > 0 && (
            <ul className="space-y-2 mb-4">
              {upcomingEvents.map((a) => (
                <EventRow
                  key={a.id}
                  name={a.name}
                  date={a.closeApproachDate}
                  distance={a.missDistance}
                  lunarDist={a.missDistance / 384_400}
                  velocity={a.relativeVelocity}
                  isPHA={a.isPotentiallyHazardous}
                />
              ))}
            </ul>
          )}

          {!isLoading && upcomingEvents.length === 0 && (
            <p className="text-xs text-slate-500 mb-4">
              No close-approach events available. Check Asteroid Monitor.
            </p>
          )}

          {/* AI summary */}
          {eventsInsight.status === 'idle' && (
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Generate an AI-prioritised briefing on the events listed above.
              The model will identify PHAs and explain their operational
              significance based solely on the NeoWs data.
            </p>
          )}

          {eventsInsight.status === 'loading' && (
            <div className="flex items-center gap-3 py-2 mb-2">
              <LoadingSpinner size="sm" />
              <span className="text-xs text-slate-400">
                Generating events briefing…
              </span>
            </div>
          )}

          {eventsInsight.status === 'done' && eventsInsight.content && (
            <div className="mb-3 p-3 rounded-lg bg-space-surface/60 border border-space-border">
              <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">
                AI Summary
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {eventsInsight.content}
              </p>
              {eventsInsight.generatedAt && (
                <p className="text-xs text-slate-500 mt-2">
                  Generated at{' '}
                  {new Date(eventsInsight.generatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}{' '}
                  · Model: Llama 3.1 8B Instruct
                </p>
              )}
            </div>
          )}

          {eventsInsight.status === 'error' && eventsInsight.error && (
            <div className="rounded-lg border border-red-800/40 bg-red-900/20 px-4 py-3 mb-3">
              <p className="text-xs font-semibold text-red-400 mb-0.5">
                AI briefing unavailable
              </p>
              <p className="text-xs text-red-300/80">{eventsInsight.error}</p>
              <p className="text-xs text-slate-500 mt-1">
                Ensure the proxy is running:{' '}
                <code className="text-slate-400">npm run proxy</code>
              </p>
            </div>
          )}

          <button
            onClick={eventsInsight.generate}
            disabled={!eventsReady || eventsInsight.status === 'loading'}
            className="
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-space-blue-700/50 text-space-blue-300
              bg-space-blue-900/30 hover:bg-space-blue-900/60
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150
            "
          >
            <Icon d={ICONS.refresh} className="w-3.5 h-3.5" />
            {eventsInsight.status === 'loading'
              ? 'Generating…'
              : eventsInsight.status === 'done'
              ? 'Refresh Events Briefing'
              : 'Generate Events Briefing'}
          </button>
        </Card>
      </div>
    </div>
  )
}
