export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string
          is_creator: boolean
          comedy_styles: string[]
          location: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          bio?: string
          is_creator?: boolean
          comedy_styles?: string[]
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string
          is_creator?: boolean
          comedy_styles?: string[]
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          creator_id: string
          content_type: 'bit' | 'sketch' | 'meme' | 'set' | 'thread' | 'roast' | 'prompt'
          title: string | null
          description: string | null
          text_content: string | null
          media_url: string | null
          media_type: 'video' | 'image' | 'audio' | 'none' | null
          duration_seconds: number
          tags: string[]
          parent_content_id: string | null
          is_remix: boolean
          laugh_score: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          content_type: 'bit' | 'sketch' | 'meme' | 'set' | 'thread' | 'roast' | 'prompt'
          title?: string | null
          description?: string | null
          text_content?: string | null
          media_url?: string | null
          media_type?: 'video' | 'image' | 'audio' | 'none' | null
          duration_seconds?: number
          tags?: string[]
          parent_content_id?: string | null
          is_remix?: boolean
          laugh_score?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          content_type?: 'bit' | 'sketch' | 'meme' | 'set' | 'thread' | 'roast' | 'prompt'
          title?: string | null
          description?: string | null
          text_content?: string | null
          media_url?: string | null
          media_type?: 'video' | 'image' | 'audio' | 'none' | null
          duration_seconds?: number
          tags?: string[]
          parent_content_id?: string | null
          is_remix?: boolean
          laugh_score?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          content_id: string
          reaction_type: 'chuckle' | 'laugh' | 'rofl' | 'dying'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          reaction_type: 'chuckle' | 'laugh' | 'rofl' | 'dying'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          reaction_type?: 'chuckle' | 'laugh' | 'rofl' | 'dying'
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          content_id: string
          parent_comment_id: string | null
          text: string
          laugh_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          parent_comment_id?: string | null
          text: string
          laugh_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          parent_comment_id?: string | null
          text?: string
          laugh_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      collaborations: {
        Row: {
          id: string
          content_id: string
          inviter_id: string
          invitee_id: string
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_id: string
          inviter_id: string
          invitee_id: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          inviter_id?: string
          invitee_id?: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
      }
      comedy_circles: {
        Row: {
          id: string
          name: string
          description: string | null
          creator_id: string
          is_private: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          creator_id: string
          is_private?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          creator_id?: string
          is_private?: boolean
          created_at?: string
        }
      }
      circle_members: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
      }
    }
  }
}
