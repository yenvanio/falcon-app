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
import React, {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {z} from "zod";
import {handleZodValidation, ValidationError} from "@/components/auth/login/form-validation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import "react-time-picker-typescript/dist/style.css";
import {PlusIcon} from "@/components/ui/icons/plus-icon";
import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";

type CreateEventDialogProps = {
    itinerary_id: number
}

export const CreateEvent = (props: CreateEventDialogProps) => {
    const supabase = createClient()
    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        event_name: z.string().min(1, {message: "Name cannot be empty"}),
        event_date: z.date(),
        event_start_time: z.string(),
        event_end_time: z.string(),
        event_location: z.object({}),
        event_notes: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handlePlaceSelect = (place: GooglePlacesAutocompleteResult) => {
        form.setValue("event_location", place)
    }

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

        // let {data, error} = await supabase
        //     .rpc('CreateEvent', {
        //         event_created_by_uuid: user.data.user?.id,
        //         event_start_date: values.event_start_date,
        //         event_end_date: values.event_end_date,
        //         event_itinerary_id: props.itinerary_id,
        //         event_location: values.event_location,
        //         event_name: values.event_name,
        //         event_notes: values.event_notes,
        //     })

        // if (error) {
        //     console.log(error)
        //     toast({
        //         title: "Error Creating Event",
        //         description: "Something went wrong, please try again later.",
        //     })
        //     return
        // }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                            <Input {...field} name='event_name' placeholder='What are you doing?' type='text'
                                                   id='event_name'/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_location'>
                                <FormField
                                    control={form.control}
                                    name="event_location"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            {/*<GooglePlacesAutocomplete className="" autocompleteTypes={['']} onComplete={handlePlaceSelect} autocompleteFields={[]} bounds={} continent={}/>*/}
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_time'>
                                <FormField
                                    control={form.control}
                                    name="event_start_time"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Time</FormLabel>
                                            {/*<TimePicker {...field} />*/}
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_notes'>
                                <FormField
                                    control={form.control}
                                    name="event_notes"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <Input {...field} name='event_notes' placeholder='Additional Info...' type='text'
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