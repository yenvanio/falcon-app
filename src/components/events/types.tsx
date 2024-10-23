export interface EventProps {
    id: number
    name: string
    location: {
        name: string
        address: string
        latitude: string
        longitude: string
    }
    start_date: Date
    end_date: Date
    all_day: boolean
    notes: string
    created_by: string
}