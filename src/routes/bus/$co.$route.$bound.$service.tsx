import NowRouteInfo from '@/components/NowBusRouteInfo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Spinner } from '@/components/ui/spinner'
import { getStopInfoQueryOptions, useBusRouteStops } from '@/features/bus/hooks'
import { busCo } from '@/features/bus/types'
import { getRouteInfo } from '@/features/bus/utils'
import { cn } from '@/lib/utils'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import z from 'zod'

export const Route = createFileRoute('/bus/$co/$route/$bound/$service')({
  validateSearch: z.object({
    stop: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })
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
      <div>
        <span>搵唔到呢條線……</span>
      </div>
    )
  }

  if (!routeStops) {
    return (
      <div>
        <span>搵唔到巴士站，請嘗試切換方向。</span>
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
              co={co}
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

function BusStop({
  co,
  nameTc,
  stopId,
  seq,
}: {
  co: string
  nameTc?: string
  stopId: string
  seq: number
}) {
  const bg = co === busCo.kmb ? 'bg-kmb text-white' : 'bg-ctb text-black'

  return (
    <AccordionItem value={stopId} className="border-b px-4 last:border-b-0 hover:bg-accent">
      <AccordionTrigger className="flex flex-row items-center gap-2 text-lg hover:no-underline">
        <div className={cn(`grid size-8 shrink-0 place-content-center rounded-md font-bold`, bg)}>
          {seq}
        </div>
        <div className="flex-1">{nameTc ?? `搵唔到 ID 為「${stopId}」的巴士站`}</div>
      </AccordionTrigger>
      <AccordionContent className="text-base">{seq}</AccordionContent>
    </AccordionItem>
  )
}
