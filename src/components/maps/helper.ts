export function GetBounds(mapCenter: { lat: number, lng: number }, radius: number): google.maps.LatLngBounds | null {
    const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
    const circle = new google.maps.Circle({center: centerLatLng, radius: radius});

    return circle.getBounds()
}
