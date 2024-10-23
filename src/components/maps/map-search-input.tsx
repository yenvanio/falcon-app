"use client"

import React, {useEffect, useRef} from "react";
import {SearchIcon} from "@/components/ui/icons/search-icon";
import {Input} from "@/components/ui/input";
import {XIcon} from "lucide-react";

export interface MapSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch: () => void
    onSelect: () => void
}

export const MapSearchInput = React.forwardRef<HTMLInputElement, MapSearchInputProps>(
    ({className, onSearch, onSelect, ...props}, ref) => {
        const inputRef = useRef<HTMLInputElement>(null)
        const [isInputActive, setIsInputActive] = React.useState(false)

        const onClear = () => {
            if (inputRef.current) {
                inputRef.current.value = ''
                setIsInputActive(false)
            }
        }

        useEffect(() => {
            if (inputRef.current && inputRef.current.value) {
                setIsInputActive(true)
            }
        }, [inputRef]);

        return (
            <div className={`relative ${className}`}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <Input
                    ref={inputRef}
                    placeholder="Search"
                    className="pl-10 pr-10"
                    onSubmit={onSearch}
                />
                {isInputActive && (
                    <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={onClear}
                    />
                )}
            </div>
        )
    });