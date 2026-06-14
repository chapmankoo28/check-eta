import { MetroLineCard } from '@/components/metro/MetroLineCard'
import type { LineListEntry, MtrLine } from '@/features/metro/types'
import { mtrLineName } from '@/features/metro/utils'
import allMtrData from '@/res/json/mtr_lines_and_stations.json'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mtr/')({
  component: Mtr,
})

function Mtr() {
  const lines: LineListEntry[] = allMtrData.data.map((i) => ({
    line: i['Line Code'] as MtrLine,
    name_tc: i['Chinese Name'],
    name_en: mtrLineName[i['Line Code'] as MtrLine],
  }))

  return (
    <>
      <div className="grid place-content-center p-5">
        <h1 className="text-3xl font-bold">鐡路幾時到</h1>
      </div>
      <div className="mx-auto flex max-w-xl flex-col gap-2 px-5">
        {lines.map((i) => (
          <MetroLineCard key={i.line} line={i.line} name={i.name_tc} />
        ))}
      </div>
    </>
  )
}
