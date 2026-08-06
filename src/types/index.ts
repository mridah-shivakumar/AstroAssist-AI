// Core domain types for AstroAssist AI
// These interfaces define the data contracts for future NASA API integration.

export interface Mission {
  id: string
  name: string
  status: 'active' | 'planned' | 'completed' | 'standby'
  launchDate: string
  target: string
  description: string
}

export interface AsteroidObject {
  id: string
  name: string
  diameter: { min: number; max: number }    // kilometres
  closeApproachDate: string
  missDistance: number                       // astronomical units (AU)
  relativeVelocity: number                   // km/s
  isPotentiallyHazardous: boolean
  orbitClass: 'Apollo' | 'Aten' | 'Amor' | 'Atira'
}

export interface RoverStatus {
  name: string
  sol: number
  earthDate: string
  location: string
  status: 'online' | 'standby' | 'offline'
  totalPhotos: number
  lastActivity: string
}

export interface InsightSummary {
  id: string
  category: 'mission' | 'asteroid' | 'mars' | 'events'
  title: string
  generatedAt: string                        // ISO 8601 timestamp
  content: string
  confidence: number                         // 0–1
  sources: string[]
}
