"use client"

import {Button} from "@/app/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"
import {Input} from "@/app/components/ui/input"
import {Label} from "@/app/components/ui/label"
import React, {useState} from "react"
import {z} from "zod";
import {createClient} from "@/lib/supabase/client";
import {handleZodValidation, ValidationError} from "@/app/login/form-validation";
import {redirect, useRouter} from "next/navigation";

export const LoginDialog = (props: { nextUrl?: string }) => {
    const [isLogin, setIsLogin] = React.useState(true)
    const supabase = createClient()
    const router = useRouter();

    const formSchema = z.object({
        email: z.string().min(1, {message: "E-mail cannot be empty"}).email("E-mail is not valid"),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        })
    })

    const fields = [
        {name: 'email', label: 'E-mail', type: 'email', placeholder: ''},
        {name: 'password', label: 'Password', type: 'password', placeholder: ''}
    ]
    const [errors, setErrors] = useState<ValidationError<typeof formSchema>>({})

    const handleSubmit = (e: any) => {
        e.preventDefault()

        const formValue = e.target.form;
        const data = Object.fromEntries(new FormData(formValue))

        handleZodValidation({
            onError: setErrors,
            data: data,
            onSuccess: (res) => {
                isLogin ? login(res) : signup(res)
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
            router.push("/auth/auth-error")
        }

        router.replace("/dashboard")
    }

    async function signup(values: z.infer<typeof formSchema>) {
        const data = {
            email: values.email,
            password: values.password,
        }

        const {error} = await supabase.auth.signUp(data)

        if (error) {
            router.push("/auth/auth-error")
        }

        router.replace("/dashboard")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="h-10 rounded-md bg-slate-900 hover:bg-slate-100 hover:text-slate-950 text-slate-50 px-5">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isLogin ? "Login" : "Signup"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <form className="space-y-8">
                        {fields.map(({name, placeholder, type, label}) => (
                            <div className="grid grid-cols-1 items-center gap-4" key={name}>
                                <Label htmlFor={name}>{label ?? name}</Label>
                                <Input name={name} placeholder={placeholder} type={type ?? 'text'} id={name} />
                            </div>
                        ))}
                        <Button onClick={handleSubmit}>{isLogin ? "Login" : "Signup"}</Button>
                    </form>
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
