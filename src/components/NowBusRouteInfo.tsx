import { Button } from '@/components/ui/button'
import { ArrowsDownUpIcon, ArrowSquareOutIcon } from '@phosphor-icons/react'
import { useState } from 'react'

export default function NowRouteInfo({ co, route, nowRoute, setSearchParams }) {
  const [rotate, setRotate] = useState(false)

  const handleSwapBound = () => {
    setRotate(true)
    const url = new URL(window.location.href)
    const currentBound = url.searchParams.get('bound')
    url.searchParams.set('bound', currentBound === 'O' ? 'I' : 'O')
    window.history.replaceState({}, '', url)
    setRotate(false)
  }

  return (
    <>
      {Object.keys(nowRoute).length !== 0 ? (
        <>
          <div className="flex flex-row items-center justify-center gap-5">
            <span>{nowRoute.route}</span>
            <div>
              <span>{nowRoute.dest_tc}</span>
            </div>

            <Button variant="outline" onClick={handleSwapBound}>
              <ArrowsDownUpIcon
                className={rotate ? 'animate-rotate' : ''}
                data-icon="inline-start"
              />{' '}
              調轉方向
            </Button>
          </div>
          <a
            target="_blank"
            href={
              co === 'KMB'
                ? `https://search.kmb.hk/KMBWebSite/?action=routesearch&route=${route}`
                : `https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=${route}`
            }
            rel="noreferrer"
          >
            <div>
              按此查詢巴士公司網站之資料
              <ArrowSquareOutIcon size={20} color="#ffffff" />
            </div>
          </a>
        </>
      ) : (
        <span>搵唔到呢條線……</span>
      )}
    </>
  )
}
