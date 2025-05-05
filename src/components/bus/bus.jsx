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

    const get_bus_company_info = (co, route) => {
        const COMPANY_NAMES = {
            CTB: "城巴",
            KMB: "九巴",
            LWB: "龍運",
        };
        const LWB_PATTERN = /^(A|E|NA|R|S|X)/;
        const NOT_LWB_ROUTES = ["X6C", "X42C", "X42P", "X89D", "X90", "R33", "R42"];
        const isLWBRoute = (route) => LWB_PATTERN.test(route) && !NOT_LWB_ROUTES.includes(route);
        if (co === "CTB") {
            return { name_tc: COMPANY_NAMES.CTB, code: "CTB" };
        }
        if (co === "KMB" && isLWBRoute(route)) {
            return { name_tc: COMPANY_NAMES.LWB, code: "LWB" };
        }
        return { name_tc: COMPANY_NAMES.KMB, code: "KMB" };
    };

    return (
        <>
            {is_selected_route ? (
                <Route co={co} route={route} bound={bound} service={service} stop={stop} setSearchParams={setSearchParams} get_bus_company_info={get_bus_company_info} />
            ) : (
                <Flex direction="column" gap="0">
                    <Heading size="8" weight="light" align="center" m="1" id="title-bus">
                        巴士幾時到
                    </Heading>
                    <SearchBar q={q} setSearchParams={setSearchParams} />
                    <DataTable q={q} get_bus_company_info={get_bus_company_info} setSearchParams={setSearchParams} />
                </Flex>
            )}
        </>
    );
}
