-- Add email column to signups table for Android user follow-up
ALTER TABLE signups ADD COLUMN IF NOT EXISTS email TEXT;
