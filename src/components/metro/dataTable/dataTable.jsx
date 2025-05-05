import React from "react";
import { Card, Flex, Text } from "@radix-ui/themes";
import mtr_lines_and_stations from "../../../res/json/mtr_lines_and_stations.json";
import "./dataTable.css";

const lines = mtr_lines_and_stations.data;

export default function DataTable({ setSearchParams }) {
    return (
        <>
            <Flex direction="column" gap="3" align="center">
                {lines.map((i, index) => {
                    return (
                        <Card key={btoa("Line" + i["Station ID"] + index)} asChild className="metro-data-card">
                            <button
                                onClick={() => {
                                    setSearchParams({ type: "metro", line: i["Line Code"], dir: "DT", station: "" }, { replace: false });
                                }}
                            >
                                <Flex gap="1" justify="between" align="center">
                                    <div className={"mtr-line-color " + i["Line Code"].toLowerCase()} />
                                    <Text size="6">{i["Chinese Name"]}</Text>
                                    <Text trim="both" id="icon-navigate-next" className="material-symbols-outlined">
                                        navigate_next
                                    </Text>
                                </Flex>
                            </button>
                        </Card>
                    );
                })}
            </Flex>
        </>
    );
}
