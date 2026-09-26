"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required")}`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Email and password are required")}`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // After Supabase creates the auth user, create matching row in User table
  if (data.user) {
    const userProfile = await getOrCreateUser(data.user, name);
    if (!userProfile) {
      redirect(
        `/signup?error=${encodeURIComponent("Account created but profile setup failed. Please contact support.")}`
      );
    }
  }

  // If session was immediately established (email confirmation disabled)
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  redirect(
    `/signup?message=${encodeURIComponent("Registration successful! If confirmation is required, please check your email.")}`
  );
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
