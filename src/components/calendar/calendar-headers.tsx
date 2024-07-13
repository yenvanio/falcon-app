import {FormatDateRange} from "@/components/calendar/formatted-date";

interface AgendaHeaderProps {
    start: Date,
    end: Date
}

export const CalendarAgendaHeader = (object: AgendaHeaderProps) => {
    return FormatDateRange(object.start, object.end)
}