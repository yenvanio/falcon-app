"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Label} from "@/components/ui/label";
import {CreateEvent} from "@/components/itinerary/create-event-dialog";
import EventListItemCard, {EventProps} from "@/components/itinerary/event-list-item-card";
import {ItineraryProps} from "@/components/itinerary/card";
import {parseISO} from "date-fns";
import {GetEventDateKey} from "@/components/itinerary/helper";

type EventListItemCollapsible = {
    date: string
    itinerary: ItineraryProps
    eventsMap: Map<number, EventProps>
    isExpanded: boolean
}

export function EventListItemCollapsible({date, itinerary, eventsMap, isExpanded}: EventListItemCollapsible) {
    const [isOpen, setIsOpen] = React.useState(isExpanded)

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="mt-10"
            id={date}
        >
            <div className="grid grid-cols-6">
                <Label className="text-2xl font-semibold col-span-5">{GetEventDateKey(date)}</Label>
                <CollapsibleTrigger asChild className="col-span-1 justify-self-end">
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4"/>
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
                    {Array.from(eventsMap.entries()).map(([id, event]) => (
                        <EventListItemCard
                            key={event.id}
                            id={event.id}
                            name={event.name}
                            location={event.location}
                            date={event.date}
                            notes={event.notes}
                            created_by={event.created_by}
                        />
                    ))}
            </CollapsibleContent>
        </Collapsible>
    )
}
