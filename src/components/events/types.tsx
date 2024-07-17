export interface EventProps {
    id: number
    name: string
    location: {
        name: string
        latitude: string
        longitude: string
    }
    start_date: string
    end_date: string
    notes: string
    created_by: string
}