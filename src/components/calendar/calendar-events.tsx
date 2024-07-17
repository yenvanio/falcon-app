import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React from "react";
import {EventProps as FalconEventProps} from "@/components/events/types";
import {EventProps} from "react-big-calendar";
import {parseISO} from "date-fns";

export const CalendarMonthEvent = (props: EventProps) => {
    const event = props.event.resource

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer">
                    <div>{event.name}</div>
                </div>
            </DialogTrigger>
            <EventDialogContent event={event}/>
        </Dialog>
    )
}

export const CalendarWeekEvent = (props: EventProps) => {
    const event = props.event.resource

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md hover:cursor-pointer p-0.5 text-xs h-[100%]">
                    <div className="m-1">{event.name}</div>
                </div>
            </DialogTrigger>
            <EventDialogContent event={event}/>
        </Dialog>
    )
}

export const CalendarDayEvent = (props: EventProps) => {
    const event = props.event.resource

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer h-[100%]">
                    <div className="m-1">{`${event.name} @ ${event.location.name}`}</div>
                </div>
            </DialogTrigger>
            <EventDialogContent event={event}/>
        </Dialog>
    )
}

const EventDialogContent = ({ event }: { event: FalconEventProps }) => {
    const start = parseISO(event.start_date)
    const startTime = start.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const end = parseISO(event.end_date)
    const endTime = end.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{event.name}</DialogTitle>
            </DialogHeader>
            <div className="grid-rows-2">
                <p>{event.location.name}</p>
                <p className="text-sm text-muted-foreground">{startTime} - {endTime}</p>
            </div>
            <DialogDescription>
                {event.notes}
            </DialogDescription>
        </DialogContent>
    )
}