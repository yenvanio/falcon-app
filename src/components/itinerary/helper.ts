import {format, parseISO} from "date-fns";

export const GetEventDateKey = (dateString: string) => {
    const date = parseISO(dateString)
    return date.toLocaleString('default', { month: 'long' }) + " " + date.getDate()
}

export const StripTimeFromDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
};