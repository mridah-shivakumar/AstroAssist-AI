import { useCallback } from 'react'
import { AsteroidObject } from '../types'
import { buildAsteroidPrompt } from '../services/nasaApi'
import { useInsightModule } from './useInsightModule'

export type { InsightStatus, InsightModuleState as InsightState } from './useInsightModule'

/**
 * Asteroid-specific insight hook — wraps the generic useInsightModule with
 * the asteroid prompt builder. Preserved for backward compatibility with
 * MissionInsights and any other consumers.
 */
export function useInsight(asteroids: AsteroidObject[]) {
  const buildPrompt = useCallback(
    () => buildAsteroidPrompt(asteroids),
    [asteroids]
  )
  return useInsightModule(buildPrompt)
}
