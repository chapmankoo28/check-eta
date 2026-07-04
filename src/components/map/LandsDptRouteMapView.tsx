import { BusStopIcon } from '@/assets/icons'
import { UserPositionMarker } from '@/components/map/UserPositionMarker'
import {
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map'
import type { BusCo } from '@/features/bus/types'
import { busCoTextColor } from '@/features/bus/utils'
import type { MapLocation } from '@/lib/types'
import { cn } from '@/lib/utils'
import { landsdStyle } from './landsd-basemap-style'

type Marker = MapLocation & { id: string; name: string }

export function LandsDptRouteMapView({
  center,
  markers,
  stopId,
  co,
  userLocation,
  onLocate,
}: {
  center: MapLocation
  markers: Marker[]
  stopId: string
  co: BusCo
  userLocation?: MapLocation | null
  onLocate?: (coords: { longitude: number; latitude: number }) => void
}) {
  const markerOffset = 32 + 5
  const { lat, long } = center

  return (
    <div className="relative h-[300px] w-full">
      <MapView
        center={[long, lat]}
        zoom={16}
        minZoom={9}
        maxZoom={18}
        styles={{ light: landsdStyle, dark: landsdStyle }}
      >
        <MapControls position="top-right" showZoom showCompass showLocate onLocate={onLocate} />
        {userLocation && (
          <MapMarker longitude={userLocation.long} latitude={userLocation.lat} anchor="center">
            <MarkerContent>
              <UserPositionMarker />
            </MarkerContent>
          </MapMarker>
        )}
        {markers.map((m) => (
          <MapMarker key={m.id} longitude={m.long} latitude={m.lat} anchor="bottom">
            <MarkerContent>
              <BusStopIcon className={cn(busCoTextColor[co])} />
            </MarkerContent>
            <MarkerPopup offset={markerOffset} className="p-1" defaultOpen={m.id === stopId}>
              <p className="text-base text-foreground">{m.name}</p>
            </MarkerPopup>
          </MapMarker>
        ))}
        <a
          href="https://api.portal.hkmapservice.gov.hk/disclaimer"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-2 z-10 flex items-center"
        >
          <img
            src="https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg"
            alt="Lands Department logo"
            width={20}
            height={20}
          />
        </a>
      </MapView>
    </div>
  )
}
