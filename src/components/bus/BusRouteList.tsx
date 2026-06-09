import { BusRouteCard } from '@/components/bus/BusRouteCard'
import { SearchBar } from '@/components/SearchBar'
import allRoutesData from '@/res/json/all_route_list.json'
import { useState } from 'react'

export function BusRouteList() {
  const [q, setQ] = useState(() => new URL(window.location.href).searchParams.get('q') || '')

  return (
    <div className="mx-auto flex max-w-xl flex-col">
      <div className="my-5">
        <SearchBar q={q} onSearch={setQ} />
      </div>
      <RouteList q={q} />
    </div>
  )
}

function RouteList({ q }: { q: string }) {
  const routes =
    !q.trim() || /^[^0-9a-zA-Z]+$/g.test(q)
      ? []
      : allRoutesData.data.filter((i) => i.route.toLowerCase().includes(q.toLowerCase()))

  if (!q) {
    return (
      <div className="grid flex-1 place-content-center">
        <span className="text-muted-foreground">請輸入路線</span>
      </div>
    )
  }

  if (routes.length === 0) {
    return (
      <div className="grid flex-1 place-content-center">
        <span className="text-destructive">搵唔到您輸入的路線</span>
      </div>
    )
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
