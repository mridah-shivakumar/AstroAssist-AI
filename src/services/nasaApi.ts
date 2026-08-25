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

/**
 * Fetch active and planned mission data.
 * Planned integration point: NASA HORIZONS or custom mission database.
 */
export async function fetchMissions(): Promise<Mission[]> {
  // TODO: Integrate with NASA HORIZONS System or a custom missions endpoint
  return Promise.resolve([])
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
