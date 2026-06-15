import { Loading } from '@/components/Loading'
import { buttonVariants } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMetroEta } from '@/features/metro/hooks'
import type {
  MtrDirection,
  MtrLine,
  MtrStation,
  MtrStationCode,
  TrainSchedule,
} from '@/features/metro/types'
import { getStationName, mtrDirection, mtrLineBorder } from '@/features/metro/utils'
import { cn, formatTime } from '@/lib/utils'
import { ArrowClockwiseIcon, CheckIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export function MetroEta({
  line,
  dir,
  station,
}: {
  line: MtrLine
  dir: MtrDirection
  station: MtrStation
}) {
  const stationId = station.code

  const {
    data,
    isLoading: isLoadingEta,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useMetroEta({ line, station: stationId })
  const lastUpdated = formatTime(new Date(dataUpdatedAt))
  const eta = data?.[mtrDirection[dir]] as TrainSchedule[]
  // const [dest, setDest] = useState<number | null>(null)
  const [showTick, setShowTick] = useState(false)

  // useEffect(() => {
  //   userDistanceToStop(stop).then(setDest)
  // }, [stop])

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

  if (line === 'DRL') {
    return (
      <div className="text-center">
        <span className="text-lg text-secondary-foreground">迪士尼線暫無ETA</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:ml-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-light">
          {/*{dest !== null && <span>{`距離 ${dest.toFixed(0)} 米`} </span>}*/}
          {/*{dest !== null && <span>&middot;</span>}*/}

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

      {!eta || eta.length === 0 ? (
        <div className="text-center">
          <span className="text-lg text-destructive">搵唔到班次，請再試一次</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 sm:gap-3">
          {eta.map((i, index) => {
            return (
              <div
                key={`eta-${i.seq}-${i.time}`}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md border bg-secondary',
                  index === 0 ? 'h-32 w-32' : 'h-24 w-24',
                  mtrLineBorder[line]
                )}
              >
                <div className={cn(index === 0 ? 'text-sm' : 'text-xs')}>
                  往 {getStationName({ line, dir, station: i.dest as MtrStationCode })}
                </div>
                <div className={cn(index === 0 ? 'text-5xl font-bold' : 'text-2xl font-medium')}>
                  {etaText({ eta: i, line })}
                </div>
                <div className={cn(index === 0 ? 'text-sm' : 'text-xs')}>分鐘</div>
                <div className="text-xs font-light text-secondary-foreground italic">
                  {i.plat} 號月台
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function etaText({ eta, line }: { eta: TrainSchedule; line: MtrLine }): string {
  const etaInMin = parseInt(eta.ttnt, 10)

  if (etaInMin > 1) {
    return eta.ttnt
  }

  // Only in East Rail Line
  if (line === 'EAL') {
    switch (eta.timetype) {
      case 'A':
        return '即將抵達'
      case 'D':
        return '正在離開'
      default:
        return '–'
    }
  }

  return '–'
}
