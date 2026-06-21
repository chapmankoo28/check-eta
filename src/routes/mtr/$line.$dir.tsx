import { Loading } from '@/components/Loading'
import { MetroEta } from '@/components/metro/MetroEta'
import MetroRouteInfo from '@/components/metro/MetroLineInfo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getMetroEtaQueryOptions } from '@/features/metro/hooks'
import type { MtrDirection, MtrLine, MtrLineData } from '@/features/metro/types'
import { getDest, getStations, mtrLine, mtrLineName } from '@/features/metro/utils'
import { scrollToElement } from '@/lib/utils'
import allMtrData from '@/res/json/mtr_lines_and_stations.json'
import { QuestionMarkIcon } from '@phosphor-icons/react'
import { SubwayIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { useMemo, useRef } from 'react'
import z from 'zod'

export const Route = createFileRoute('/mtr/$line/$dir')({
  validateSearch: z.object({
    station: z.coerce.string().optional(),
  }),
  loader: async ({ params, context: { queryClient } }) => {
    const { line: lineParams, dir: dirParams } = params
    const line = mtrLine[lineParams.toUpperCase() as MtrLine]
    const dir = dirParams.toUpperCase() as MtrDirection
    if (!line) {
      return { line, dir }
    }
    const nowLine = allMtrData.data[line] as MtrLineData | undefined
    const lineName = mtrLineName['zh-hant'][line]
    const dest = nowLine ? getDest({ nowLine, dir, line }) : ''

    const stationList = getStations({ line, dir })
    stationList.map((s) => queryClient.ensureQueryData(getMetroEtaQueryOptions(line, s.code)))

    return { line, dir, lineName, dest }
  },
  pendingComponent: () => <Loading />,
  pendingMs: 0,
  component: RouteComponent,
  head: ({ loaderData }) => {
    if (loaderData?.lineName && loaderData?.dest) {
      return {
        meta: [{ title: `${loaderData.lineName} 往 ${loaderData.dest} | 幾時到` }],
      }
    }
    return {}
  },
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate({ from: '/mtr/$line/$dir' })
  const canGoBack = useCanGoBack()

  const { line, dir, lineName, dest } = Route.useLoaderData()
  const { station } = Route.useSearch()

  const nowLine = useMemo(() => {
    const found = allMtrData.data[line]
    return found ? (found as MtrLineData) : null
  }, [line])

  const stations = useMemo(() => {
    return getStations({ line, dir })
  }, [line, dir])

  // Scrolls to the stop element only when:
  // 1. A stop is already in the URL on first page load
  // 2. The closest stop was auto-detected
  // Clicking an accordion item does NOT trigger scroll.
  const shouldScroll = useRef(Boolean(station))

  if (station && shouldScroll.current) {
    shouldScroll.current = false
    scrollToElement(station)
  }

  if (!nowLine || !lineName) {
    return (
      <div className="flex flex-col items-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <SubwayIcon className="size-8" />
              <QuestionMarkIcon className="size-8" />
            </EmptyMedia>
            <EmptyTitle>搵唔到呢條線</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              aria-label="Back to MTR page"
              onClick={() => {
                if (canGoBack) {
                  router.history.back()
                } else {
                  navigate({ to: '/mtr' })
                }
              }}
            >
              返回
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (!stations || stations.length === 0) {
    return (
      <div>
        <MetroRouteInfo line={line} lineName={lineName} dest={dest ?? ''} />
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <SubwayIcon className="size-8" />
              <QuestionMarkIcon className="size-8" />
            </EmptyMedia>
            <EmptyTitle>搵唔到地鐡站，試下調轉方向</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <MetroRouteInfo line={line} lineName={lineName} dest={dest ?? ''} />
      <Accordion
        className="mt-5 max-w-xl rounded-lg border"
        value={station ? [station] : []}
        onValueChange={(v) =>
          navigate({
            search: (prev) => (v.length ? { ...prev, station: v[0] } : {}),
            resetScroll: false,
            replace: true,
          })
        }
      >
        {stations.map((i) => (
          <AccordionItem
            key={`${line}-${dir}-${i.code}`}
            id={i.code}
            value={i.code}
            className="relative border-b px-4 last:border-b-0"
          >
            <AccordionTrigger className="flex items-center gap-2 text-lg font-normal hover:no-underline">
              <div className="relative z-10 grid size-8 shrink-0 place-content-center rounded-full border bg-background font-medium">
                {i.seq}
              </div>
              <div className="flex-1">{i.name_tc ?? `搵唔到 ID 為「${i.code}」的地鐡站`}</div>
            </AccordionTrigger>
            <AccordionContent>
              <MetroEta line={line} dir={dir} station={i} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
