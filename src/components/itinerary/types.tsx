export type ItineraryRole = 'OWNER' | 'COLLABORATOR' | 'FOLLOWER'

export interface ItineraryProps {
    id: number
    name: string
    start_date: Date
    end_date: Date
    owner_uuid: string
    location: {
        name: string
        country: string
        continent: string
        latitude: string
        longitude: string
    }
    role: ItineraryRole,
}