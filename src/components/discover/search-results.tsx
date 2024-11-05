'use client'

import React, { useEffect, useRef } from "react";
import { LocationProps } from "@/components/maps/map-box";
import clsx from "clsx";

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
}

export const DiscoverSearchResults = React.forwardRef<HTMLDivElement, SearchResultProps>(
    ({ className, mapCenter, locations,
         showResults, onClose, onResultSelected, ...props }, ref) => {
        const panelRef = useRef<HTMLDivElement>(null);

        // Close panel if clicked outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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
            "fixed top-0 right-0 w-80 h-full bg-[#0f172a] text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
            {
                "translate-x-0": showResults,    // Show when true
                "translate-x-full": !showResults // Hide when false
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
                    { mapCenter.title !== "" ? `Destinations from ${mapCenter.title}` : "Search for an Airport" }
                </h2>
                <div className="overflow-y-auto max-h-full px-4 py-2">
                    <ul className="space-y-2">
                        {locations.map((location, index) => (
                            <li key={index} className="p-2 border-b border-gray-600 hover:cursor-pointer" onClick={() => {
                                onResultSelected(location.id)
                            }}>
                                {location.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
);

DiscoverSearchResults.displayName = "DiscoverSearchResults";
