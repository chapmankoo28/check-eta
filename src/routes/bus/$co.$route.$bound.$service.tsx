import { BusStopIcon } from '@/assets/icons'
import NowRouteInfo from '@/components/NowBusRouteInfo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { getStopInfoQueryOptions, useBusRouteStops } from '@/features/bus/hooks'
import { busCo, getRouteInfo } from '@/features/bus/utils'
import { cn } from '@/lib/utils'
import { BusIcon, QuestionMarkIcon } from '@phosphor-icons/react'
import { useQueries } from '@tanstack/react-query'
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useParams,
  useRouter,
} from '@tanstack/react-router'
import { useMemo } from 'react'
import z from 'zod'

export const Route = createFileRoute('/bus/$co/$route/$bound/$service')({
  validateSearch: z.object({
    stop: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const params = useParams({ from: '/bus/$co/$route/$bound/$service' })
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })
  const canGoBack = useCanGoBack()

  const { co, route, bound, service } = Route.useParams()
  const { stop } = Route.useSearch()

  const nowRouteInfo = getRouteInfo(co, route, bound, service)
  const { data: routeStops, isLoading: isLoadingRouteStops } = useBusRouteStops({
    co,
    route,
    bound,
    service,
  })

  const stopIds = useMemo(() => [...new Set(routeStops?.map((s) => s.stop) ?? [])], [routeStops])

  const { isPending: isStopInfoPending, stopNameMap } = useQueries({
    queries: stopIds.map((id) => getStopInfoQueryOptions(co, id)),
    combine: (results) => ({
      isPending: results.some((r) => r.isPending),
      stopNameMap: results.reduce((map, r) => {
        if (r.data) {
          map.set(r.data.stop, r.data.name_tc)
        }
        return map
      }, new Map<string, string>()),
    }),
  })

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
    return (
      <div className="flex flex-col items-center">
        <NowRouteInfo co={co} nowRoute={nowRouteInfo} />
        <div className="my-10">
          <Spinner className="size-8" />
        </div>
      </div>
    )
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
        {routeStops.map((i) => {
          return (
            <BusStop
              key={`${i.route}-${i.seq}-${i.stop}`}
              nameTc={stopNameMap.get(i.stop)}
              stopId={i.stop}
              seq={i.seq}
            />
          )
        })}
      </Accordion>
    </div>
  )
}

function BusStop({ nameTc, stopId, seq }: { nameTc?: string; stopId: string; seq: number }) {
  return (
    <AccordionItem value={stopId} className="border-b px-4 last:border-b-0 hover:bg-accent">
      <AccordionTrigger className="flex flex-row items-center gap-2 text-lg font-normal hover:no-underline">
        <div
          className={cn(`grid size-8 shrink-0 place-content-center rounded-md border font-bold`)}
        >
          {seq}
        </div>
        <div className="flex-1">{nameTc ?? `搵唔到 ID 為「${stopId}」的巴士站`}</div>
      </AccordionTrigger>
      <AccordionContent className="text-base">{seq}</AccordionContent>
    </AccordionItem>
  )
}
