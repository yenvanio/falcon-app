import Link from "next/link"
import {SearchIcon} from "@/components/ui/icons/search-icon";
import {MapIcon} from "@/components/ui/icons/map-icon";
import {Dispatch, SetStateAction, useState} from "react";
import HamburgerMenuIcon from "@/components/ui/hamburger-menu-icon";

interface UnauthedNavbarProps {
    isSearch: boolean
    isResultsExpanded: boolean
    toggleSearch: Dispatch<SetStateAction<boolean>>
    toggleResults: Dispatch<SetStateAction<boolean>>
}

export default function UnauthedNavbar({isSearch, toggleSearch, isResultsExpanded, toggleResults}: UnauthedNavbarProps) {
    return (
        <header className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center justify-center" prefetch={false}>
                    <img
                        src="/falcon.svg"
                        alt="falcon"
                        className="h-10 w-18"
                    />
                </Link>
            </nav>
            <div className="flex flex-row justify-end items-center space-x-4">
                <div className="hover:cursor-pointer z-10" onClick={() => toggleSearch(!isSearch)}>
                    {isSearch ? <MapIcon/> : <SearchIcon/>}
                </div>
                <div className="hover:cursor-pointer z-10" onClick={() => toggleResults(!isResultsExpanded)}>
                    <HamburgerMenuIcon/>
                </div>
            </div>
        </header>
    )
}