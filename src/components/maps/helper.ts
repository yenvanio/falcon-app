import axios from "axios"

export function GetBounds(mapCenter: { lat: number, lng: number }, radius: number): google.maps.LatLngBounds | null {
    const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
    const circle = new google.maps.Circle({center: centerLatLng, radius: radius});

    return circle.getBounds()
}

export async function GetPlaces(query: string) {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}`, {
                params: {
                    access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                }
            }
        )

        return response.data.features
    } catch (error) {
        console.log("There was an error getting places.", error)
    }
}
