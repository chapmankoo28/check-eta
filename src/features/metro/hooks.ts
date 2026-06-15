import type { StationData } from '@/features/metro/types'
import { ETA_REFETCH_INTERVAL } from '@/lib/constants'
import apiConfig from '@/res/json/api_config.json'
import { useQuery } from '@tanstack/react-query'

export function useMetroEta({ line, station }: { line: string; station: string }) {
  return useQuery({
    queryKey: ['metro-eta', line, station],
    queryFn: async ({ signal }) => {
      const api = apiConfig.data.find((i) => {
        return i.co.toUpperCase() === 'MTR'
      })

      if (!api) {
        console.error('ERROR: Api not found.')
        return null
      }

      const url = `${api.baseUrl}${api.api.line}${line}&${api.api.sta}${station}&${api.api.lang}TC/`

      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data[`${line}-${station}`] as StationData
    },
    refetchInterval: ETA_REFETCH_INTERVAL,
  })
}
