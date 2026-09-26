export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
      <main
        aria-busy="true"
        aria-label="Loading new project form"
        className="mx-auto max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-lg bg-indigo-200 dark:bg-indigo-900" />
      </main>
    </div>
  );
}
