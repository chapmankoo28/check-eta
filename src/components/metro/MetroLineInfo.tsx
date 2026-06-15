import { SwapBoundButton } from '@/components/SwapBoundButton'
import type { MtrDirection, MtrLine, MtrLineData } from '@/features/metro/types'
import { mtrLineBg, mtrLineName } from '@/features/metro/utils'
import { cn } from '@/lib/utils'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function MetroRouteInfo({ nowLine, dir }: { nowLine: MtrLineData; dir: string }) {
  const params = useParams({ from: '/mtr/$line/$dir' })
  const navigate = useNavigate({ from: '/mtr/$line/$dir' })
  const line = params.line.toUpperCase() as MtrLine

  return (
    <div className="sticky top-0 z-20 w-full bg-background">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-1 py-1">
        <div className="mr-1 flex items-center gap-1.5">
          <div className={cn('h-9 w-3', mtrLineBg[line])}></div>
          <span className="text-3xl font-medium sm:text-4xl">{mtrLineName['zh-hant'][line]}</span>
        </div>
        <div className="flex flex-1 items-baseline justify-center text-center">
          <span className="text-3xl sm:text-4xl">
            <span className="mr-0.5 text-lg sm:text-2xl">往</span>
            {getDest({ nowLine, dir: dir as MtrDirection, line })}
          </span>
        </div>
        <SwapBoundButton
          className="shrink-0"
          handleSwapBound={() =>
            navigate({
              params: { ...params, dir: params.dir === 'DT' ? 'UT' : 'DT' },
              resetScroll: false,
              replace: true,
            })
          }
        />
      </div>
    </div>
  )
}

function getDest({
  nowLine,
  dir,
  line,
}: {
  nowLine: MtrLineData
  dir: MtrDirection
  line: MtrLine
}) {
  const lastStation = nowLine[dir]?.at(-1)

  if (line === 'EAL' && (dir === 'UT' || dir === 'LMC-UT')) {
    const lmcStationName = nowLine['LMC-UT']?.at(-1)?.name_tc
    return `${lastStation?.name_tc} · ${lmcStationName}`
  }

  return lastStation?.name_tc ?? ''
}
