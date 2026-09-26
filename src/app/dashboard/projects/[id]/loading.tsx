export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main
        aria-busy="true"
        aria-label="Loading project"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-6 h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-6 dark:border-slate-800">
            <div className="space-y-3">
              <div className="h-8 w-64 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-6 w-24 animate-pulse rounded-full bg-indigo-100 dark:bg-indigo-950" />
          </div>
          <section className="space-y-3 border-b border-slate-100 py-6 dark:border-slate-800">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </section>
          <section className="space-y-3 border-b border-slate-100 py-6 dark:border-slate-800">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-44 animate-pulse rounded-lg bg-indigo-100 dark:bg-indigo-950" />
          </section>
          <section className="space-y-3 pt-6">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-14 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          </section>
        </div>
      </main>
    </div>
  );
}
