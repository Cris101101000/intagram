-- ============================================================================
-- Auditoría de Instagram — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Instagram Profiles ─────────────────────────────────────────────────────
-- Stores a snapshot of the IG profile at audit time
create table if not exists instagram_profiles (
  id          uuid primary key default uuid_generate_v4(),
  username    text not null,
  full_name   text,
  biography   text,
  followers   int not null default 0,
  follows     int not null default 0,
  posts_count int not null default 0,
  profile_pic text,
  is_verified boolean not null default false,
  is_private  boolean not null default false,
  is_business boolean not null default false,
  business_category text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_ig_profiles_username on instagram_profiles (username);

-- ─── Sessions ───────────────────────────────────────────────────────────────
-- Each time a user starts an audit flow, a session is created
create table if not exists sessions (
  id          uuid primary key default uuid_generate_v4(),
  username    text not null,
  user_agent  text,
  ip_address  text,
  locale      text default 'es',
  started_at  timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_sessions_username on sessions (username);

-- ─── Audit Results ──────────────────────────────────────────────────────────
create table if not exists audits (
  id                 uuid primary key default uuid_generate_v4(),
  username           text not null,
  session_id         uuid references sessions(id),
  ig_profile_id      uuid references instagram_profiles(id),

  -- Score
  score              numeric(5,2) not null default 0,
  score_level        text not null default 'REGULAR',
  route              text not null default 'DIAGNOSTICO',

  -- Metrics (raw)
  metrics            jsonb not null default '{}'::jsonb,
  normalized_metrics jsonb not null default '{}'::jsonb,
  health_signals     jsonb not null default '{}'::jsonb,
  critical_points    jsonb not null default '[]'::jsonb,

  -- Context
  sector             text not null default 'general',
  posts_analyzed     int not null default 0,
  analysis_window    int not null default 90,

  -- Evolution link
  previous_audit_id  uuid references audits(id),

  -- Unique access token for sharing results
  access_token       text unique not null default encode(gen_random_bytes(16), 'hex'),

  created_at         timestamptz not null default now()
);

create index if not exists idx_audits_username on audits (username);
create index if not exists idx_audits_access_token on audits (access_token);

-- ─── Leads ──────────────────────────────────────────────────────────────────
create table if not exists leads (
  id           uuid primary key default uuid_generate_v4(),
  audit_id     uuid references audits(id),

  -- Contact info
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  phone_code   text not null default '+57',
  phone_country text not null default 'CO',
  phone_number text not null,

  -- IG context
  username     text not null,
  score        numeric(5,2),
  score_level  text,
  sector       text,

  -- Consent
  gdpr_consent boolean not null default false,

  created_at   timestamptz not null default now()
);

create index if not exists idx_leads_email on leads (email);
create index if not exists idx_leads_username on leads (username);

-- ─── Row-level security (optional, using service role key bypasses RLS) ─────
-- If you ever want to use anon key from client, enable RLS and add policies:
-- alter table audits enable row level security;
-- alter table leads enable row level security;
-- alter table instagram_profiles enable row level security;
-- alter table sessions enable row level security;
