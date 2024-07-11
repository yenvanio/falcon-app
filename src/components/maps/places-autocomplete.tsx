"use client"

import React, {useEffect, useRef, useState} from 'react';
import {ControllerRenderProps} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";

export interface GooglePlacesAutocompleteResult {
    description: string;
    place_id: string;
}

interface GooglePlacesAutocompleteProps extends React.HTMLAttributes<HTMLInputElement> {
    field: ControllerRenderProps<{
        itinerary_name: string;
        itinerary_location: string;
        itinerary_location_id: string;
        itinerary_dates: { from: Date; to: Date; };
    }, "itinerary_location">
    autocompleteTypes: string[]
    onComplete: (result: GooglePlacesAutocompleteResult) => void;
}

export function GooglePlacesAutocomplete({className, field, autocompleteTypes, onComplete}: GooglePlacesAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const suggestionsRef = useRef(suggestions);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        suggestionsRef.current = suggestions;
    }, [suggestions]);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        let autocomplete: google.maps.places.Autocomplete | null = null;

        if (inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
                types: autocompleteTypes,
            });
        }

        return () => {
            if (autocomplete) {
                google.maps.event.clearInstanceListeners(autocomplete);
            }
        };
    }, [field, suggestions, activeIndex]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        if (searchTerm) {
            const service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions(
                {input: searchTerm, types: autocompleteTypes},
                (predictions, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setSuggestions(predictions);
                        setActiveIndex(-1)
                    } else {
                        setSuggestions([]);
                    }
                }
            );
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestionsRef.current.length > 0) {
            if (e.key === 'ArrowDown') {
                setActiveIndex((prevIndex) => (prevIndex === suggestionsRef.current.length - 1 ? -1 : (prevIndex + 1) % suggestionsRef.current.length));
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                setActiveIndex((prevIndex) => (prevIndex === -1 ? suggestionsRef.current.length - 1 : prevIndex - 1));
                e.preventDefault();
            } else if (e.key === 'Enter' && activeIndexRef.current !== -1) {
                handleSuggestionSelection(suggestionsRef.current[activeIndexRef.current]);
                e.preventDefault();
            }
        }
    }

    const handleSuggestionSelection = (suggestion: google.maps.places.AutocompletePrediction) => {
        onComplete({
            description: suggestion.description,
            place_id: suggestion.place_id,
        });

        field.value = suggestion.description
        setSuggestions([]);
        setActiveIndex(-1);
    };

    return (
        <div className={cn("relative grid gap-2", className)}>
            <Command className="rounded-lg border shadow-md">
                <CommandInput
                    ref={inputRef}
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onInputCapture={handleInput}
                    onKeyDownCapture={handleKeyDown}
                    placeholder="Where do you want to go?"
                />
                <CommandList>
                    {suggestions?.length > 0 && (
                        suggestions.map((suggestion, index) => (
                            <CommandItem
                                key={suggestion.place_id}
                                className={cn("hover:bg-slate-100 rounded-md p-1 cursor-pointer", {
                                    "bg-slate-100": index === activeIndex
                                })}
                                onSelect={() => handleSuggestionSelection(suggestion)}
                            >
                                {suggestion.description}
                            </CommandItem>
                        ))
                    )}
                </CommandList>
                {inputRef.current?.value == '' && suggestions?.length === 0 && (
                    <CommandEmpty>No results found.</CommandEmpty>
                )}
            </Command>
        </div>
    );

};

export default GooglePlacesAutocomplete;
