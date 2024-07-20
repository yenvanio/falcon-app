"use client"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import React, {useState} from "react"
import {z} from "zod";
import {createClient} from "@/lib/supabase/client";
import {handleZodValidation, ValidationError} from "@/components/auth/login/form-validation";
import {useRouter} from "next/navigation";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {AuthError} from "@supabase/auth-js";
import {toast} from "@/components/ui/use-toast";

interface FormFieldType {
    name: "email" | "password"
    label: string
    type: string
    placeholder: string
}

export const LoginDialog = (props: { nextUrl?: string }) => {
    const [isLogin, setIsLogin] = React.useState(true)
    const [authError, setAuthError] = React.useState<AuthError | null>(null);
    const [open, setOpen] = useState(false);

    const supabase = createClient()
    const router = useRouter();

    const formSchema = z.object({
        email: z.string().min(1, {message: "E-mail cannot be empty"}).email("E-mail is not valid"),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        })
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });
    const fields: FormFieldType[] = [
        {name: 'email', label: 'E-mail', type: 'email', placeholder: 'Email'},
        {name: 'password', label: 'Password', type: 'password', placeholder: 'Password'}
    ]
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handleInputChange = () => {
        setAuthError(null);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        handleZodValidation({
            onError: setErrors,
            data: values,
            onSuccess: (res) => {
                isLogin ? login(values) : signup(values)
            },
            schema: formSchema,
        })
    }

    async function login(values: z.infer<typeof formSchema>) {
        const data = {
            email: values.email,
            password: values.password,
        }

        const {error} = await supabase.auth.signInWithPassword(data)

        if (error) {
            toast({
                title: "Login Error",
                description: error?.message,
            })
            return
        }

        setOpen(false)

        router.replace("/home")
        router.refresh()
    }

    async function signup(values: z.infer<typeof formSchema>) {
        const data = {
            email: values.email,
            password: values.password,
        }

        const {error} = await supabase.auth.signUp(data)

        if (error) {
            toast({
                title: "Signup Error",
                description: error?.message,
            })
            return
        }

        toast({
            title: "Signup Successful!",
            description: "Check your e-mail for a verification link."
        })

        setOpen(false)

        router.replace("/home")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="h-10 rounded-md bg-slate-900 hover:bg-slate-100 hover:text-slate-950 text-slate-50 px-5">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isLogin ? "Login" : "Signup"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            {fields.map(({name, placeholder, type, label}) => (
                                <div className="grid grid-cols-1 items-center gap-4" key={name}>
                                    <FormField
                                        control={form.control}
                                        name={name}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{label ?? name}</FormLabel>
                                                <Input {...field} name={name} type={type ?? 'text'} id={name}
                                                       onChange={(e) => {
                                                           field.onChange(e);
                                                           handleInputChange();
                                                       }}/>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                </div>
                            ))}
                            <Button>{isLogin ? "Login" : "Signup"}</Button>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <div className="grid-rows-1 items-center gap-2">
                        <Label className="text-right font-light">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </Label>

                        <Label className="text-right font-light">
                            Click <Button onClick={() => setIsLogin(!isLogin)}
                                          className="inline h-0 p-0 m-0 border-none font-semibold bg-transparent text-black hover:bg-transparent hover:underline focus:outline-none">here</Button> to {isLogin ? "sign up" : "login"}.
                        </Label>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
