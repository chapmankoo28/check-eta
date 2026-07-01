import type { CtbStop, KmbEta, KmbStop, RouteEtaGroup, RouteListEntry } from '@/features/bus/types'
import { POSITION_TTL } from '@/lib/constants'
import { haversineDistance, timeDiffInMinutes } from '@/lib/utils'
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

export const busCoBorder = {
  KMB: 'border-kmb',
  CTB: 'border-ctb-yellow',
  LWB: 'border-lwb',
} as const

const companyNames = {
  CTB: '城巴',
  KMB: '九巴',
  LWB: '龍運',
} as const

export const coWebsites = {
  KMB: `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=`,
  LWB: `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=`,
  CTB: `https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=`,
} as const

let cachedPosition: { lat: number; lng: number; ts: number } | null = null

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
    /^(A|E|NA|R|S|X)/.test(route) && !notLwbRoutes.includes(route)
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

function getUserPosition(): Promise<{ lat: number; lng: number }> {
  if (cachedPosition && Date.now() - cachedPosition.ts < POSITION_TTL) {
    return Promise.resolve(cachedPosition)
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          ts: Date.now(),
        }
        resolve(cachedPosition)
      },
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    )
  })
}

export async function userDistanceToStop(stop: CtbStop | KmbStop): Promise<number | null> {
  const { lat, lng } = await getUserPosition()
  return haversineDistance(
    lat,
    lng,
    parseFloat(stop.lat as string),
    parseFloat(stop.long as string)
  )
}

export async function findClosestStop(
  stopMap: Record<string, CtbStop | KmbStop>
): Promise<string | null> {
  const { lat, lng } = await getUserPosition()
  let minDistance = Infinity
  let closestStop = ''

  for (const stop of Object.values(stopMap)) {
    const distance = haversineDistance(
      lat,
      lng,
      parseFloat(stop.lat as string),
      parseFloat(stop.long as string)
    )

    if (distance < minDistance) {
      minDistance = distance
      closestStop = stop.stop
    }
  }

  if (closestStop && minDistance <= 500) {
    console.log('Closest stop:', closestStop, 'Distance:', minDistance.toFixed(2), 'm')
    return closestStop
  } else {
    console.log(`Closest stop is too far: ${minDistance.toFixed(2)}m (>500m). Not selecting.`)
    return null
  }
}

export function getEtaInMinutes(eta: string | null): number | null {
  if (!eta) {
    return null
  }
  return Math.ceil(timeDiffInMinutes(new Date(), new Date(eta)))
}

export function formatEtaText(eta: { eta: string | null; rmk_tc: string }): string {
  if (eta.rmk_tc) {
    return eta.rmk_tc === '原定班次' ? '未開出' : eta.rmk_tc
  }
  if (!eta.eta) {
    return '–'
  }
  const etaInMin = getEtaInMinutes(eta.eta)
  return etaInMin !== null && etaInMin > 0 ? `${etaInMin} 分鐘` : '–'
}

export function groupEtasByRoute(etas: KmbEta[]): RouteEtaGroup[] {
  const routeGroups = new Map<string, KmbEta[]>()
  for (const e of etas) {
    const key = `${e.route}|${e.dir}|${String(e.service_type)}`
    if (!routeGroups.has(key)) {
      routeGroups.set(key, [])
    }
    routeGroups.get(key)?.push(e)
  }

  return [...routeGroups.entries()]
    .map(([key, etas]) => {
      const [route, dir, serviceType] = key.split('|') as [string, string, string]
      const firstWithEta = etas.find((e) => e.eta)
      const firstEtaTime = firstWithEta?.eta ? new Date(firstWithEta.eta).getTime() : Infinity
      return {
        route,
        bound: dir,
        serviceType,
        destTc: etas[0].dest_tc,
        etas,
        etaTime: firstEtaTime,
      }
    })
    .sort((a, b) => a.etaTime - b.etaTime)
}
