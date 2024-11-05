"use client"

import 'react-big-calendar/lib/sass/styles.scss'
import {Calendar, dateFnsLocalizer, ToolbarProps, View, Views} from 'react-big-calendar'
import React, {Children, cloneElement, Fragment, HTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import {format, getDay, parse, parseISO, startOfWeek} from "date-fns"
import {enUS} from "date-fns/locale/en-US"
import CalendarToolbar from "@/components/calendar/calendar-toolbar";
import {
    CalendarDayEvent,
    CalendarMonthEvent,
    CalendarWeekEvent
} from "@/components/calendar/calendar-events";
import {createClient} from "@/lib/supabase/client";
import {EventProps} from "@/components/events/types";
import {ItineraryProps} from "@/components/itinerary/types";
import {DayPropGetter} from "@/components/calendar/calendar-wrappers";
import {FalconLocation} from "@/components/maps/types";

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
    initialLocations: Map<string, FalconLocation>
}

export default function FalconCalendar({itinerary, initialEvents, initialLocations}: FalconCalendarProps) {
    const [view, setView] = useState<View>(Views.DAY);
    const [date, setDate] = useState(itinerary.start_date);

    const [events, setEvents] = useState(initialEvents);
    const [locations, setLocations] = useState(new Map(initialLocations))
    const supabase = createClient();

    const start_date_only = itinerary.start_date
    start_date_only.setHours(0, 0, 0, 0)

    const end_date_only = itinerary.end_date
    end_date_only.setHours(23, 59, 59, 999);

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
                toolbar: (props: ToolbarProps) => {
                    return CalendarToolbar(props, itinerary, Array.from(locations.values()))
                },
                day: {
                    event: CalendarDayEvent,
                },
                week: {
                    event: CalendarWeekEvent,
                },
                month: {
                    event: CalendarMonthEvent,
                },
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
                        const updatedEvents = [...prevEvents]
                        const { id, name, location, address, latitude, longitude, start_date, end_date, all_day, notes, created_by } = payload.new;
                        const event: EventProps = {
                            id,
                            name,
                            location: {
                                name: location,
                                address: address,
                                latitude: latitude,
                                longitude: longitude
                            },
                            start_date: parseISO(start_date),
                            end_date: parseISO(end_date),
                            notes,
                            all_day,
                            created_by
                        };

                        updatedEvents.push({
                            title: event.name,
                            start: event.start_date,
                            end: event.end_date,
                            resource: event,
                            allDay: event.all_day,
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
                        const updatedEvents = [...prevEvents]
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
    }, [supabase, itinerary]);

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = new Map(prevLocations);
                        const { id, name, address, latitude, longitude, phone, website } = payload.new;
                        const location: FalconLocation = {
                            id,
                            name,
                            address,
                            latitude: parseFloat(latitude),
                            longitude: parseFloat(longitude),
                            phone,
                            website
                        };
                        updatedLocations.set(location.id, location);
                        return updatedLocations;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = new Map(prevLocations);
                        const location = payload.old;
                        updatedLocations.delete(location.id);
                        return updatedLocations;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary]);

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
                    onView={(view) => {
                        setView(view)
                    }}
                    onNavigate={(date: Date) => {
                        setDate(new Date(date));
                    }}
                    onDrillDown={onDrillDown}
                    dayPropGetter={(date: Date) => {
                        return DayPropGetter(date, start_date_only, end_date_only)
                    }}
                    min={start_date_only}
                    max={end_date_only}
                />
            </div>
        </Fragment>
    )
}
