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

export const CalendarMonthEvent = (props: EventProps) => {
    const event = props.event.resource

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer border-white border-2">
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
                <div className="bg-primary text-primary-foreground rounded-md hover:cursor-pointer p-0.5 text-xs h-[100%] border-white">
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
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer h-[100%] border-white">
                    <div className="m-1">{`${event.name} @ ${event.location.name}`}</div>
                </div>
            </DialogTrigger>
            <EventDialogContent event={event}/>
        </Dialog>
    )
}

const EventDialogContent = ({ event }: { event: FalconEventProps }) => {
    const start = event.start_date
    const startTime = start.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const end = event.end_date
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
                {!event.all_day && <p className="text-sm text-muted-foreground">{startTime} - {endTime}</p>}
            </div>
            <DialogDescription>
                {event.notes}
            </DialogDescription>
        </DialogContent>
    )
}