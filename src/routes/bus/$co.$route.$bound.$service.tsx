import { BusStopIcon } from '@/assets/icons'
import { BusEta } from '@/components/bus/BusEta'
import BusRouteInfo from '@/components/bus/BusRouteInfo'
import { Loading } from '@/components/Loading'
import { LandsDptRouteMapView } from '@/components/map/LandsDptRouteMapView'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  getBusRouteStopsQueryOptions,
  getStopInfoQueryOptions,
  useBusRouteStops,
} from '@/features/bus/hooks'
import type { CtbStop, KmbStop } from '@/features/bus/types'
import {
  busCo,
  coWebsites,
  findClosestStop,
  getRouteInfo,
  getUserPosition,
} from '@/features/bus/utils'
import type { MapLocation } from '@/lib/types'
import { cn, scrollToElement } from '@/lib/utils'
import { ArrowSquareOutIcon, BusIcon, QuestionMarkIcon } from '@phosphor-icons/react'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute, Link, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import z from 'zod'

export const Route = createFileRoute('/bus/$co/$route/$bound/$service')({
  loader: async ({ params, context: { queryClient } }) => {
    const { co, route, bound, service } = params

    const stops = await queryClient.ensureQueryData(
      getBusRouteStopsQueryOptions(co, route, bound, service)
    )
    const stopIds = [...new Set(stops.map((s) => s.stop))]

    Promise.all(stopIds.map((id) => queryClient.prefetchQuery(getStopInfoQueryOptions(co, id))))

    return getRouteInfo(co, route, bound, service)
  },
  validateSearch: z.object({
    stop: z.coerce.string().optional(),
  }),
  pendingComponent: () => <Loading />,
  pendingMs: 0,
  component: RouteComponent,
  head: ({ loaderData }) => {
    if (loaderData?.route && loaderData?.dest_tc) {
      return {
        meta: [{ title: `${loaderData.route} 往 ${loaderData.dest_tc} | 幾時到` }],
      }
    }
    return {}
  },
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })
  const canGoBack = useCanGoBack()

  const { co, route, bound, service } = Route.useParams()
  const { stop } = Route.useSearch()
  const nowRouteInfo = Route.useLoaderData()

  // Scrolls to the stop element only when:
  // 1. A stop is already in the URL on first page load
  // 2. The closest stop was auto-detected
  // Clicking an accordion item does NOT trigger scroll.
  const shouldScroll = useRef(Boolean(stop))
  const autoDetected = useRef(false)
  const stickyHeaderRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null)

  useEffect(() => {
    getUserPosition()
      .then((pos) => setUserLocation({ lat: pos.lat, long: pos.long }))
      .catch(() => setUserLocation(null))
  }, [])

  const { data: routeStops, isLoading: isLoadingRouteStops } = useBusRouteStops({
    co,
    route,
    bound,
    service,
  })

  const stopIds = useMemo(() => [...new Set(routeStops?.map((s) => s.stop) ?? [])], [routeStops])

  const {
    isPending: isStopInfoPending,
    stopNameMap,
    stopMap,
  } = useQueries({
    queries: stopIds.map((id) => getStopInfoQueryOptions(co, id)),
    combine: (results) => ({
      isPending: results.some((r) => r.isPending),
      stopNameMap: results.reduce((map, r) => {
        if (r.data) {
          map.set(r.data.stop, r.data.name_tc)
        }
        return map
      }, new Map<string, string>()),
      stopMap: results.reduce(
        (map, r) => {
          if (r.data) {
            map[r.data.stop] = r.data as CtbStop | KmbStop
          }
          return map
        },
        {} as Record<string, CtbStop | KmbStop>
      ),
    }),
  })

  const markers = useMemo(
    () =>
      routeStops?.flatMap((i) => {
        const info = stopMap[i.stop]
        const name = stopNameMap.get(i.stop)
        if (!info || name === undefined) {
          return []
        }
        const long = typeof info.long === 'number' ? info.long : parseFloat(info.long)
        const lat = typeof info.lat === 'number' ? info.lat : parseFloat(info.lat)
        return [{ id: i.stop, long, lat, name }]
      }) ?? [],
    [routeStops, stopMap, stopNameMap]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: Don't want to find when "stop" changes
  useEffect(() => {
    const find = async () => {
      // wait for stopMap
      if (!stop && !autoDetected.current && !isStopInfoPending && Object.keys(stopMap).length > 0) {
        autoDetected.current = true
        const closest = await findClosestStop(stopMap)
        // user may have scrolled to a different stop
        // before the closest stop is found
        if (closest && !stop) {
          shouldScroll.current = true
          navigate({
            search: (prev) => ({ ...prev, stop: closest }),
            resetScroll: false,
            replace: true,
          })
        }
      }
    }
    find()
  }, [stopMap, navigate, isStopInfoPending])

  useEffect(() => {
    if (!shouldScroll.current || !stop) {
      return
    }
    shouldScroll.current = false
    scrollToElement(stop, stickyHeaderRef.current?.offsetHeight ?? 0)
  }, [stop])

  if ((co !== busCo.kmb && co !== busCo.ctb) || !nowRouteInfo) {
    return (
      <div className="flex flex-col items-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <BusIcon className="size-8" />
              <QuestionMarkIcon className="size-8" />
            </EmptyMedia>
            <EmptyTitle>搵唔到呢條線</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              aria-label="Back to bus page"
              onClick={() => {
                if (canGoBack) {
                  router.history.back()
                } else {
                  navigate({ to: '/bus' })
                }
              }}
            >
              返回
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (isStopInfoPending || isLoadingRouteStops) {
    return <Loading />
  }

  if (!routeStops || routeStops.length === 0) {
    return (
      <div>
        <BusRouteInfo co={co} nowRoute={nowRouteInfo} />
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <BusStopIcon />
              <QuestionMarkIcon className="size-8" />
            </EmptyMedia>
            <EmptyTitle>搵唔到巴士站，試下調轉方向</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const fallbackStopId = routeStops?.[0]?.stop ?? null
  const effectiveStopId = stop ?? fallbackStopId
  const mapStopInfo = effectiveStopId ? stopMap[effectiveStopId] : null

  return (
    <div className="flex flex-col items-center">
      {/* sticky */}
      <div ref={stickyHeaderRef} className="sticky top-0 z-20 flex w-full flex-col bg-background">
        <BusRouteInfo co={co} nowRoute={nowRouteInfo} />
        {mapStopInfo && effectiveStopId && (
          <div className="mx-auto w-full max-w-xl pb-2">
            <LandsDptRouteMapView
              center={{
                lat:
                  typeof mapStopInfo.lat === 'number'
                    ? mapStopInfo.lat
                    : parseFloat(mapStopInfo.lat),
                long:
                  typeof mapStopInfo.long === 'number'
                    ? mapStopInfo.long
                    : parseFloat(mapStopInfo.long),
              }}
              markers={markers}
              stopId={effectiveStopId}
              co={co}
              userLocation={userLocation}
              onLocate={(coords) =>
                setUserLocation({ lat: coords.latitude, long: coords.longitude })
              }
            />
          </div>
        )}
      </div>
      {/* sticky */}
      <Accordion
        className="max-w-xl rounded-lg border"
        value={stop ? [stop] : []}
        onValueChange={(v) =>
          navigate({
            search: (prev) => (v.length ? { ...prev, stop: v[0] } : {}),
            resetScroll: false,
            replace: true,
          })
        }
      >
        {routeStops.map((i) => {
          const nameTc = stopNameMap.get(i.stop)
          return (
            <AccordionItem
              key={`${i.seq}-${i.stop}`}
              id={i.stop}
              value={i.stop}
              className="relative border-b px-4 last:border-b-0"
            >
              <AccordionTrigger className="flex items-center gap-2 text-lg font-normal hover:no-underline">
                <div
                  className={cn(
                    `relative z-10 grid size-8 shrink-0 place-content-center rounded-full border bg-background font-medium`
                  )}
                >
                  {i.seq}
                </div>
                <div className="flex-1">{nameTc ?? `搵唔到 ID 為「${i.stop}」的巴士站`}</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                <BusEta
                  co={co}
                  route={route}
                  bound={bound}
                  service={service}
                  stop={stopMap[i.stop]}
                  userLocation={userLocation}
                />
                {co === busCo.kmb && (
                  <Link
                    to="/bus/$co/stop/$stopId"
                    params={{ co, stopId: i.stop }}
                    className={cn(buttonVariants({ variant: 'secondary' }))}
                    style={{ textDecoration: 'none' }}
                  >
                    同站巴士
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <a
        target="_blank"
        href={`${coWebsites[co]}${nowRouteInfo.route}`}
        className={cn(buttonVariants({ variant: 'link' }), 'my-2')}
        rel="noreferrer"
      >
        按此查詢巴士公司網站之資料
        <ArrowSquareOutIcon size={10} />
      </a>
    </div>
  )
}
