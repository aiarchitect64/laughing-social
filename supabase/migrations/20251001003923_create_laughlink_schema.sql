/*
  # LaughLink Platform Schema

  ## Overview
  Complete database schema for LaughLink - a social network for comedy and humor.
  
  ## New Tables
  
  ### `profiles`
  User profile information and preferences
  - `id` (uuid, FK to auth.users)
  - `username` (text, unique)
  - `display_name` (text)
  - `avatar_url` (text)
  - `bio` (text)
  - `is_creator` (boolean)
  - `comedy_styles` (text array) - preferred humor styles
  - `location` (text)
  - `website` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `content`
  All comedy content posts
  - `id` (uuid, PK)
  - `creator_id` (uuid, FK to profiles)
  - `content_type` (text) - bit, sketch, meme, set, thread, roast, prompt
  - `title` (text)
  - `description` (text)
  - `text_content` (text) - for bits and text jokes
  - `media_url` (text) - for videos/images
  - `media_type` (text) - video, image, audio
  - `duration_seconds` (integer)
  - `tags` (text array) - comedy style tags
  - `parent_content_id` (uuid) - for threads and remixes
  - `is_remix` (boolean)
  - `laugh_score` (integer, default 0)
  - `view_count` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `reactions`
  User reactions to content (laugh meter)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `content_id` (uuid, FK to content)
  - `reaction_type` (text) - chuckle, laugh, rofl, dying
  - `created_at` (timestamptz)

  ### `comments`
  Comments on content
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `content_id` (uuid, FK to content)
  - `parent_comment_id` (uuid) - for nested comments
  - `text` (text)
  - `laugh_count` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `follows`
  User follow relationships
  - `id` (uuid, PK)
  - `follower_id` (uuid, FK to profiles)
  - `following_id` (uuid, FK to profiles)
  - `created_at` (timestamptz)

  ### `collaborations`
  Content collaboration invitations
  - `id` (uuid, PK)
  - `content_id` (uuid, FK to content)
  - `inviter_id` (uuid, FK to profiles)
  - `invitee_id` (uuid, FK to profiles)
  - `status` (text) - pending, accepted, declined
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `comedy_circles`
  Private groups for creators
  - `id` (uuid, PK)
  - `name` (text)
  - `description` (text)
  - `creator_id` (uuid, FK to profiles)
  - `is_private` (boolean, default true)
  - `created_at` (timestamptz)

  ### `circle_members`
  Members of comedy circles
  - `id` (uuid, PK)
  - `circle_id` (uuid, FK to comedy_circles)
  - `user_id` (uuid, FK to profiles)
  - `role` (text) - admin, member
  - `joined_at` (timestamptz)

  ## Security
  Row Level Security (RLS) enabled on all tables with appropriate policies.
  - Users can read public content
  - Users can manage their own data
  - Circle content restricted to members
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio text DEFAULT '',
  is_creator boolean DEFAULT false,
  comedy_styles text[] DEFAULT '{}',
  location text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('bit', 'sketch', 'meme', 'set', 'thread', 'roast', 'prompt')),
  title text,
  description text,
  text_content text,
  media_url text,
  media_type text CHECK (media_type IN ('video', 'image', 'audio', 'none')),
  duration_seconds integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  parent_content_id uuid REFERENCES content(id) ON DELETE SET NULL,
  is_remix boolean DEFAULT false,
  laugh_score integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('chuckle', 'laugh', 'rofl', 'dying')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  text text NOT NULL,
  laugh_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comedy_circles table
CREATE TABLE IF NOT EXISTS comedy_circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create circle_members table
CREATE TABLE IF NOT EXISTS circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES comedy_circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(circle_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_creator ON content(creator_id);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_tags ON content USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_reactions_content ON reactions(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comedy_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Content policies
CREATE POLICY "Content is viewable by everyone"
  ON content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can insert their own content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own content"
  ON content FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own content"
  ON content FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone"
  ON reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own reactions"
  ON reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Collaborations policies
CREATE POLICY "Users can view their own collaborations"
  ON collaborations FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "Users can create collaboration invites"
  ON collaborations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Invitees can update collaboration status"
  ON collaborations FOR UPDATE
  TO authenticated
  USING (auth.uid() = invitee_id)
  WITH CHECK (auth.uid() = invitee_id);

-- Comedy circles policies
CREATE POLICY "Public circles are viewable by everyone"
  ON comedy_circles FOR SELECT
  TO authenticated
  USING (
    NOT is_private OR 
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM circle_members 
      WHERE circle_members.circle_id = comedy_circles.id 
      AND circle_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comedy circles"
  ON comedy_circles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Circle creators can update their circles"
  ON comedy_circles FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Circle creators can delete their circles"
  ON comedy_circles FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Circle members policies
CREATE POLICY "Circle members are viewable by circle members"
  ON circle_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM comedy_circles 
      WHERE comedy_circles.id = circle_members.circle_id 
      AND (
        NOT comedy_circles.is_private OR
        comedy_circles.creator_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM circle_members cm 
          WHERE cm.circle_id = comedy_circles.id 
          AND cm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Circle admins can add members"
  ON circle_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM comedy_circles 
      WHERE comedy_circles.id = circle_id 
      AND comedy_circles.creator_id = auth.uid()
    )
  );

CREATE POLICY "Circle admins can remove members"
  ON circle_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM comedy_circles 
      WHERE comedy_circles.id = circle_id 
      AND comedy_circles.creator_id = auth.uid()
    )
    OR user_id = auth.uid()
  );
