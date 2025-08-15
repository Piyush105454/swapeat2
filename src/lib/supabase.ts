import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          avatar_url?: string
          updated_at?: string
        }
      }
      food_shares: {
        Row: {
          id: string
          user_id: string
          food_name: string
          type: 'Veg' | 'Non-Veg' | 'Vegan'
          quantity: string
          condition: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen'
          location: string
          available_until: string
          pickup_method: 'Pickup only' | 'Can Deliver Nearby'
          special_notes?: string
          photo_url?: string
          contact_name: string
          contact_phone: string
          preferred_contact_time?: string
          is_verified: boolean
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          type: 'Veg' | 'Non-Veg' | 'Vegan'
          quantity: string
          condition: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen'
          location: string
          available_until: string
          pickup_method: 'Pickup only' | 'Can Deliver Nearby'
          special_notes?: string
          photo_url?: string
          contact_name: string
          contact_phone: string
          preferred_contact_time?: string
          is_verified?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          type?: 'Veg' | 'Non-Veg' | 'Vegan'
          quantity?: string
          condition?: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen'
          location?: string
          available_until?: string
          pickup_method?: 'Pickup only' | 'Can Deliver Nearby'
          special_notes?: string
          photo_url?: string
          contact_name?: string
          contact_phone?: string
          preferred_contact_time?: string
          is_verified?: boolean
          is_available?: boolean
          updated_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          participants: string[]
          food_share_id?: string
          food_share_title?: string
          last_message_id?: string
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participants: string[]
          food_share_id?: string
          food_share_title?: string
          last_message_id?: string
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participants?: string[]
          food_share_id?: string
          food_share_title?: string
          last_message_id?: string
          last_activity?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          message: string
          message_type: 'text' | 'image' | 'location'
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          message: string
          message_type?: 'text' | 'image' | 'location'
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          message_type?: 'text' | 'image' | 'location'
          is_read?: boolean
          updated_at?: string
        }
      }
    }
  }
}