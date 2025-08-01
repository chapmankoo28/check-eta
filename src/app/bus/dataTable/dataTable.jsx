import { IconArrow } from '@/components/icon/icon-arrow';
import { getBusCompanyInfo } from '@/features/bus/utils';
import allRoutesData from '@/res/json/all_route_list.json';
import { Card, Flex, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import './dataTable.css';

const filteredRoutes = (q) => {
  const Q_ROUTE_REGEX = /^[^0-9a-zA-Z]+$/g;
  
  if (q.trim().length === 0 || Q_ROUTE_REGEX.test(q)) return [];
  return allRoutesData['data'].filter((i) => {
    return i.route.toLowerCase().includes(q);
  });
};

export default function DataTable({ q, setSearchParams }) {
  const query = q.toLowerCase();
  const routes = useMemo(() => {
    return filteredRoutes(query);
  }, [query]);

  return (
    <>
      {routes.length > 0 ? (
        <>
          <Flex direction="column" gap="3" align="center">
            {routes.map((i) => (
              <Card
                className="bus-data-card"
                key={`route-${i.co}-${i.route}-${i.bound}-${i.service_type}`}
                onClick={() => {
                  setSearchParams(
                    {
                      type: 'bus',
                      co: i.co,
                      route: i.route,
                      bound: i.bound,
                      service: i.service_type
                    },
                    { replace: false }
                  );
                }}
              >
                <Flex direction="row" gap="1" align="center" justify="between">
                  <Text
                    as="div"
                    className="data-card-route-num"
                    size="8"
                    weight={700}
                    style={{ width: '80px' }}
                  >
                    {i.route}
                  </Text>
                  <Flex
                    mr="auto"
                    direction="column"
                    align="start"
                    style={{ flexGrow: 1, minWidth: 0 }}
                  >
                    <Text
                      className={
                        'bus-co-color ' + getBusCompanyInfo(i.co, i.route)['code'].toLowerCase()
                      }
                    >
                      {getBusCompanyInfo(i.co, i.route)['name_tc']}
                    </Text>
                    <Text as="div">
                      <Flex gap="1" align="baseline">
                        <Text>往</Text>
                        <Text size="5" truncate>
                          {i.dest_tc}
                        </Text>
                      </Flex>
                    </Text>
                    <Text as="div" size="2" color="gray">
                      {i.service_type !== '1' ? '特別班' : ''}
                    </Text>
                  </Flex>

                  <IconArrow size={32} />
                </Flex>
              </Card>
            ))}
          </Flex>
        </>
      ) : (
        <Text size="7" align="center">
          {query.length !== 0 ? '搵唔到您輸入的路線' : '請輸入路線'}
        </Text>
      )}
    </>
  );
}
