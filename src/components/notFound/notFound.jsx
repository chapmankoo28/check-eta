import React from "react";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";

export default function NotFound() {
    return (
        <>
            <Flex direction="column" gap="6" align="center">
                <Heading size="9" weight="light">
                    404
                </Heading>
                <Heading size="8">Page Not Found</Heading>
                <Button asChild>
                    <a href="/">
                        <Text as="span" className="material-symbols-outlined" id="icon-home">
                            home
                        </Text>
                        Back to Home
                    </a>
                </Button>
            </Flex>
        </>
    );
}
