import { EtaBoxes } from '@/components/bus/EtaBoxes'
import { Loading } from '@/components/Loading'
import { buttonVariants } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBusEta } from '@/features/bus/hooks'
import type { CtbEta, CtbStop, KmbEta, KmbStop } from '@/features/bus/types'
import { userDistanceToStop } from '@/features/bus/utils'
import { cn, formatTime } from '@/lib/utils'
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

      <EtaBoxes eta={eta} isError={isError} />
    </div>
  )
}
