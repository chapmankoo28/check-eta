import { SwapBoundButton } from '@/components/SwapBoundButton'
import { buttonVariants } from '@/components/ui/button'
import type { BusCo, RouteListEntry } from '@/features/bus/types'
import { busCoBg, getBusCompanyCode } from '@/features/bus/utils'
import { cn } from '@/lib/utils'
import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function NowRouteInfo({ co, nowRoute }: { co: BusCo; nowRoute: RouteListEntry }) {
  const params = useParams({ from: '/bus/$co/$route/$bound/$service' })
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })
  const coCode = getBusCompanyCode(co, nowRoute.route)
  const coWebsites = {
    KMB: `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=${nowRoute.route}`,
    LWB: `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=${nowRoute.route}`,
    CTB: `https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=${nowRoute.route}`,
  }

  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-background">
        <div className="mx-auto flex w-full max-w-xl flex-row place-items-baseline justify-between gap-5 py-2">
          <div className="flex flex-row place-items-baseline gap-2">
            <div className={cn('h-10 w-3', busCoBg[coCode])}></div>
            <span className="text-5xl font-medium">{nowRoute.route}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-row place-items-baseline gap-2">
            <span className="text-lg">往</span>
            <span className="text-3xl">{nowRoute.dest_tc}</span>
          </div>
          <SwapBoundButton
            className="shrink-0 self-center"
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
        href={coWebsites[co]}
        className={cn(buttonVariants({ variant: 'link', size: 'xs' }), 'my-2')}
        rel="noreferrer"
      >
        按此查詢巴士公司網站之資料
        <ArrowSquareOutIcon size={10} />
      </a>
    </>
  )
}
