import api_config from "../res/json/api_config.json";
import allRoutesData from "../res/json/all_route_list.json";

export const get_bus_company_info = (co, route) => {
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

export const get_eta = async (co, route, service, stop) => {
    try {
        const api =
            api_config.data.find(
                (item) => item.co.toLowerCase() === co.toLowerCase(),
            );

        const url = `${api["base_url"]}${api["api"]["eta"]}${stop.toUpperCase()}/${route.toUpperCase()}/`;
        const s = co.toLowerCase() === "kmb" ? service : "";

        const response = await fetch(url + s);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("ERROR: fetching stop data. Info:", error);
    }
};

export const get_stop_list = async (co, route, bound, service, abortSignal) => {
    // if (Object.keys(get_route_info(co, route, bound, service) ?? {}).length === 0) return [];
    try {
        if (abortSignal) {
            const api = api_config.data.find((item) => item.co.toLowerCase() === co.toLowerCase());

            const b = bound.toLowerCase() === "o" ? "outbound" : "inbound";
            const url = `${api["base_url"]}${api["api"]["route-stop"]}${route.toUpperCase()}/${b}/`;
            const s = co.toLowerCase() === "kmb" ? service : "";

            const response = await fetch(url + s);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result.data;
        }
    } catch (error) {
        console.error("ERROR: fetching stop data. Info:", error);
    }
    return []
};

export const get_route_info = (co, route, bound, service) => {
    if (!co || !route || !bound || !service) return {};

    const res =
        allRoutesData["data"].find((i) => {
            return i.route === route && i.co === co && i.bound === bound && i.service_type === service;
        }) ?? {};

    if (Object.keys(res).length === 0) {
        console.log("CHECK SWAP BOUND STOP LIST");
        const swap_bound = bound === "O" ? "I" : "O";
        return get_route_info(co, route, swap_bound, service) ?? {};
    }

    return res;
};

export const get_stop_data = async (co, stopID, abortSignal) => {
    if (!co || !stopID) return "";
    try {
        if (abortSignal) {
            const api = api_config.data.find((item) => item.co.toUpperCase() === co.toUpperCase()) ?? {};
            const url = `${api.base_url}${api["api"]["stop"]}${stopID.toUpperCase()}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result.data;
        }
    } catch (error) {
        console.error("ERROR: fetching stop name. Info:", error);
    }
    return ""
};