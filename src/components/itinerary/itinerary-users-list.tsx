"use client"

import * as React from "react"

import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {ItineraryRole} from "@/components/itinerary/card";
import {createClient} from "@/lib/supabase/client";
import {useEffect, useState} from "react";

interface UserProps {
    id: number;
    email: string;
    phone: string;
    role: ItineraryRole
}

type ItineraryUsersListProps = {
    itinerary_id: number
}

export function ItineraryUsersList({itinerary_id}: ItineraryUsersListProps) {
    const supabase = createClient();
    const [users, setUsers] = useState<UserProps[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            if (itinerary_id) {
                const { data, error } = await supabase
                    .rpc('GetUsersByItineraryId', {
                        query_id: itinerary_id
                    });

                if (error) {
                    console.error(error);
                } else {
                    setUsers(data);
                }
            }
        };

        getUsers().catch(console.error); // Explicitly handle any unhandled rejections
    }, [itinerary_id, supabase]);

    return (
        <ScrollArea className="h-72 w-70 rounded-md border">
            <div className="p-4">
                {users.map((u) => (
                    <>
                        <div key={u.email} className="text-sm">
                            <p>{u.email}</p>
                        </div>
                        <Separator className="my-2"/>
                    </>
                ))}
            </div>
        </ScrollArea>
    )
}