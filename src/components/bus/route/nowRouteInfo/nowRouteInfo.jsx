import React, { useState } from "react";
import { Flex, Text, Heading, Tooltip } from "@radix-ui/themes";
import "./nowRouteInfo.css";

export default function NowRouteInfo({ co, route, bound, service, nowRoute, setSearchParams }) {
    const [rotate, setRotate] = useState(false);

    const handle_swap_bound = () => {
        setSearchParams(
            (prev) => {
                prev.set("bound", prev.get("bound") === "O" ? "I" : "O");
                return prev;
            },
            { replace: true }
        );
        setRotate(true);
        setTimeout(() => {
            // The timeout should match the animation duration
            setRotate(false);
        }, 500);
    };

    return (
        <>
            {Object.keys(nowRoute).length !== 0 ? (
                <>
                    <Flex direction="row" align="center" justify="center" gap="5" id="now-route-info">
                        <Heading id="now-route-num">{nowRoute.route}</Heading>
                        <div>
                            <Heading id="now-route-dest">
                                {nowRoute.dest_tc}
                            </Heading>
                        </div>

                        <Tooltip content="調轉方向">
                            <button onClick={handle_swap_bound}>
                                <Text trim="both" as="div" id="icon-swap_vert" className="material-symbols-outlined" state={rotate ? "loading" : ""}>
                                    swap_vert
                                </Text>
                            </button>
                        </Tooltip>
                    </Flex>
                    <a target="_blank" href={co === "KMB" ? (
                        "https://search.kmb.hk/KMBWebSite/?action=routesearch&route=" + route
                    ) : (
                        "https://mobile.citybus.com.hk/nwp3/?f=1&dsmode=1&l=0&ds=" + route)} rel="noreferrer">
                        <div id="info-link">
                            按此查詢巴士公司網站之資料
                            <span className="material-symbols-outlined" id="icon-open-in-new">
                                open_in_new
                            </span>
                        </div>
                    </a>

                </>
            ) : (
                <>
                    <Heading id="now-route-dest">搵唔到呢條線……</Heading>
                </>
            )}
        </>
    );
}
