import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./App.css";
import Layout from "../layout/layout";

export default function App() {
    return (
        <>
            <Theme appearance="dark" accentColor="indigo" radius="large" panelBackground="translucent" scaling="100%">
                <div id="main-container">
                    <BrowserRouter>
                        <Layout />
                    </BrowserRouter>
                </div>
            </Theme>
        </>
    );
}
