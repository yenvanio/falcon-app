interface FormattedDateProps {
    start_date: Date;
    end_date: Date;
}

export function FormatDateRange(start_date: Date, end_date: Date) {
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

    return formatted_start_date + " - " + formatted_end_date
}

export default function FormattedDateRange({start_date, end_date}: FormattedDateProps) {
    const formattedDateRange = FormatDateRange(start_date, end_date)
    return <time>{formattedDateRange}</time>;
}