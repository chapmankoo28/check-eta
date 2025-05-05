import React from "react";
import { useSearchParams } from "react-router-dom";
import { Flex, Heading } from "@radix-ui/themes";
import DataTable from "./dataTable/dataTable";
import Line from "./line/line";
import "./metro.css";

export default function Metro() {
    const [searchParams, setSearchParams] = useSearchParams({ line: "", dir: "", station: "" });
    const line = searchParams.get("line")?.trim() ?? "";
    const dir = searchParams.get("dir")?.trim() ?? "";
    const station = searchParams.get("station")?.trim() ?? "";

    const is_selected_line = line ? true : false;

    return (
        <>
            {is_selected_line ? (
                <Line line={line} dir={dir} station={station} setSearchParams={setSearchParams} />
            ) : (
                <Flex direction="column" gap="3">
                    <Heading size="8" weight="light" align="center" mb="9" m="1">
                        地鐵幾時到
                    </Heading>

                    <DataTable setSearchParams={setSearchParams} />
                </Flex>
            )}
        </>
    );
}
