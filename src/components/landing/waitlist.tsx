"use client"

import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
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
        <div className="grid grid-rows-2 space-y-2">
            <div className="row-span-1">
                <Separator />
            </div>
            <div className="row-span-1 flex items-center justify-center">
                <div className="grid grid-rows-3 col-span-1">
                    <h3 className="text-lg font-semibold">Sign up for the waitlist</h3>
                    <p className="text-muted-foreground">Be the first to know when we launch.</p>
                    <form className="flex gap-2" onSubmit={handleSubmit}>
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
        </div>
    );
}
