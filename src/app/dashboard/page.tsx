import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { db } from "@/lib/db";
import { signout } from "@/app/auth/actions";

import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch or create the logged-in user's row from the User table using shared helper
  const dbUser = await getOrCreateUser(user);

  // If user row is still null, redirect immediately to prevent query with undefined user id
  if (!dbUser) {
    redirect("/login");
  }

  const isAdmin = dbUser.role === "ADMIN";

  // Fetch projects based on user role:
  // - ADMIN: all Projects with status NOT_STARTED or IN_PROGRESS
  // - MEMBER: only Projects with status NOT_STARTED or IN_PROGRESS where user has a matching ProjectMember record
  const projects = await db.project.findMany({
    where: {
      status: {
        in: ["NOT_STARTED", "IN_PROGRESS"],
      },
      ...(isAdmin
        ? {}
        : {
            members: {
              some: {
                userId: dbUser.id,
              },
            },
          }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Prisma
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Dashboard
              </span>
            </div>

            <nav className="hidden sm:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                Active Projects
              </Link>
              <Link
                href="/dashboard/archive"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                Archive
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link
                href="/dashboard/projects/new"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                + New Project
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {dbUser.name || user.email}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
              >
                {dbUser.role}
              </span>
            </div>

            <form action={signout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex sm:hidden border-t border-slate-200 px-4 py-2 dark:border-slate-800 space-x-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
          >
            Active Projects
          </Link>
          <Link
            href="/dashboard/archive"
            className="rounded-md px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-400"
          >
            Archive
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Active Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isAdmin
                ? "Showing all active projects across the organization."
                : "Showing active projects you are assigned to."}
            </p>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
            found
          </div>
        </div>

        {/* Project Cards or Empty State */}
        {projects.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No active projects found
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isAdmin
                ? "There are currently no projects with NOT_STARTED or IN_PROGRESS status in the system."
                : "You do not have any assigned projects with NOT_STARTED or IN_PROGRESS status right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 text-lg leading-snug">
                      {project.name}
                    </h2>
                    <StatusBadge status={project.status} />
                  </div>

                  {project.description && (
                    <p className="mt-2.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
                  <span>
                    Created{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(project.createdAt))}
                  </span>
                  <span className="font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform dark:text-indigo-400 flex items-center gap-1">
                    View project &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
