import { IconRefresh } from '@/components/icon/icon-refresh';
import Loading from '@/components/loading/loading';
import apiConfig from '@/res/json/api_config.json';
import { Flex, Heading, Separator, Text, Tooltip } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

export default function ETA({ line, dir, station, now_line: nowLine }) {
  const [loading, setLoading] = useState(true);
  const [etaData, setEtaData] = useState([]);
  const [error, setError] = useState(false);

  const now = new Date();
  const hr = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const sec = now.getSeconds().toString().padStart(2, '0');
  const time = `${hr}:${min}:${sec}`;

  const getEta = async (line, station) => {
    if (!line || !station) return {};
    try {
      const api =
        apiConfig.data.find((i) => {
          return i.co.toUpperCase() === 'MTR';
        }) ?? {};

      const url = `${api['base_url']}${api['api']['line']}${line}&${api['api']['sta']}${station}&${api['api']['lang']}TC/`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log(result.data[`${line}-${station}`]);
      return result.data[`${line}-${station}`];
    } catch (error) {
      console.error('ERROR: fetching stop data. Info:', error);
      setError(true);
    }
  };

  const getFilteredEtaData = async (isMounted) => {
    const DIR_MAP = { DT: 'DOWN', UT: 'UP' };
    try {
      const data = await getEta(line, station);
      if (isMounted) {
        const eta = data[DIR_MAP[dir]] ?? [];
        setEtaData(eta);
        setLoading(false);
      }
    } catch (error) {
      if (isMounted) {
        console.error('ERROR: fetching filtered eta data. Info:', error);
        setLoading(false);
        setError(true);
      }
    }
  };

  const getStationName = (line, dir, station) => {
    console.log('CALLED get_station_name', line, dir, station);
    if (!line || !dir || !station) return '';
    if (line === 'EAL' && station === 'LMC') {
      const res =
        nowLine['LMC-' + dir].find((i) => {
          return i['Station Code'] === station;
        })['Chinese Name'] ?? 'NOT FOUND';
      return res;
    }

    const res =
      nowLine[dir].find((i) => {
        return i['Station Code'] === station;
      })['Chinese Name'] ?? 'NOT FOUND';

    return res;
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getFilteredEtaData(isMounted);
    const interval = setInterval(() => getFilteredEtaData(isMounted), 30000);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [line, dir, station]);

  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" justify="between" align="center" mt="5" mb="1">
        <Text>最後更新時間：{time} </Text>
        <Tooltip content="更新">
          <button onClick={getFilteredEtaData}>
            <IconRefresh state={loading ? 'loading' : 'done'} />
          </button>
        </Tooltip>
      </Flex>

      <Flex direction="column" gap="2" justify="center">
        {loading ? (
          <Loading />
        ) : etaData.length > 0 ? (
          etaData.map((i, count) => {
            return (
              <>
                <Separator key={'separator' + count + i.seq} orientation="horizontal" size="4" />
                <Flex
                  key={'eta' + count + i.seq}
                  direction="row"
                  gap="3"
                  justify="between"
                  align="center"
                >
                  <Flex direction="column" gap="1" align="start">
                    <Flex gap="1" align="baseline">
                      <Text size="2">往</Text>
                      <Text size="5">
                        {getStationName(line, dir, i.dest)}
                        {i.route === 'RAC' ? ' 經馬場' : ''}
                      </Text>
                    </Flex>
                    <Text size="2" color="gray">
                      {i.plat}號月台
                    </Text>
                  </Flex>
                  <Flex gap="2" align="baseline">
                    <Text size="7" className="eta-min">
                      {i.ttnt > 1
                        ? i.ttnt
                        : line === 'EAL'
                          ? i.timeType === 'A'
                            ? '即將抵達'
                            : '正在離開'
                          : '即將抵達'}
                    </Text>
                    {i.ttnt > 1 && <Text>分鐘</Text>}
                  </Flex>
                </Flex>
              </>
            );
          })
        ) : (
          <Heading size="5" weight="light" mt="5" mb="5" m="auto" align="center">
            {error ? '查詢唔到班次，請再試一次' : '暫無班次'}
          </Heading>
        )}
      </Flex>
    </Flex>
  );
}
