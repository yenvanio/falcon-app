"use client"

import 'react-big-calendar/lib/sass/styles.scss'
import {Calendar, dateFnsLocalizer, DateLocalizer, View, Views} from 'react-big-calendar'
import React, {Fragment, HTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import {format, getDay, parse, parseISO, startOfWeek} from "date-fns"
import { enUS } from "date-fns/locale/en-US"
import CalendarToolbar from "@/components/calendar/calendar-toolbar";
import {
    CalendarDayEvent,
    CalendarMonthEvent,
    CalendarWeekEvent
} from "@/components/calendar/calendar-events";
import {createClient} from "@/lib/supabase/client";
import {EventProps} from "@/components/events/types";
import {ItineraryProps} from "@/components/itinerary/types";

export interface CalendarObject {
    title: string
    event: CalendarEvent
    slotStart: Date
    slotEnd: Date
    localizer: DateLocalizer
    isAllDay: boolean
    continuesAfter: boolean
    continuesPrior: boolean
}

export interface CalendarEvent {
    allDay: boolean
    title: React.ReactNode
    start: Date
    end: Date
    resource: EventProps
}

const locales = {
    'en-US': enUS,
}

const dFnsLocalizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

type FalconCalendarProps = {
    itinerary: ItineraryProps
    initialEvents: CalendarEvent[]
}

export default function FalconCalendar({itinerary, initialEvents}: FalconCalendarProps) {
    const [view, setView] = useState<View>(Views.DAY);
    const [date, setDate] = useState(itinerary.start_date);

    const [events, setEvents] = useState(initialEvents);
    const supabase = createClient();

    const start_date_only = itinerary.start_date
    start_date_only.setHours(0,0,0,0)

    const end_date_only = itinerary.end_date
    end_date_only.setHours(23,59,59,999);

    function dayPropGetter(date: Date): HTMLAttributes<HTMLDivElement> {
        const disabled = !(date >= start_date_only && date <= end_date_only)

        return {
            style: {
                backgroundColor: disabled ? 'bg-gray-300' : undefined,
                pointerEvents: disabled ? 'none' : undefined,
                opacity: disabled ? 0.5 : undefined,
            }
        }
    }

    const onDrillDown = useCallback(
        (newDate: Date) => {
            setDate(newDate)
            setView(Views.DAY)
        },
        [setDate, setView]
    )

    const {components, formats} = useMemo(
        () => ({
            components: {
                toolbar: CalendarToolbar,
                day: {
                    event: CalendarDayEvent,
                },
                week: {
                  event: CalendarWeekEvent,
                },
                month: {
                    event: CalendarMonthEvent,
                }
            },
            formats: {}
        }),
        []
    )

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = prevEvents
                        const event = payload.new as EventProps
                        updatedEvents.push({
                            title: event.name,
                            start: parseISO(event.start_date),
                            end: parseISO(event.end_date),
                            resource: event,
                            allDay: false,
                        })

                        return updatedEvents;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'events',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = prevEvents
                        const event = payload.old as CalendarEvent

                        const index = updatedEvents.indexOf(event);
                        if (index > -1) { // only splice array when item is found
                            updatedEvents.splice(index, 1); // 2nd parameter means remove one item only
                        }

                        return updatedEvents;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary.id]);

    return (
        <Fragment>
            <div className="h-auto overflow-y-scroll w-full">
                <Calendar
                    components={components}
                    formats={formats}
                    events={events}
                    localizer={dFnsLocalizer}
                    showMultiDayTimes
                    step={30}
                    views={[Views.DAY, Views.WEEK, Views.MONTH]}
                    defaultView={view}
                    view={view}
                    date={date}
                    onView={(view) => {setView(view)}}
                    onNavigate={(date: Date) => {
                        setDate(new Date(date));
                    }}
                    onDrillDown={onDrillDown}
                    dayPropGetter={dayPropGetter}
                    min={start_date_only}
                    max={end_date_only}
                />
            </div>
        </Fragment>
    )
}
