"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, { useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {z} from "zod";
import {handleZodValidation, ValidationError} from "@/components/auth/login/form-validation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {PlusIcon} from "@/components/ui/icons/plus-icon";
import {DatePickerWithRange} from "@/components/ui/date-range-picker";
import {addDays} from "date-fns";
import {LocationsAutocomplete} from "@/components/events/locations-autocomplete";
import {FalconLocation} from "@/components/maps/types";
import {ItineraryProps} from "@/components/itinerary/types";
import { TimePicker } from 'antd';
import {toast} from "@/components/ui/use-toast";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {Label} from "@/components/ui/label";

type CreateEventDialogProps = {
    itinerary: ItineraryProps
    locations: FalconLocation[]
}

export const CreateEvent = ({itinerary, locations}: CreateEventDialogProps) => {
    const supabase = createClient()
    const [open, setOpen] = useState(false);
    const [allDayCheckbox, setAllDayCheckbox] = useState(false);

    const formSchema = z.object({
        event_name: z.string().min(1, {message: "Name cannot be empty"}),
        event_dates: z.object({
            from: z.date(),
            to: z.date(),
        }).refine(
            (data) => data.from > addDays(new Date(), -1),
            {
                message: "Start date must be in the future",
                path: ["from"], // specify which field the error message is for
            }
        ).refine(
            (data) => data.to >= data.from,
            {
                message: "End date must be after start date",
                path: ["to"], // specify which field the error message is for
            }
        ),
        event_times: z.object({
            start: z.date(),
            end: z.date(),
        }),
        event_location_name: z.string(),
        event_location: z.any(),
        event_notes: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            event_dates: {
                from: itinerary.start_date,
                to: itinerary.start_date,
            },
            event_times: {
                start: itinerary.start_date,
                end: itinerary.start_date,
            },
            event_notes: "",
        },
    });
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        handleZodValidation({
            onError: setErrors,
            data: values,
            onSuccess: (res) => {
                createEvent(res)
            },
            schema: formSchema,
        })
    }

    async function createEvent(values: z.infer<typeof formSchema>) {
        const user = await supabase.auth.getUser()

        const start_date = values.event_dates.from
        const end_date = values.event_dates.to

        if (!allDayCheckbox) {
            start_date.setUTCHours(values.event_times.start.getHours())
            end_date.setUTCHours(values.event_times.end.getHours())
        }

        let {data, error} = await supabase
            .rpc('CreateEvent', {
                event_all_day: allDayCheckbox,
                event_created_by_uuid: user.data.user?.id,
                event_end_date: end_date.toISOString(),
                event_itinerary_id: itinerary.id,
                event_location_id: values.event_location.id,
                event_name: values.event_name,
                event_notes: values.event_notes,
                event_start_date: start_date.toISOString(),
            })

        if (error) {
            console.log(error)
            toast({
                title: "Error Creating Event",
                description: "Something went wrong, please try again later.",
            })
            return
        }

        setOpen(false)
    }

    const handleLocationSelection = (location: FalconLocation) => {
        form.setValue("event_location", location)
    }

    const handleTimeSelection = (dates: any) => {
        form.setValue("event_times", {
            start: dates[0].$d,
            end: dates[1].$d
        })
    };

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open)
            form.reset()
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost" size="icon" key="create-event-button">
                    <PlusIcon className="w-5 h-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_name'>
                                <FormField
                                    control={form.control}
                                    name="event_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <Input {...field} name='event_name' placeholder='What are you doing?'
                                                   type='text'
                                                   id='event_name'/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_location_name'>
                                <FormField
                                    control={form.control}
                                    name="event_location_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <LocationsAutocomplete field={field} locations={locations}
                                                                   onComplete={handleLocationSelection}/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_dates'>
                                <FormField
                                    control={form.control}
                                    name="event_dates"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dates</FormLabel>
                                            <DatePickerWithRange field={field}/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_times'>
                                <FormField
                                    control={form.control}
                                    name="event_times"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <TimePicker.RangePicker use12Hours format="h:mm A" disabled={allDayCheckbox}
                                                                onChange={handleTimeSelection} className="w-full hover:border-primary focus:border-primary"/>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <div className="flex items-center justify-end">
                                    <Checkbox
                                        checked={allDayCheckbox}
                                        onCheckedChange={(state: CheckedState) => {
                                            const isChecked = typeof state === "boolean" ? state : false
                                            setAllDayCheckbox(isChecked)
                                        }}
                                    />
                                    <Label className="p-2">All Day Event?</Label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_notes'>
                                <FormField
                                    control={form.control}
                                    name="event_notes"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <Input {...field} name='event_notes' placeholder='Additional Info...'
                                                   type='text'
                                                   id='event_notes'/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid-rows-1 items-center gap-4">
                                <Button className="float-right">Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}