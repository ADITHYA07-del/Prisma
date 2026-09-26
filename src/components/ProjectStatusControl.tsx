"use client";

import { useState, useTransition } from "react";
import { ProjectStatus } from "@prisma/client";
import { updateProjectStatus } from "@/app/dashboard/projects/actions";

interface ProjectStatusControlProps {
  projectId: string;
  currentStatus: ProjectStatus;
  isAdmin: boolean;
}

export function ProjectStatusControl({
  projectId,
  currentStatus,
  isAdmin,
}: ProjectStatusControlProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTransition = (newStatus: ProjectStatus) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.error) {
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
          {errorMessage}
        </div>
      )}

      {!isAdmin ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Only administrators can change project status.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {currentStatus === "NOT_STARTED" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleTransition("IN_PROGRESS")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <span>▶</span>
                  Start Project (In Progress)
                </>
              )}
            </button>
          )}

          {currentStatus === "IN_PROGRESS" && (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleTransition("COMPLETED")}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Mark as Completed
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleTransition("NOT_STARTED")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent dark:border-slate-300" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span>↺</span>
                    Revert to Not Started
                  </>
                )}
              </button>
            </>
          )}

          {currentStatus === "COMPLETED" && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">
              This project is marked as completed and has reached its final
              state.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
