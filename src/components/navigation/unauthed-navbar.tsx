// UnauthedNavbar.tsx
import Link from "next/link";
import {SearchIcon} from "@/components/ui/icons/search-icon";
import {MapIcon} from "@/components/ui/icons/map-icon";
import {Dispatch, MutableRefObject, SetStateAction, useRef} from "react";
import HamburgerMenuIcon from "@/components/ui/hamburger-menu-icon";

interface UnauthedNavbarProps {
    isSearch: boolean;
    isResultsExpanded: boolean;
    menuIconRef: React.RefObject<HTMLDivElement>
    toggleSearch: Dispatch<SetStateAction<boolean>>;
    toggleResults: Dispatch<SetStateAction<boolean>>;
}

export default function UnauthedNavbar({
                                           isSearch,
                                           toggleSearch,
                                           menuIconRef,
                                           isResultsExpanded,
                                           toggleResults,
                                       }: UnauthedNavbarProps) {
    return (
        <header className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center justify-center" prefetch={false}>
                    <img
                        src="/falcon.svg"
                        alt="falcon"
                        className="h-8 w-16"
                    />
                </Link>
            </nav>
            <div
                className={`flex flex-row justify-end items-center space-x-4 floating-icons ${isResultsExpanded ? "shift-left" : ""}`}>
                <div className="hover:cursor-pointer z-10" onClick={() => toggleSearch(prev => !prev)}>
                    {isSearch ? <MapIcon/> : <SearchIcon/>}
                </div>
                <div className="hover:cursor-pointer z-10" onClick={() => {
                    toggleResults(prev => !prev)
                }}>
                    <div ref={menuIconRef}>
                        <HamburgerMenuIcon/>
                    </div>
                </div>
            </div>
        </header>
    );
}
