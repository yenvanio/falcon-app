'use client'

import React, {useRef, useState} from "react";
import {AirportSearch} from "@/components/discover/airport-search";
import UnauthedNavbar from "@/components/navigation/unauthed-navbar";
import FalconAdButton from "@/components/discover/falcon-ad-button";

export default function Home() {
    const [isSearch, setIsSearch] = useState<boolean>(true)
    const [isResultsExpanded, setIsResultsExpanded] = useState<boolean>(false);
    const menuIconRef = useRef<HTMLDivElement>(null); // Navbar ref for outside click detection

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <UnauthedNavbar isSearch={isSearch} isResultsExpanded={isResultsExpanded} menuIconRef={menuIconRef} toggleSearch={setIsSearch} toggleResults={setIsResultsExpanded} />
            <div className="justify-center al">
                <div className="flex">
                    <div className="m-auto">
                        <AirportSearch isSearch={isSearch} isResultsExpanded={isResultsExpanded} menuIconRef={menuIconRef} toggleSearch={setIsSearch} toggleResults={setIsResultsExpanded}/>
                    </div>
                </div>
            </div>
            <FalconAdButton/>
        </main>
    );
}
