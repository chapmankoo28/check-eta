import React from "react";
import { useSearchParams } from "react-router-dom";
import { Flex, Heading } from "@radix-ui/themes";
import SearchBar from "./searchBar/searchBar";
import DataTable from "./dataTable/dataTable";
import Route from "./route/route";
import "./bus.css";

export default function Bus() {
    const [searchParams, setSearchParams] = useSearchParams({ q: "", co: "", route: "", bound: "", service: "", stop: "" });
    const q = searchParams.get("q")?.trim() ?? "";
    const co = searchParams.get("co")?.trim() ?? "";
    const route = searchParams.get("route")?.trim() ?? "";
    const bound = searchParams.get("bound")?.trim() ?? "";
    const service = searchParams.get("service")?.trim() ?? "";
    const stop = searchParams.get("stop")?.trim() ?? "";

    const is_selected_route = co ? true : false;

    return (
        <>
            {is_selected_route ? (
                <Route co={co} route={route} bound={bound} service={service} stop={stop} setSearchParams={setSearchParams} />
            ) : (
                <Flex direction="column" gap="0">
                    <Heading size="8" weight="light" align="center" m="1" id="title-bus">
                        巴士幾時到
                    </Heading>
                    <SearchBar q={q} setSearchParams={setSearchParams} />
                    <DataTable q={q} setSearchParams={setSearchParams} />
                </Flex>
            )}
        </>
    );
}
