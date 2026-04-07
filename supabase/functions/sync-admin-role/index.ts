import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    // Check caller is admin
    const { data: callerRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!callerRole) throw new Error("Permission denied: admin role required");

    const { action, email } = await req.json();
    if (!email) throw new Error("email is required");

    // Find user by email
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw new Error(`Failed to list users: ${listError.message}`);
    const targetUser = usersData.users.find(
      (u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!targetUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Usuário não encontrado com este e-mail. Ele precisa criar uma conta primeiro." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (action === "grant") {
      // Insert admin role (ignore if already exists)
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: targetUser.id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Permissão admin concedida" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else if (action === "revoke") {
      // Remove admin role
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", targetUser.id)
        .eq("role", "admin");
      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Permissão admin removida" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      throw new Error("Invalid action. Use 'grant' or 'revoke'.");
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});