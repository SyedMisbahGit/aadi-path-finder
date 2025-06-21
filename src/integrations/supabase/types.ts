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
      ai_recommendations: {
        Row: {
          admission_probability: number
          ai_reasoning: string
          assessment_id: string | null
          benefits: string[] | null
          college_id: string | null
          created_at: string
          cultural_fit_score: number
          financial_feasibility: number
          id: string
          predicted_cutoff: number | null
          recommendation_rank: number
          risk_factors: string[] | null
          safety_rating: number
          scholarship_eligibility: string[] | null
          total_cost_estimation: number | null
        }
        Insert: {
          admission_probability: number
          ai_reasoning: string
          assessment_id?: string | null
          benefits?: string[] | null
          college_id?: string | null
          created_at?: string
          cultural_fit_score: number
          financial_feasibility: number
          id?: string
          predicted_cutoff?: number | null
          recommendation_rank: number
          risk_factors?: string[] | null
          safety_rating: number
          scholarship_eligibility?: string[] | null
          total_cost_estimation?: number | null
        }
        Update: {
          admission_probability?: number
          ai_reasoning?: string
          assessment_id?: string | null
          benefits?: string[] | null
          college_id?: string | null
          created_at?: string
          cultural_fit_score?: number
          financial_feasibility?: number
          id?: string
          predicted_cutoff?: number | null
          recommendation_rank?: number
          risk_factors?: string[] | null
          safety_rating?: number
          scholarship_eligibility?: string[] | null
          total_cost_estimation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "student_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          annual_fees_max: number | null
          annual_fees_min: number | null
          climate_type: string | null
          courses: string[]
          created_at: string
          cultural_diversity_score: number | null
          exam_accepted: Database["public"]["Enums"]["exam_type"][]
          hostel_available: boolean | null
          id: string
          infrastructure_score: number | null
          location: string
          medical_facilities_nearby: boolean | null
          name: string
          placement_score: number | null
          safety_score: number | null
          scholarship_available: boolean | null
          state: string
          type: Database["public"]["Enums"]["college_type"]
          updated_at: string
        }
        Insert: {
          annual_fees_max?: number | null
          annual_fees_min?: number | null
          climate_type?: string | null
          courses: string[]
          created_at?: string
          cultural_diversity_score?: number | null
          exam_accepted: Database["public"]["Enums"]["exam_type"][]
          hostel_available?: boolean | null
          id?: string
          infrastructure_score?: number | null
          location: string
          medical_facilities_nearby?: boolean | null
          name: string
          placement_score?: number | null
          safety_score?: number | null
          scholarship_available?: boolean | null
          state: string
          type: Database["public"]["Enums"]["college_type"]
          updated_at?: string
        }
        Update: {
          annual_fees_max?: number | null
          annual_fees_min?: number | null
          climate_type?: string | null
          courses?: string[]
          created_at?: string
          cultural_diversity_score?: number | null
          exam_accepted?: Database["public"]["Enums"]["exam_type"][]
          hostel_available?: boolean | null
          id?: string
          infrastructure_score?: number | null
          location?: string
          medical_facilities_nearby?: boolean | null
          name?: string
          placement_score?: number | null
          safety_score?: number | null
          scholarship_available?: boolean | null
          state?: string
          type?: Database["public"]["Enums"]["college_type"]
          updated_at?: string
        }
        Relationships: []
      }
      counseling_rounds: {
        Row: {
          created_at: string
          cutoff_trends: Json | null
          end_date: string | null
          exam_type: string
          id: string
          is_active: boolean | null
          round_name: string | null
          round_number: number
          seat_matrix: Json | null
          start_date: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          cutoff_trends?: Json | null
          end_date?: string | null
          exam_type: string
          id?: string
          is_active?: boolean | null
          round_name?: string | null
          round_number: number
          seat_matrix?: Json | null
          start_date?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          cutoff_trends?: Json | null
          end_date?: string | null
          exam_type?: string
          id?: string
          is_active?: boolean | null
          round_name?: string | null
          round_number?: number
          seat_matrix?: Json | null
          start_date?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      crawl_status: {
        Row: {
          created_at: string
          errors: string[] | null
          exam_type: string
          id: string
          last_crawled: string | null
          records_processed: number | null
          sources_crawled: string[] | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          errors?: string[] | null
          exam_type: string
          id?: string
          last_crawled?: string | null
          records_processed?: number | null
          sources_crawled?: string[] | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          errors?: string[] | null
          exam_type?: string
          id?: string
          last_crawled?: string | null
          records_processed?: number | null
          sources_crawled?: string[] | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      historical_cutoffs: {
        Row: {
          category: Database["public"]["Enums"]["category_type"]
          closing_marks: number | null
          closing_rank: number | null
          college_id: string | null
          created_at: string
          exam_name: Database["public"]["Enums"]["exam_type"]
          exam_year: number
          id: string
          opening_marks: number | null
          opening_rank: number | null
          round_number: number | null
          state_quota: boolean | null
        }
        Insert: {
          category: Database["public"]["Enums"]["category_type"]
          closing_marks?: number | null
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string
          exam_name: Database["public"]["Enums"]["exam_type"]
          exam_year: number
          id?: string
          opening_marks?: number | null
          opening_rank?: number | null
          round_number?: number | null
          state_quota?: boolean | null
        }
        Update: {
          category?: Database["public"]["Enums"]["category_type"]
          closing_marks?: number | null
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string
          exam_name?: Database["public"]["Enums"]["exam_type"]
          exam_year?: number
          id?: string
          opening_marks?: number | null
          opening_rank?: number | null
          round_number?: number | null
          state_quota?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "historical_cutoffs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_models: {
        Row: {
          accuracy_score: number | null
          created_at: string
          exam_type: string
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_name: string
          model_parameters: Json | null
          model_type: string
          training_data_years: number[] | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          exam_type: string
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_name: string
          model_parameters?: Json | null
          model_type: string
          training_data_years?: number[] | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          exam_type?: string
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_name?: string
          model_parameters?: Json | null
          model_type?: string
          training_data_years?: number[] | null
        }
        Relationships: []
      }
      news_sentiment: {
        Row: {
          analyzed_at: string
          content_summary: string | null
          cultural_safety_score: number | null
          gender_safety_score: number | null
          headline: string | null
          id: string
          location: string
          news_source: string | null
          published_date: string | null
          safety_relevance: number | null
          sentiment_score: number | null
          state: string
        }
        Insert: {
          analyzed_at?: string
          content_summary?: string | null
          cultural_safety_score?: number | null
          gender_safety_score?: number | null
          headline?: string | null
          id?: string
          location: string
          news_source?: string | null
          published_date?: string | null
          safety_relevance?: number | null
          sentiment_score?: number | null
          state: string
        }
        Update: {
          analyzed_at?: string
          content_summary?: string | null
          cultural_safety_score?: number | null
          gender_safety_score?: number | null
          headline?: string | null
          id?: string
          location?: string
          news_source?: string | null
          published_date?: string | null
          safety_relevance?: number | null
          sentiment_score?: number | null
          state?: string
        }
        Relationships: []
      }
      student_assessments: {
        Row: {
          accommodation_preference: string
          additional_info: string | null
          budget_range: string
          category: Database["public"]["Enums"]["category_type"]
          climate_preference: string | null
          college_type_preference: string
          created_at: string
          domicile_state: string
          exam_name: Database["public"]["Enums"]["exam_type"]
          exam_year: number
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          language_preference: string | null
          marks: number
          religious_practices: string | null
          safety_priority_score: number | null
          special_needs: string | null
          total_marks: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accommodation_preference: string
          additional_info?: string | null
          budget_range: string
          category: Database["public"]["Enums"]["category_type"]
          climate_preference?: string | null
          college_type_preference: string
          created_at?: string
          domicile_state: string
          exam_name: Database["public"]["Enums"]["exam_type"]
          exam_year: number
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          language_preference?: string | null
          marks: number
          religious_practices?: string | null
          safety_priority_score?: number | null
          special_needs?: string | null
          total_marks: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accommodation_preference?: string
          additional_info?: string | null
          budget_range?: string
          category?: Database["public"]["Enums"]["category_type"]
          climate_preference?: string | null
          college_type_preference?: string
          created_at?: string
          domicile_state?: string
          exam_name?: Database["public"]["Enums"]["exam_type"]
          exam_year?: number
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          language_preference?: string | null
          marks?: number
          religious_practices?: string | null
          safety_priority_score?: number | null
          special_needs?: string | null
          total_marks?: number
          updated_at?: string
          user_id?: string | null
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
      category_type: "general" | "obc" | "sc" | "st" | "ews" | "pwd"
      college_type: "government" | "semi-government" | "private" | "deemed"
      exam_type: "neet-ug" | "jee-main" | "jee-advanced"
      gender_type: "male" | "female" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      category_type: ["general", "obc", "sc", "st", "ews", "pwd"],
      college_type: ["government", "semi-government", "private", "deemed"],
      exam_type: ["neet-ug", "jee-main", "jee-advanced"],
      gender_type: ["male", "female", "other"],
    },
  },
} as const
