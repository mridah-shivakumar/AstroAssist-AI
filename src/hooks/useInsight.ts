import { useState, useCallback, useRef } from 'react'
import { AsteroidObject } from '../types'
import { buildAsteroidPrompt, generateInsight } from '../services/nasaApi'

export type InsightStatus = 'idle' | 'loading' | 'done' | 'error'

export interface InsightState {
  status: InsightStatus
  content: string | null
  error: string | null
  generatedAt: string | null
  /** Trigger a (re)generation. No-op while loading. */
  generate: () => void
}

/**
 * Manages AI-generated asteroid risk briefing state.
 *
 * - Does NOT auto-trigger on mount — the user must call generate() explicitly.
 * - Ignores duplicate calls while a request is in-flight.
 * - Safe under React StrictMode: uses an in-flight ref to deduplicate the
 *   double-invocation in development.
 */
export function useInsight(asteroids: AsteroidObject[]): InsightState {
  const [status, setStatus] = useState<InsightStatus>('idle')
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  // Prevents duplicate in-flight requests (StrictMode double-invoke guard)
  const inFlight = useRef(false)

  const generate = useCallback(() => {
    if (inFlight.current) return

    inFlight.current = true
    setStatus('loading')
    setError(null)

    const prompt = buildAsteroidPrompt(asteroids)

    generateInsight(prompt)
      .then((text) => {
        setContent(text)
        setGeneratedAt(new Date().toISOString())
        setStatus('done')
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        setStatus('error')
      })
      .finally(() => {
        inFlight.current = false
      })
  }, [asteroids])

  return { status, content, error, generatedAt, generate }
}
