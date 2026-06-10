import { Button, buttonVariants } from '@/components/ui/button'
import type { BusCo, RouteListEntry } from '@/features/bus/types'
import { cn } from '@/lib/utils'
import { ArrowsDownUpIcon, ArrowSquareOutIcon } from '@phosphor-icons/react'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function NowRouteInfo({ co, nowRoute }: { co: BusCo; nowRoute: RouteListEntry }) {
  const params = useParams({ from: '/bus/$co/$route/$bound/$service' })
  const navigate = useNavigate({ from: '/bus/$co/$route/$bound/$service' })

  const handleSwapBound = () => {
    navigate({ params: { ...params, bound: params.bound === 'O' ? 'I' : 'O' } })
  }

  const coWebsites = {
    KMB: `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=${nowRoute.route}`,
    CTB: `https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=${nowRoute.route}`,
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-5">
        <span>{nowRoute.route}</span>
        <span>{nowRoute.dest_tc}</span>

        <Button variant="secondary" onClick={handleSwapBound}>
          <ArrowsDownUpIcon className={'text-foreground'} data-icon="inline-start" />
          調轉方向
        </Button>
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
    </div>
  )
}
