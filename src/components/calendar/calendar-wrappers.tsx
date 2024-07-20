import {Children, cloneElement, HTMLAttributes} from "react";

export function DayPropGetter(date: Date, start_date: Date, end_date: Date): HTMLAttributes<HTMLDivElement> {
    const disabled = !(date >= start_date && date <= end_date)

    return {
        style: {
            backgroundColor: disabled ? 'bg-gray-300' : undefined,
            pointerEvents: disabled ? 'none' : undefined,
            opacity: disabled ? 0.5 : undefined,
        }
    }
}
