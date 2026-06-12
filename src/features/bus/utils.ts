/** biome-ignore-all lint/style/useNamingConvention: required by the API */
import type { RouteListEntry } from '@/features/bus/types'
import allRoutesData from '@/res/json/all_route_list.json'

export const busCo = {
  kmb: 'KMB',
  ctb: 'CTB',
  lwb: 'LWB',
} as const

export const busCoBg = {
  KMB: 'bg-kmb text-white',
  CTB: 'bg-ctb text-black',
  LWB: 'bg-lwb text-white',
} as const

const companyNames = {
  CTB: '城巴',
  KMB: '九巴',
  LWB: '龍運',
} as const

export function getBusCompanyInfo(
  co: string,
  route: string
): { name: string; code: keyof typeof busCoBg } {
  const notLwbRoutes = [
    'SP1',
    'SP3',
    'SP5A',
    'SP6',
    'SP7',
    'SP10',
    'SP12',
    'X6C',
    'X42C',
    'X42P',
    'X89D',
    'X90',
  ]
  const isLwbRoute = (route: string) =>
    /^(A|E|N|R|S|X)/.test(route) && !notLwbRoutes.includes(route)
  if (co === 'CTB') {
    return { name: companyNames.CTB, code: busCo.ctb }
  }
  if (co === 'KMB' && isLwbRoute(route)) {
    return { name: companyNames.LWB, code: busCo.lwb }
  }
  return { name: companyNames.KMB, code: busCo.kmb }
}

export function getBusCompanyName(co: string, route: string): string {
  return getBusCompanyInfo(co, route).name
}

export function getBusCompanyCode(co: string, route: string): keyof typeof busCoBg {
  return getBusCompanyInfo(co, route).code
}

const routeInfoMap = new Map<string, RouteListEntry>(
  allRoutesData.data.map((entry) => [
    `${entry.co}|${entry.route}|${entry.bound}|${entry.service_type}`,
    entry as RouteListEntry,
  ])
)

export function getRouteInfo(
  co: string,
  route: string,
  bound: string,
  service: string
): RouteListEntry | null {
  if (!co || !route || !bound || !service) {
    return null
  }

  const key = `${co}|${route}|${bound}|${service}`
  const direct = routeInfoMap.get(key)
  if (direct) {
    return direct
  }

  const swapBound = bound === 'O' ? 'I' : 'O'
  const swapKey = `${co}|${route}|${swapBound}|${service}`
  return routeInfoMap.get(swapKey) ?? null
}
