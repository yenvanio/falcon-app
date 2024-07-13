import React from 'react'
import clsx from 'clsx'
import {Navigate as navigate, Views} from 'react-big-calendar'
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon} from "@/components/ui/icons/chevron-left-icon";
import {CalendarIcon} from "@/components/ui/icons/calendar-icon";
import {ChevronRightIcon} from "@/components/ui/icons/chevron-right-icon";
import {ListIcon} from "lucide-react";
import {CalendarDaysIcon} from "@/components/ui/icons/calendar-days-icon";

type CalendarToolBarProps = {
    date: Date,
    label: string,
    localizer: {
        messages: {
            today: string
            next: string
            previous: string
        }
    },
    onNavigate: (direction: string) => void,
    onView: () => void,
    view: string,
    views: string[],
}

type ViewNamesGroupProps = {
    messages: {
        [key: string]: string; // Index signature for dynamic keys
    };
    onView: (name: string) => void,
    view: string,
    views: string[]
}

function ViewNamesGroup({views: viewNames, view, messages, onView}: ViewNamesGroupProps) {
    return (
        <div className="flex items-center gap-4">
            {viewNames.map((name: string) => (
                name == Views.AGENDA ?
                    <Button variant="ghost" size="icon" key={name} onClick={() => onView(name)} className={clsx({'bg-accent': view === name})}>
                        <ListIcon className="w-5 h-5"/>
                        <span className="sr-only">View List</span>
                    </Button> :
                name == Views.WEEK ?
                    <Button variant="ghost" size="icon" className={clsx({'bg-accent': view === name})}>
                        <CalendarDaysIcon className="w-5 h-5" key={name} onClick={() => onView(name)}/>
                        <span className="sr-only">View Calendar</span>
                    </Button>  :
                name == Views.MONTH ?
                    <Button variant="ghost" size="icon" className={clsx({'bg-accent': view === name})}>
                        <CalendarIcon className="w-5 h-5" key={name} onClick={() => onView(name)}/>
                        <span className="sr-only">View Calendar</span>
                    </Button> :
                    <></>
            ))}
        </div>
    )
}

export default function CalendarToolbar({label, localizer: {messages}, onNavigate, onView, view, views}: CalendarToolBarProps) {
    return (
        <div className="flex flex-col h-full">
            <header className="bg-background border-b flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => onNavigate(navigate.PREVIOUS)}
                            aria-label={messages.previous}>
                        <ChevronLeftIcon className="w-5 h-5"/>
                        <span className="sr-only">Previous Month</span>
                    </Button>
                    <div className="text-lg font-medium">{label}</div>
                    <Button variant="ghost" size="icon" onClick={() => onNavigate(navigate.NEXT)}
                            aria-label={messages.next}>
                        <ChevronRightIcon className="w-5 h-5"/>
                        <span className="sr-only">Next Month</span>
                    </Button>
                </div>
                <ViewNamesGroup
                    view={view}
                    views={views}
                    messages={messages}
                    onView={onView}
                />
        </header>
</div>
)
}