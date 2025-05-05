import { Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import React, { useState } from "react";

export default function NowLineInfo({ dir, setSearchParams, now_line }) {
    const [rotate, setRotate] = useState(false);
    const handle_swap_bound = () => {
        setSearchParams(
            (prev) => {
                prev.set("dir", prev.get("dir") === "DT" ? "UT" : "DT");
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
            <div id="now-route-info">
                <div className={"mtr-line-color " + now_line["Line Code"].toLowerCase()} />

                <Heading id="now-route-dest">{now_line["Chinese Name"]}</Heading>

                <Flex gap="1" align="baseline">
                    <Text size="2">往</Text>
                    <Text size="5">{now_line[dir][now_line[dir].length - 1]["Chinese Name"]}</Text>
                </Flex>
                <Tooltip content="切換方向">
                    <button onClick={handle_swap_bound}>
                        <Text trim="both" as="div" id="icon-swap_vert" className="material-symbols-outlined" state={rotate ? "loading" : ""}>
                            swap_vert
                        </Text>
                    </button>
                </Tooltip>
            </div>
        </>
    );
}
