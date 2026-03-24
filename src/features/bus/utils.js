/** biome-ignore-all lint/style/useNamingConvention: required by the API */
import allRoutesData from '@/res/json/all_route_list.json'

export const getBusCompanyInfo = (co, route) => {
  const companyNames = {
    CTB: '城巴',
    KMB: '九巴',
    LWB: '龍運',
  }
  const notLwbRoutes = ['X6C', 'X42C', 'X42P', 'X89D', 'X90', 'R33', 'R42']
  const isLwbRoute = (route) => /^(A|E|NA|R|S|X)/.test(route) && !notLwbRoutes.includes(route)
  if (co === 'CTB') {
    return { name_tc: companyNames.CTB, code: 'CTB' }
  }
  if (co === 'KMB' && isLwbRoute(route)) {
    return { name_tc: companyNames.LWB, code: 'LWB' }
  }
  return { name_tc: companyNames.KMB, code: 'KMB' }
}

export const getRouteInfo = (co, route, bound, service) => {
  if (!co || !route || !bound || !service) {
    return {}
  }

  const res =
    allRoutesData.data.find((i) => {
      return i.route === route && i.co === co && i.bound === bound && i.service_type === service
    }) ?? {}

  if (Object.keys(res).length === 0) {
    console.log('CHECK SWAP BOUND STOP LIST')
    const swapBound = bound === 'O' ? 'I' : 'O'
    return getRouteInfo(co, route, swapBound, service) ?? {}
  }

  return res
}
