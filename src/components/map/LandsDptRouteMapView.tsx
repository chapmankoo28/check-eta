import { useEffect, useRef } from "react";
import { BusStopIcon, CtbBusStopIcon, KmbBusStopIcon } from "@/assets/icons";
import { UserPositionMarker } from "@/components/map/UserPositionMarker";
import { useLandsDStyle } from "@/components/map/use-lands-dpt-style";
import {
  MapControls,
  MapMarker,
  Map as MapView,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { Spinner } from "@/components/ui/spinner";
import type { BusCo } from "@/features/bus/types";
import { busCo } from "@/features/bus/utils";
import type { MapLocation } from "@/lib/types";

type Marker = MapLocation & { id: string; name: string };

function MapFocusController({ stopId, center }: { stopId?: string; center: MapLocation }) {
  const { map, isLoaded } = useMap();
  const isInitialMount = useRef(true);
  const prevStopId = useRef(stopId);

  useEffect(() => {
    if (!isLoaded || !map) {
      return;
    }

    if (isInitialMount.current) {
      map.flyTo({ center: [center.long, center.lat], duration: 1000 });
      isInitialMount.current = false;
      prevStopId.current = stopId;
      return;
    }

    if (prevStopId.current === stopId) {
      return;
    }

    prevStopId.current = stopId;

    if (!stopId) {
      return;
    }

    map.flyTo({ center: [center.long, center.lat], duration: 1000 });
  }, [map, isLoaded, stopId, center]);

  return null;
}

export function LandsDptRouteMapView({
  center,
  markers,
  stopId,
  co,
  userLocation,
  onLocate,
}: {
  center: MapLocation;
  markers: Marker[];
  stopId?: string;
  co: BusCo;
  userLocation?: MapLocation | null;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
}) {
  const { data: style, isLoading } = useLandsDStyle();
  const markerOffset = 32 + 5;
  const { lat, long } = center;

  if (isLoading || !style) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-md">
      <MapView
        center={[long, lat]}
        zoom={16}
        minZoom={9}
        maxZoom={19}
        styles={{ light: style, dark: style }}
      >
        <MapFocusController stopId={stopId} center={center} />
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
              {co === busCo.ctb ? (
                <CtbBusStopIcon />
              ) : co === busCo.kmb ? (
                <KmbBusStopIcon />
              ) : (
                <BusStopIcon className="text-primary" />
              )}
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
  );
}
