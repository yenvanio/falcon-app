import React, {ComponentType} from 'react'
import clsx from 'clsx'
import {Messages, Navigate as navigate, ToolbarProps, View, Views, ViewsProps} from 'react-big-calendar'
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon} from "@/components/ui/icons/chevron-left-icon";
import {CalendarIcon} from "@/components/ui/icons/calendar-icon";
import {ChevronRightIcon} from "@/components/ui/icons/chevron-right-icon";
import {ListIcon} from "lucide-react";
import {CalendarDaysIcon} from "@/components/ui/icons/calendar-days-icon";
import {PlusIcon} from "@/components/ui/icons/plus-icon";
import {CreateEvent} from "@/components/events/create-event-dialog";
import {CalendarEvent} from "@/components/calendar/calendar";
import {DotIcon} from "@/components/ui/icons/dot-icon";

type ViewNamesGroupProps = {
    messages: Messages,
    onView: (view: View) => void,
    view: View,
    views: ViewsProps
}

function ViewNamesGroup(props: ViewNamesGroupProps) {
    const {views, view, messages, onView} = props
    const viewNames: View[] = Array.isArray(views)
        ? views
        : (Object.keys(views).filter(key => views[key as keyof typeof views]) as View[]);


    return (
        <div className="flex items-center gap-4">
            <CreateEvent itinerary_id={5}/>

            {viewNames.map((name: string) => (
                name == Views.DAY ?
                    <Button variant="ghost" size="icon" key={name} onClick={() => onView(name)}
                            className={clsx({'bg-accent': view === name})}>
                        <ListIcon className="w-5 h-5"/>
                        <span className="sr-only">View List</span>
                    </Button> :
                    name == Views.WEEK ?
                        <Button variant="ghost" size="icon" className={clsx({'bg-accent': view === name})}>
                            <CalendarDaysIcon className="w-5 h-5" key={name} onClick={() => onView(name)}/>
                            <span className="sr-only">View Calendar</span>
                        </Button> :
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

export default function CalendarToolbar(props: ToolbarProps) {
    const {label, localizer: {messages}, onNavigate, onView, view, views} = props

    return (
        <div className="flex flex-col h-full">
            <header className="bg-background border-b flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => onNavigate(navigate.PREVIOUS)}
                            aria-label={messages.previous}>
                        <ChevronLeftIcon className="w-5 h-5"/>
                        <span className="sr-only">Previous Month</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onNavigate(navigate.TODAY)}
                            aria-label={messages.today}>
                        <DotIcon className="w-10 h-10"/>
                        <span className="sr-only">Today</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onNavigate(navigate.NEXT)}
                            aria-label={messages.next}>
                        <ChevronRightIcon className="w-5 h-5"/>
                        <span className="sr-only">Next Month</span>
                    </Button>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="text-lg font-medium">{label}</div>
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