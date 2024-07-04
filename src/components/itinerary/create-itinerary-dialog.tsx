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
import {DatePickerWithRange} from "@/components/ui/date-range-picker";
import {addDays} from "date-fns";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";

export const CreateItinerary = (props: { nextUrl?: string }) => {
    const supabase = createClient()
    const [open, setOpen] = useState(false);
    const formSchema = z.object({
        itinerary_name: z.string().min(1, {message: "Name cannot be empty"}),
        itinerary_dates: z.object({
            from: z.date(),
            to: z.date(),
        }).refine(
            (data) => data.from > addDays(new Date(), -1),
            {
                message: "Start date must be in the future",
                path: ["from"], // specify which field the error message is for
            }
        ).refine(
            (data) => data.to > data.from,
            {
                message: "End date must be after start date",
                path: ["to"], // specify which field the error message is for
            }
        ),
        itinerary_notes: z.string().optional()
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itinerary_dates: {
                from: new Date(),
                to: addDays(new Date(), 7),
            },
            itinerary_notes: "",
        },
    });
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        handleZodValidation({
            onError: setErrors,
            data: values,
            onSuccess: (res) => {
                createItinerary(res)
            },
            schema: formSchema,
        })
    }

    async function createItinerary(values: z.infer<typeof formSchema>) {
        const user = await supabase.auth.getUser()

        let {data, error} = await supabase
            .rpc('CreateItinerary', {
                itinerary_end_date: values.itinerary_dates.to.toISOString(),
                itinerary_name: values.itinerary_name,
                itinerary_notes: values.itinerary_notes,
                itinerary_start_date: values.itinerary_dates.from.toISOString(),
                owner_uuid: user.data.user?.id,
            })

        if (error) {
            console.log(error)
            toast({
                title: "Error Creating Itinerary",
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
                    className="h-10 rounded-md bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-50 px-5">Plan new trip</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Itinerary</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid grid-cols-1 items-center gap-4" key='name'>
                                <FormField
                                    control={form.control}
                                    name="itinerary_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <Input {...field} name='name' placeholder='Where are you going?' type='text'
                                                   id='name'/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='dates'>
                                <FormField
                                    control={form.control}
                                    name="itinerary_dates"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dates</FormLabel>
                                            <DatePickerWithRange field={field}/>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-4" key='notes'>
                                <FormField
                                    control={form.control}
                                    name="itinerary_notes"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <Input {...field} name='notes' placeholder='Additional Info...' type='text'
                                                   id='notes'/>
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