import { BusStopIcon } from '@/assets/icons'
import { BusEta } from '@/components/bus/BusEta'
import NowRouteInfo from '@/components/bus/BusRouteInfo'
import { Loading } from '@/components/Loading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getStopInfoQueryOptions, useBusRouteStops } from '@/features/bus/hooks'
import type { CtbStop, KmbStop } from '@/features/bus/types'
import {
  busCo,
  busCoBg,
  findClosestStop,
  getBusCompanyCode,
  getRouteInfo,
} from '@/features/bus/utils'
import { cn, scrollToElement } from '@/lib/utils'
import { BusIcon, QuestionMarkIcon } from '@phosphor-icons/react'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useRef } from 'react'
import z from 'zod'

export const Route = createFileRoute('/bus/$co/$route/$bound/$service')({
  validateSearch: z.object({
    stop: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })
  const canGoBack = useCanGoBack()

  const { co, route, bound, service } = Route.useParams()
  const { stop } = Route.useSearch()
  const coCode = getBusCompanyCode(co, route)

  // Scrolls to the stop element only when:
  // 1. A stop is already in the URL on first page load
  // 2. The closest stop was auto-detected
  // Clicking an accordion item does NOT trigger scroll.
  const shouldScroll = useRef(Boolean(stop))

  const nowRouteInfo = getRouteInfo(co, route, bound, service)
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

  const autoDetected = useRef(false)

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

  if (stop && shouldScroll.current) {
    shouldScroll.current = false
    scrollToElement(stop)
  }

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
                  navigate({ to: '/' })
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
        <NowRouteInfo co={co} nowRoute={nowRouteInfo} />
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

  return (
    <div className="flex flex-col items-center">
      <NowRouteInfo co={co} nowRoute={nowRouteInfo} />
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
        {routeStops.map((i, idx, arr) => {
          const isFirst = idx === 0
          const isLast = idx === arr.length - 1
          const nameTc = stopNameMap.get(i.stop)
          return (
            <AccordionItem
              key={`${i.seq}-${i.stop}`}
              id={i.stop}
              value={i.stop}
              className="relative border-b px-4 last:border-b-0"
            >
              <div
                className={cn(
                  'absolute left-8 w-px',
                  isFirst && 'top-8 h-[calc(100%-2rem)]',
                  isLast && 'top-0 h-8',
                  !isFirst && !isLast && 'top-0 h-full',
                  busCoBg[coCode]
                )}
              />
              <AccordionTrigger className="flex items-center gap-2 text-lg font-normal hover:no-underline">
                <div
                  className={cn(
                    `relative z-10 grid size-8 shrink-0 place-content-center rounded-full border bg-background font-medium`,
                    coCode === 'KMB' && 'border-kmb',
                    coCode === 'CTB' && 'border-ctb',
                    coCode === 'LWB' && 'border-lwb'
                  )}
                >
                  {i.seq}
                </div>
                <div className="flex-1">{nameTc ?? `搵唔到 ID 為「${i.stop}」的巴士站`}</div>
              </AccordionTrigger>
              <AccordionContent className={'ml-10'}>
                <BusEta
                  co={co}
                  route={route}
                  bound={bound}
                  service={service}
                  stop={stopMap[i.stop]}
                />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
