import {createClient} from "@/lib/supabase/server";
import AuthedNavbar from "@/components/navigation/authed-navbar";
import UnauthedNavbar from "@/components/navigation/unauthed-navbar";

export default async function Navbar() {
    const supabase = createClient();
    const user = await supabase.auth.getUser()

    return (
        <>
            {user.data.user ? <AuthedNavbar user={user.data.user}/> : <UnauthedNavbar/>}
        </>
    )
}