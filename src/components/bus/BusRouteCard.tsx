import { busCoBg, getBusCompanyCode, getBusCompanyName } from '@/features/bus/utils'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

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
  const coName = getBusCompanyName(operator, route)
  const coCode = getBusCompanyCode(operator, route)

  return (
    <Link
      to="/bus/$co/$route/$bound/$service"
      params={{ co: operator, route, bound, service: serviceType ?? '1' }}
    >
      <div className="flex flex-row items-center justify-between space-x-2 rounded-md border p-1 hover:bg-accent">
        <div className="w-20 text-center text-3xl font-bold">{route}</div>
        <div className="flex flex-1 items-start">
          <div className="flex flex-col">
            <div
              className={cn('h-fit w-fit rounded-full px-1 text-sm font-medium', busCoBg[coCode])}
            >
              {coName}
            </div>
            <span className="text-2xl font-semibold">{destination}</span>
            {serviceType !== '1' ? <span className="text-muted-foreground">特別班</span> : ''}
          </div>
        </div>
        <ArrowRightIcon />
      </div>
    </Link>
  )
}
