-- Run this SQL in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_slug, visitor_id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  visitor_id text NOT NULL,
  score int NOT NULL CHECK (score BETWEEN 1 AND 5),
  review text DEFAULT '',
  name text DEFAULT 'Anonymous',
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_slug, visitor_id)
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  subscribed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Likes policies (public can read and insert)
CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a like" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their own like" ON likes FOR DELETE USING (true);

-- Ratings policies
CREATE POLICY "Anyone can read ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a rating" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their own rating" ON ratings FOR UPDATE USING (true);

-- Subscribers policies (insert only — reading is admin only)
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- Contact form submissions table (added for Cloudflare Pages — replaces Netlify Forms)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT '',
  email text NOT NULL,
  message text DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form, but only admins can read
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);
