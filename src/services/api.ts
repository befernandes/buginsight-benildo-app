
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

export interface CreateBugRequest {
  title: string
  description: string
  stackTrace?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export async function getBugs(): Promise<Bug[]> {
  const response = await fetch(`${API_URL}/api/bugs`)

  if (!response.ok) {
    throw new Error(`Error fetching bugs: ${response.status}`)
  }

  return response.json()
}

export async function createBug(data: CreateBugRequest): Promise<Bug> {
  const response = await fetch(`${API_URL}/api/bugs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || `Error creating bug: ${response.status}`)
  }

  return response.json()
}
