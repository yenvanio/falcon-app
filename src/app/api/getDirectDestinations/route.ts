import {NextResponse} from "next/server";
import Amadeus, {AirportDirectDestinationParams, ResponseError} from "amadeus-ts";
import {LocationProps} from "@/components/maps/map-box";
import {toTitleCase} from "@/lib/utils";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const airportCode = searchParams.get('airportCode');

    if (!airportCode) {
        return NextResponse.json({message: "Airport code is required"}, {status: 400});
    }

    try {
        const amadeus = new Amadeus({
            clientId: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET!,
        });

        const directDestinationsSearch: AirportDirectDestinationParams = {
            departureAirportCode: airportCode,
        };

        const response = await amadeus.airport.directDestinations.get(directDestinationsSearch);
        let airports: LocationProps[] = []

        if (response.statusCode !== 200 || !response.data) {
            return NextResponse.json({message: "Airport destinations not found"}, {status: 500});
        }

        const tempAirports = [];

        // Populate tempAirports with initial data
        for (const airport of response.data) {
            if (!airport.iataCode) continue;
            tempAirports.push({
                id: 0,
                title: toTitleCase(airport.name ?? "") + ", (" + airport.iataCode + ")",
                iata_code: airport.iataCode ?? "",
                city: airport.name ?? "",
                country: airport.address?.countryName ?? "",
                latitude: airport.geoCode?.latitude ?? 0,
                longitude: airport.geoCode?.longitude ?? 0,
            });
        }

        // Sort by title alphabetically and index
        tempAirports.sort((a, b) => a.title.localeCompare(b.title));
        tempAirports.forEach((airport, index) => {
            airport.id = index;
        });

        // Push sorted and indexed airports to final array
        airports.push(...tempAirports);


        return NextResponse.json(airports, {status: response.statusCode});
    } catch (error) {
        console.log(error)
        if (error instanceof ResponseError) {
            return NextResponse.json({message: error.description}, {status: error.response.statusCode ?? 500});
        }
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}
