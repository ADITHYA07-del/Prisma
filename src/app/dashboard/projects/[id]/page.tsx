import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/StatusBadge";
import { ProjectStatusControl } from "@/components/ProjectStatusControl";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
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

  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isAdmin = dbUser.role === "ADMIN";
  const isMember = project.members.some((m) => m.userId === dbUser.id);

  // If not admin and not a project member, deny access
  if (!isAdmin && !isMember) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow dark:border-red-900/50 dark:bg-slate-900 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You do not have permission to view this project.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            &larr; Back to Projects
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {project.name}
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Created on{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(project.createdAt))}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <StatusBadge status={project.status} />
              {project.completedAt && (
                <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Completed{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(project.completedAt))}
                </p>
              )}
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Description
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {project.description || "No description provided."}
            </p>
          </div>

          {/* Project Status Management Control */}
          <div className="border-t border-slate-100 py-6 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Manage Status
            </h2>
            <ProjectStatusControl
              projectId={project.id}
              currentStatus={project.status}
            />
          </div>

          <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Project Members ({project.members.length})
            </h2>
            {project.members.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No members assigned yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {project.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {member.user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {member.user.email}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {member.user.role}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
