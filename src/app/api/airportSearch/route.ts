import { NextResponse } from "next/server";
import Amadeus, {ReferenceDataLocationsParams, ResponseError} from "amadeus-ts";
import {LocationProps} from "@/components/maps/map-box";
import {toTitleCase} from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const subType = 'AIRPORT'
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({ message: "Valid search term required" }, { status: 400 });
    }

    try {
        const amadeus = new Amadeus({
            hostname: process.env.NODE_ENV === 'development' ? 'test' : 'production',
            clientId: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET!,
        });

        const request: ReferenceDataLocationsParams = {
            page: {
                offset: Number(offset),
                limit: Number(limit),
            },
            subType: subType,
            keyword: keyword,
        }
        const response = await amadeus.referenceData.locations.get(request)

        let locations: LocationProps[] = []
        let i = 0;
        for (const airport of response.data) {
            locations[i] = {
                id: i,
                title: toTitleCase(airport.address?.cityName ?? "") + ", (" + airport.iataCode + ")",
                iata_code: airport.iataCode ?? "",
                city: airport.name ?? "",
                country: airport.address?.countryName ?? "",
                latitude: airport.geoCode?.latitude ?? 0,
                longitude: airport.geoCode?.longitude ?? 0,
            };
            i++;
        }

        return NextResponse.json(locations, { status: 200 });
    } catch (error) {
        console.log(error)
        if (error instanceof ResponseError) {
            return NextResponse.json({ message: error.description }, { status: error.response.statusCode ?? 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}