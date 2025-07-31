import { IconChevron } from '@/components/icon/icon-chevron';
import mtrLinesAndStations from '@/res/json/mtr_lines_and_stations.json';
import * as Accordion from '@radix-ui/react-accordion';
import * as Avatar from '@radix-ui/react-avatar';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useEffect, useMemo } from 'react';
import ETA from './eta/eta';
import './line.css';
import NowLineInfo from './nowLineInfo';

export default function Line({ line, dir, station, setSearchParams }) {
  const nowLine = useMemo(
    () =>
      mtrLinesAndStations.data.find((i) => {
        return i['Line Code'] === line;
      }) ?? {},
    [line]
  );

  useEffect(() => {
    console.log('now_line', nowLine);
  }, [nowLine]);

  return (
    <>
      <Flex direction="column" align="center" gap="3">
        <NowLineInfo
          line={line}
          dir={dir}
          station={station}
          now_line={nowLine}
          setSearchParams={setSearchParams}
        />

        <Accordion.Root type="single" className="AccordionRoot" defaultValue={station}>
          <Flex mt="5" direction="column" gap="3" justify="center">
            {nowLine[dir].map((i, count) => (
              <Accordion.Item
                id={i['Station Code']}
                className="AccordionItem"
                value={i['Station Code']}
                key={'stop' + i['Station Code'] + count}
              >
                <Card
                  className="AccordionCard"
                  key={'stop' + i['Station Code'] + count}
                  onClick={() => {
                    setSearchParams(
                      { type: 'metro', line: i['Line Code'], dir: dir, station: i['Station Code'] },
                      { replace: true }
                    );
                  }}
                >
                  <Accordion.Header className="AccordionHeader">
                    <Accordion.Trigger className="AccordionTrigger">
                      <Flex
                        direction="row"
                        gap="3"
                        className="AccordionTriggerContent"
                        align="center"
                        justify="between"
                      >
                        <Avatar.Root
                          className={'AvatarRoot stop-seq ' + nowLine['Line Code'].toLowerCase()}
                        >
                          <Avatar.Fallback className="AvatarFallback">
                            <Text size="7">{i['Sequence']}</Text>
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <Text size="5" align="left" mr="auto">
                          {i['Chinese Name']}
                        </Text>

                        <IconChevron rotate={station === i['Station Code'] ? 270 : 90} />
                      </Flex>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="AccordionContent">
                    {line === 'DRL' ? (
                      <Heading size="5" weight="light" mt="5" mb="5" m="auto" align="center">
                        迪士尼線暫無ETA
                      </Heading>
                    ) : (
                      <ETA line={line} dir={dir} station={i['Station Code']} now_line={nowLine} />
                    )}
                  </Accordion.Content>
                </Card>
              </Accordion.Item>
            ))}
          </Flex>
        </Accordion.Root>
      </Flex>
    </>
  );
}
