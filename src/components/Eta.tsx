import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { getEta } from '@/features/bus/api'
import type { CtbEta, KmbEta } from '@/features/bus/types'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { Fragment, useCallback, useEffect, useState } from 'react'

export default function Eta({
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
  stop: string
}) {
  const [loading, setLoading] = useState(true)
  const [etaData, setEtaData] = useState<(CtbEta | KmbEta)[]>([])

  const now = new Date()
  const hr = now.getHours().toString().padStart(2, '0')
  const min = now.getMinutes().toString().padStart(2, '0')
  const sec = now.getSeconds().toString().padStart(2, '0')
  const time = `${hr}:${min}:${sec}`

  const getFilteredEtaData = useCallback(
    async (isMounted: unknown) => {
      try {
        const data = await getEta(co, route, service, stop)
        if (isMounted) {
          if (!data) {
            setLoading(false)
            return
          }
          const eta = data.filter((i) => i.dir === bound.toUpperCase()) ?? []
          if (eta.length !== 0) {
            setEtaData(eta)
          }
          if (eta.length === 0) {
            setEtaData(
              data.filter((i) => i.dir === (bound.toUpperCase() === 'O' ? 'I' : 'O')) ?? []
            )
          }
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          console.error('ERROR: fetching filtered eta data. Info:', error)
          setLoading(false)
        }
      }
    },
    [bound, co, route, service, stop]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refetch when any of the dependencies change
  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)

    const getFilteredEtaDataWithSignal = async () => {
      try {
        await getFilteredEtaData(abortController.signal)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching data:', error)
        }
      }
    }

    getFilteredEtaDataWithSignal()
    const interval = setInterval(getFilteredEtaDataWithSignal, 60000)

    return () => {
      clearInterval(interval)
      abortController.abort()
    }
  }, [co, route, bound, service, stop, getFilteredEtaData])

  const renderEtaData = () => {
    if (loading) {
      return <Spinner className="size-8" />
    }

    if (etaData.length === 0) {
      return (
        <div className="m-auto text-center">
          <span className="text-lg">查詢唔到班次，請再試一次。</span>
        </div>
      )
    }

    if (etaData.every((i) => !i.eta && !i.rmk_tc)) {
      return (
        <div className="m-auto text-center">
          <span className="text-lg">暫無班次</span>
        </div>
      )
    }

    let hasShownNoSchedule = false

    return etaData.map((i) => {
      if (!i.eta && i.rmk_tc) {
        return (
          <div key={`rmk-${i.seq}`} className="m-auto text-center">
            <span className="text-lg">{i.rmk_tc}</span>
          </div>
        )
      } else if (i.eta) {
        const etaInMin = Math.ceil((new Date(i.eta).getTime() - now.getTime()) / 1000 / 60)
        return (
          <Fragment key={`eta-${i.seq}-${i.eta_seq}`}>
            <Separator key={`separator-${i.seq}-${i.eta_seq}`} />
            <div
              key={`eta_flex-${i.seq}`}
              className="flex flex-row items-center justify-between gap-3"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-baseline gap-1">
                  <span>往</span>
                  <span className="text-lg">{i.dest_tc}</span>
                </div>
                <span className="text-sm text-muted-foreground">{i.rmk_tc}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="eta-min">
                  <span className="text-2xl font-bold">{etaInMin > 0 ? etaInMin : '即將抵達'}</span>
                </span>
                {etaInMin > 0 && <span>分鐘</span>}
              </div>
            </div>
          </Fragment>
        )
      } else if (!hasShownNoSchedule) {
        hasShownNoSchedule = true
        return (
          <div key="no-schedule" className="m-auto text-center">
            <span className="text-lg">暫無班次</span>
          </div>
        )
      }

      return null
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-5 mb-1 flex items-center justify-between gap-2">
        <span>最後更新時間：{time}</span>

        <Button variant="outline" onClick={() => getFilteredEtaData({})}>
          <ArrowsClockwiseIcon data-icon="inline-start" />
          更新
        </Button>
      </div>

      <div className="flex flex-col justify-center gap-2">{renderEtaData()}</div>
    </div>
  )
}
