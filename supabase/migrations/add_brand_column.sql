-- Add brand column to sessions, audits, and leads tables
-- Default 'bewe' so all existing rows are tagged automatically

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'bewe';
ALTER TABLE audits ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'bewe';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'bewe';

-- Index for filtering by brand (improves query performance)
CREATE INDEX IF NOT EXISTS idx_sessions_brand ON sessions (brand);
CREATE INDEX IF NOT EXISTS idx_audits_brand ON audits (brand);
CREATE INDEX IF NOT EXISTS idx_leads_brand ON leads (brand);
