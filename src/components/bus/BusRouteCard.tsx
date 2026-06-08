import { getBusCompanyCode, getBusCompanyName } from '@/features/bus/utils'
import { Badge, Text, cn } from '@cloudflare/kumo'
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
  const coName = getBusCompanyName(operator, route)
  const coCode = getBusCompanyCode(operator, route)

  return (
    <div className="border-kumo-fill flex flex-row items-center justify-between space-x-2 rounded-md border p-1">
      <div className="w-20 text-center text-3xl font-bold">{route}</div>
      <div className="flex flex-1 items-start">
        <div className="flex flex-col">
          <Badge
            className={cn(
              coCode === 'CTB' && 'bg-ctb text-black',
              coCode === 'KMB' && 'bg-kmb text-white',
              coCode === 'LWB' && 'bg-lwb text-white'
            )}
          >
            <span className="font-medium">{coName}</span>
          </Badge>
          <span className="text-3xl font-semibold">{destination}</span>
          {serviceType !== '1' ? <Text variant="secondary"> 特別班</Text> : ''}
        </div>
      </div>
      <ArrowRightIcon />
    </div>
  )
}
