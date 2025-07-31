import Bus from '@/app/bus/bus.jsx';
import Metro from '@/app/metro/metro.jsx';
import NotFound from '@/app/notFound/notFound.jsx';
import Banner from '@/components/banner/banner.jsx';
import { useSearchParams } from 'react-router-dom';
import './layout.css';

export default function Layout() {
  const [searchParams, setSearchParams] = useSearchParams({ type: 'bus' });
  const type = searchParams.get('type').trim() ?? '';

  switch (type) {
    case 'bus':
      return (
        <>
          <Banner type={type} setSearchParams={setSearchParams} />
          <Bus />
        </>
      );
    case 'metro':
      return (
        <>
          <Banner type={type} setSearchParams={setSearchParams} />
          <Metro />
        </>
      );
    default:
      return (
        <>
          <Banner type={type} setSearchParams={setSearchParams} />
          <NotFound />
        </>
      );
  }
}
