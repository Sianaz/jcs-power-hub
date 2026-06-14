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
      citas: {
        Row: {
          cliente_id: string | null
          created_at: string
          direccion: string | null
          equipo_id: string | null
          estado: Database["public"]["Enums"]["cita_estado"]
          fecha_hora: string
          id: string
          nombre_cliente: string
          notas: string | null
          problema: string
          telefono: string
          tipo_equipo: string
          tipo_servicio: Database["public"]["Enums"]["tipo_servicio"]
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          direccion?: string | null
          equipo_id?: string | null
          estado?: Database["public"]["Enums"]["cita_estado"]
          fecha_hora: string
          id?: string
          nombre_cliente: string
          notas?: string | null
          problema: string
          telefono: string
          tipo_equipo: string
          tipo_servicio?: Database["public"]["Enums"]["tipo_servicio"]
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          direccion?: string | null
          equipo_id?: string | null
          estado?: Database["public"]["Enums"]["cita_estado"]
          fecha_hora?: string
          id?: string
          nombre_cliente?: string
          notas?: string | null
          problema?: string
          telefono?: string
          tipo_equipo?: string
          tipo_servicio?: Database["public"]["Enums"]["tipo_servicio"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "citas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          direccion: string | null
          id: string
          nombre: string
          telefono: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          direccion?: string | null
          id?: string
          nombre: string
          telefono: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          direccion?: string | null
          id?: string
          nombre?: string
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipos: {
        Row: {
          cliente_id: string
          created_at: string
          estado: Database["public"]["Enums"]["equipo_estado"]
          id: string
          modelo: string | null
          nombre: string
          notas: string | null
          proxima_revision: string | null
          ultima_revision: string | null
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          estado?: Database["public"]["Enums"]["equipo_estado"]
          id?: string
          modelo?: string | null
          nombre: string
          notas?: string | null
          proxima_revision?: string | null
          ultima_revision?: string | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["equipo_estado"]
          id?: string
          modelo?: string | null
          nombre?: string
          notas?: string | null
          proxima_revision?: string | null
          ultima_revision?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      tareas: {
        Row: {
          completada: boolean
          created_at: string
          descripcion: string
          equipo_id: string
          id: string
        }
        Insert: {
          completada?: boolean
          created_at?: string
          descripcion: string
          equipo_id: string
          id?: string
        }
        Update: {
          completada?: boolean
          created_at?: string
          descripcion?: string
          equipo_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tareas_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      app_role: "admin"
      cita_estado:
        | "pendiente"
        | "confirmada"
        | "en_camino"
        | "completada"
        | "cancelada"
      equipo_estado: "ok" | "atencion" | "urgente"
      tipo_servicio: "domicilio" | "taller"
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
      app_role: ["admin"],
      cita_estado: [
        "pendiente",
        "confirmada",
        "en_camino",
        "completada",
        "cancelada",
      ],
      equipo_estado: ["ok", "atencion", "urgente"],
      tipo_servicio: ["domicilio", "taller"],
    },
  },
} as const
