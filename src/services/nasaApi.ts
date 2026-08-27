// NASA API service
// Required environment variable: VITE_NASA_API_KEY

import { AsteroidObject, Mission, RoverStatus, NasaImageItem } from '../types'

// --- NASA Image and Video Library raw response types ---

interface NasaImageLinks {
  href: string
  rel: string
  render?: string
}

interface NasaImageMetadata {
  nasa_id: string
  title: string
  description?: string
  date_created?: string
  center?: string
  keywords?: string[]
}

interface NasaImageLibraryItem {
  data: NasaImageMetadata[]
  links?: NasaImageLinks[]
  href: string
}

interface NasaImageLibraryCollection {
  version: string
  href: string
  items: NasaImageLibraryItem[]
  metadata: { total_hits: number }
}

interface NasaImageLibraryResponse {
  collection: NasaImageLibraryCollection
}

// --- NeoWs raw response types ---

interface NeoWsCloseApproach {
  close_approach_date: string
  relative_velocity: { kilometers_per_second: string }
  miss_distance: { kilometers: string }
}

interface NeoWsEntry {
  id: string
  name: string
  nasa_jpl_url: string
  absolute_magnitude_h: number
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: NeoWsCloseApproach[]
  orbital_data?: {
    orbit_class: {
      orbit_class_type: string
    }
  }
}

interface NeoWsFeedResponse {
  near_earth_objects: Record<string, NeoWsEntry[]>
}

/**
 * Maps a NASA NeoWs orbit_class_type code to the AsteroidObject union.
 * Note: the /feed endpoint does not include orbital_data; only the individual
 * /neo/{id} lookup does. When the code is absent, 'Unknown' is returned rather
 * than silently defaulting to 'Apollo'.
 */
function mapOrbitClass(
  code: string
): AsteroidObject['orbitClass'] {
  switch (code.toUpperCase()) {
    case 'APO': return 'Apollo'
    case 'ATE': return 'Aten'
    case 'AMO': return 'Amor'
    case 'IEO': return 'Atira'
    default:    return 'Unknown'
  }
}

/**
 * Fetch near-Earth asteroid close approach data from NASA NeoWs API.
 * @param startDate YYYY-MM-DD
 * @param endDate   YYYY-MM-DD (max 7-day window)
 */
export async function fetchAsteroids(
  startDate: string,
  endDate: string
): Promise<AsteroidObject[]> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY as string

  // --- DIAGNOSTIC (temporary) ---
  console.group('[fetchAsteroids] diagnostics')
  console.log('startDate arg:', startDate)
  console.log('endDate arg:', endDate)
  console.log('API key type:', typeof apiKey)
  console.log('API key length:', apiKey ? apiKey.length : 'undefined/null')
  console.log('API key truthy:', !!apiKey)
  // Print URL with key masked — safe to log
  const maskedUrl =
    `https://api.nasa.gov/neo/rest/v1/feed` +
    `?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey ? '***MASKED***' : '(empty)'}`
  console.log('Request URL (masked):', maskedUrl)
  console.groupEnd()
  // --- END DIAGNOSTIC ---

  const url =
    `https://api.nasa.gov/neo/rest/v1/feed` +
    `?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`

  const response = await fetch(url)
  if (!response.ok) {
    // --- DIAGNOSTIC (temporary) ---
    let body = '(could not read body)'
    try { body = await response.clone().text() } catch { /* ignore */ }
    console.group('[fetchAsteroids] non-OK response')
    console.log('HTTP status:', response.status)
    console.log('HTTP statusText:', response.statusText)
    console.log('Response URL:', response.url.replace(/api_key=[^&]+/, 'api_key=***MASKED***'))
    console.log('Response body (first 500 chars):', body.slice(0, 500))
    console.groupEnd()
    // --- END DIAGNOSTIC ---
    throw new Error(
      `NeoWs API request failed: ${response.status} ${response.statusText}`
    )
  }

  const data: NeoWsFeedResponse = await response.json()

  const asteroids: AsteroidObject[] = Object.values(data.near_earth_objects)
    .flat()
    .map((neo) => {
      const approach = neo.close_approach_data[0]
      return {
        id: neo.id,
        name: neo.name,
        diameter: {
          min: neo.estimated_diameter.kilometers.estimated_diameter_min,
          max: neo.estimated_diameter.kilometers.estimated_diameter_max,
        },
        closeApproachDate: approach?.close_approach_date ?? '',
        missDistance: approach
          ? parseFloat(approach.miss_distance.kilometers)
          : 0,
        relativeVelocity: approach
          ? parseFloat(approach.relative_velocity.kilometers_per_second)
          : 0,
        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
        orbitClass: mapOrbitClass(
          neo.orbital_data?.orbit_class?.orbit_class_type ?? ''
        ),
      }
    })

  return asteroids
}

/**
 * Fetch Mars / Perseverance images from the NASA Image and Video Library.
 * Does NOT require an API key.
 * GET https://images-api.nasa.gov/search?q=...&media_type=image&page_size=24&page=N
 *
 * @param page     1-based page number (default 1)
 * @param query    Search string (default "perseverance mars")
 * @returns Array of NasaImageItem with thumbnail URL, title, and detail href
 */
export async function fetchMarsPhotos(
  page = 1,
  query = 'perseverance mars'
): Promise<NasaImageItem[]> {
  const encoded = encodeURIComponent(query)
  const url =
    `https://images-api.nasa.gov/search` +
    `?q=${encoded}&media_type=image&page_size=24&page=${page}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `NASA Image Library request failed: ${response.status} ${response.statusText}`
    )
  }

  const data: NasaImageLibraryResponse = await response.json()
  const items = data.collection?.items ?? []

  return items
    .filter((item) => item.links && item.links.length > 0)
    .map((item): NasaImageItem => {
      const meta = item.data[0] ?? {}
      // The first link with rel="preview" is the thumbnail JPEG
      const thumbLink = item.links!.find((l) => l.rel === 'preview') ?? item.links![0]
      return {
        nasaId: meta.nasa_id ?? '',
        title: meta.title ?? '',
        description: meta.description ?? '',
        dateCreated: meta.date_created ?? '',
        thumbUrl: thumbLink.href,
        detailHref: item.href,
      }
    })
}

// ---------------------------------------------------------------------------
// Mission catalogue
// ---------------------------------------------------------------------------
//
// NASA does not publish a single public REST endpoint that maps cleanly to the
// Mission interface (id / name / status / launchDate / target / description).
// HORIZONS provides ephemeris only; TechPort covers R&D grants; the Launch
// Library is a third-party service.
//
// Approach: curated catalogue of real, publicly-known NASA missions combined
// with a live NASA Image and Video Library thumbnail fetch for each entry.
// The structured fields (name, status, launchDate, target, description) come
// from verified public mission fact-sheets and are labelled as such in the UI.
// The thumbnail is the only field that is fetched live from NASA's API.
//
// Source for mission facts: NASA.gov mission pages (public domain).

interface MissionSeed {
  id: string
  name: string
  status: Mission['status']
  launchDate: string
  target: string
  description: string
  /** Query sent to the NASA Image Library to retrieve a representative image */
  imageQuery: string
}

const MISSION_SEEDS: MissionSeed[] = [
  {
    id: 'perseverance',
    name: 'Mars 2020 Perseverance',
    status: 'active',
    launchDate: '2020-07-30',
    target: 'Mars / Jezero Crater',
    description:
      'Perseverance searches for signs of ancient microbial life, characterises Martian geology and climate, and caches samples for future return to Earth. It also deployed the Ingenuity helicopter.',
    imageQuery: 'perseverance rover mars 2020',
  },
  {
    id: 'europa-clipper',
    name: 'Europa Clipper',
    status: 'active',
    launchDate: '2024-10-14',
    target: "Jupiter's moon Europa",
    description:
      'Europa Clipper will conduct ~50 close flybys of Europa to investigate whether the icy moon could harbour conditions suitable for life, characterising its subsurface ocean, ice shell, and surface.',
    imageQuery: 'europa clipper spacecraft jupiter',
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    status: 'active',
    launchDate: '2021-12-25',
    target: 'Sun-Earth L2 Halo Orbit',
    description:
      'JWST is the premier space-science observatory of the next decade. It observes in infrared from the Big Bang\'s first galaxies to exoplanet atmospheres, operating at L2 roughly 1.5 million km from Earth.',
    imageQuery: 'james webb space telescope JWST',
  },
  {
    id: 'osiris-apex',
    name: 'OSIRIS-APEX',
    status: 'active',
    launchDate: '2016-09-08',
    target: 'Asteroid Apophis',
    description:
      'Formerly OSIRIS-REx, this spacecraft delivered the first asteroid sample from Bennu to Earth in 2023. It was then redirected to rendezvous with asteroid Apophis during its rare 2029 close Earth approach.',
    imageQuery: 'OSIRIS-REx asteroid Bennu sample',
  },
  {
    id: 'artemis',
    name: 'Artemis Programme',
    status: 'planned',
    launchDate: '2026-04-01',
    target: 'Lunar South Pole',
    description:
      'NASA\'s Artemis programme aims to return humans to the Moon, land the first woman and first person of colour near the lunar South Pole, and establish a long-term presence as a stepping-stone to Mars.',
    imageQuery: 'Artemis SLS moon lunar',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    status: 'active',
    launchDate: '1977-09-05',
    target: 'Interstellar Space',
    description:
      'Launched in 1977, Voyager 1 is humanity\'s most distant spacecraft, now travelling through interstellar space more than 23 billion km from Earth. It continues to return plasma-wave and particle data.',
    imageQuery: 'Voyager 1 spacecraft interstellar',
  },
  {
    id: 'mars-sample-return',
    name: 'Mars Sample Return',
    status: 'planned',
    launchDate: '2030-01-01',
    target: 'Mars (sample retrieval)',
    description:
      'A joint NASA-ESA campaign to retrieve the samples cached by Perseverance and return them to Earth for detailed laboratory analysis. The Earth Return Orbiter is being built by ESA; the Sample Retrieval Lander by NASA.',
    imageQuery: 'mars sample return mission NASA ESA',
  },
  {
    id: 'new-horizons',
    name: 'New Horizons',
    status: 'active',
    launchDate: '2006-01-19',
    target: 'Kuiper Belt',
    description:
      'New Horizons performed the first close flyby of Pluto in 2015, revealing mountains, plains and a tenuous atmosphere. It then flew past Kuiper Belt Object Arrokoth in 2019 and continues exploring the outer solar system.',
    imageQuery: 'New Horizons Pluto Kuiper Belt',
  },
]

/**
 * Returns curated NASA mission data, enriched with a live thumbnail from the
 * NASA Image and Video Library API.
 *
 * The structured fields (name, status, launchDate, target, description) are
 * sourced from NASA public mission fact-sheets and are static/curated — not
 * fetched live — because no single NASA REST endpoint exposes them in this
 * format. The thumbnail URL is the only value fetched live per call.
 *
 * If the image fetch for a mission fails the mission is still returned with an
 * empty thumbUrl, so a single network failure never drops the whole list.
 */
export async function fetchMissions(): Promise<Mission[]> {
  const results = await Promise.allSettled(
    MISSION_SEEDS.map(async (seed): Promise<Mission & { thumbUrl: string }> => {
      const encoded = encodeURIComponent(seed.imageQuery)
      const url = `https://images-api.nasa.gov/search?q=${encoded}&media_type=image&page_size=1`
      let thumbUrl = ''
      try {
        const res = await fetch(url)
        if (res.ok) {
          const data: NasaImageLibraryResponse = await res.json()
          const first = data.collection?.items?.[0]
          const link = first?.links?.find((l) => l.rel === 'preview') ?? first?.links?.[0]
          if (link) thumbUrl = link.href
        }
      } catch {
        // Non-fatal: mission still returned without a thumbnail
      }
      return { ...seed, thumbUrl }
    })
  )

  return results.flatMap((r) =>
    r.status === 'fulfilled' ? [r.value] : []
  )
}

/**
 * Fetch Perseverance rover status.
 * NOTE: The old Mars Rover Photos manifest endpoint
 *   https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance
 * is no longer available (HTTP 404). This function returns null gracefully
 * so that the rest of the Mars Explorer page continues to work.
 */
export async function fetchRoverStatus(): Promise<RoverStatus | null> {
  return null
}

// ---------------------------------------------------------------------------
// AI Insight — Asteroid Risk Briefing
// ---------------------------------------------------------------------------
// The browser calls /api/insight (Vite dev proxy → server/proxy.cjs).
// The proxy holds HF_TOKEN server-side; it never reaches the browser bundle.
// ---------------------------------------------------------------------------

/**
 * Deterministically builds the user-facing prompt from live asteroid data.
 * The model is explicitly instructed to use only this supplied data.
 */
export function buildAsteroidPrompt(asteroids: AsteroidObject[]): string {
  if (asteroids.length === 0) {
    return 'No near-Earth object data is available for this window. Report that the data could not be loaded.'
  }

  const total = asteroids.length
  const hazardous = asteroids.filter((a) => a.isPotentiallyHazardous)

  // Sort by miss distance ascending (closest first)
  const sorted = [...asteroids].sort((a, b) => a.missDistance - b.missDistance)
  const closest = sorted[0]

  const fmt = (n: number, decimals = 2): string =>
    n.toLocaleString('en-US', { maximumFractionDigits: decimals })

  const closestBlock = `Closest approach this window:
- Name: ${closest.name}
- Date: ${closest.closeApproachDate}
- Miss distance: ${fmt(closest.missDistance, 0)} km (${fmt(closest.missDistance / 384_400, 2)} lunar distances)
- Estimated diameter: ${fmt(closest.diameter.min, 3)}–${fmt(closest.diameter.max, 3)} km
- Relative velocity: ${fmt(closest.relativeVelocity, 2)} km/s
- Potentially Hazardous: ${closest.isPotentiallyHazardous ? 'Yes' : 'No'}`

  const hazardBlock =
    hazardous.length === 0
      ? 'No Potentially Hazardous Asteroids (PHAs) in this window.'
      : `Potentially Hazardous Asteroids (PHAs) in this window (${hazardous.length} total):\n` +
        hazardous
          .slice(0, 5) // cap to 5 to keep prompt concise
          .map(
            (a, i) =>
              `${i + 1}. ${a.name} — Miss: ${fmt(a.missDistance, 0)} km — ` +
              `Diameter: ${fmt(a.diameter.min, 3)}–${fmt(a.diameter.max, 3)} km — ` +
              `Velocity: ${fmt(a.relativeVelocity, 2)} km/s — Date: ${a.closeApproachDate}`
          )
          .join('\n')

  return `Asteroid close-approach data for the current 7-day window (source: NASA NeoWs):

Total near-Earth objects tracked: ${total}
Potentially Hazardous Asteroids (PHAs): ${hazardous.length}

${closestBlock}

${hazardBlock}

Write a 3–4 sentence natural-language risk briefing for a space operations team. Be factual and proportionate. Do not exceed 130 words. Use only the data above — do not add information not present here.`
}

/**
 * Sends the prompt to the server-side proxy (/api/insight) and returns the
 * AI-generated briefing text. The proxy forwards to Hugging Face; the browser
 * never touches HF_TOKEN.
 */
export async function generateInsight(prompt: string): Promise<string> {
  const res = await fetch('/api/insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    let message = `Insight proxy returned ${res.status}`
    try {
      const body = await res.json() as { error?: string }
      if (body.error) message = body.error
    } catch { /* ignore parse errors */ }
    throw new Error(message)
  }

  const data = await res.json() as { content?: string }
  if (!data.content) throw new Error('Empty response from insight service.')
  return data.content
}
