import React from "react";
import { Flex } from "@radix-ui/themes";
import * as Progress from '@radix-ui/react-progress';
import "./loading.css";

export default function Loading() {
    return (
        <>
            <Flex direction="column" id="loading" align="center">
                <Progress.Root className="ProgressRoot">
                    <Progress.Indicator className="ProgressIndicator" />
                </Progress.Root>
            </Flex>
        </>
    );
}
