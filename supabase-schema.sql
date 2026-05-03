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

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT '',
  email text NOT NULL,
  reason text DEFAULT '',
  message text DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a like" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their own like" ON likes FOR DELETE USING (true);

-- Ratings policies
CREATE POLICY "Anyone can read ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a rating" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their own rating" ON ratings FOR UPDATE USING (true);

-- Subscribers policies (insert only — reading is admin only)
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- Contact submissions policies (insert only — reading is admin only)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- EMAIL NOTIFICATION SETUP (do this AFTER running the tables above)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Supabase can email you every time someone submits the contact form.
-- Use the built-in "Webhooks" feature (no extra service needed):
--
-- STEP 1 — Enable the pg_net extension (needed to make HTTP calls from SQL)
--   In Supabase Dashboard → Database → Extensions → search "pg_net" → Enable
--
-- STEP 2 — Create a Database Webhook
--   Dashboard → Database → Webhooks → "Create a new hook"
--     Name:        notify_contact_submission
--     Table:       contact_submissions
--     Events:      ✅ Insert
--     Type:        HTTP Request
--     Method:      POST
--     URL:         https://hook.eu2.make.com/YOUR_MAKE_WEBHOOK_URL
--                  (or use https://formspree.io, Zapier, or any webhook receiver)
--
-- STEP 3 — Set up the email side (free options):
--   Option A — Make.com (recommended, free tier)
--     1. Go to https://make.com → Create a scenario
--     2. Add trigger: "Webhooks → Custom webhook" → copy the URL → paste in Step 2
--     3. Add action: "Email → Send an email" (or Gmail)
--     4. Map fields: name, email, reason, message from the webhook payload
--     5. Send to: idaazilpah@gmail.com
--
--   Option B — Zapier (free tier)
--     Same idea: Trigger = "Webhooks by Zapier", Action = "Gmail: Send email"
--
-- ALTERNATIVE — Supabase Edge Function (most control, slightly more setup):
--   If you prefer to handle email directly in code, create an Edge Function
--   at Dashboard → Edge Functions → "New function" and use the Resend.com API
--   (free up to 3,000 emails/month) to send yourself a notification email.
--   The Edge Function is triggered by the same Database Webhook above,
--   just pointing to your Edge Function URL instead of Make/Zapier.
-- ─────────────────────────────────────────────────────────────────────────────
