export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airports: {
        Row: {
          city_name: string
          country_code: string
          country_name: string
          iata_code: string
          latitude: string
          longitude: string
          region_code: string
        }
        Insert: {
          city_name: string
          country_code: string
          country_name: string
          iata_code: string
          latitude: string
          longitude: string
          region_code: string
        }
        Update: {
          city_name?: string
          country_code?: string
          country_name?: string
          iata_code?: string
          latitude?: string
          longitude?: string
          region_code?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          date: string | null
          description: string | null
          id: number
          itinerary_id: number
          latitude: number | null
          longitude: number | null
          name: string | null
          order: number | null
        }
        Insert: {
          date?: string | null
          description?: string | null
          id?: number
          itinerary_id: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          order?: number | null
        }
        Update: {
          date?: string | null
          description?: string | null
          id?: number
          itinerary_id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          end_date: string
          id: number
          name: string
          notes: string | null
          owner_uuid: string
          start_date: string
        }
        Insert: {
          end_date: string
          id?: number
          name: string
          notes?: string | null
          owner_uuid: string
          start_date: string
        }
        Update: {
          end_date?: string
          id?: number
          name?: string
          notes?: string | null
          owner_uuid?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_owner_uuid_fkey"
            columns: ["owner_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_flights: {
        Row: {
          flight_id: number
          id: number
          itinerary_id: number
        }
        Insert: {
          flight_id: number
          id?: number
          itinerary_id: number
        }
        Update: {
          flight_id?: number
          id?: number
          itinerary_id?: number
        }
        Relationships: []
      }
      itinerary_hotels: {
        Row: {
          hotel_id: number
          id: number
          itinerary_id: number
        }
        Insert: {
          hotel_id: number
          id?: number
          itinerary_id: number
        }
        Update: {
          hotel_id?: number
          id?: number
          itinerary_id?: number
        }
        Relationships: []
      }
      itinerary_users: {
        Row: {
          id: number
          itinerary_id: number
          role: string
          user_uuid: string
        }
        Insert: {
          id?: number
          itinerary_id: number
          role: string
          user_uuid: string
        }
        Update: {
          id?: number
          itinerary_id?: number
          role?: string
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_users_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_itineraries_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_itineraries_itinerary_id_fkey1"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          destination_code: string
          origin_code: string
        }
        Insert: {
          destination_code: string
          origin_code: string
        }
        Update: {
          destination_code?: string
          origin_code?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
        }
        Insert: {
          avatar?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
        }
        Update: {
          avatar?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      CreateItinerary: {
        Args: {
          owner_uuid: string
          itinerary_start_date: string
          itinerary_end_date: string
          itinerary_name: string
          itinerary_notes: string
        }
        Returns: undefined
      }
      GetEventsByItineraryId: {
        Args: {
          queryid: number
        }
        Returns: Record<string, unknown>[]
      }
      GetItinerariesByUserUuid: {
        Args: {
          uuid: string
        }
        Returns: Record<string, unknown>[]
      }
      GetItineraryById: {
        Args: {
          query_id: number
        }
        Returns: Record<string, unknown>
      }
      GetUsersByItineraryId: {
        Args: {
          query_id: number
        }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
