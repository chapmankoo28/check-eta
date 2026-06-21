import type {
  CtbEta,
  CtbRouteStop,
  CtbStop,
  KmbEta,
  KmbRouteStop,
  KmbStop,
} from '@/features/bus/types'
import { busCo } from '@/features/bus/utils'
import { ETA_REFETCH_INTERVAL } from '@/lib/constants'
import type { ApiConfigEntry } from '@/lib/types'
import apiConfig from '@/res/json/api_config.json'
import { useQuery } from '@tanstack/react-query'

export function getBusEtaQueryOptions(co: string, route: string, service: string, stopId: string) {
  return {
    queryKey: ['bus-eta', co, route, service, stopId] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const api = (apiConfig.data as ApiConfigEntry[]).find(
        (item) => item.co.toLowerCase() === co.toLowerCase()
      )
      if (!api) {
        console.error('ERROR: Api not found.')
        return null
      }

      const s = co.toLowerCase() === 'kmb' ? `/${service}` : ''
      const url = `${api.baseUrl}${api.api.eta}${stopId.toUpperCase()}/${route.toUpperCase()}${s}`

      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (co === busCo.ctb) {
        return result.data as CtbEta[]
      } else {
        return result.data as KmbEta[]
      }
    },
    refetchInterval: ETA_REFETCH_INTERVAL,
  } as const
}

export function useBusEta({
  co,
  route,
  service,
  stopId,
}: {
  co: string
  route: string
  service: string
  stopId: string
}) {
  return useQuery(getBusEtaQueryOptions(co, route, service, stopId))
}

export function getBusRouteStopsQueryOptions(
  co: string,
  route: string,
  bound: string,
  service: string
) {
  return {
    queryKey: ['bus-route-stops', co, route, bound, service] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const api = (apiConfig.data as ApiConfigEntry[]).find(
        (item) => item.co.toLowerCase() === co.toLowerCase()
      )
      if (!api) {
        console.error('ERROR: Api not found.')
        return []
      }

      const b = bound.toLowerCase() === 'o' ? '/outbound' : '/inbound'
      const s = co.toLowerCase() === 'kmb' ? `/${service}` : ''
      const url = `${api.baseUrl}${api.api.routeStop}${route.toUpperCase()}${b}${s}`

      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (co === busCo.ctb) {
        return result.data as CtbRouteStop[]
      } else {
        return result.data as KmbRouteStop[]
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  } as const
}

export function useBusRouteStops({
  co,
  route,
  bound,
  service,
}: {
  co: string
  route: string
  bound: string
  service: string
}) {
  return useQuery(getBusRouteStopsQueryOptions(co, route, bound, service))
}

export function getStopInfoQueryOptions(co: string, stopId: string) {
  return {
    queryKey: ['bus-stop-info', co, stopId],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const api = ((apiConfig.data as ApiConfigEntry[]).find(
        (item) => item.co.toUpperCase() === co.toUpperCase()
      ) ?? {}) as ApiConfigEntry

      const url = api.baseUrl + api.api.stop + stopId.toUpperCase()

      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (co === busCo.ctb) {
        return result.data as CtbStop
      } else {
        return result.data as KmbStop
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  } as const
}

export function useBusStopInfo({ co, stopId }: { co: string; stopId: string }) {
  return useQuery(getStopInfoQueryOptions(co, stopId))
}
