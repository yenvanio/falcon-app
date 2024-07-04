"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {toast} from "@/components/ui/use-toast";

export default function Waitlist() {
    const [email, setEmail] = useState('');
    const supabase = createClient();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (email == '') {
            return
        }

        let { data, error } = await supabase
            .rpc('AddToWaitlist', {
                user_email: email
            });

        if (error) {
            if (error?.code == "23505") {
                toast({
                    title: "Thank you!",
                    description: "You're already on the waitlist!",
                })
                return
            }

            toast({
                title: "Oh, no.",
                description: "Something went wrong, please try again later.",
            })
            return
        }

        toast({
            title: "Woohoo!",
            description: "You're on the waitlist! You'll be the first to know when we launch",
        })
        console.log(data);
    };

    return (
        <div className="w-full py-6 md:py-12 lg:py-24">
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="landing-page-waitlist">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Waitlist</h2>
                        <p className="text-muted-foreground md:text-xl/relaxed">
                            Sign up to be the first to know when we launch our new travel planning platform.
                        </p>
                        <form className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type="submit">Sign Up</Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
