import {parseISO, format, formatDate} from 'date-fns';

interface FormattedDateProps {
    start_date_string: string;
    end_date_string: string;
}

export default function FormattedDateRange({start_date_string, end_date_string}: FormattedDateProps) {
    const start_date = parseISO(start_date_string)
    const end_date = parseISO(end_date_string)

    let formatted_start_date = ""
    let formatted_end_date = ""

    formatted_start_date += start_date.toLocaleString('default', { month: 'long' }) + " " + start_date.getDate()

    // Same month, no need to include end month in string
    if (start_date.getMonth() == end_date.getMonth()) {
        formatted_end_date += end_date.getDate()
    } else {
        formatted_end_date += end_date.toLocaleString('default', { month: 'long' }) + " " + end_date.getDate()
    }

    // Starts in the current year
    if (start_date.getFullYear() == new Date().getFullYear()) {
        // Starts and ends in a different year
        if (start_date.getFullYear() != end_date.getFullYear()) {
            formatted_end_date += " " + end_date.getFullYear()
            formatted_start_date += " " + start_date.getFullYear()
        }
    }

    // Starts in a different year
    if (start_date.getFullYear() != new Date().getFullYear()) {
        // Starts and ends in the same year
        if (start_date.getFullYear() == end_date.getFullYear()) {
            formatted_end_date += ", " + end_date.getFullYear()
        }

        // Starts and ends in a different year
        if (start_date.getFullYear() != end_date.getFullYear()) {
            formatted_start_date += ", " + start_date.getFullYear()
        }
    }

    const formattedDateRange = formatted_start_date + " - " + formatted_end_date

    return <time>{formattedDateRange}</time>;
}