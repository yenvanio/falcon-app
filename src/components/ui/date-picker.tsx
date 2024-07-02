"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ControllerRenderProps} from "react-hook-form";

interface DatePickerWithProps extends React.HTMLAttributes<HTMLDivElement> {
    field: ControllerRenderProps<{
        event_name: string;
        event_location: string;
        event_date: Date;
        event_notes?: string | undefined;
    }, "event_date">
}

export function DatePicker({className, field}: DatePickerWithProps) {
    const [date, setDate] = React.useState<Date>()

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}