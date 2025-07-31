import allRoutesData from '@/res/json/all_route_list.json';

export const getBusCompanyInfo = (co, route) => {
  const COMPANY_NAMES = {
    CTB: '城巴',
    KMB: '九巴',
    LWB: '龍運',
  };
  const LWB_PATTERN = /^(A|E|NA|R|S|X)/;
  const NOT_LWB_ROUTES = ['X6C', 'X42C', 'X42P', 'X89D', 'X90', 'R33', 'R42'];
  const isLWBRoute = (route) => LWB_PATTERN.test(route) && !NOT_LWB_ROUTES.includes(route);
  if (co === 'CTB') {
    return { name_tc: COMPANY_NAMES.CTB, code: 'CTB' };
  }
  if (co === 'KMB' && isLWBRoute(route)) {
    return { name_tc: COMPANY_NAMES.LWB, code: 'LWB' };
  }
  return { name_tc: COMPANY_NAMES.KMB, code: 'KMB' };
};

export const getRouteInfo = (co, route, bound, service) => {
  if (!co || !route || !bound || !service) return {};

  const res =
    allRoutesData['data'].find((i) => {
      return i.route === route && i.co === co && i.bound === bound && i.service_type === service;
    }) ?? {};

  if (Object.keys(res).length === 0) {
    console.log('CHECK SWAP BOUND STOP LIST');
    const swapBound = bound === 'O' ? 'I' : 'O';
    return getRouteInfo(co, route, swapBound, service) ?? {};
  }

  return res;
};
