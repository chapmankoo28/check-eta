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
import type { MtrDirection, MtrLine, MtrLineData } from '@/features/metro/types'
import { mtrLine } from '@/features/metro/utils'
import allMtrData from '@/res/json/mtr_lines_and_stations.json'
import { QuestionMarkIcon } from '@phosphor-icons/react'
import { SubwayIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'
import z from 'zod'

export const Route = createFileRoute('/mtr/$line/$dir')({
  validateSearch: z.object({
    station: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate({ from: '/mtr/$line/$dir' })
  const canGoBack = useCanGoBack()

  const { line: lineParams, dir: dirParams } = Route.useParams()
  const { station: stationParams } = Route.useSearch()
  const line = mtrLine[lineParams.toUpperCase() as MtrLine]
  const dir = dirParams.toUpperCase() as MtrDirection
  const station = stationParams?.toUpperCase()

  const nowLine = useMemo(() => {
    const found = allMtrData.data[line]
    return found ? (found as MtrLineData) : null
  }, [line])

  const stations = useMemo(() => {
    const found = allMtrData.data[line] as MtrLineData | undefined
    if (!found) {
      return []
    }
    const dirData = found[dir as MtrDirection]
    return Array.isArray(dirData) ? dirData : []
  }, [line, dir])

  if (!nowLine) {
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
        <MetroRouteInfo nowLine={nowLine} dir={dir} />
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
      <MetroRouteInfo nowLine={nowLine} dir={dir} />
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
              {line === 'DRL' ? (
                <div className="text-center">
                  <span className="text-lg text-secondary-foreground">迪士尼線暫無ETA</span>
                </div>
              ) : (
                <MetroEta line={line} dir={dir} station={i} />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
