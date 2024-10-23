import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function ItineraryInvite() {
    return (
        <Card className="shadow-sm hover:shadow-md hover:cursor-pointer">
            <CardHeader>
                <CardTitle className="justify-center">{"Join Shiv's Itinerary"}</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <p>Login to https://falcon.box now to start planning!</p>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}