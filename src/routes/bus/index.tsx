import { createFileRoute } from '@tanstack/react-router';
import { BusRouteList } from '@/components/bus/BusRouteList';
import { pageHead } from '@/lib/seo';

export const Route = createFileRoute('/bus/')({
  component: Bus,
  head: () =>
    pageHead({
      title: '巴士',
      description: '搜尋香港巴士路線：查閱九巴、城巴同龍運嘅實時到站時間。',
      path: '/bus',
    }),
});

function Bus() {
  return (
    <>
      <div className="grid place-content-center p-5">
        <h1 className="font-bold text-3xl">巴士幾時到</h1>
      </div>
      <BusRouteList />
    </>
  );
}
