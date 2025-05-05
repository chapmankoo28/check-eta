import React, { useEffect, useMemo } from "react";
import ETA from "./eta/eta";
import * as Accordion from "@radix-ui/react-accordion";
import * as Avatar from "@radix-ui/react-avatar";
import mtr_lines_and_stations from "../../../res/json/mtr_lines_and_stations.json";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import NowLineInfo from "./nowLineInfo";
import "./line.css";

export default function Line({ line, dir, station, setSearchParams }) {
    const now_line = useMemo(
        () =>
            mtr_lines_and_stations.data.find((i) => {
                return i["Line Code"] === line;
            }) ?? {},
        [line]
    );

    useEffect(() => {
        console.log("now_line", now_line);
    }, [now_line]);

    return (
        <>
            <Flex direction="column" align="center" gap="3">
                <NowLineInfo line={line} dir={dir} station={station} now_line={now_line} setSearchParams={setSearchParams} />

                <Accordion.Root type="single" className="AccordionRoot" defaultValue={station}>
                    <Flex mt="5" direction="column" gap="3" justify="center">
                        {now_line[dir].map((i, count) => (
                            <Card asChild className="AccordionCard ">
                                <button
                                    onClick={() => {
                                        setSearchParams({ type: "metro", line: i["Line Code"], dir: dir, station: i["Station Code"] }, { replace: true });
                                    }}
                                >
                                    <Accordion.Item id={i["Station Code"]} className="AccordionItem" value={i["Station Code"]} key={btoa("stop" + i["Station Code"] + count)}>
                                        <Accordion.Header className="AccordionHeader">
                                            <Accordion.Trigger className="AccordionTrigger">
                                                <Flex direction="row" gap="3" className="AccordionTriggerContent" align="center" justify="between">
                                                    <Avatar.Root className={"AvatarRoot stop-seq " + now_line["Line Code"].toLowerCase()}>
                                                        <Avatar.Fallback className="AvatarFallback">
                                                            <Text size="7">{i["Sequence"]}</Text>
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>

                                                    <Text size="5" align="left" mr="auto">
                                                        {i["Chinese Name"]}
                                                    </Text>

                                                    <Text as="div" trim="both" id="icon-expand_more" className="material-symbols-outlined">
                                                        expand_more
                                                    </Text>
                                                </Flex>
                                            </Accordion.Trigger>
                                        </Accordion.Header>
                                        <Accordion.Content className="AccordionContent">
                                            {line === "DRL" ? (
                                                <Heading size="5" weight="light" mt="5" mb="5" m="auto" align="center">
                                                    迪士尼線暫無ETA
                                                </Heading>
                                            ) : (
                                                <ETA line={line} dir={dir} station={i["Station Code"]} now_line={now_line} />
                                            )}
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </button>
                            </Card>
                        ))}
                    </Flex>
                </Accordion.Root>
            </Flex>
        </>
    );
}
