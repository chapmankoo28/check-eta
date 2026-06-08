import { BusRouteCard } from '@/components/BusRouteCard'
import { SearchBar } from '@/components/SearchBar'
import allRoutesData from '@/res/json/all_route_list.json'
import { useState } from 'react'

export function BusRouteList({ q: initialQ }: { q: string }) {
  const [q, setQ] = useState(initialQ)

  return (
    <div>
      <SearchBar q={q} onSearch={setQ} />
      <RouteList q={q} />
    </div>
  )
}

function RouteList({ q }: { q: string }) {
  const routes =
    !q.trim() || /^[^0-9a-zA-Z]+$/g.test(q)
      ? []
      : allRoutesData.data.filter((i) => i.route.toLowerCase().includes(q))

  if (!q) {
    return <div>請輸入路線</div>
  }

  if (routes.length === 0) {
    return <div>搵唔到您輸入的路線</div>
  }

  return (
    <div className="flex flex-col gap-2">
      {routes.map((i) => (
        <BusRouteCard
          key={`${i.co}-${i.route}-${i.bound}-${i.service_type}`}
          route={i.route}
          operator={i.co}
          destination={i.dest_tc}
          bound={i.bound}
          serviceType={i.service_type}
        />
      ))}
    </div>
  )
}
