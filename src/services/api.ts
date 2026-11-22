const API_URL = 'http://localhost:8080'

export interface Bug {
  id: number
  title: string
  description: string
  stackTrace: string | null
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
  aiAnalysis: string | null
  createdAt: string | null
}

export async function getBugs(): Promise<Bug[]> {
  const response = await fetch(`${API_URL}/api/bugs`)

  if (!response.ok) {
    throw new Error(`Error fetching bugs: ${response.status}`)
  }

  return response.json()
}
