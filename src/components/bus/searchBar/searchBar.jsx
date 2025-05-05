import React, { useEffect, useRef } from "react";
import { TextField, Text, IconButton } from "@radix-ui/themes";
import "./searchBar.css";

export default function SearchBar({ q, setSearchParams }) {
    const inputRef = useRef(null);

    const clearInputBox = () => {
        setSearchParams(
            (prev) => {
                prev.set("q", "");
                return prev;
            },
            { replace: true }
        );
        inputRef.current?.focus();
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        
        setSearchParams(
            (prev) => {
                prev.set("q", e.target.value);
                return prev;
            },
            { replace: true }
        );
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <TextField.Root id="search-bar">
            <TextField.Input variant="surface" id="inputBox0" placeholder="請輸入路線" value={q} onChange={handleInputChange} ref={inputRef} />
            {q.length !== 0 && (
                <TextField.Slot aria-label="Clear search">
                    <IconButton variant="ghost" color="crimson" radius="full" aria-label="Clear search query" onClick={clearInputBox} size="1">
                        <Text trim="both" as="span" className="material-symbols-outlined" id="icon-close">
                            close
                        </Text>
                    </IconButton>
                </TextField.Slot>
            )}
        </TextField.Root>
    );
}
