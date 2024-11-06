'use client'

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LocationProps } from "@/components/maps/map-box";
import clsx from "clsx";
import { Loader2 } from "lucide-react"; // Import Loader2

interface SearchResultProps extends React.HTMLAttributes<HTMLDivElement> {
    locations: LocationProps[];
    mapCenter: {
        latitude: number;
        longitude: number;
        title: string;
    };
    showResults: boolean;
    onClose: () => void;
    onResultSelected: (index: number) => void;
    menuIconRef: React.RefObject<HTMLDivElement>
}

export const DiscoverSearchResults = React.forwardRef<HTMLDivElement, SearchResultProps>(
    ({ className, mapCenter, locations, showResults, onClose, onResultSelected, menuIconRef, ...props }, ref) => {
        const panelRef = useRef<HTMLDivElement>(null);
        const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
        const [highlights, setHighlights] = useState<{ [key: number]: { pros: string[], cons: string[] } }>({});
        const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

        // Fetch highlights from OpenAI API
        const fetchCityHighlights = async (cityName: string, index: number) => {
            setLoading((prev) => ({ ...prev, [index]: true })); // Set loading state
            try {
                const response = await axios.post('/api/getCityHighlights', {
                    city: cityName
                });

                const { pros, cons } = response.data;
                setHighlights((prev) => ({
                    ...prev,
                    [index]: { pros, cons }
                }));
            } catch (error) {
                console.error("Error fetching city highlights:", error);
            } finally {
                setLoading((prev) => ({ ...prev, [index]: false })); // Remove loading state
            }
        };

        // Handle item selection with expand/collapse logic and API call
        const handleItemClick = async (index: number) => {
            onResultSelected(index);

            if (expandedIndex === index) {
                // Collapse if clicked again
                setExpandedIndex(null);
            } else {
                // Expand and fetch highlights if needed
                setExpandedIndex(index);
                if (!highlights[index]) {
                    await fetchCityHighlights(locations[index].title, index);
                }
            }
        };

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const clickedOutsidePanel = panelRef.current && !panelRef.current.contains(event.target as Node);
                const clickedOutsideNavbar = menuIconRef.current && !menuIconRef.current.contains(event.target as Node);

                if (clickedOutsidePanel && clickedOutsideNavbar) {
                    onClose();
                }
            };

            if (showResults) {
                document.addEventListener("mousedown", handleClickOutside);
            } else {
                document.removeEventListener("mousedown", handleClickOutside);
            }

            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [showResults, onClose]);

        const panelClasses = clsx(
            "fixed top-[60px] right-0 w-80 h-[calc(100vh-60px)] bg-[#0f172a] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
            {
                "translate-x-0": showResults,
                "translate-x-full": !showResults
            },
            className
        );

        return (
            <div ref={panelRef} className={panelClasses} {...props}>
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                    aria-label="Close panel"
                >
                    ✕
                </button>
                <h2 className="p-4 text-md font-bold">
                    {mapCenter.title !== "" ? `Destinations from ${mapCenter.title}` : "Search for an Airport"}
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-4">
                    <ul className="space-y-2">
                        {locations.map((location, index) => (
                            <li key={index} className="border-b border-gray-600">
                                <div
                                    className="p-2 flex items-center hover:cursor-pointer"
                                    onClick={() => handleItemClick(index)}
                                >
                                    <span>{location.title}</span>
                                    {loading[index] && (
                                        <Loader2 className="ml-2 animate-spin text-gray-400" />
                                    )}
                                </div>
                                {expandedIndex === index && highlights[index] && (
                                    <div className="p-2 bg-gray-700 text-sm text-gray-200">
                                        <h3 className="font-semibold">Pros:</h3>
                                        <ul className="list-disc list-inside">
                                            {highlights[index].pros.map((pro, idx) => (
                                                <li key={idx}>{pro}</li>
                                            ))}
                                        </ul>
                                        <h3 className="font-semibold mt-2">Cons:</h3>
                                        <ul className="list-disc list-inside">
                                            {highlights[index].cons.map((con, idx) => (
                                                <li key={idx}>{con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
);

DiscoverSearchResults.displayName = "DiscoverSearchResults";
