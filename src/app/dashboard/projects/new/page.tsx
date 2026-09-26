import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { db } from "@/lib/db";
import { createProject } from "@/app/dashboard/projects/actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getOrCreateUser(user);

  if (!dbUser) {
    redirect("/login");
  }

  if (dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const allUsers = await db.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          New Project
        </h1>
        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
            {searchParams.error}
          </div>
        )}
        <form action={createProject} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Assign Members
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              {allUsers.map((u) => (
                <label key={u.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="memberIds" value={u.id} />
                  {u.name} ({u.email})
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
