import type { ComponentProps } from 'react';
import { lazy, Suspense } from 'react';
import type { LandsDptRouteMapView } from '@/components/map/LandsDptRouteMapView';
import { Spinner } from '@/components/ui/spinner';

const LazyMap = lazy(() =>
  import('@/components/map/LandsDptRouteMapView').then((m) => ({
    default: m.LandsDptRouteMapView,
  })),
);

export function LandsDptRouteMapViewLazy(props: ComponentProps<typeof LandsDptRouteMapView>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[300px] w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <LazyMap {...props} />
    </Suspense>
  );
}
