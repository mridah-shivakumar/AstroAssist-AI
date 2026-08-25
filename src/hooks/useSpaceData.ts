import { useState, useEffect } from 'react'
import { AsteroidObject, Mission, RoverStatus } from '../types'
import { fetchAsteroids, fetchRoverStatus } from '../services/nasaApi'

interface SpaceData {
  missions: Mission[]
  asteroids: AsteroidObject[]
  roverStatus: RoverStatus | null
  isLoading: boolean
  error: string | null
}

export function useSpaceData(): SpaceData {
  const [asteroids, setAsteroids] = useState<AsteroidObject[]>([])
  const [roverStatus, setRoverStatus] = useState<RoverStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const start = new Date()
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    setIsLoading(true)
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

    Promise.all([asteroidsRequest, roverRequest]).finally(() => {
      setIsLoading(false)
    })
  }, [])

  return {
    missions: [],
    asteroids,
    roverStatus,
    isLoading,
    error,
  }
}
