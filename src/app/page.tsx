import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Prisma
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Next.js 14 Project Management application with Supabase Auth and Prisma ORM.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
