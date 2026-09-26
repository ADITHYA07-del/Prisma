import { db } from "@/lib/db";

interface AuthUserLike {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
}

/**
 * Finds or creates a matching row in the User database table for a Supabase auth user.
 * Returns the User record, or null if creation failed or required fields are missing.
 */
export async function getOrCreateUser(
  authUser: AuthUserLike,
  fallbackName?: string
) {
  if (!authUser?.id) {
    return null;
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { authId: authUser.id },
  });

  if (existingUser) {
    return existingUser;
  }

  const email = authUser.email;
  if (!email) {
    return null;
  }

  const name =
    fallbackName?.trim() ||
    authUser.user_metadata?.name ||
    email.split("@")[0] ||
    "User";

  try {
    return await db.user.upsert({
      where: { authId: authUser.id },
      update: {
        email,
      },
      create: {
        authId: authUser.id,
        email,
        name,
        role: "MEMBER",
      },
    });
  } catch (err) {
    console.error("Failed to find or create user in database:", err);
    return null;
  }
}
