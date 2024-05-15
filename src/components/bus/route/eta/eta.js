import React, { useEffect, useState } from "react";
import { Flex, Text, Heading, Tooltip, Separator } from "@radix-ui/themes";
import Loading from "../../../loading/loading";
import api_config from "../../../../res/json/api_config.json";
import "./eta.css";

export default function ETA({ co, route, bound, service, stop }) {
    const [loading, setLoading] = useState(true);
    const [etaData, setEtaData] = useState([]);
    const [error, setError] = useState(false);

    const now = new Date();
    const hr = now.getHours().toString().padStart(2, "0");
    const min = now.getMinutes().toString().padStart(2, "0");
    const sec = now.getSeconds().toString().padStart(2, "0");
    const time = `${hr}:${min}:${sec}`;

    const get_eta = async (co, route, service, stop) => {
        console.count("CALLED get_eta");
        try {
            const api =
                api_config.data.find(
                    (item) => item.co.toLowerCase() === co.toLowerCase(),
                ) ?? {};

            const url = `${api["base_url"]}${api["api"]["eta"]}${stop.toUpperCase()}/${route.toUpperCase()}/`;
            const s = co.toLowerCase() === "kmb" ? service : "";

            console.count(url + s);

            const response = await fetch(url + s);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            console.error("ERROR: fetching stop data. Info:", error);
            setError(true);
        }
    };

    const get_filtered_eta_data = async (isMounted) => {
        console.count("CALLED get_filtered_eta_data");
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
                setError(true);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        get_filtered_eta_data(isMounted);
        const interval = setInterval(
            () => get_filtered_eta_data(isMounted),
            60000,
        );

        return () => {
            clearInterval(interval);
            // isMounted = false;
        };
    }, [co, route, bound, service, stop]);

    return (
        <Flex direction="column" gap="2">
            <Flex gap="2" justify="between" align="center" mt="5" mb="1">
                <Text>最後更新時間：{time}</Text>
                <Tooltip content="更新">
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
                {loading ? (
                    <Loading />
                ) : etaData.length > 0 ? (
                    etaData.map((i, count) => {
                        if (!i.eta && i.rmk_tc) {
                            return (
                                <Heading
                                    size="5"
                                    weight="light"
                                    m="auto"
                                    align="center"
                                >
                                    {i.rmk_tc}
                                </Heading>
                            );
                        } else if (!i.eta && !i.rmk_tc) {
                            return (
                                <Heading
                                    size="5"
                                    weight="light"
                                    m="auto"
                                    align="center"
                                >
                                    暫無班次
                                </Heading>
                            );
                        }
                        const eta_in_min = Math.ceil(
                            (new Date(i.eta) - now) / 1000 / 60,
                        );
                        return (
                            <>
                                <Separator
                                    key={
                                        "separator" + count + i.seq + i.eta_seq
                                    }
                                    orientation="horizontal"
                                    size="4"
                                />
                                <Flex
                                    key={btoa("eta", i.seq, count)}
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
                            </>
                        );
                    })
                ) : (
                    <Heading size="5" weight="light" m="auto" align="center">
                        {error ? "查詢唔到班次，請再試一次。" : "暫無班次"}
                    </Heading>
                )}
            </Flex>
        </Flex>
    );
}
