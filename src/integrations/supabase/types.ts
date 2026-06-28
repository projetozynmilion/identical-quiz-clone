export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          criteria: string | null
          description: string | null
          emoji: string
          id: string
          name: string
          position: number
          rarity: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: string | null
          description?: string | null
          emoji?: string
          id?: string
          name: string
          position?: number
          rarity?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: string | null
          description?: string | null
          emoji?: string
          id?: string
          name?: string
          position?: number
          rarity?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      bonuses: {
        Row: {
          action_payload: Json
          action_type: string
          banner_url: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          position: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_payload?: Json
          action_type?: string
          banner_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_payload?: Json
          action_type?: string
          banner_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          position?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachment_mime: string | null
          attachment_name: string | null
          attachment_size: number | null
          attachment_url: string | null
          audio_duration: number | null
          content: string | null
          created_at: string
          id: string
          message_type: string
          user_id: string
        }
        Insert: {
          attachment_mime?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          audio_duration?: number | null
          content?: string | null
          created_at?: string
          id?: string
          message_type?: string
          user_id: string
        }
        Update: {
          attachment_mime?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          audio_duration?: number | null
          content?: string | null
          created_at?: string
          id?: string
          message_type?: string
          user_id?: string
        }
        Relationships: []
      }
      community_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_ratings: {
        Row: {
          created_at: string
          post_id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_ratings_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_saves: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          content: string | null
          created_at: string
          id: string
          image_urls: string[]
          is_official: boolean
          is_pinned: boolean
          live_at: string | null
          live_url: string | null
          post_type: string
          prompt_text: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string
          id?: string
          image_urls?: string[]
          is_official?: boolean
          is_pinned?: boolean
          live_at?: string | null
          live_url?: string | null
          post_type?: string
          prompt_text?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string
          id?: string
          image_urls?: string[]
          is_official?: boolean
          is_pinned?: boolean
          live_at?: string | null
          live_url?: string | null
          post_type?: string
          prompt_text?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "niche_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "niche_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          created_at: string
          id: string
          job_id: string
          message: string | null
          portfolio_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          message?: string | null
          portfolio_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          message?: string | null
          portfolio_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          brand: string
          budget: string | null
          contact: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string
          id: string
          niche: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          brand: string
          budget?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description: string
          id?: string
          niche?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brand?: string
          budget?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string
          id?: string
          niche?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_rsvps: {
        Row: {
          created_at: string
          id: string
          live_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          live_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          live_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_rsvps_live_id_fkey"
            columns: ["live_id"]
            isOneToOne: false
            referencedRelation: "lives"
            referencedColumns: ["id"]
          },
        ]
      }
      lives: {
        Row: {
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          host: string | null
          id: string
          scheduled_at: string
          status: string
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          host?: string | null
          id?: string
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          host?: string | null
          id?: string
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          banner_url: string | null
          created_at: string
          id: string
          position: number
          progress: number | null
          row_type: string
          subtitle: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          id?: string
          position?: number
          progress?: number | null
          row_type: string
          subtitle?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          id?: string
          position?: number
          progress?: number | null
          row_type?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      niche_groups: {
        Row: {
          created_at: string
          description: string | null
          emoji: string | null
          id: string
          name: string
          niche: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name: string
          niche: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name?: string
          niche?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          icon: string | null
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          active: boolean
          bio: string
          contact: string
          created_at: string
          id: string
          kind: string
          niche: string
          portfolio_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          bio: string
          contact: string
          created_at?: string
          id?: string
          kind: string
          niche: string
          portfolio_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          bio?: string
          contact?: string
          created_at?: string
          id?: string
          kind?: string
          niche?: string
          portfolio_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      prompt_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          kind: string
          label: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          label: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          label?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          kind: string
          media_type: string
          position: number
          prompt_text: string
          subtitle: string | null
          title: string
          tutorial: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          kind?: string
          media_type?: string
          position?: number
          prompt_text?: string
          subtitle?: string | null
          title: string
          tutorial?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          kind?: string
          media_type?: string
          position?: number
          prompt_text?: string
          subtitle?: string | null
          title?: string
          tutorial?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "prompt_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      radar_products: {
        Row: {
          affiliate_url: string
          category: string
          competition: string
          conversion_score: number
          created_at: string
          creators: number
          emoji: string
          growth: number
          hashtag: string | null
          hook: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          old_price: number | null
          position: number
          price: number
          sales_24h: number
          updated_at: string
          views_millions: number
        }
        Insert: {
          affiliate_url: string
          category?: string
          competition?: string
          conversion_score?: number
          created_at?: string
          creators?: number
          emoji?: string
          growth?: number
          hashtag?: string | null
          hook?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          old_price?: number | null
          position?: number
          price?: number
          sales_24h?: number
          updated_at?: string
          views_millions?: number
        }
        Update: {
          affiliate_url?: string
          category?: string
          competition?: string
          conversion_score?: number
          created_at?: string
          creators?: number
          emoji?: string
          growth?: number
          hashtag?: string | null
          hook?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          old_price?: number | null
          position?: number
          price?: number
          sales_24h?: number
          updated_at?: string
          views_millions?: number
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          downloads: number
          external_url: string | null
          file_url: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads?: number
          external_url?: string | null
          file_url?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads?: number
          external_url?: string | null
          file_url?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      victories: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: string
          media_url: string | null
          title: string
          updated_at: string
          user_id: string
          victory_type: string
          views_count: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          victory_type?: string
          views_count?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          victory_type?: string
          views_count?: number | null
        }
        Relationships: []
      }
      victory_likes: {
        Row: {
          created_at: string
          user_id: string
          victory_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
          victory_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          victory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "victory_likes_victory_id_fkey"
            columns: ["victory_id"]
            isOneToOne: false
            referencedRelation: "victories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
