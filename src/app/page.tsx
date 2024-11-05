'use client'

import React, {useState} from "react";
import {AirportSearch} from "@/components/discover/airport-search";
import UnauthedNavbar from "@/components/navigation/unauthed-navbar";

export default function Home() {
    const [isSearch, setIsSearch] = useState<boolean>(true)
    const [isResultsExpanded, setIsResultsExpanded] = useState<boolean>(false);

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <UnauthedNavbar isSearch={isSearch} isResultsExpanded={isResultsExpanded} toggleSearch={setIsSearch} toggleResults={setIsResultsExpanded} />
            <div className="justify-center al">
                <div className="flex">
                    <div className="m-auto">
                        <AirportSearch isSearch={isSearch} isResultsExpanded={isResultsExpanded} toggleSearch={setIsSearch} toggleResults={setIsResultsExpanded}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
