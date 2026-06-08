import type {
  CtbEta,
  CtbRouteStop,
  CtbStop,
  KmbEta,
  KmbRouteStop,
  KmbStop,
} from '@/features/bus/types'
import apiConfig from '@/res/json/api_config.json'

interface ApiConfigEntry {
  co: string
  base_url: string
  api: {
    eta: string
    route_stop: string
    stop: string
  }
}

export const getEta = async (
  co: string,
  route: string,
  service: string,
  stop: string
): Promise<CtbEta[] | KmbEta[] | null> => {
  try {
    const api = (apiConfig.data as ApiConfigEntry[]).find(
      (item) => item.co.toLowerCase() === co.toLowerCase()
    )

    if (!api) {
      console.error('ERROR: Api not found.')
      return null
    }

    const url = `${api.base_url}${api.api.eta}${stop.toUpperCase()}/${route.toUpperCase()}/`
    const s = co.toLowerCase() === 'kmb' ? service : ''

    const response = await fetch(url + s)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    return result.data as CtbEta[] | KmbEta[]
  } catch (error) {
    console.error('ERROR: fetching stop data. Info:', error)
    return null
  }
}

export const getStopList = async (
  co: string,
  route: string,
  bound: string,
  service: string,
  abortSignal?: AbortSignal
): Promise<CtbRouteStop[] | KmbRouteStop[]> => {
  try {
    if (abortSignal) {
      const api = (apiConfig.data as ApiConfigEntry[]).find(
        (item) => item.co.toLowerCase() === co.toLowerCase()
      )

      if (!api) {
        console.error('ERROR: Api not found.')
        return []
      }

      const b = bound.toLowerCase() === 'o' ? 'outbound' : 'inbound'
      const url = `${api.base_url}${api.api.route_stop}${route.toUpperCase()}/${b}`
      const s = co.toLowerCase() === 'kmb' ? `/${service}` : ''

      const response = await fetch(url + s)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      return result.data as CtbRouteStop[] | KmbRouteStop[]
    }
  } catch (error) {
    console.error('ERROR: fetching stop data. Info:', error)
  }
  return []
}

export const getStopData = async (
  co: string,
  stopId: string,
  abortSignal?: AbortSignal
): Promise<CtbStop | KmbStop | ''> => {
  if (!co || !stopId) {
    return ''
  }
  try {
    if (abortSignal) {
      const api = ((apiConfig.data as ApiConfigEntry[]).find(
        (item) => item.co.toUpperCase() === co.toUpperCase()
      ) ?? {}) as ApiConfigEntry
      const url = api.base_url + api.api.stop + stopId.toUpperCase()
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      return result.data as CtbStop | KmbStop
    }
  } catch (error) {
    console.error('ERROR: fetching stop name. Info:', error)
  }
  return ''
}
