import { IconOpenInNew } from '@/components/icon/icon-open-in-new';
import { IconSwap } from '@/components/icon/icon-swap';
import { Flex, Heading, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';
import './nowRouteInfo.css';

export default function NowRouteInfo({ co, route, nowRoute, setSearchParams }) {
  const [rotate, setRotate] = useState(false);

  const handleSwapBound = () => {
    setSearchParams(
      (prev) => {
        prev.set('bound', prev.get('bound') === 'O' ? 'I' : 'O');
        return prev;
      },
      { replace: true }
    );
    setRotate(true);
    setTimeout(() => {
      // The timeout should match the animation duration
      setRotate(false);
    }, 500);
  };

  return (
    <>
      {Object.keys(nowRoute).length !== 0 ? (
        <>
          <Flex direction="row" align="center" justify="center" gap="5" className="now-route-info">
            <Heading id="now-route-num">{nowRoute.route}</Heading>
            <div>
              <Heading id="now-route-dest">{nowRoute.dest_tc}</Heading>
            </div>

            <Tooltip content="調轉方向">
              <button onClick={handleSwapBound}>
                <IconSwap status={rotate ? 'loading' : ''} />
              </button>
            </Tooltip>
          </Flex>
          <a
            target="_blank"
            href={
              co === 'KMB'
                ? 'https://search.kmb.hk/KMBWebSite/?action=routesearch&route=' + route
                : 'https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=' + route
            }
            rel="noreferrer"
          >
            <div className="info-link">
              按此查詢巴士公司網站之資料
              <IconOpenInNew size={20} color="#ffffff" />
            </div>
          </a>
        </>
      ) : (
        <>
          <Heading id="now-route-dest">搵唔到呢條線……</Heading>
        </>
      )}
    </>
  );
}
