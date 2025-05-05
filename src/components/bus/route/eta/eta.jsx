import React, { useCallback, useEffect, useState } from "react";
import { Flex, Text, Heading, Tooltip, Separator } from "@radix-ui/themes";
import Loading from "../../../loading/loading";
import { get_eta } from "../../../../utils/busUtils";

export default function ETA({ co, route, bound, service, stop }) {
    const [loading, setLoading] = useState(true);
    const [etaData, setEtaData] = useState([]);

    const now = new Date();
    const hr = now.getHours().toString().padStart(2, "0");
    const min = now.getMinutes().toString().padStart(2, "0");
    const sec = now.getSeconds().toString().padStart(2, "0");
    const time = `${hr}:${min}:${sec}`;

    const get_filtered_eta_data = useCallback(async (isMounted) => {
        try {
            const data = await get_eta(co, route, service, stop);
            if (isMounted) {
                const eta =
                    data.filter((i) => i.dir === bound.toUpperCase()) ?? [];
                if (eta.length !== 0) setEtaData(eta);
                if (eta.length === 0) {
                    setEtaData(
                        data.filter(
                            (i) => i.dir === (bound.toUpperCase() === "O" ? "I" : "O"),
                        ) ?? [],
                    );
                }
                setLoading(false);
            }
        } catch (error) {
            if (isMounted) {
                console.error(
                    "ERROR: fetching filtered eta data. Info:",
                    error,
                );
                setLoading(false);
            }
        }
    }, [bound, co, route, service, stop]);

    useEffect(() => {
        const abortController = new AbortController();
        setLoading(true);
    
        const get_filtered_eta_data_with_signal = async () => {
            try {
                await get_filtered_eta_data(abortController.signal);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        get_filtered_eta_data_with_signal();
        const interval = setInterval(get_filtered_eta_data_with_signal, 60000);
    
        return () => {
            clearInterval(interval);
            abortController.abort();
        };
    }, [co, route, bound, service, stop, get_filtered_eta_data]);

    const renderEtaData = () => {
        if (loading) {
            return <Loading />;
        }

        if (etaData.length === 0) {
            return (
                <Heading size="5" weight="light" m="auto" align="center">
                    查詢唔到班次，請再試一次。
                </Heading>
            );
        }

        if (etaData.every(i => !i.eta && !i.rmk_tc)) {
            return (
                <Heading size="5" weight="light" m="auto" align="center">
                    暫無班次
                </Heading>
            );
        }

        let hasShownNoSchedule = false;

        return etaData.map((i, count) => {
            if (!i.eta && i.rmk_tc) {
                return (
                    <Heading
                        key={`rmk-${count}`}
                        size="5"
                        weight="light"
                        m="auto"
                        align="center"
                    >
                        {i.rmk_tc}
                    </Heading>
                );
            } else if (i.eta) {
                const eta_in_min = Math.ceil((new Date(i.eta) - now) / 1000 / 60);
                return (
                    <React.Fragment key={`eta-${i.seq}-${count}-${i.eta_seq}`}>
                        <Separator
                            key={`separator-${count}-${i.seq}-${i.eta_seq}`}
                            orientation="horizontal"
                            size="4"
                        />
                        <Flex
                            key={`eta_flex-${i.seq}-${count}`}
                            direction="row"
                            gap="3"
                            justify="between"
                            align="center"
                        >
                            <Flex
                                direction="column"
                                gap="1"
                                align="start"
                            >
                                <Flex gap="1" align="baseline">
                                    <Text size="2">往</Text>
                                    <Text size="5">{i.dest_tc}</Text>
                                </Flex>
                                <Text size="2" color="gray">
                                    {i.rmk_tc}
                                </Text>
                            </Flex>
                            <Flex gap="2" align="baseline">
                                <Text size="7" className="eta-min">
                                    {eta_in_min > 0
                                        ? eta_in_min
                                        : "即將抵達"}
                                </Text>
                                {eta_in_min > 0 && <Text>分鐘</Text>}
                            </Flex>
                        </Flex>
                    </React.Fragment>
                );
            } else if (!hasShownNoSchedule) {
                hasShownNoSchedule = true;
                return (
                    <Heading
                        key={`no-schedule-${count}`}
                        size="5"
                        weight="light"
                        m="auto"
                        align="center"
                    >
                        暫無班次
                    </Heading>
                );
            }
            
            return null;
        });
    };

    return (
        <Flex direction="column" gap="2">
            <Flex gap="2" justify="between" align="center" mt="5" mb="1">
                <Text>最後更新時間：{time}</Text>
                <Tooltip content="更新" key={"updated_time"}>
                    <button onClick={get_filtered_eta_data}>
                        <Text
                            trim="both"
                            as="div"
                            className="material-symbols-outlined"
                            id="icon-refresh"
                            state={loading ? "loading" : "done"}
                        >
                            autorenew
                        </Text>
                    </button>
                </Tooltip>
            </Flex>

            <Flex direction="column" gap="2" justify="center">
                {renderEtaData()}
            </Flex>
        </Flex>
    );
}
