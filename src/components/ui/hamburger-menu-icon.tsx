'use client'

import { useState } from 'react'

export default function HamburgerMenuIcon() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <button
            className="relative z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
        >
            <span className="sr-only">Toggle menu</span>
            <span
                className='absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out -translate-y-1.5'
            ></span>
            <span
                className='absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out opacity-100'
            ></span>
            <span
                className='absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out translate-y-1.5'
            ></span>
        </button>
    )
}