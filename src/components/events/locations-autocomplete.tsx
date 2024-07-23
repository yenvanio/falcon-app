import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {FalconLocation} from "@/components/maps/types";
import {ControllerRenderProps} from "react-hook-form";

interface LocationAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    locations: FalconLocation[]
    onComplete: (result: FalconLocation) => void
    field: ControllerRenderProps<{
        event_location_name: string;
        event_name: string;
        event_dates: { from: Date; to: Date; };
        event_location?: any;
        event_times: { start: Date; end: Date; };
        event_notes?: string | undefined;
    }, "event_location_name">
}

export const LocationsAutocomplete = React.forwardRef<HTMLInputElement, LocationAutocompleteProps>(
    ({className, locations, field, onComplete, ...props}, ref) => {
    const [suggestions, setSuggestions] = useState<FalconLocation[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

        const handleInputChange = (e: any) => {
            field.onChange(e)

            const value = e.target.value;

            if (value === "") {
                setSuggestions([]);
            } else {
                const filteredSuggestions = locations.filter((location: FalconLocation) =>
                    location.name.toLowerCase().includes(value.toLowerCase())
                );
                setSuggestions(filteredSuggestions);
            }

            setSelectedIndex(-1);
        };

    const handleKeyDown = (e: any) => {
        if (e.key === "ArrowUp") {
            setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1))
        } else if (e.key === "ArrowDown") {
            setSelectedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0))
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            field.value = suggestions[selectedIndex].name
            onComplete(suggestions[selectedIndex])

            setSuggestions([])
            setSelectedIndex(-1)
        }
    }

    const handleSuggestionClick = (suggestion: FalconLocation) => {
        field.value = suggestion.name
        onComplete(suggestion)

        setSuggestions([])
        setSelectedIndex(-1)
    }

    return (
        <div className="grid gap-1.5">
            <div className="relative">
                <Input
                    ref={ref}
                    id="autocomplete"
                    type="text"
                    placeholder="Type to search..."
                    value={field.value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="pr-10"
                />
                {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-background border border-input rounded-md shadow-lg mt-1 overflow-auto max-h-48">
                        {suggestions.map((location, index) => (
                            <div
                                key={location.name}
                                className={`px-4 py-2 cursor-pointer hover:bg-muted ${index === selectedIndex ? "bg-muted" : ""}`}
                                onClick={() => handleSuggestionClick(location)}
                            >
                                {location.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
})