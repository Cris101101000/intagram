import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const VALID_EVENTS = [
  'share_whatsapp',
  'share_instagram',
  'share_download',
  'share_copy_url',
  'cta_free_trial',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, eventType, metadata } = body;

    if (!username || !eventType) {
      return NextResponse.json({ error: 'username and eventType required' }, { status: 400 });
    }

    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    const sb = getSupabase();
    const { error } = await sb.from('events').insert({
      username,
      event_type: eventType,
      metadata: metadata ?? {},
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Events API]', err);
    return NextResponse.json({ error: 'Error saving event' }, { status: 500 });
  }
}
