"use client"

import * as React from "react"

import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {createClient} from "@/lib/supabase/client";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {UsersIcon} from "@/components/ui/icons/users-icon";
import {ItineraryProps, ItineraryRole} from "@/components/itinerary/types";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {addDays, parseISO} from "date-fns";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {handleZodValidation, ValidationError} from "@/components/auth/login/form-validation";
import {Input} from "@/components/ui/input";
import {PlusIcon} from "@/components/ui/icons/plus-icon";
import {SendIcon} from "@/components/ui/icons/send-icon";

interface UserProps {
    id: number;
    email: string;
    phone: string;
    role: ItineraryRole
}

type ItineraryUsersListProps = {
    itinerary_id: number
    initial_users: UserProps[]
}

export function ItineraryUsersList({itinerary_id, initial_users}: ItineraryUsersListProps) {
    const supabase = createClient();
    const [users, setUsers] = useState<UserProps[]>(initial_users);
    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        email: z.string().min(1, {message: "email cannot be empty"}),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {email: ""},
    });
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        handleZodValidation({
            onError: setErrors,
            data: values,
            onSuccess: (res) => {
                addUserToItinerary(res)
            },
            schema: formSchema,
        })
    }

    const addUserToItinerary = (values: z.infer<typeof formSchema>) => {
        supabase.rpc('AddUserToItinerary', {
            p_email: values.email,
            p_itinerary_id: itinerary_id,
            p_role: "COLLABORATOR",
        }).then((data: any, error: any) => {
            if (error) console.error(error)
            else console.log(data)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-slate-950 hover:bg-accent">
                    <UsersIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby={"List of users travelling"}>
                <DialogHeader>
                    <DialogTitle>Travellers</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72 w-70 rounded-md border">
                    <div className="p-4">
                        {users.map((u) => (
                            <React.Fragment key={u.email}>
                                <div className="text-sm">
                                    <p>{u.email}</p>
                                </div>
                                <Separator className="my-2"/>
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid grid-cols-5 items-center gap-4" key='email'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem className="col-span-4">
                                        <Input {...field} name='email' placeholder='Invite by Email'
                                               type='text'
                                               id='name'/>
                                    </FormItem>
                                )}/>
                            <div className="col-span-1 flex justify-center">
                                <Button className="justify-center"
                                        variant="ghost" size="icon" key="create-event-button">
                                    <SendIcon className="w-5 h-5"/>
                                </Button>
                            </div>

                        </div>
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}
