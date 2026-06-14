import { SwapBoundButton } from '@/components/SwapBoundButton'
import { buttonVariants } from '@/components/ui/button'
import type { BusCo, RouteListEntry } from '@/features/bus/types'
import { busCoBg, coWebsites, getBusCompanyCode } from '@/features/bus/utils'
import { cn } from '@/lib/utils'
import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function NowRouteInfo({ co, nowRoute }: { co: BusCo; nowRoute: RouteListEntry }) {
  const params = useParams({ from: '/bus/$co/$route/$bound/$service' })
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })

  const coCode = getBusCompanyCode(co, nowRoute.route)

  return (
    <>
      <div className="sticky top-0 z-20 w-full bg-background">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-1 py-1">
          <div className="mr-1 flex place-items-baseline gap-1.5">
            <div className={cn('h-9 w-3', busCoBg[coCode])}></div>
            <span className="text-5xl font-medium">{nowRoute.route}</span>
          </div>
          <span className="flex-1 text-center text-2xl">{nowRoute.dest_tc}</span>
          <SwapBoundButton
            className="shrink-0"
            handleSwapBound={() =>
              navigate({
                params: { ...params, bound: params.bound === 'O' ? 'I' : 'O' },
                resetScroll: false,
                replace: true,
              })
            }
          />
        </div>
      </div>
      <a
        target="_blank"
        href={`${coWebsites[co]}${nowRoute.route}`}
        className={cn(buttonVariants({ variant: 'link', size: 'xs' }), 'my-2')}
        rel="noreferrer"
      >
        按此查詢巴士公司網站之資料
        <ArrowSquareOutIcon size={10} />
      </a>
    </>
  )
}
