import { useQuery } from '@tanstack/react-query';
import type { RouteListEntry } from '@/features/bus/types';

export function getRouteListQueryOptions() {
  return {
    queryKey: ['bus-route-list'] as const,
    queryFn: async () => {
      const mod = await import('@/res/json/all_route_list.json');
      return mod.default.data as RouteListEntry[];
    },
    staleTime: Infinity,
  } as const;
}

export function useRouteList() {
  return useQuery(getRouteListQueryOptions());
}

let routeInfoMapSource: RouteListEntry[] | null = null;
let routeInfoMap: Map<string, RouteListEntry> = new Map();

function getRouteInfoMap(list: RouteListEntry[]) {
  if (routeInfoMapSource !== list) {
    routeInfoMap = new Map(
      list.map((entry) => [
        `${entry.co}|${entry.route}|${entry.bound}|${entry.service_type}`,
        entry,
      ]),
    );
    routeInfoMapSource = list;
  }
  return routeInfoMap;
}

export function findRouteInfo(
  list: RouteListEntry[],
  co: string,
  route: string,
  bound: string,
  service: string,
): RouteListEntry | null {
  if (!co || !route || !bound || !service) {
    return null;
  }

  const map = getRouteInfoMap(list);
  const direct = map.get(`${co}|${route}|${bound}|${service}`);
  if (direct) {
    return direct;
  }

  const swapBound = bound === 'O' ? 'I' : 'O';
  return map.get(`${co}|${route}|${swapBound}|${service}`) ?? null;
}
