import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface PushPayload {
  patient_id: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Missing authorization", { status: 401 });
  }

  // Validate the JWT token using Supabase auth
  const token = authHeader.replace("Bearer ", "");
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) {
    return new Response("Invalid authorization token", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const payload: PushPayload = await req.json();
  const { patient_id, title, body, data } = payload;

  if (!patient_id || !title || !body) {
    return new Response(
      JSON.stringify({ error: "patient_id, title, and body are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch active push tokens for the patient
  const { data: tokens, error } = await supabase
    .from("push_tokens")
    .select("expo_push_token")
    .eq("patient_id", patient_id)
    .eq("is_active", true);

  if (error || !tokens || tokens.length === 0) {
    return new Response(
      JSON.stringify({ error: "No active push tokens found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Build Expo push messages
  const messages = tokens.map((t: { expo_push_token: string }) => ({
    to: t.expo_push_token,
    sound: "default",
    title,
    body,
    data: data ?? {},
  }));

  // Send via Expo Push API
  const expoPushResponse = await fetch(
    "https://exp.host/--/api/v2/push/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    }
  );

  const result = await expoPushResponse.json();

  return new Response(
    JSON.stringify({ success: true, tickets: result.data ?? result }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
