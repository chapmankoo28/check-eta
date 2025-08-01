import { IconArrow } from '@/components/icon/icon-arrow';
import mtrLinesAndStations from '@/res/json/mtr_lines_and_stations.json';
import { Card, Flex, Text } from '@radix-ui/themes';
import './dataTable.css';

const lines = mtrLinesAndStations.data;

export default function DataTable({ setSearchParams }) {
  return (
    <>
      <Flex direction="column" gap="3" align="center">
        {lines.map((i) => {
          return (
            <Card
              key={`Line-${i['Line Code']}`}
              className="metro-data-card"
              onClick={() => {
                setSearchParams(
                  { type: 'metro', line: i['Line Code'], dir: 'DT', station: '' },
                  { replace: false }
                );
              }}
            >
              <Flex gap="1" justify="between" align="center">
                <div className={'mtr-line-color ' + i['Line Code'].toLowerCase()} />
                <Text size="6">{i['Chinese Name']}</Text>
                <IconArrow size={32} />
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </>
  );
}
