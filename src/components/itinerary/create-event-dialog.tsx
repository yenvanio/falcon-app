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
import {parseISO} from "date-fns";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import {DatePicker} from "@/components/ui/date-picker";

type CreateEventDialogProps = {
    itinerary_id: number;
    start_date: string;
    end_date: string;
}

export const CreateEvent = (props: CreateEventDialogProps) => {
    const supabase = createClient()
    const [open, setOpen] = useState(false);

    const i_start_date = parseISO(props.start_date);
    const i_end_date = parseISO(props.end_date);

    const formSchema = z.object({
        event_name: z.string().min(1, {message: "Name cannot be empty"}),
        event_location: z.string().min(1, {message: "Location cannot be empty"}),
        event_date: z.date().refine(
            (date) => date >= i_start_date && date <= i_end_date,
            {
                message: "Event must be within itinerary dates",
            }
        ),
        event_notes: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            event_date: i_start_date,
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

        let {data, error} = await supabase
            .rpc('CreateEvent', {
                event_created_by_uuid: user.data.user?.id,
                event_date: values.event_date.toISOString(),
                event_itinerary_id: props.itinerary_id,
                event_location: values.event_location,
                event_name: values.event_name,
                event_notes: values.event_notes,
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="h-10 rounded-md bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-50 px-5">Add item</Button>
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
                                            <Input {...field} name='event_location' placeholder='Where are you going?' type='text'
                                                   id='event_location'/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='event_date'>
                                <FormField
                                    control={form.control}
                                    name="event_date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dates</FormLabel>
                                            <DatePicker field={field}/>
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