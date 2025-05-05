import React, { useMemo } from "react";
import { Flex, Text, Card } from "@radix-ui/themes";
import { get_bus_company_info } from "../../../utils/busUtils";
import allRoutesData from "../../../res/json/all_route_list.json";
import "./dataTable.css";

const filtered_routes = (q) => {
    const q_ROUTE_REP = /^[^0-9a-zA-Z]+$/g;

    if (q.length === 0 || q_ROUTE_REP.test(q)) return [];
    return allRoutesData["data"].filter((i) => {
        return i.route.toLowerCase().includes(q);
    });
};

export default function DataTable({ q, setSearchParams }) {
    const query = q.toLowerCase();
    const routes = useMemo(() => {
        return filtered_routes(query);
    }, [query]);

    return (
        <>
            {routes.length > 0 ? (
                <>
                    <Flex direction="column" gap="3" align="center">
                        {routes.map((i, count) => (
                            <Card className="bus-data-card" asChild key={btoa("route" + count + i.route)}>
                                <button
                                    onClick={() => {
                                        setSearchParams({ type: "bus", co: i.co, route: i.route, bound: i.bound, service: i.service_type }, { replace: false });
                                    }}
                                >
                                    <Flex direction="row" gap="1" align="center" justify="between">
                                        <Text className="data-card-route-num" size="7">
                                            {i.route}
                                        </Text>
                                        <Flex mr="auto" direction="column" align="start">
                                            <Text className={"bus-co-color " + get_bus_company_info(i.co, i.route)["code"].toLowerCase()}>
                                                {get_bus_company_info(i.co, i.route)["name_tc"]}
                                            </Text>
                                            <Text as="div">
                                                <Flex gap="1" align="baseline">
                                                    <Text>往</Text>
                                                    <Text size="5">{i.dest_tc}</Text>
                                                </Flex>
                                            </Text>
                                            <Text as="div" size="2" color="gray">
                                                {i.service_type !== "1" ? "特別班" : ""}
                                            </Text>
                                        </Flex>

                                        <Text trim="both" id="icon-navigate-next" className="material-symbols-outlined">
                                            navigate_next
                                        </Text>
                                    </Flex>
                                </button>
                            </Card>
                        ))}
                    </Flex>
                </>
            ) : (
                <Text size="7" align="center">
                    {query.length !== 0 ? "搵唔到您輸入的路線" : "請輸入路線"}
                </Text>
            )}
        </>
    );
}
