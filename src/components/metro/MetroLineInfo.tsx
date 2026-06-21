import { SwapBoundButton } from '@/components/SwapBoundButton'
import type { MtrLine } from '@/features/metro/types'
import { mtrLineBg } from '@/features/metro/utils'
import { cn } from '@/lib/utils'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function MetroRouteInfo({
  line,
  lineName,
  dest,
}: {
  line: MtrLine
  lineName: string
  dest: string
}) {
  const params = useParams({ from: '/mtr/$line/$dir' })
  const navigate = useNavigate({ from: '/mtr/$line/$dir' })

  return (
    <div className="sticky top-0 z-20 w-full bg-background">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-1 py-1">
        <div className="mr-1 flex items-center gap-1.5">
          <div className={cn('h-9 w-3', mtrLineBg[line])}></div>
          <span className="text-3xl font-medium sm:text-4xl">{lineName}</span>
        </div>
        <div className="flex flex-1 items-baseline justify-center text-center">
          <span className="text-3xl sm:text-4xl">
            <span className="mr-0.5 text-lg sm:text-2xl">往</span>
            {dest}
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
