import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Ensure matching user row exists in User table
      const userEmail = data.user.email ?? "";
      const userName =
        data.user.user_metadata?.name || userEmail.split("@")[0] || "User";

      await db.user.upsert({
        where: { authId: data.user.id },
        update: {
          email: userEmail,
        },
        create: {
          authId: data.user.id,
          email: userEmail,
          name: userName,
          role: "MEMBER",
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
