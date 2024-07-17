import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React from "react";
import {CalendarEvent} from "@/components/calendar/calendar";
import {EventProps} from "react-big-calendar";

export const CalendarMonthEvent = (props: EventProps) => {
    const event = props.event.resource

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer">
                    <div>{event.title}</div>
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
                    <div className="m-1">{event.title}</div>
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
                    <div className="m-1">{`${event.title} @ ${event.resource.location.name}`}</div>
                </div>
            </DialogTrigger>
            <EventDialogContent event={event}/>
        </Dialog>
    )
}

const EventDialogContent = ({ event }: { event: CalendarEvent }) => {
    const startTime = event.start.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = event.end.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
            </DialogHeader>
            <div className="grid-rows-2">
                <p>{event.resource.location.name}</p>
                <p className="text-sm text-muted-foreground">{startTime} - {endTime}</p>
            </div>
            <DialogDescription>
                {event.resource.notes}
            </DialogDescription>
        </DialogContent>
    )
}