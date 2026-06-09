import { BusRouteList } from '@/components/bus/BusRouteList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bus')({
  component: Bus,
})

function Bus() {
  return (
    <>
      <div className="grid place-content-center p-5">
        <h1 className="text-3xl font-bold">巴士幾時到</h1>
      </div>
      <BusRouteList />
    </>
  )
}
