import { BusStopIcon } from '@/assets/icons'
import {
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from '@/components/ui/map'
import type { BusCo } from '@/features/bus/types'
import { busCoTextColor } from '@/features/bus/utils'
import { cn } from '@/lib/utils'

export function RouteMapView({
  long,
  lat,
  name,
  co,
}: {
  long: number
  lat: number
  name: string
  co: BusCo
}) {
  return (
    <div className="h-[300px] w-full">
      <MapView center={[long, lat]} zoom={16}>
        <MapControls position="top-right" showZoom showCompass showLocate />
        <MapMarker key={name} longitude={long} latitude={lat} anchor="bottom">
          <MarkerContent>
            <BusStopIcon className={cn(busCoTextColor[co])} />
          </MarkerContent>
          <MarkerTooltip>{name}</MarkerTooltip>
          <MarkerPopup closeOnClick={false}>
            <div className="space-y-1">
              <p className="text-foreground">{name}</p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </MapView>
    </div>
  )
}
