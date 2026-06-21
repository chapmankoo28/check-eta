import { Loading } from '@/components/Loading'
import { buttonVariants } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBusEta } from '@/features/bus/hooks'
import type { CtbEta, CtbStop, KmbEta, KmbStop } from '@/features/bus/types'
import { busCoBorder, getBusCompanyCode, userDistanceToStop } from '@/features/bus/utils'
import { cn, formatTime, timeDiffInMinutes } from '@/lib/utils'
import { ArrowClockwiseIcon, CheckIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export function BusEta({
  co,
  route,
  bound,
  service,
  stop,
}: {
  co: string
  route: string
  bound: string
  service: string
  stop: CtbStop | KmbStop
}) {
  const stopId = stop.stop

  const {
    data,
    isLoading: isLoadingEta,
    isFetching,
    isError,
    dataUpdatedAt,
    refetch,
  } = useBusEta({ co, route, service, stopId })
  const lastUpdated = formatTime(new Date(dataUpdatedAt))
  const eta = (data?.filter((i) => i.dir === bound.toUpperCase()) as CtbEta[] | KmbEta[]) ?? []

  const [dest, setDest] = useState<number | null>(null)
  const [showTick, setShowTick] = useState(false)

  useEffect(() => {
    userDistanceToStop(stop).then(setDest)
  }, [stop])

  useEffect(() => {
    if (!isFetching && dataUpdatedAt > 0) {
      setShowTick(true)
      const id = setTimeout(() => setShowTick(false), 1000)
      return () => clearTimeout(id)
    }
  }, [isFetching, dataUpdatedAt])

  if (isLoadingEta) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-2 sm:ml-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-light">
          {dest !== null && <span>{`距離 ${dest.toFixed(0)} 米`} </span>}
          {dest !== null && <span>&middot;</span>}

          <span>最後更新於 {lastUpdated}</span>
        </div>
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

      <EtaInner eta={eta} isError={isError} />
    </div>
  )
}

function EtaInner({ eta, isError }: { eta: CtbEta[] | KmbEta[]; isError: boolean }) {
  if (eta.length === 0 || eta.every((i) => !i.eta && !i.rmk_tc)) {
    if (isError) {
      return (
        <div className="text-center">
          <span className="text-lg text-destructive">搵唔到班次，請再試一次</span>
        </div>
      )
    }
    return (
      <div className="text-center">
        <span className="text-lg text-secondary-foreground">暫無班次</span>
      </div>
    )
  }

  if (eta.every((i) => !i.eta && i.rmk_tc)) {
    return eta.map((i) => (
      <div key={`rmk-${i.seq}`} className="text-center">
        <span className="text-lg">{i.rmk_tc}</span>
      </div>
    ))
  }

  const now = new Date()
  return (
    <div className="flex items-center gap-1 sm:gap-3">
      {eta.map((i, index) => {
        if (!i.eta) {
          return null
        }

        const coCode = getBusCompanyCode(i.co, i.route)
        const etaDate = new Date(i.eta)
        const etaInMin = Math.ceil(timeDiffInMinutes(now, etaDate))
        return (
          <div
            key={`eta-${i.seq}-${i.eta_seq}`}
            className={cn(
              'flex flex-col items-center justify-center rounded-md border bg-secondary',
              index === 0 ? 'h-30 w-30' : 'h-24 w-24',
              busCoBorder[coCode]
            )}
          >
            <div className={cn(index === 0 ? 'text-5xl font-bold' : 'text-2xl font-medium')}>
              {etaInMin > 0 ? etaInMin : '–'}
            </div>
            <div className={cn(index === 0 ? 'text-base' : 'text-sm')}>分鐘</div>
            {i.rmk_tc && (
              <div className="text-sm font-light text-secondary-foreground italic">
                {i.rmk_tc === '原定班次' ? '未開出' : i.rmk_tc}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
