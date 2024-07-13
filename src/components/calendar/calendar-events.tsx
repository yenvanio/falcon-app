import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React from "react";
import {CalendarObject} from "@/components/calendar/calendar";

export const CalendarMonthEvent = (object: CalendarObject) => {
    const event = object.event

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md p-0.5 hover:cursor-pointer">
                    <div>{event.title}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                        Event Details
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export const CalendarWeekEvent = (object: CalendarObject) => {
    const event = object.event
    const startTime = event.start.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = event.end.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-primary text-primary-foreground rounded-md hover:cursor-pointer p-0.5 h-max text-xs">
                    <div>{`${startTime} - ${endTime}`}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                        Event Details
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export const CalendarAgendaEvent = (object: CalendarObject) => {
    const event = object.event

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="rounded-md p-0.5 hover:cursor-pointer">
                    <div>{`${event.title} @ ${event.resource?.location}`}</div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                        Event Details
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}