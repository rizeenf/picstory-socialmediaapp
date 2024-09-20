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
      Faces: {
        Row: {
          created_at: string
          descriptor: Json | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          descriptor?: Json | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          descriptor?: Json | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      Posts: {
        Row: {
          caption: string | null
          createdAt: string
          creator: string
          id: string
          imageId: string
          imageUrl: string
          likedBy: string[] | null
          location: string | null
          savedBy: string[] | null
          tags: string[] | null
        }
        Insert: {
          caption?: string | null
          createdAt?: string
          creator: string
          id?: string
          imageId: string
          imageUrl: string
          likedBy?: string[] | null
          location?: string | null
          savedBy?: string[] | null
          tags?: string[] | null
        }
        Update: {
          caption?: string | null
          createdAt?: string
          creator?: string
          id?: string
          imageId?: string
          imageUrl?: string
          likedBy?: string[] | null
          location?: string | null
          savedBy?: string[] | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "Posts_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Saves: {
        Row: {
          id: string
          post: string
          user: string
        }
        Insert: {
          id?: string
          post: string
          user: string
        }
        Update: {
          id?: string
          post?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "Saves_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Saves_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          accountId: string
          bio: string | null
          createdAt: string
          email: string
          id: string
          imageId: string | null
          imageUrl: string | null
          liked: string[] | null
          name: string | null
          save: string[] | null
          username: string
        }
        Insert: {
          accountId: string
          bio?: string | null
          createdAt?: string
          email: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          liked?: string[] | null
          name?: string | null
          save?: string[] | null
          username: string
        }
        Update: {
          accountId?: string
          bio?: string | null
          createdAt?: string
          email?: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          liked?: string[] | null
          name?: string | null
          save?: string[] | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
