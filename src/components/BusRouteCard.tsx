import { getBusCompanyInfo } from '@/features/bus/utils'
import { ArrowRightIcon } from '@phosphor-icons/react'

export function BusRouteCard({
  route,
  operator,
  destination,
  bound,
  serviceType,
}: {
  route: string
  operator: string
  destination: string
  bound: string
  serviceType?: string
}) {
  const op = getBusCompanyInfo(operator, route).name_tc
  // className={`bus-co-color ${getBusCompanyInfo(i.co, i.route).code.toLowerCase()}`}
  const st = serviceType !== '1' ? '特別班' : ''

  return (
    <div className="border-kumo-contrast flex flex-row items-center justify-between space-x-2 rounded-md border">
      <div>{route}</div>
      <div className="flex flex-1 flex-col items-start">
        <div>
          {op}
          {destination}
          {st}
        </div>
      </div>
      <ArrowRightIcon />
    </div>
  )
}
