import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import { useSpaceData } from '../hooks/useSpaceData'
import { fetchMarsPhotos } from '../services/nasaApi'
import type { NasaImageItem } from '../types'

const Icon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

// Instrument list is static mission knowledge — not in the manifest API
const instruments = [
  { name: 'MEDA Weather Station',          value: 'Nominal',  color: 'text-green-400' },
  { name: 'SuperCam Rock Analysis',         value: 'Active',   color: 'text-space-blue-400' },
  { name: 'PIXL X-Ray Spectrometer',        value: 'Standby',  color: 'text-slate-400' },
  { name: 'RIMFAX Ground Penetrating Radar',value: 'Active',   color: 'text-space-blue-400' },
  { name: 'Ingenuity Helicopter',           value: 'Grounded', color: 'text-amber-400' },
]

export default function MarsExplorer() {
  const { isLoading: globalLoading } = useSpaceData()

  // Photo browser state (NASA Image Library — search/page based)
  const [query, setQuery] = useState<string>('perseverance mars')
  const [queryInput, setQueryInput] = useState<string>('perseverance mars')
  const [page, setPage] = useState<number>(1)
  const [photos, setPhotos] = useState<NasaImageItem[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photosError, setPhotosError] = useState<string | null>(null)

  // Fetch photos whenever query or page changes
  useEffect(() => {
    setPhotosLoading(true)
    setPhotosError(null)
    setPhotos([])

    fetchMarsPhotos(page, query)
      .then((items) => {
        setPhotos(items)
      })
      .catch((err: unknown) => {
        setPhotosError(err instanceof Error ? err.message : 'Failed to fetch photos')
      })
      .finally(() => setPhotosLoading(false))
  }, [query, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = queryInput.trim()
    if (trimmed) {
      setPage(1)
      setQuery(trimmed)
    }
  }

  // globalLoading gates asteroids; roverStatus can remain null (API is dead)
  if (globalLoading) {
    return (
      <div>
        <Header
          title="Mars Explorer"
          subtitle="Surface data, rover imagery, and mission context"
        />
        <div className="flex items-center justify-center py-24 text-slate-400">
          <svg className="animate-spin mr-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-sm">Loading Mars Explorer…</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Mars Explorer"
        subtitle="Surface data, rover imagery, and mission context"
      />

      {/* Status cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card title="Rover Status" icon={<Icon d="M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 6h5l3 5v4h-8V6zM3 6h5l3 5v4H3V6z" />}>
          <span className="block text-xl font-bold text-green-400 mb-1">Active</span>
          <span className="text-xs text-slate-500">
            Perseverance · Jezero Crater · Operational since Feb 2021
          </span>
        </Card>

        <Card title="Surface Temperature" icon={<Icon d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />}>
          <span className="block text-xl font-bold text-orange-400 mb-1">~−23°C</span>
          <span className="text-xs text-slate-500">Typical daytime high · Low approx −83°C · Static reference value</span>
        </Card>

        <Card title="Mission Sol" icon={<Icon d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />}>
          <span className="block text-xl font-bold text-amber-400 mb-1">
            Sol 1500+
          </span>
          <span className="text-xs text-slate-500">
            Perseverance · Live sol count unavailable (manifest API retired)
          </span>
        </Card>

        <Card title="Atmospheric Pressure" icon={<Icon d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />}>
          <span className="block text-xl font-bold text-space-blue-400 mb-1">~7.1 hPa</span>
          <span className="text-xs text-slate-500">Typical surface pressure · CO₂ ~95.3% · Static reference value</span>
        </Card>
      </div>

      {/* Instrument readings + sample progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card title="Instrument Readings" icon={<Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />}>
          <ul className="space-y-3">
            {instruments.map((inst) => (
              <li key={inst.name} className="flex items-center justify-between">
                <span className="text-slate-300 text-xs">{inst.name}</span>
                <span className={`text-xs font-medium ${inst.color}`}>{inst.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Sample Collection Progress" icon={<Icon d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />}>
          <p className="text-xs text-slate-500 mb-3">Static reference values — live manifest API is unavailable</p>
          <div className="space-y-4">
            {[
              { label: 'Core Samples Collected', current: 23, target: 38, color: 'bg-space-blue-600' },
              { label: 'Spectroscopy Targets', current: 187, target: 200, color: 'bg-space-purple-600' },
              { label: 'Panoramic Images', current: 4120, target: 5000, color: 'bg-amber-600' },
            ].map((item) => {
              const pct = Math.round((item.current / item.target) * 100)
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-300">{item.current.toLocaleString()} / {item.target.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-space-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Photo browser */}
      <Card
        title="Rover Photo Browser"
        icon={<Icon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />}
      >
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search NASA image library…"
            className="flex-1 bg-space-surface border border-space-border rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-space-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-space-blue-600 hover:bg-space-blue-500 text-xs text-white transition-colors"
          >
            Search
          </button>
        </form>

        {/* Photo grid / states */}
        {photosLoading && (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <svg className="animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-xs">Searching NASA image library…</span>
          </div>
        )}

        {!photosLoading && photosError && (
          <div className="rounded border border-red-800 bg-red-900/20 p-4 text-center">
            <p className="text-xs font-medium text-red-400">Photo fetch failed</p>
            <p className="text-xs text-slate-500 mt-1">{photosError}</p>
          </div>
        )}

        {!photosLoading && !photosError && photos.length === 0 && (
          <div className="py-10 text-center text-slate-500 text-xs">
            No images found for "{query}". Try a different search term.
          </div>
        )}

        {!photosLoading && !photosError && photos.length > 0 && (
          <>
            <p className="text-xs text-slate-500 mb-3">
              {photos.length} image{photos.length !== 1 ? 's' : ''} · page {page} · NASA Image Library
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {photos.map((item) => (
                <a key={item.nasaId} href={item.detailHref} target="_blank" rel="noopener noreferrer" title={item.title}>
                  <img
                    src={item.thumbUrl}
                    alt={item.title}
                    className="w-full aspect-square object-cover rounded border border-space-border hover:border-space-blue-500 transition-colors bg-space-surface"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      img.style.display = 'none'
                      const placeholder = img.nextElementSibling as HTMLElement | null
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                  />
                  <div
                    className="w-full aspect-square rounded border border-space-border bg-space-surface items-center justify-center text-slate-600 text-xs"
                    style={{ display: 'none' }}
                    aria-label={item.title}
                  >
                    <span className="px-2 text-center">{item.title || 'Image unavailable'}</span>
                  </div>
                </a>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-space-surface border border-space-border text-xs text-slate-300 disabled:opacity-40 hover:border-space-blue-500 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs text-slate-500">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={photos.length < 24}
                className="px-3 py-1 rounded bg-space-surface border border-space-border text-xs text-slate-300 disabled:opacity-40 hover:border-space-blue-500 transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
