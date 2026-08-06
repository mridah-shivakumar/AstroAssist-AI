// NASA API service stubs
// TODO: Implement real API calls using the NASA Open APIs (https://api.nasa.gov)
// Required environment variable: VITE_NASA_API_KEY

import { AsteroidObject, Mission, RoverStatus } from '../types'

/**
 * Fetch near-Earth asteroid close approach data from NASA NeoWs API.
 * @param startDate YYYY-MM-DD
 * @param endDate   YYYY-MM-DD (max 7-day window)
 */
export async function fetchAsteroids(
  _startDate: string,
  _endDate: string
): Promise<AsteroidObject[]> {
  // TODO: GET https://api.nasa.gov/neo/rest/v1/feed?start_date=...&end_date=...&api_key=...
  return Promise.resolve([])
}

/**
 * Fetch Mars rover photos from the NASA Mars Rover Photos API.
 * @param sol Martian sol number
 */
export async function fetchMarsPhotos(_sol: number): Promise<string[]> {
  // TODO: GET https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=...
  return Promise.resolve([])
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
 * Fetch Perseverance rover latest manifest and status.
 */
export async function fetchRoverStatus(): Promise<RoverStatus | null> {
  // TODO: GET https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance
  return Promise.resolve(null)
}
