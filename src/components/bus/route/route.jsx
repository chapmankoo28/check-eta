import React, { useEffect, useState } from "react";
import { Card, Flex, Text } from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import * as Avatar from "@radix-ui/react-avatar";
import Loading from "../../loading/loading";
import ETA from "./eta/eta";
import NowRouteInfo from "./nowRouteInfo/nowRouteInfo";
import L from "leaflet";
import { get_bus_company_info, get_route_info, get_stop_data, get_stop_list } from "../../../utils/busUtils";

export default function Route({ co, route, bound, service, stop, setSearchParams }) {
    const [stopData, setStopData] = useState([]);
    const [nowRoute, setNowRoute] = useState({});
    const [loading, setLoading] = useState(true);
    const [stopDataObj, setStopDataObj] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setLoading(true);

        const fetchStopData = async () => {
            try {
                setNowRoute(get_route_info(co, route, bound, service));
                const data = await get_stop_list(co, route, bound, service, signal);
                setStopData(data ?? []);

                const fetchNamesPromises = (data ?? []).map((stop) =>
                    get_stop_data(co, stop.stop, signal)
                );

                const names = await Promise.all(fetchNamesPromises);
                const namesObject = names.reduce((acc, name, index) => {
                    acc[data[index].stop] = name;
                    return acc;
                }, {});

                setStopDataObj(namesObject);
                setLoading(false);

                if (stop) {
                    console.log("scrolling...");
                    scrollToElement(stop);
                } else {
                    console.log("finding the closest stop...");
                    findClosestStop(namesObject);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error("ERROR: fetching stop data. Info:", error);
                    setLoading(false);
                }
            }
        };

        const scrollToElement = (elementId) => {
            setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    console.log("Scrolled to stop:", elementId);
                } else {
                    console.log("Could not find element with ID:", elementId);
                }
            }, 300); 
        };

        const findClosestStop = (stopDataObjParam) => {
            if (!navigator.geolocation) {
                console.log("Geolocation is not supported by your browser");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    let minDistance = Infinity;
                    let closestStop = "";
                    
                    console.log("User location:", userLat, userLng);
                    const userLocat = L.latLng(userLat, userLng);
                    
                    for (const stop of Object.values(stopDataObjParam)) {
                        const stopPoint = L.latLng(parseFloat(stop.lat), parseFloat(stop.long));
                        const distance = userLocat.distanceTo(stopPoint);
        
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestStop = stop.stop;
                        }
                    }
                    
                    if (closestStop && minDistance <= 1000) {
                        console.log("Closest stop:", closestStop, "Distance:", minDistance.toFixed(2), "m");
                        
                        setSearchParams(
                            (prev) => {
                                prev.set("stop", closestStop);
                                return prev;
                            },
                            { replace: true, state: { scrollToElement: closestStop } }
                        );

                        scrollToElement(closestStop);
                    } else {
                        console.log("Closest stop is too far:", minDistance.toFixed(2), "m (>1km). Not selecting.");
                    }
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("Location permission denied");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Location information unavailable");
                        break;
                    case error.TIMEOUT:
                        console.log("Location request timed out");
                        break;
                    case error.UNKNOWN_ERROR:
                    default:
                        console.log("Unknown geolocation error");
                        break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        };

        fetchStopData();

        return () => {
            abortController.abort();
        };
    }, [co, route, bound, service, get_route_info, get_stop_list, get_stop_data]);

    return (
        <>
            <Flex direction="column" gap="3" align="center">
                <NowRouteInfo co={co} route={route} nowRoute={nowRoute} setSearchParams={setSearchParams} />
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Accordion.Root type="single" className="AccordionRoot" defaultValue={stop} value={stop} onValueChange={(value) => {
                            setSearchParams(
                                (prev) => {
                                    prev.set("stop", value);
                                    return prev;
                                },
                                { replace: true }
                            );
                        }}>
                            <Flex mt="5" direction="column" gap="3" justify="center">
                                {stopData.length === 0 ? (
                                    <Text align="center" size="6">
                                        搵唔到巴士站，請嘗試切換方向。
                                    </Text>
                                ) : (
                                    <>
                                        {stopData.map((i, count) => (
                                            <>
                                                <Card asChild className="AccordionCard " key={"stop" + i.stop + count}>
                                                    <button
                                                        onClick={() => {
                                                            setSearchParams(
                                                                (prev) => {
                                                                    prev.set("stop", i.stop);
                                                                    return prev;
                                                                },
                                                                { replace: true }
                                                            );
                                                        }}
                                                    >
                                                        <Accordion.Item id={i.stop} className="AccordionItem" value={i.stop}>
                                                            <Accordion.Header className="AccordionHeader">
                                                                <Accordion.Trigger className="AccordionTrigger">
                                                                    <Flex direction="row" gap="3" className="AccordionTriggerContent" align="center" justify="between">
                                                                        <Avatar.Root className={"AvatarRoot stop-seq " + get_bus_company_info(co, route)["code"].toLowerCase()}>
                                                                            <Avatar.Fallback className="AvatarFallback">
                                                                                <Text size="7">{i["seq"]}</Text>
                                                                            </Avatar.Fallback>
                                                                        </Avatar.Root>
                                                                        <Text size="5" align="left" mr="auto">
                                                                            {stopDataObj[i.stop]?.name_tc ?? `搵唔到巴士站 ID: ${i.stop}`}
                                                                        </Text>
                                                                        <Text as="div" trim="both" id="icon-expand_more" className="material-symbols-outlined">
                                                                            expand_more
                                                                        </Text>
                                                                    </Flex>
                                                                </Accordion.Trigger>
                                                            </Accordion.Header>
                                                            <Accordion.Content className="AccordionContent">
                                                                <ETA co={co} route={route} bound={bound} service={service} stop={i.stop} />
                                                            </Accordion.Content>
                                                        </Accordion.Item>
                                                    </button>
                                                </Card>
                                            </>
                                        ))}
                                    </>
                                )}
                            </Flex>
                        </Accordion.Root>
                    </>
                )}
            </Flex>
        </>
    );
}
