import { useState, useEffect } from 'react'
import { AsteroidObject, Mission, RoverStatus } from '../types'
import { fetchAsteroids, fetchMissions, fetchRoverStatus } from '../services/nasaApi'

interface SpaceData {
  missions: Mission[]
  asteroids: AsteroidObject[]
  roverStatus: RoverStatus | null
  missionsLoading: boolean
  isLoading: boolean
  error: string | null
}

export function useSpaceData(): SpaceData {
  const [asteroids, setAsteroids] = useState<AsteroidObject[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [roverStatus, setRoverStatus] = useState<RoverStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [missionsLoading, setMissionsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const start = new Date()
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    setIsLoading(true)
    setMissionsLoading(true)
    setError(null)

    const asteroidsRequest = fetchAsteroids(fmt(start), fmt(end))
      .then((data) => {
        setAsteroids(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch asteroid data')
      })

    const roverRequest = fetchRoverStatus()
      .then((data) => {
        setRoverStatus(data)
      })
      .catch((err: unknown) => {
        // Rover failure is non-fatal — asteroid pages stay functional
        console.warn(
          '[useSpaceData] fetchRoverStatus failed (rover data unavailable):',
          err instanceof Error ? err.message : err
        )
      })

    const missionsRequest = fetchMissions()
      .then((data) => {
        setMissions(data)
      })
      .catch((err: unknown) => {
        console.warn(
          '[useSpaceData] fetchMissions failed:',
          err instanceof Error ? err.message : err
        )
      })
      .finally(() => {
        setMissionsLoading(false)
      })

    // isLoading gates AsteroidMonitor and MarsExplorer — keep it scoped to
    // those two requests so the mission fetches (8 image-library calls) do not
    // delay the existing pages' loading spinners.
    Promise.all([asteroidsRequest, roverRequest]).finally(() => {
      setIsLoading(false)
    })

    // missionsRequest manages its own missionsLoading flag independently.
    void missionsRequest
  }, [])

  return {
    missions,
    asteroids,
    roverStatus,
    missionsLoading,
    isLoading,
    error,
  }
}
