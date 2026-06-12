import { busCoBg, getBusCompanyCode } from '@/features/bus/utils'
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
  const coCode = getBusCompanyCode(operator, route)

  return (
    <Link
      to="/bus/$co/$route/$bound/$service"
      params={{ co: operator, route, bound, service: serviceType ?? '1' }}
    >
      <div className="flex flex-row items-center justify-between rounded-md border p-1 hover:bg-accent">
        <div className="flex w-35 items-baseline gap-1">
          <div className={cn('h-9 w-3', busCoBg[coCode])}></div>
          <span className="text-5xl font-medium">{route}</span>
        </div>
        <div className="flex flex-1 flex-col items-start">
          <span className="text-2xl">{destination}</span>
          {serviceType !== '1' ? <span className="text-sm text-muted-foreground">特別班</span> : ''}
        </div>
        <ArrowRightIcon className="size-6" />
      </div>
    </Link>
  )
}
