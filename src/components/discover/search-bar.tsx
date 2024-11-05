"use client";

import React, {useCallback, useEffect} from "react";
import {debounce} from "lodash";
import {LocationProps} from "@/components/maps/map-box";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";

interface DiscoverSearchBarProps extends React.InputHTMLAttributes<HTMLFormElement> {
    onSearch: (location: LocationProps) => void
}

export const DiscoverSearchBar = React.forwardRef<HTMLFormElement, DiscoverSearchBarProps>(
    ({className, onSearch, ...props}, ref) => {
        const [search, setSearch] = React.useState('')
        const [keyword, setKeyword] = React.useState('')
        const [open, setOpen] = React.useState(false);
        const [options, setOptions] = React.useState<LocationProps[]>([]);
        const [loading, setLoading] = React.useState(false);

        // Debounce function to prevent excess input events
        const debounceLoadData = useCallback(debounce(setKeyword, 1000), []);

        useEffect(() => {
            debounceLoadData(search);
        }, [search, debounceLoadData]);

        useEffect(() => {
            if (!search) return;

            const controller = new AbortController();
            const { signal } = controller;
            setLoading(true);

            fetch(`/api/airportSearch?limit=10&offset=0&keyword=${keyword}`, { signal })
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        setOptions(data);
                    } else {
                        setOptions([]);
                    }
                })
                .catch((err) => {
                    if (err.name !== 'AbortError') console.error(err);
                    setOptions([]);
                })
                .finally(() => setLoading(false));

            return () => controller.abort();
        }, [keyword]);


        return (
            <Autocomplete
                className="
                    absolute top-1/2 left-1/2 transform
                    -translate-x-1/2 -translate-y-1/2
                    w-1/2 h-100 z-10 border bg-white
                    border-white shadow-2xl
                    drop-shadow-2xl ring-4
                    ring-white/40 focus:ring-white/60
                "
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={(e, airport) => {
                    if (airport && airport.title) {
                        onSearch(airport)
                        return
                    }
                    setSearch("")
                }}
                getOptionLabel={(option) => option.title}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Airports"
                        fullWidth
                        onChange={(e) => {
                            e.preventDefault()
                            setSearch(e.target.value)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        );
    }
);

DiscoverSearchBar.displayName = "DiscoverSearchBar";
