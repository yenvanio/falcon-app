"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function FalconAdButton() {
    const [isHovered, setIsHovered] = useState(true)

    return (
        <Link
            href="https://falcon.box"
            className="fixed bottom-6 right-6 z-50"
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
        >
            <Button
                className={`group flex items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-lg border border-gray-200 ${
                    isHovered ? "w-[280px] px-4" : "w-16"
                }`}
                size="icon"
            >
                <div className="flex h-8 w-full items-center justify-center">
                    <div className={`flex items-center transition-all duration-300 ${isHovered ? "mr-2" : ""}`}>
                        <Image
                            src="/falcon.svg"
                            alt="falcon"
                            width={40}
                            height={40}
                            className="transition-all duration-300"
                        />
                    </div>
                    <span
                        className={`whitespace-nowrap text-sm transition-all duration-300 ${
                            isHovered ? "opacity-100" : "w-0 opacity-0"
                        }`}
                    >
            Need help planning your trip?
          </span>
                </div>
            </Button>
        </Link>
    )
}