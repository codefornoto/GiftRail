import { GAS_URL } from '../config'
import type { Marker } from '../types/marker'

interface MarkerResponse {
  status: string
  data: Marker[]
}

export async function fetchMarkers(id?: string) {
  try {
    const response = await fetch(`${GAS_URL}?sheetName=${id}`, {
      method: 'GET',
    })
    const data: MarkerResponse = await response.json()

    if (data.status === 'success') {
      console.log(data)
      return data.data
    }
    throw new Error('Failed to fetch markers')
  } catch (error) {
    console.error('Error fetching markers:', error)
    return []
  }
}
