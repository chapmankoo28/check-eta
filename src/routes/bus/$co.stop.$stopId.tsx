import { Loading } from '@/components/Loading'
import { buttonVariants } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  getBusStopEtaQueryOptions,
  getStopInfoQueryOptions,
  useBusStopEta,
} from '@/features/bus/hooks'
import type { KmbEta } from '@/features/bus/types'
import {
  busCo,
  busCoBg,
  busCoBorder,
  formatEtaText,
  getBusCompanyCode,
  getEtaInMinutes,
  groupEtasByRoute,
} from '@/features/bus/utils'
import { cn, formatTime } from '@/lib/utils'
import { ArrowClockwiseIcon, ArrowRightIcon, BusIcon, CheckIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/bus/$co/stop/$stopId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { co, stopId } = params

    const stop = await queryClient.ensureQueryData(getStopInfoQueryOptions(co, stopId))
    if (co === busCo.kmb) {
      await queryClient.ensureQueryData(getBusStopEtaQueryOptions(co, stopId))
    }

    return { stop }
  },
  pendingComponent: () => <Loading />,
  pendingMs: 0,
  component: RouteComponent,
  head: ({ loaderData }) => {
    if (loaderData?.stop?.name_tc) {
      return {
        meta: [{ title: `${loaderData.stop.name_tc} | 幾時到` }],
      }
    }
    return {}
  },
})

function RouteComponent() {
  const { co, stopId } = Route.useParams()
  const { stop } = Route.useLoaderData()
  const isKmb = co === busCo.kmb
  const {
    data: allEtas,
    isLoading: isEtaLoading,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useBusStopEta({ co, stopId, enabled: isKmb })
  const lastUpdated = formatTime(new Date(dataUpdatedAt))

  const [showTick, setShowTick] = useState(false)

  useEffect(() => {
    if (!isFetching && dataUpdatedAt > 0) {
      setShowTick(true)
      const id = setTimeout(() => setShowTick(false), 1000)
      return () => clearTimeout(id)
    }
  }, [isFetching, dataUpdatedAt])

  const routeGroups = useMemo(() => {
    if (!allEtas || !isKmb) {
      return []
    }
    return groupEtasByRoute(allEtas)
  }, [allEtas, isKmb])

  if (isEtaLoading) {
    return <Loading />
  }

  if (!isKmb) {
    return (
      <div className="flex flex-col items-center">
        <div className="sticky top-0 z-20 w-full bg-background">
          <div className="mx-auto flex w-full max-w-xl items-center justify-between py-1">
            <span className="mx-auto text-3xl sm:text-4xl">
              {stop?.name_tc ?? `巴士站 ${stopId}`}
            </span>
          </div>
        </div>
        <div className="mt-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <BusIcon className="size-8" />
              </EmptyMedia>
              <EmptyTitle>城巴暫不支援此功能</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="sticky top-0 z-20 w-full bg-background">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between py-1">
          <span className="mx-auto text-3xl sm:text-4xl">
            {stop?.name_tc ?? `巴士站 ${stopId}`}
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-xl items-center justify-between">
          <div></div>
          <span className="text-sm font-light text-muted-foreground">最後更新於 {lastUpdated}</span>
          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }))}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? (
                <Spinner className="size-5 text-foreground" />
              ) : showTick ? (
                <CheckIcon weight="bold" className="size-5 text-success" data-icon="inline-start" />
              ) : (
                <ArrowClockwiseIcon data-icon="inline-start" className="size-5 text-foreground" />
              )}
            </TooltipTrigger>
            <TooltipContent>更新</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {routeGroups.length === 0 ? (
        <div className="mt-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <BusIcon className="size-8" />
              </EmptyMedia>
              <EmptyTitle>暫無班次</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="mt-3 flex w-full max-w-xl flex-col gap-4">
          {routeGroups.map((g) => (
            <StopRouteCard
              key={`${g.route}|${g.bound}|${g.serviceType}`}
              co={co}
              stopId={stopId}
              route={g.route}
              bound={g.bound}
              serviceType={g.serviceType}
              destTc={g.destTc}
              etas={g.etas}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StopRouteCard({
  co,
  stopId,
  route,
  bound,
  serviceType,
  destTc,
  etas,
}: {
  co: string
  stopId: string
  route: string
  bound: string
  serviceType: string
  destTc: string
  etas: KmbEta[]
}) {
  const coCode = getBusCompanyCode(co, route)

  return (
    <div className="flex flex-col gap-2 rounded-md border">
      <Link
        to="/bus/$co/$route/$bound/$service"
        params={{ co, route, bound, service: serviceType }}
        search={{ stop: stopId }}
      >
        <div className="flex flex-row items-center justify-between p-2 hover:bg-muted">
          <div className="flex min-w-30 items-center gap-1">
            <div className={cn('h-9 w-3', busCoBg[coCode])}></div>
            <span className="text-4xl font-medium">{route}</span>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-xl">{destTc}</span>
            {serviceType !== '1' ? (
              <span className="text-sm text-muted-foreground">特別班</span>
            ) : null}
          </div>
          <ArrowRightIcon className="size-6" />
        </div>
      </Link>
      <div className="px-2 pb-2">
        <EtaBoxes etas={etas} coCode={coCode} />
      </div>
    </div>
  )
}

function EtaBoxes({ etas, coCode }: { etas: KmbEta[]; coCode: string }) {
  if (etas.length === 0 || etas.every((i) => !i.eta && !i.rmk_tc)) {
    return (
      <div className="text-center">
        <span className="text-lg text-secondary-foreground">暫無班次</span>
      </div>
    )
  }

  if (etas.every((i) => !i.eta && i.rmk_tc)) {
    return etas.map((i) => (
      <div key={`rmk-${i.seq}`} className="text-center">
        <span className="text-lg">{formatEtaText(i)}</span>
      </div>
    ))
  }

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      {etas.map((i, index) => {
        if (!i.eta) {
          return null
        }

        const etaInMin = getEtaInMinutes(i.eta)

        return (
          <div
            key={`eta-${i.seq}-${i.eta_seq}`}
            className={cn(
              'flex flex-col items-center justify-center rounded-md border bg-secondary',
              index === 0 ? 'h-30 w-30' : 'h-24 w-24',
              busCoBorder[coCode as keyof typeof busCoBorder]
            )}
          >
            <div className={cn(index === 0 ? 'text-5xl font-bold' : 'text-2xl font-medium')}>
              {etaInMin !== null && etaInMin > 0 ? etaInMin : '–'}
            </div>
            <div className={cn(index === 0 ? 'text-base' : 'text-sm')}>分鐘</div>
            {i.rmk_tc && (
              <div className="text-sm font-light text-secondary-foreground italic">
                {formatEtaText(i)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
