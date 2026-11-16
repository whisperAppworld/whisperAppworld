import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import webpush from "npm:web-push@3.6.7";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
webpush.setVapidDetails("mailto:admin@whisperapp.world", VAPID_PUBLIC, VAPID_PRIVATE);
serve(async (req) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const _b = await req.json(); const user_id=_b.user_id, title=_b.title, body=_b.body, url=_b.url; const sender_id=_b.sender_id || (_b.data && _b.data.sender_id);
    if (!user_id) throw new Error("user_id required");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data, error } = await supabase.from("push_subscriptions").select("subscription").eq("user_id", user_id).single();
    if (error || !data) throw new Error("No subscription for user");
    await webpush.sendNotification(data.subscription, JSON.stringify({ title: title || "Whisper 🔔", body: body || "Test push - it works!", url: url || "/", sender_id: sender_id || null }));
    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as any).message || e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
