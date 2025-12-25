-- Add device column to existing signups table
ALTER TABLE signups ADD COLUMN IF NOT EXISTS device TEXT;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS name TEXT;
