import { useState, useCallback, useRef } from 'react'
import { generateInsight } from '../services/nasaApi'

export type InsightStatus = 'idle' | 'loading' | 'done' | 'error'

export interface InsightModuleState {
  status: InsightStatus
  content: string | null
  error: string | null
  generatedAt: string | null
  /** Trigger a (re)generation. No-op while loading. */
  generate: () => void
}

/**
 * Generic AI insight module hook.
 *
 * Accepts a prompt builder function that returns the prompt string from the
 * current data snapshot. Each call to generate() re-evaluates the builder.
 *
 * - Does NOT auto-trigger on mount — caller must invoke generate() explicitly.
 * - Ignores duplicate calls while a request is in-flight.
 * - Failure is isolated: one module failing does not affect any other.
 * - Safe under React StrictMode: uses an in-flight ref to deduplicate the
 *   double-invocation in development.
 */
export function useInsightModule(
  buildPrompt: () => string
): InsightModuleState {
  const [status, setStatus] = useState<InsightStatus>('idle')
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  const inFlight = useRef(false)

  const generate = useCallback(() => {
    if (inFlight.current) return

    inFlight.current = true
    setStatus('loading')
    setError(null)

    const prompt = buildPrompt()

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
  }, [buildPrompt])

  return { status, content, error, generatedAt, generate }
}
