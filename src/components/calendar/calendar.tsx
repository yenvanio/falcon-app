"use client"

import 'react-big-calendar/lib/sass/styles.scss'
import {Calendar, dateFnsLocalizer, DateLocalizer, View, Views} from 'react-big-calendar'
import React, {Fragment, HTMLAttributes, useCallback, useMemo, useState} from "react"
import {format, getDay, parse, startOfWeek} from "date-fns"
import { enUS } from "date-fns/locale/en-US"
import {ItineraryProps} from "@/components/itinerary/card";
import {EventProps} from "@/components/itinerary/event-list-item-card";
import CalendarToolbar from "@/components/calendar/calendar-toolbar";
import {CalendarAgendaEvent, CalendarMonthEvent, CalendarWeekEvent} from "@/components/calendar/calendar-events";
import {CalendarAgendaHeader} from "@/components/calendar/calendar-headers";
import {FormatDateRange} from "@/components/calendar/formatted-date";

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
    events: CalendarEvent[]
}

export default function FalconCalendar({itinerary, events}: FalconCalendarProps) {
    const [view, setView] = useState<View>(Views.AGENDA);
    const [date, setDate] = useState(itinerary.start_date);

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
            setView(Views.AGENDA)
        },
        [setDate, setView]
    )

    const {components, formats} = useMemo(
        () => ({
            components: {
                toolbar: CalendarToolbar,
                agenda: {
                    event: CalendarAgendaEvent,
                    header: CalendarAgendaHeader,
                },
                week: {
                  event: CalendarWeekEvent,
                },
                month: {
                    event: CalendarMonthEvent,
                }
            },
            formats: {
                agendaHeaderFormat: CalendarAgendaHeader
            }
        }),
        []
    )

    return (
        <Fragment>
            <div className="height: 100vh">
                <Calendar
                    components={components}
                    formats={formats}
                    events={events}
                    localizer={dFnsLocalizer}
                    showMultiDayTimes
                    step={30}
                    views={[Views.AGENDA, Views.WEEK, Views.MONTH]}
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
