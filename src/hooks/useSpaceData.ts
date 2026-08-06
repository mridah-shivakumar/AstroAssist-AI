// TODO: Replace stub return values with real NASA API calls once the service
// layer (src/services/nasaApi.ts) is implemented.

import { AsteroidObject, Mission, RoverStatus } from '../types'

interface SpaceData {
  missions: Mission[]
  asteroids: AsteroidObject[]
  roverStatus: RoverStatus | null
  isLoading: boolean
  error: string | null
}

export function useSpaceData(): SpaceData {
  return {
    missions: [],
    asteroids: [],
    roverStatus: null,
    isLoading: false,
    error: null,
  }
}
